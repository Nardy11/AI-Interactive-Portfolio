"use client"

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
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

type Point = { x: number; y: number }

const HandTrackingMouse = forwardRef<HandTrackingHandle, HandTrackingProps>(
  ({ onStreamChange, onHandStatusChange, onCursorMove }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const detectorRef = useRef<handPoseDetection.HandDetector | null>(null)
    const animationFrameRef = useRef<number | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const runningRef = useRef(false)
    const sessionRef = useRef(0)

    // Cursor smoothing is kept outside React state so detection can run at
    // camera speed without forcing a React render for every frame.
    const smoothCursorRef = useRef<Point | null>(null)
    const lastYRef = useRef<number | null>(null)
    const lastScrollTimeRef = useRef(0)
    const lastClickTimeRef = useRef(0)
    const pinchActiveRef = useRef(false)

    useImperativeHandle(ref, () => ({
      startCamera,
      stopCamera,
    }))

    useEffect(() => {
      return () => stopCamera()
    }, [])

    const updateHandStatus = (detected: boolean) => {
      onHandStatusChange?.(detected)
    }

    const stopTracks = (stream: MediaStream | null) => {
      stream?.getTracks().forEach((track) => track.stop())
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
              solutionPath:
                "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915",
            },
          )
        }

        if (!runningRef.current || session !== sessionRef.current) return

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access is not available in this browser.")
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            frameRate: { ideal: 30, min: 15 },
            facingMode: "user",
          },
          audio: false,
        })

        if (!runningRef.current || session !== sessionRef.current) {
          stopTracks(stream)
          return
        }

        streamRef.current = stream
        onStreamChange?.(stream)

        if (!videoRef.current) {
          stopTracks(stream)
          streamRef.current = null
          runningRef.current = false
          onStreamChange?.(null)
          return
        }

        videoRef.current.srcObject = stream
        await videoRef.current.play()

        if (!runningRef.current || session !== sessionRef.current) {
          stopTracks(stream)
          streamRef.current = null
          onStreamChange?.(null)
          return
        }

        smoothCursorRef.current = null
        lastYRef.current = null
        pinchActiveRef.current = false
        processFrame()
      } catch (error) {
        console.error("Error starting hand tracking:", error)
        if (session === sessionRef.current) {
          stopCamera()
        }
      }
    }

    const stopCamera = () => {
      sessionRef.current += 1
      runningRef.current = false

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      stopTracks(streamRef.current)
      streamRef.current = null

      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.srcObject = null
      }

      smoothCursorRef.current = null
      lastYRef.current = null
      lastScrollTimeRef.current = 0
      lastClickTimeRef.current = 0
      pinchActiveRef.current = false

      onStreamChange?.(null)
      onHandStatusChange?.(false)
    }

    const distance = (a: any, b: any) =>
      Math.hypot(a.x - b.x, a.y - b.y)

    const fingerExtended = (tip: any, pip: any, mcp: any) => {
      if (!tip || !pip || !mcp) return false

      // The tip must be meaningfully farther from the MCP than the PIP is.
      // This is less sensitive to hand scale than a fixed pixel threshold.
      return distance(tip, mcp) > distance(pip, mcp) * 1.18
    }

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value))

    const mapToScreen = (point: any, video: HTMLVideoElement): Point => {
      const width = video.videoWidth || 1280
      const height = video.videoHeight || 720

      // Keep a comfortable control zone inside the camera frame. The hand
      // therefore does not need to touch the physical edge of the webcam view
      // to reach the edge of the page.
      const normalizedX = clamp(point.x / width, 0.08, 0.92)
      const normalizedY = clamp(point.y / height, 0.08, 0.92)

      const x = ((normalizedX - 0.08) / 0.84) * window.innerWidth
      const y = ((normalizedY - 0.08) / 0.84) * window.innerHeight

      return {
        x: clamp(x, 0, window.innerWidth - 1),
        y: clamp(y, 0, window.innerHeight - 1),
      }
    }

    const moveCursor = (position: Point) => {
      const previous = smoothCursorRef.current

      // Exponential smoothing: responsive at low speed, but removes the
      // high-frequency jitter from MediaPipe landmark coordinates.
      const smoothing = previous ? 0.30 : 1
      const next = previous
        ? {
            x: previous.x + (position.x - previous.x) * smoothing,
            y: previous.y + (position.y - previous.y) * smoothing,
          }
        : position

      smoothCursorRef.current = next
      onCursorMove?.(next)
    }

    const handleVirtualClick = (screenX: number, screenY: number) => {
      const element = document.elementFromPoint(screenX, screenY)
      if (!element) return

      if (
        element instanceof HTMLButtonElement ||
        element instanceof HTMLAnchorElement ||
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement ||
        element.closest("button,a,input,textarea,select")
      ) {
        const target =
          element.closest<HTMLElement>("button,a,input,textarea,select") || element

        target.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: screenX,
            clientY: screenY,
            view: window,
          }),
        )

        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        ) {
          target.focus()
        }
      }
    }

    const processFrame = async () => {
      if (!runningRef.current || !videoRef.current || !detectorRef.current) {
        return
      }

      const video = videoRef.current

      try {
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          animationFrameRef.current = requestAnimationFrame(processFrame)
          return
        }

        const hands = await detectorRef.current.estimateHands(video, {
          flipHorizontal: true,
        })

        if (hands.length === 0) {
          updateHandStatus(false)
          lastYRef.current = null
          pinchActiveRef.current = false
        } else {
          const keypoints = hands[0].keypoints

          const indexTip = keypoints[8]
          const indexPip = keypoints[6]
          const indexMcp = keypoints[5]
          const middleTip = keypoints[12]
          const middlePip = keypoints[10]
          const middleMcp = keypoints[9]
          const thumbTip = keypoints[4]

          updateHandStatus(true)

          const indexExtended = fingerExtended(indexTip, indexPip, indexMcp)
          const middleExtended = fingerExtended(
            middleTip,
            middlePip,
            middleMcp,
          )

          if (indexTip) {
            const screen = mapToScreen(indexTip, video)
            moveCursor(screen)

            const now = performance.now()
            const pinchDistance = thumbTip
              ? distance(indexTip, thumbTip)
              : Number.POSITIVE_INFINITY

            // Pinch is edge-triggered: one click when the pinch starts, then
            // no repeated clicks until the fingers separate again.
            if (
              indexExtended &&
              pinchDistance < 34 &&
              !pinchActiveRef.current &&
              now - lastClickTimeRef.current > 180
            ) {
              pinchActiveRef.current = true
              lastClickTimeRef.current = now
              handleVirtualClick(screen.x, screen.y)
            } else if (pinchDistance > 52) {
              pinchActiveRef.current = false
            }

            if (indexExtended && middleExtended && middleTip) {
              const averageY = (indexTip.y + middleTip.y) / 2

              if (lastYRef.current !== null) {
                const deltaY = averageY - lastYRef.current

                if (
                  Math.abs(deltaY) > 2.5 &&
                  now - lastScrollTimeRef.current > 35
                ) {
                  window.scrollBy({
                    top: deltaY * 7,
                    behavior: "auto",
                  })
                  lastScrollTimeRef.current = now
                }
              }

              lastYRef.current = averageY
            } else {
              lastYRef.current = null
            }
          }
        }
      } catch (error) {
        console.error("Hand tracking frame error:", error)
      }

      if (runningRef.current) {
        animationFrameRef.current = requestAnimationFrame(processFrame)
      }
    }

    return (
      <div className={styles.container}>
        <video ref={videoRef} style={{ display: "none" }} muted playsInline />
      </div>
    )
  },
)

HandTrackingMouse.displayName = "HandTrackingMouse"

export default HandTrackingMouse
