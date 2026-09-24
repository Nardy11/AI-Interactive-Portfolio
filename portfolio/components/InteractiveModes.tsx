"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrainCircuit,
  Camera,
  CheckCircle2,
  CircleDot,
  Hand,
  Pause,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import HandTrackingMouse, { HandTrackingHandle } from "./cv1";
import styles from "./InteractiveModes.module.css";

export type InteractiveMode = "none" | "cv" | "nlp";

export default function InteractiveModes({
  mode,
  onModeChange,
}: {
  mode: InteractiveMode;
  onModeChange: (mode: InteractiveMode) => void;
}) {
  const handRef = useRef<HandTrackingHandle>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [camera, setCamera] = useState(false);
  const [hand, setHand] = useState(false);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (mode === "cv") {
      requestAnimationFrame(() => handRef.current?.startCamera());
    } else {
      handRef.current?.stopCamera();
      setCamera(false);
      setHand(false);
      setTracking(false);
    }

    return () => handRef.current?.stopCamera();
  }, [mode]);

  const startOrPauseCamera = () => {
    if (tracking) {
      handRef.current?.stopCamera();
      setTracking(false);
      return;
    }

    handRef.current?.startCamera();
  };

  return (
    <>
      {mode === "cv" && (
        <>
          <HandTrackingMouse
            ref={handRef}
            onStreamChange={(stream) => {
              setCamera(Boolean(stream));
              setTracking(Boolean(stream));

              if (previewRef.current) {
                previewRef.current.srcObject = stream;
                if (stream) previewRef.current.play().catch(() => {});
              }
            }}
            onHandStatusChange={setHand}
          />

          <aside className={styles.cvPanel} aria-label="Computer Vision Mode">
            <div className={styles.panelHeader}>
              <div>
                <h3><Hand size={18} /> Computer Vision Mode</h3>
                <p>Control this portfolio using hand gestures</p>
              </div>

              <div className={styles.panelHeaderActions}>
                <span className={styles.activePill}>
                  <span />
                  {camera ? "Active" : "Starting"}
                </span>
                <button
                  className={styles.panelIcon}
                  onClick={() => onModeChange("none")}
                  aria-label="Close Computer Vision Mode"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className={styles.cameraFrame}>
              <video
                ref={previewRef}
                muted
                playsInline
                className={styles.cameraVideo}
              />
              <div className={styles.cameraBadge}>
                <span />
                {hand ? "Hand Detected" : "Waiting for Hand"}
              </div>
            </div>

            <div className={styles.cvInfoGrid}>
              <div className={styles.infoCard}>
                <h4>Gestures</h4>
                <ul>
                  <li><Hand size={15} /> Move Hand = Move Cursor</li>
                  <li><CircleDot size={15} /> Pinch Fingers = Click</li>
                  <li><Hand size={15} /> Two Fingers = Scroll</li>
                  <li><CheckCircle2 size={15} /> Closed Hand = Pause</li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <h4>Camera Status</h4>
                <ul>
                  <li><Camera size={15} /> Camera: {camera ? "Connected" : "Starting"}</li>
                  <li><CheckCircle2 size={15} /> Hand: {hand ? "Detected" : "Not detected"}</li>
                  <li><CircleDot size={15} /> Tracking: {tracking ? "Active" : "Idle"}</li>
                  <li><Sparkles size={15} /> Status: {tracking ? "Ready" : "Paused"}</li>
                </ul>
              </div>
            </div>

            <div className={styles.panelFooter}>
              <button className={styles.panelAction} onClick={startOrPauseCamera}>
                <Pause size={14} />
                {tracking ? "Pause" : "Start Camera"}
              </button>
              <button
                className={styles.exitButton}
                onClick={() => onModeChange("none")}
              >
                Exit CV Mode
              </button>
            </div>
          </aside>
        </>
      )}

      {mode === "nlp" && <NlpAssistant onClose={() => onModeChange("none")} />}
    </>
  );
}

function NlpAssistant({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://ai-interactive-portfolio-back-end.vercel.app";

  const send = async (value = input) => {
    const question = value.trim();
    if (!question || loading) return;

    setMessages((current) => [...current, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL + "/nlp/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json().catch(() => ({}));

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            data.answer ||
            data.response ||
            data.message ||
            "I couldn't get a response from the assistant.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: "The NLP backend is currently unavailable." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={styles.nlpPanel} aria-label="NLP Assistant">
      <div className={styles.nlpHeader}>
        <div>
          <span>PORTFOLIO ASSISTANT</span>
          <h2><BrainCircuit size={18} /> NLP Assistant</h2>
        </div>
        <button onClick={onClose} aria-label="Close NLP Assistant">
          <X size={17} />
        </button>
      </div>

      <div className={styles.nlpReady}>
        <Sparkles size={20} />
        <b>Assistant ready</b>
        <span>Ask about projects, skills, experience or technologies.</span>
      </div>

      <div className={styles.nlpMessages} aria-live="polite">
        {messages.length === 0 && (
          <div className={styles.nlpWelcome}>
            <b>What would you like to know?</b>
            <span>Ask about my projects, skills, education or experience.</span>
            <div>
              <button onClick={() => send("Tell me about my ML projects")}>ML projects</button>
              <button onClick={() => send("What technologies do you use?")}>Tech stack</button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? styles.nlpUser
                : styles.nlpAssistant
            }
          >
            {message.text}
          </div>
        ))}

        {loading && <div className={styles.nlpAssistant}>Thinking…</div>}
      </div>

      <div className={styles.nlpInput}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") send();
          }}
          placeholder="Ask anything about my portfolio…"
          aria-label="Ask the NLP assistant"
        />
        <button onClick={() => send()} disabled={loading} aria-label="Send question">
          <Send size={15} />
        </button>
      </div>
    </aside>
  );
}
