'use client';

import React, { useEffect, useRef, useState } from 'react';
import HandTrackingMouse, { HandTrackingHandle } from './cv1';
import AvatarOverlay from './avatar';
import { ArrowRight, BrainCircuit, BriefcaseBusiness, CheckCircle2, ChevronRight, CircleDot, Code2, Cpu, Database, Download, Github, Hand, Layers3, Linkedin, Server, Smartphone, Sparkles, Sun, Moon, X } from 'lucide-react';
import styles from './Hero.module.css';

type Mode = 'normal' | 'cv' | 'nlp';
interface HeroProps { initialMode?: Mode }

const projects = [
  { title: 'Cooperative Perception and Control (CPAC)', description: 'Real-time perception and control research for connected autonomous vehicles.', image: '/Distance_stereo.jpeg', tags: ['YOLOv8','ROS','OpenCV'] },
  { title: 'Transaction Category Prediction', description: 'Hybrid NLP and machine-learning project combining TF-IDF, K-Means and Logistic Regression.', image: '/data analysis.png', tags: ['NLP','ML','Scikit-learn'] },
  { title: 'WorkBoard — Full-Stack Work Management Platform', description: 'Production-oriented architecture with APIs, databases, automated testing and load testing.', image: '/Clinic Webs.png', tags: ['Next.js','NestJS','PostgreSQL'] },
  { title: 'AI-Integrated Portfolio Platform', description: 'Full-stack platform exposing AI functionality through REST APIs.', image: '/CV.webp', tags: ['Next.js','FastAPI','Docker'] },
];
const navItems = [['Home','#home'],['Projects','#projects'],['Experience','#experience'],['Skills','#skills'],['About','#about'],['Contact','#contact']];
const stats = [['5+','Production web projects'],['4','Internships'],['ML + CV','AI focus'],['Open','To opportunities']];
const skills = [
  [Code2,'Software Engineering','Web, mobile, backend and APIs'],
  [BrainCircuit,'Machine Learning','Applying ML to solve real problems'],
  [Smartphone,'Mobile Development','Cross-platform applications'],
  [Server,'Production Systems','Testing, Docker and deployment'],
];

export default function Hero({ initialMode='normal' }: HeroProps) {
  const [mode,setMode]=useState<Mode>(initialMode);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [dark,setDark]=useState(true);
  const [camera,setCamera]=useState(false);
  const [hand,setHand]=useState(false);
  const [tracking,setTracking]=useState(false);
  const [status,setStatus]=useState('Ready');
  const [chatInput,setChatInput]=useState('');
  const [chatMessages,setChatMessages]=useState<{role:'user'|'assistant';text:string}[]>([]);
  const [chatLoading,setChatLoading]=useState(false);
  const [cursorPosition,setCursorPosition]=useState({x:50,y:50});
  const handRef=useRef<HandTrackingHandle>(null);
  const previewRef=useRef<HTMLVideoElement>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const API_URL=process.env.NEXT_PUBLIC_API_URL || 'https://ai-interactive-portfolio-back-end.vercel.app';

  const changeMode=(next:Mode)=>{ setMode(next); setMobileOpen(false); window.scrollTo({top:0,behavior:'smooth'}); };
  const onStream=(stream:MediaStream|null)=>{
    streamRef.current=stream; setCamera(!!stream); setTracking(!!stream);
    if(previewRef.current){ previewRef.current.srcObject=stream; if(stream) previewRef.current.play().catch(()=>{}); }
  };
  const onHand=(detected:boolean)=>{ setHand(detected); };
  const onCursorMove=(position:{x:number;y:number})=>setCursorPosition(position);
  const sendChat=async()=>{
    const question=chatInput.trim();
    if(!question || chatLoading) return;
    setChatMessages(m=>[...m,{role:'user',text:question}]); setChatInput(''); setChatLoading(true);
    try{
      const res=await fetch(API_URL+'/nlp/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question})});
      const data=await res.json().catch(()=>({}));
      const answer=data.answer||data.response||data.message||'I could not get a response from the NLP assistant.';
      setChatMessages(m=>[...m,{role:'assistant',text:answer}]);
    }catch{setChatMessages(m=>[...m,{role:'assistant',text:'The NLP backend is currently unavailable.'}]);}
    finally{setChatLoading(false);}
  };

  useEffect(()=>{
    if(mode==='cv'){ setStatus('Camera initializing...'); requestAnimationFrame(()=>handRef.current?.startCamera()); }
    else { handRef.current?.stopCamera(); setCamera(false); setHand(false); setTracking(false); setStatus('Ready'); setCursorPosition({x:50,y:50}); }
  },[mode]);
  useEffect(()=>()=>{ handRef.current?.stopCamera(); streamRef.current?.getTracks().forEach(t=>t.stop()); },[]);
  useEffect(()=>{ if(camera) setStatus(hand?'Hand detected':'Camera connected'); },[camera,hand]);
  useEffect(()=>{
    if(mode!=='nlp') return;
    fetch(API_URL+'/nlp/start-assistant').catch(()=>setStatus('NLP backend unavailable'));
    return ()=>{ fetch(API_URL+'/nlp/stop-assistant').catch(()=>{}); };
  },[mode,API_URL]);

  return <div className={`${styles.page} ${dark?styles.dark:styles.light}`}>
    {mode==='nlp' && <>
      <AvatarOverlay />
      <aside className={styles.nlpPanel}>
        <div className={styles.nlpHeader}><div><h3><BrainCircuit size={18}/> NLP Portfolio Assistant</h3><p>Ask me about Nardy's projects, skills and experience.</p></div><button className={styles.panelIcon} onClick={()=>changeMode('normal')} aria-label="Close"><X size={17}/></button></div>
        <div className={styles.chatMessages}>{chatMessages.length===0 && <div className={styles.chatWelcome}>Hi. Ask me anything about my projects, experience, skills, education, or technologies.</div>}{chatMessages.map((m,i)=><div key={i} className={`${styles.chatBubble} ${m.role==='user'?styles.chatUser:styles.chatAssistant}`}>{m.text}</div>)}{chatLoading&&<div className={`${styles.chatBubble} ${styles.chatAssistant}`}>Thinking…</div>}</div>
        <div className={styles.chatInputRow}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')sendChat();}} placeholder="Ask about my portfolio…"/><button onClick={sendChat} disabled={chatLoading}><ArrowRight size={16}/></button></div>
      </aside>
    </>}
    <HandTrackingMouse ref={handRef} onStreamChange={onStream} onHandStatusChange={onHand} onCursorMove={onCursorMove}/>

    <header className={styles.navbar}>
      <a href="#home" className={styles.brand} onClick={()=>changeMode('normal')}><span className={styles.brandMark}>NA</span><span><strong>Nardy Attalla</strong><small>CS Engineer | Aspiring ML Engineer</small></span></a>
      <nav className={`${styles.navLinks} ${mobileOpen?styles.navOpen:''}`}>{navItems.map(([label,href])=><a key={label} href={href} onClick={()=>setMobileOpen(false)}>{label}</a>)}</nav>
      <div className={styles.navActions}>
        <button className={styles.iconButton} onClick={()=>setDark(v=>!v)} aria-label="Toggle theme">{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
        <button className={styles.outlineButton} onClick={()=>changeMode('cv')}><Hand size={16}/> CV Mode</button>
        <button className={styles.outlineButton} onClick={()=>changeMode('nlp')}><BrainCircuit size={16}/> NLP Assistant</button>
        <a className={styles.outlineButton} href="/full_stack_cv_edited.pdf" target="_blank"><Download size={16}/> Download CV</a>
        <button className={styles.mobileMenuButton} onClick={()=>setMobileOpen(v=>!v)} aria-label="Menu">{mobileOpen?<X size={20}/>:<Layers3 size={20}/>}</button>
      </div>
    </header>

    <main>
      <section id="home" className={styles.hero}>
        <div className={styles.heroBackdrop}/>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>BUILD · LEARN · IMPROVE · REPEAT</div>
          <h1>Hi, I’m <span>Nardy Attalla</span></h1>
          <h2>Computer Science Engineer</h2>
          <p>I build modern web and mobile applications, explore Machine Learning, and turn ideas into practical software.</p>
          <div className={styles.heroButtons}><a className={styles.primaryButton} href="#projects">View My Projects <ArrowRight size={17}/></a><a className={styles.outlineButton} href="/full_stack_cv_edited.pdf" target="_blank"><Download size={16}/> Download CV</a></div>
        </div>
        <div className={styles.heroVisual}><div className={styles.visualGlow}/><div className={styles.cityLine}/><div className={styles.visualQuote}>Same<br/>Engineer.<br/>Bigger<br/>Possibilities.</div></div>
        {mode==='cv' && hand && <div className={styles.cursorDemo} style={{left:cursorPosition.x,top:cursorPosition.y}}><CircleDot size={26}/><span>Controlled by Hand</span></div>}

        {mode==='cv' && <aside className={styles.cvPanel}>
          <div className={styles.panelHeader}><div><h3><Hand size={18}/> Computer Vision Mode</h3><p>Control this portfolio using hand gestures</p></div><div className={styles.panelHeaderActions}><span className={styles.activePill}><span/>{camera?'Active':'Starting'}</span><button className={styles.panelIcon} onClick={()=>changeMode('normal')} aria-label="Close"><X size={17}/></button></div></div>
          <div className={styles.cameraFrame}><video ref={previewRef} muted playsInline className={styles.cameraVideo}/><div className={styles.cameraBadge}><span/>{hand?'Hand Detected':'Waiting for Hand'}</div></div>
          <div className={styles.cvInfoGrid}>
            <div className={styles.infoCard}><h4>Gestures</h4><ul><li><Hand size={15}/> Move Hand = Move Cursor</li><li><CircleDot size={15}/> Pinch Fingers = Click</li><li><Hand size={15}/> Two Fingers = Scroll</li><li><CheckCircle2 size={15}/> Closed Hand = Pause</li></ul></div>
            <div className={styles.infoCard}><h4>Camera Status</h4><ul><li><CircleDot size={15}/> Camera: {camera?'Connected':'Starting'}</li><li><CheckCircle2 size={15}/> Hand: {hand?'Detected':'Not detected'}</li><li><Cpu size={15}/> Tracking: {tracking?'Active':'Idle'}</li><li><Sparkles size={15}/> Status: {status}</li></ul></div>
          </div>
          <div className={styles.panelFooter}><button className={styles.panelAction} onClick={()=>{ if(tracking){handRef.current?.stopCamera();setTracking(false)}else handRef.current?.startCamera(); }}>{tracking?'Pause':'Start Camera'}</button><button className={styles.exitButton} onClick={()=>changeMode('normal')}>Exit CV Mode</button></div>
        </aside>}
      </section>

      <section className={styles.statsBar}>{stats.map(([value,label])=><div key={label}><span>{value}</span><small>{label}</small></div>)}</section>

      <section id="projects" className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>SELECTED WORK</span><h2>Featured Projects</h2></div><a href="#projects" onClick={(e)=>{e.preventDefault();document.getElementById('projects')?.scrollIntoView({behavior:'smooth',block:'start'});}}>View All Projects <ChevronRight size={17}/></a></div><div className={styles.projectGrid}>{projects.map(p=><article className={styles.projectCard} key={p.title}><div className={styles.projectImageWrap}><img src={p.image} alt="" className={styles.projectImage}/></div><div className={styles.projectBody}><h3>{p.title}</h3><p>{p.description}</p><div className={styles.tags}>{p.tags.map(t=><span key={t}>{t}</span>)}</div></div></article>)}</div></section>

      <section id="experience" className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>CAREER</span><h2>Experience</h2></div><a href="#contact">Open to opportunities <ChevronRight size={17}/></a></div><div className={styles.experienceGrid}><article className={styles.experienceCard}><BriefcaseBusiness size={20}/><div><h3>Full-Stack / Software Engineer</h3><p>Prime Softworks × Poseidon X · Jul 2026 – Present</p><span>React · React Native · TypeScript · NestJS · PostgreSQL/Supabase · Docker</span></div></article><article className={styles.experienceCard}><Server size={20}/><div><h3>Backend Systems Engineer</h3><p>Huawei Technologies · Dec 2025 – Jun 2026</p><span>Linux production environments · SQL · operational data · troubleshooting</span></div></article></div></section>

      <section id="skills" className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>CAPABILITIES</span><h2>What I Work On</h2></div></div><div className={styles.skillGrid}>{skills.map(([Icon,title,text])=>{const SkillIcon=Icon as React.ElementType;return <div className={styles.skillCard} key={String(title)}><SkillIcon size={21}/><h3>{String(title)}</h3><p>{String(text)}</p></div>})}</div><div className={styles.learningBlock}><div><span className={styles.sectionKicker}>CURRENT DIRECTION</span><h3>Growing deeper into ML</h3><p>Machine Learning fundamentals and Computer Vision are already part of my projects. Deep learning, MLOps and RAG are the next steps.</p></div><div className={styles.learningGrid}>{[[BrainCircuit,'Machine Learning'],[Cpu,'Computer Vision'],[Server,'MLOps'],[Sparkles,'RAG — Next']].map(([Icon,title])=>{const I=Icon as React.ElementType;return <div key={String(title)}><I size={18}/><span>{String(title)}</span></div>})}</div></div></section>

      <section id="about" className={styles.section}><div className={styles.aboutCard}><div><span className={styles.sectionKicker}>ABOUT</span><h2>Software engineer with a growing ML focus.</h2></div><p>I’m a Computer Science and Engineering graduate from the German University in Cairo. I enjoy building full-stack and mobile products while developing practical Machine Learning and Computer Vision skills through projects, research and continuous learning.</p><div className={styles.aboutMeta}><span><Database size={16}/> SQL / NoSQL</span><a href="https://github.com/Nardy11" target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a><a href="https://www.linkedin.com/in/nardy-attallah" target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn</a></div></div></section>

      <section id="contact" className={styles.contact}><div><span className={styles.sectionKicker}>LET’S CONNECT</span><h2>Open to opportunities.</h2><p>Software engineering, full-stack development and ML-focused opportunities.</p></div><div className={styles.contactLinks}><a href="mailto:nardymichelle2003@gmail.com"><CircleDot size={16}/> Email</a><a href="https://www.linkedin.com/in/nardy-attallah" target="_blank"><Linkedin size={16}/> LinkedIn</a><a href="https://github.com/Nardy11" target="_blank"><Github size={16}/> GitHub</a></div></section>
    </main>
  </div>;
}
