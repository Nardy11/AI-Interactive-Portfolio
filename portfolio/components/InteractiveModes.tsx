"use client";

import { useEffect, useRef, useState } from "react";
import { BrainCircuit, Camera, Hand, Pause, X, CircleDot, CheckCircle2, Send } from "lucide-react";
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
  const [cursor, setCursor] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (mode === "cv") {
      handRef.current?.startCamera();
    } else {
      handRef.current?.stopCamera();
      setCamera(false);
      setTracking(false);
      setHand(false);
    }
    return () => {
      handRef.current?.stopCamera();
    };
  }, [mode]);

  useEffect(() => {
    return () => handRef.current?.stopCamera();
  }, []);

  const cvPanel = mode === "cv";
  const nlpPanel = mode === "nlp";

  return (
    <>
      {cvPanel && (
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
          onCursorMove={setCursor}
        />
      )}

      {cvPanel && (
        <aside className={styles.cvOverlay} aria-label="Computer Vision Mode">
          <div className={styles.panelHeader}>
            <div>
              <h2><Hand size={17} /> Computer Vision Mode</h2>
              <p>Control this portfolio using hand gestures</p>
            </div>
            <div className={styles.panelHeaderActions}>
              <span className={styles.status}><i /> Active</span>
              <button aria-label="Exit CV Mode" onClick={() => onModeChange("none")}><X size={16} /></button>
            </div>
          </div>

          <div className={styles.cameraBox}>
            <video ref={previewRef} muted playsInline className={styles.cameraVideo} />
            <span className={styles.detected}><i /> {hand ? "Hand Detected" : camera ? "Camera Connected" : "Starting Camera"}</span>
          </div>

          <div className={styles.infoGrid}>
            <div>
              <h3>Gestures</h3>
              <p><Hand size={15} /> Move Hand = Move Cursor</p>
              <p><CircleDot size={15} /> Pinch Fingers = Click</p>
              <p><Hand size={15} /> Two Fingers = Scroll</p>
              <p><CheckCircle2 size={15} /> Closed Hand = Pause</p>
            </div>
            <div>
              <h3>Camera Status</h3>
              <p><Camera size={15} /> Camera: <b>{camera ? "Connected" : "Starting"}</b></p>
              <p><CheckCircle2 size={15} /> Hand: <b>{hand ? "Detected" : "Not Detected"}</b></p>
              <p><CircleDot size={15} /> Tracking: <b>{tracking ? "Active" : "Paused"}</b></p>
              <p><span className={styles.fpsDot} /> FPS: 30</p>
            </div>
          </div>

          <div className={styles.cvFooterActions}>
            <button onClick={() => tracking ? handRef.current?.stopCamera() : handRef.current?.startCamera()}>
              <Pause size={15} /> {tracking ? "Pause" : "Resume"}
            </button>
            <button className={styles.exitButton} onClick={() => onModeChange("none")}>Exit CV Mode</button>
          </div>

          <span
            className={styles.virtualCursor}
            style={{ left: cursor.x, top: cursor.y }}
            aria-hidden="true"
          />
        </aside>
      )}

      {nlpPanel && (
        <aside className={styles.nlpOverlay} aria-label="NLP Assistant">
          <div className={styles.nlpHeader}>
            <div>
              <h2><BrainCircuit size={17} /> NLP Assistant</h2>
              <p>Ask about projects, skills, experience or technologies</p>
            </div>
            <button aria-label="Close NLP Assistant" onClick={() => onModeChange("none")}><X size={16} /></button>
          </div>
          <NlpChat />
        </aside>
      )}
    </>
  );
}

function NlpChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ai-interactive-portfolio-back-end.vercel.app";

  const send = async (preset?: string) => {
    const question = (preset ?? input).trim();
    if (!question || loading) return;

    setMessages(current => [...current, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL + "/nlp/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json().catch(() => ({}));
      setMessages(current => [
        ...current,
        {
          role: "assistant",
          text: data.answer || data.response || data.message || "I couldn't get a response from the assistant.",
        },
      ]);
    } catch {
      setMessages(current => [
        ...current,
        { role: "assistant", text: "The NLP backend is currently unavailable." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.nlpBody}>
      <div className={styles.nlpReady}>
        <span><i /> Assistant ready</span>
        <small>Ask about projects, skills, experience or technologies</small>
        {messages.length === 0 && (
          <div className={styles.nlpSuggestions}>
            <button onClick={() => send("Tell me about my ML projects")}>ML projects</button>
            <button onClick={() => send("What technologies do I use?")}>Tech stack</button>
          </div>
        )}
      </div>

      <div className={styles.messages} aria-live="polite">
        {messages.map((message, index) => (
          <div key={index} className={message.role === "user" ? styles.userMessage : styles.assistantMessage}>
            {message.text}
          </div>
        ))}
        {loading && <div className={styles.assistantMessage}>Thinking…</div>}
      </div>

      <div className={styles.inputRow}>
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
    </div>
  );
}
