"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrainCircuit,
  Camera,
  CheckCircle2,
  CircleDot,
  Hand,
  Pause,
  Play,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import HandTrackingMouse, { HandTrackingHandle } from "./cv1";
import styles from "./InteractiveModes.module.css";
import { askAssistant } from "@/lib/assistant";

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
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let cancelled = false;

    if (mode === "cv") {
      setCameraStarting(true);
      void (async () => {
        try {
          if (!cancelled) await handRef.current?.startCamera();
        } finally {
          if (!cancelled) setCameraStarting(false);
        }
      })();
    } else {
      handRef.current?.stopCamera();
      setCamera(false);
      setHand(false);
      setTracking(false);
      setCameraStarting(false);
    }

    return () => {
      cancelled = true;
      handRef.current?.stopCamera();
    };
  }, [mode]);

  const startOrPauseCamera = async () => {
    if (tracking) {
      handRef.current?.stopCamera();
      setTracking(false);
      setCameraStarting(false);
      return;
    }

    if (cameraStarting) return;

    setCameraStarting(true);
    try {
      await handRef.current?.startCamera();
    } finally {
      setCameraStarting(false);
    }
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
            onCursorMove={setCursor}
          />

          <span className={styles.virtualCursor} style={{ left: cursor.x, top: cursor.y }} aria-hidden="true" />

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
                  type="button"
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
              <button
                type="button"
                className={styles.panelAction}
                onClick={startOrPauseCamera}
                disabled={cameraStarting}
                aria-busy={cameraStarting}
              >
                {cameraStarting ? <CircleDot size={14} /> : tracking ? <Pause size={14} /> : <Play size={14} />}
                {cameraStarting ? "Starting…" : tracking ? "Pause Camera" : "Start Camera"}
              </button>
              <button
                type="button"
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

  const send = async (value = input) => {
    const question = value.trim();
    if (!question || loading) return;

    setMessages((current) => [...current, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    const reply = await askAssistant(question);
    setMessages((current) => [...current, { role: "assistant", text: reply.text }]);
    setLoading(false);
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
