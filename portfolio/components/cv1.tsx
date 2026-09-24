"use client"

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection"
import "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-converter"
import styles from "./HandTracking.module.css"

interface HandTrackingProps {
  onStreamChange?: (stream: MediaStream | null) => void
  onHandStatusChange?: (detected: boolean) => void
  onCursorMove?: (position: { x: number; y: number }) => void
}

export interface HandTrackingHandle {
  startCamera: () => Promise<void>
  stopCamera: () => void
}

const HandTrackingMouse = forwardRef<HandTrackingHandle, HandTrackingProps>(
  ({ onStreamChange, onHandStatusChange, onCursorMove }, ref) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 })
  const [isClicking, setIsClicking] = useState(false)
  const [handDetected, setHandDetected] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastClickRef = useRef(0)
  const lastYRef = useRef<number | null>(null)
  const lastScrollTimeRef = useRef(0)
  const runningRef = useRef(false)
  const sessionRef = useRef(0)

    useImperativeHandle(ref, () => ({
      startCamera,
      stopCamera,
    }))

    useEffect(() => {
      return () => stopCamera()
    }, [])

    const updateHandStatus = (detected: boolean) => {
      setHandDetected((previous) => {
        if (previous !== detected) {
          onHandStatusChange?.(detected)
        }
        return detected
      })
    }

  const startCamera = async () => {
    if (runningRef.current) return
    runningRef.current = true
    const session = ++sessionRef.current

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
      if (!runningRef.current || session !== sessionRef.current) return

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: "user",
        },
      })

      if (!runningRef.current || session !== sessionRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream
      onStreamChange?.(stream)

      if (!videoRef.current) {
        runningRef.current = false
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        onStreamChange?.(null)
        return
      }

      videoRef.current.srcObject = stream
      await videoRef.current.play()
      if (!runningRef.current || session !== sessionRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        onStreamChange?.(null)
        return
      }
      processFrame()
    } catch (error) {
      console.error("Error starting hand tracking:", error)
      if (session === sessionRef.current) stopCamera()
    }
  }

  const stopCamera = () => {
    sessionRef.current += 1
    runningRef.current = false

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    onStreamChange?.(null)

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setHandDetected(false)
    setIsClicking(false)
    lastYRef.current = null
    lastScrollTimeRef.current = 0
    lastClickRef.current = 0
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
        const indexPip = keypoints[6]
        const indexMcp = keypoints[5]
        const middleTip = keypoints[12]
        const middlePip = keypoints[10]
        const middleMcp = keypoints[9]
        const thumbTip = keypoints[4]

        const distance = (a: any, b: any) =>
          Math.hypot(a.x - b.x, a.y - b.y)

        // Finger extension is measured relative to the MCP joint so that
        // bent fingers do not accidentally trigger the two-finger mode.
        const indexExtended =
          !!indexTip &&
          !!indexPip &&
          !!indexMcp &&
          distance(indexTip, indexMcp) > distance(indexPip, indexMcp) * 1.15

        const middleExtended =
          !!middleTip &&
          !!middlePip &&
          !!middleMcp &&
          distance(middleTip, middleMcp) > distance(middlePip, middleMcp) * 1.15

        if (indexTip) {
          const cursorX = Math.min(
            window.innerWidth - 1,
            Math.max(0, (indexTip.x / videoRef.current.videoWidth) * window.innerWidth)
          )
          const cursorY = Math.min(
            window.innerHeight - 1,
            Math.max(0, (indexTip.y / videoRef.current.videoHeight) * window.innerHeight)
          )

          updateHandStatus(true)

          const pinchDistance = thumbTip
            ? distance(indexTip, thumbTip)
            : Infinity

          const now = Date.now()

          // INDEX + THUMB PINCH = CLICK.
          // Keep this separate from scrolling so a normal two-finger gesture
          // does not accidentally click.
          if (
            indexExtended &&
            pinchDistance < 42 &&
            now - lastClickRef.current > 700
          ) {
            lastClickRef.current = now
            setIsClicking(true)
            handleVirtualClick(cursorX, cursorY)
            window.setTimeout(() => setIsClicking(false), 180)
          }

          // TWO FINGERS (INDEX + MIDDLE) = SCROLL.
          // Move both fingertips upward to scroll up and downward to scroll down.
          if (indexExtended && middleExtended && middleTip) {
            const averageY = (indexTip.y + middleTip.y) / 2

            if (lastYRef.current !== null) {
              const deltaY = averageY - lastYRef.current

              if (Math.abs(deltaY) > 3 && now - lastScrollTimeRef.current > 20) {
                window.scrollBy({
                  top: deltaY * 5,
                  behavior: "auto",
                })
                lastScrollTimeRef.current = now
              }
            }

            lastYRef.current = averageY
          } else {
            // ONE FINGER = MOVE CURSOR WITH INDEX FINGER.
            // Do not update the scroll baseline while only one finger is active.
            lastYRef.current = null
            if (indexExtended) {
              const position = { x: cursorX, y: cursorY }
              setCursorPosition(position)
              onCursorMove?.(position)
            }
          }
        }
      } else {
        updateHandStatus(false)
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
      {/* The visible cursor is rendered by Hero so it can match the blue design cursor. */}

    </div>
    )
  }
)

HandTrackingMouse.displayName = "HandTrackingMouse"

export default HandTrackingMouse
