"use client";

import React, { useEffect, useRef, useState } from "react";
import HandTrackingMouse, { HandTrackingHandle } from "./cv1";
import AvatarOverlay from "./avatar";
import { ArrowRight, BrainCircuit, CheckCircle2, CircleDot, Cpu, Download, Github, Hand, Layers3, Linkedin, Mail, Moon, Server, Sparkles, Sun, X } from "lucide-react";
import styles from "./Hero.module.css";
import { askAssistant } from "@/lib/assistant";

export type Mode = "cv" | "nlp";

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const next = saved === "light" ? false : true;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    document.documentElement.style.colorScheme = next ? "dark" : "light";
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    window.localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, setDark] as const;
}

function ModeNavbar({ mode, dark, setDark }: { mode: Mode; dark: boolean; setDark: React.Dispatch<React.SetStateAction<boolean>> }) {
  const links = [["Home","/home"],["Projects","/projects"],["Experience","/experience"],["Skills","/skills"],["About","/about"],["Contact","/contact"]] as const;
  return <header className={styles.modeNavbar}>
    <a href="/home" className={styles.modeBrand}><span>NA</span><div><b>Nardy Attalla</b><small>CS Engineer | Aspiring ML Engineer</small></div></a>
    <nav>{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
    <div className={styles.modeActions}>
      <button className={styles.modeTheme} onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? <Sun size={16}/> : <Moon size={16}/>}</button>
      <a className={`${styles.modeButton} ${mode === "cv" ? styles.modeButtonActive : ""}`} href="/cv"><Hand size={15}/> CV Mode</a>
      <a className={`${styles.modeButton} ${mode === "nlp" ? styles.modeButtonActive : ""}`} href="/nlp"><BrainCircuit size={15}/> NLP Assistant</a>
      <a className={styles.modeButton} href="/full_stack_cv_edited.pdf" target="_blank" rel="noreferrer"><Download size={15}/> Download CV</a>
    </div>
  </header>;
}

function CVPage({ dark, setDark }: { dark: boolean; setDark: React.Dispatch<React.SetStateAction<boolean>> }) {
  const handRef = useRef<HandTrackingHandle>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [camera, setCamera] = useState(false);
  const [hand, setHand] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  useEffect(() => {
    handRef.current?.startCamera();
    return () => handRef.current?.stopCamera();
  }, []);
  return <div className={styles.modePage}>
    <ModeNavbar mode="cv" dark={dark} setDark={setDark}/>
    <HandTrackingMouse
      ref={handRef}
      onStreamChange={(stream) => {
        setCamera(!!stream); setTracking(!!stream);
        if (previewRef.current) { previewRef.current.srcObject = stream; if (stream) previewRef.current.play().catch(() => {}); }
      }}
      onHandStatusChange={setHand}
      onCursorMove={setCursor}
    />
    <main className={styles.modeMain}>
      <section className={styles.modeIntro}>
        <span className={styles.modeKicker}>COMPUTER VISION MODE</span>
        <h1>Navigate with <span>your hands.</span></h1>
        <p>Use your webcam as a virtual mouse. The portfolio remains fully visible while the control panel stays separate from the experience.</p>
        <div className={styles.modeStats}><span><b>{camera ? "Connected" : "Starting"}</b> Camera</span><span><b>{hand ? "Detected" : "Waiting"}</b> Hand</span><span><b>{tracking ? "Active" : "Idle"}</b> Tracking</span></div>
        <div className={styles.modeLinks}><a href="/home">Back to portfolio <ArrowRight size={14}/></a><button onClick={() => tracking ? handRef.current?.stopCamera() : handRef.current?.startCamera()}>{tracking ? "Pause Camera" : "Start Camera"}</button></div>
      </section>
      <section className={styles.cvWorkspace}>
        <div className={styles.cvVisual}>
          <div className={styles.cvGrid}/>
          <div className={styles.cvOrb}/>
          <div className={styles.cvCursor} style={{left: `${cursor.x}%`,top: `${cursor.y}%`}}><CircleDot size={22}/></div>
          <div className={styles.cvVisualLabel}><span/><b>LIVE HAND TRACKING</b><small>Move your hand to control the pointer</small></div>
        </div>
        <aside className={styles.cvPanelModern}>
          <div className={styles.modernPanelHead}><div><span>LIVE CONTROL</span><h2><Hand size={18}/> Computer Vision</h2></div><a href="/home" aria-label="Close CV mode"><X size={17}/></a></div>
          <div className={styles.cameraFrameModern}><video ref={previewRef} muted playsInline className={styles.cameraVideoModern}/><span className={styles.cameraStatus}><i/>{hand ? "Hand detected" : camera ? "Camera connected" : "Starting camera"}</span></div>
          <div className={styles.gestureGridModern}>
            <div><Hand/><b>Move</b><small>Move cursor</small></div><div><CircleDot/><b>Pinch</b><small>Click</small></div><div><Hand/><b>Two fingers</b><small>Scroll</small></div><div><CheckCircle2/><b>Closed hand</b><small>Pause</small></div>
          </div>
          <div className={styles.modernPanelFooter}><span>Tracking status</span><strong>{tracking ? "Active" : "Paused"}</strong></div>
        </aside>
      </section>
    </main>
  </div>;
}

function NLPPage({ dark, setDark }: { dark: boolean; setDark: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [chatOpen, setChatOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role:"user"|"assistant";text:string}[]>([]);
  const [loading, setLoading] = useState(false);
  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    const reply = await askAssistant(q);
    setMessages(m => [...m, { role: "assistant", text: reply.text }]);
    setLoading(false);
  };
  return <div className={styles.modePage}>
    <ModeNavbar mode="nlp" dark={dark} setDark={setDark}/>
    <main className={styles.modeMainNlp}>
      <section className={styles.nlpModelStage}>
        <div className={styles.modelBackdrop}><div/><div/></div>
        <div className={styles.modelCopy}><span className={styles.modeKicker}>NLP ASSISTANT</span><h1>Ask about my <span>work.</span></h1><p>The 3D assistant stays visible while the conversation lives in its own workspace.</p></div>
        <AvatarOverlay embedded/>
        <div className={styles.modelStageFooter}><span><i/> Assistant ready</span><small>Ask about projects, skills, experience or technologies</small></div>
      </section>
      <aside className={`${styles.nlpWorkspace} ${chatOpen ? "" : styles.nlpWorkspaceClosed}`}>
        {chatOpen ? <><div className={styles.nlpModernHead}><div><span>PORTFOLIO ASSISTANT</span><h2><BrainCircuit size={18}/> NLP Assistant</h2></div><button onClick={()=>setChatOpen(false)} aria-label="Close chat"><X size={17}/></button></div>
          <div className={styles.nlpModernMessages}>{messages.length===0 && <div className={styles.nlpWelcome}><Sparkles size={25}/><b>What would you like to know?</b><span>Ask about my projects, skills, education or experience.</span><div><button onClick={()=>setInput("Tell me about your ML projects")}>ML projects</button><button onClick={()=>setInput("What technologies do you use?")}>Tech stack</button></div></div>}{messages.map((m,i)=><div key={i} className={m.role==="user"?styles.nlpUserModern:styles.nlpAssistantModern}>{m.text}</div>)}{loading&&<div className={styles.nlpAssistantModern}>Thinking…</div>}</div>
          <div className={styles.nlpInputModern}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send()}} placeholder="Ask anything about my portfolio…"/><button onClick={send} disabled={loading}><ArrowRight size={16}/></button></div>
        </> : <button className={styles.openChatButton} onClick={()=>setChatOpen(true)}><BrainCircuit size={15}/> Open assistant</button>}
      </aside>
    </main>
  </div>;
}

export default function Hero({ initialMode = "cv" }: { initialMode?: Mode }) {
  const [dark, setDark] = useTheme();
  return initialMode === "cv" ? <CVPage dark={dark} setDark={setDark}/> : <NLPPage dark={dark} setDark={setDark}/>;
}
