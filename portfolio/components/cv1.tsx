"use client"

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection"
import "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-converter"
import styles from "./HandTracking.module.css"

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

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastClickRef = useRef(0)
  const lastYRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  useImperativeHandle(ref, () => ({
    startCamera,
    stopCamera,
  }))

  useEffect(() => {
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    if (runningRef.current) return
    runningRef.current = true

    try {
      if (!detectorRef.current) {
        detectorRef.current = await handPoseDetection.createDetector(
          handPoseDetection.SupportedModels.MediaPipeHands,
          {
            runtime: "mediapipe",
            modelType: "full",
            maxHands: 1,
            solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915",
          }
        )
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: "user",
        },
      })

      streamRef.current = stream

      if (!videoRef.current) {
        runningRef.current = false
        return
      }

      videoRef.current.srcObject = stream
      await videoRef.current.play()
      processFrame()
    } catch (error) {
      console.error("Error starting hand tracking:", error)
      runningRef.current = false
      stopCamera()
    }
  }

  const stopCamera = () => {
    runningRef.current = false

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setHandDetected(false)
    setIsClicking(false)
    lastYRef.current = null
  }

  const processFrame = async () => {
    if (!runningRef.current || !videoRef.current || !detectorRef.current) return

    try {
      const hands = await detectorRef.current.estimateHands(videoRef.current, {
        flipHorizontal: true,
      })

      if (hands.length > 0) {
        const hand = hands[0]
        const keypoints = hand.keypoints
        const indexTip = keypoints[8]
        const thumbTip = keypoints[4]
        const middleMcp = keypoints[9]

        if (indexTip) {
          const cursorX = Math.min(
            window.innerWidth - 1,
            Math.max(0, (indexTip.x / videoRef.current.videoWidth) * window.innerWidth)
          )
          const cursorY = Math.min(
            window.innerHeight - 1,
            Math.max(0, (indexTip.y / videoRef.current.videoHeight) * window.innerHeight)
          )

          setCursorPosition({ x: cursorX, y: cursorY })
          setHandDetected(true)

          const pinchDistance = thumbTip && indexTip
            ? Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y)
            : Infinity

          const now = Date.now()
          if (pinchDistance < 35 && now - lastClickRef.current > 700) {
            lastClickRef.current = now
            setIsClicking(true)
            handleVirtualClick(cursorX, cursorY)
            window.setTimeout(() => setIsClicking(false), 180)
          }

          if (middleMcp) {
            if (lastYRef.current !== null) {
              const deltaY = middleMcp.y - lastYRef.current
              if (Math.abs(deltaY) > 10) {
                window.scrollBy({ top: deltaY * 3, behavior: "auto" })
              }
            }
            lastYRef.current = middleMcp.y
          }
        }
      } else {
        setHandDetected(false)
        lastYRef.current = null
      }
    } catch (error) {
      console.error("Hand tracking frame error:", error)
    }

    if (runningRef.current) {
      animationFrameRef.current = requestAnimationFrame(processFrame)
    }
  }

  const handleVirtualClick = (screenX: number, screenY: number) => {
    const element = document.elementFromPoint(screenX, screenY)
    if (!element) return

    element.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX: screenX,
        clientY: screenY,
        view: window,
      })
    )

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.focus()
    }
  }

  return (
    <div className={styles.container}>
      <video ref={videoRef} style={{ display: "none" }} muted playsInline />
      {handDetected && (
        <div
          className={`${styles.cursor} ${isClicking ? styles.clicking : ""}`}
          style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
        />
      )}
    </div>
  )
})

HandTrackingMouse.displayName = "HandTrackingMouse"

export default HandTrackingMouse
