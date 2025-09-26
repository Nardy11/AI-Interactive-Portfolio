'use client'

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import styles from './HandTracking.module.css'

interface HandData {
  cursor_x: number
  cursor_y: number
  click: boolean
  scroll: number
  hand_detected: boolean
}

export interface HandTrackingHandle {
  startCamera: () => void
  stopCamera: () => void
}

const HandTrackingMouse = forwardRef<HandTrackingHandle>((_, ref) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 })
  const [isClicking, setIsClicking] = useState(false)
  const [handDetected, setHandDetected] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)   

  // Expose start/stop to parent
useImperativeHandle(ref, () => ({
  startCamera,
  stopCamera
}));


  useEffect(() => {
    isMountedRef.current = true
    return () => cleanup()
  }, [])

  const cleanup = () => {
    console.log("🛑 Cleaning up webcam and WebSocket")
    isMountedRef.current = false

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current)
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }

    setHandDetected(false)
    console.log("✅ Webcam fully stopped")
  }
const startCamera = () => {
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
  isMountedRef.current = true; // Ensure we allow starting
  connectWebSocket();
};

const stopCamera = () => {
  // Stop webcam & intervals
  if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
  if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

  if (videoRef.current?.srcObject) {
    (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
  }

  // Close WebSocket but prevent auto-reconnect
  if (wsRef.current) {
    const ws = wsRef.current;
    wsRef.current = null;
    ws.onclose = null; // disable onclose handler for this manual close
    ws.close();
  }

  setHandDetected(false);
  console.log("✅ Camera stopped manually");
};

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280, min: 640 }, height: { ideal: 720, min: 480 }, frameRate: { ideal: 30, min: 15 }, facingMode: 'user' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        startFrameCapture()
      }
    } catch (error) {
      console.error('Error accessing webcam:', error)
    }
  }

  const connectWebSocket = () => {
    if (!isMountedRef.current) return
    wsRef.current = new WebSocket('ws://localhost:8000/cv/hand-tracking')

    wsRef.current.onopen = () => {
      console.log('✅ Connected to backend')
      wsRef.current?.send(JSON.stringify({
        type: 'screen_size',
        width: window.innerWidth,
        height: window.innerHeight,
      }))
      startWebcam()
    }

    wsRef.current.onmessage = (event) => {
      try {
        const handData: HandData = JSON.parse(event.data)
        handleHandData(handData)
      } catch (error) {
        console.error('Error parsing hand data:', error)
      }
    }

    wsRef.current.onclose = () => {
      console.log('❌ WebSocket closed')
      cleanup()
      // Optional: auto-reconnect after 3s
      if (isMountedRef.current) setTimeout(connectWebSocket, 3000)
    }

    wsRef.current.onerror = (error) => console.error('WebSocket error:', error)
  }

  const startFrameCapture = () => {
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current)
    frameIntervalRef.current = setInterval(captureAndSendFrame, 1000 / 20)
  }

  const captureAndSendFrame = () => {
    if (!videoRef.current || !canvasRef.current || wsRef.current?.readyState !== WebSocket.OPEN) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const video = videoRef.current

    canvas.width = 640
    canvas.height = 480

    if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = canvas.toDataURL('image/jpeg', 0.6)
      wsRef.current.send(JSON.stringify({ type: 'frame', image: imageData }))
    }
  }

  const handleHandData = (handData: HandData) => {
    setHandDetected(handData.hand_detected)
    if (handData.hand_detected) {
      const cursorX = handData.cursor_x * window.innerWidth
      const cursorY = handData.cursor_y * window.innerHeight
      setCursorPosition({ x: cursorX, y: cursorY })

      if (handData.click) {
        setIsClicking(true)
        handleVirtualClick(cursorX, cursorY)
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
        clickTimeoutRef.current = setTimeout(() => setIsClicking(false), 200)
      }

      if (handData.scroll !== 0) {
        document.documentElement.scrollTop -= handData.scroll * 150
      }
    }
  }

  const handleVirtualClick = (screenX: number, screenY: number) => {
    const element = document.elementFromPoint(screenX, screenY)
    if (!element) return

    element.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: screenX,
      clientY: screenY,
      view: window,
    }))
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) element.focus()
  }

  return (
    <div className={styles.container}>
      <video ref={videoRef} style={{ display: 'none' }} muted playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {handDetected && (
        <div
          className={`${styles.cursor} ${isClicking ? styles.clicking : ''}`}
          style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
        />
      )}
    </div>
  )
})

export default HandTrackingMouse
