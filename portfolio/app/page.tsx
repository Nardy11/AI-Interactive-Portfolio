"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import styles from "@/components/PortfolioPages.module.css";

export default function Home() {
  return <PageFrame active="Home">
    <main>
      <section className={styles.heroHome}>
        <div className={styles.container}>
          <div className={styles.homeHeroGrid}>
            <div className={styles.homeCopy}>
              <div className={styles.kicker}>INTERACTIVE PORTFOLIO</div>
              <h1>Same Engineer.<br/><span className={styles.gradient}>More Possibilities.</span></h1>
              <p>I’m Nardy Attalla, a Computer Science Engineer based in Egypt. I build full-stack applications while developing practical skills in <span className={styles.gradient}>Machine Learning, Computer Vision and AI.</span></p>
              <div className={styles.statsMini}><div><strong>3+</strong><small>Years of Experience</small></div><div><strong>10+</strong><small>Projects</small></div><div><strong>∞</strong><small>Curiosity to Learn</small></div></div>
              <div style={{display:"flex",gap:12}}><Link href="/projects" className={styles.button}>Explore My Work <ArrowRight size={15}/></Link><Link href="/contact" className={styles.buttonGhost}>Contact Me</Link></div>
            </div>
            <div className={styles.heroPortrait}>
              <Image src="/picprofile.png" alt="Nardy Attalla" width={500} height={500}/>
              <div className={styles.quote}>“Turning knowledge into real-world impact.”<b>— Nardy Attalla</b></div>
              <div className={styles.steps}><span>Build</span><span>Learn</span><span>Improve</span><span>Repeat</span></div>
            </div>
          </div>
          <div className={styles.modeCards}>
            <article className={styles.modeCard}><span className={styles.modeNum}>01</span><Image className={styles.modeImage} src="/normal_navigation.png" alt="" width={180} height={90}/><h3>Normal Navigation</h3><p>Explore my portfolio with the traditional interface.</p><Link href="/projects" className={styles.buttonGhost}>Start Exploring <ArrowRight size={14}/></Link></article>
            <article className={styles.modeCard}><span className={styles.modeNum}>02</span><Image className={styles.modeImage} src="/cv.png" alt="" width={180} height={90}/><h3>Navigate Using<br/>Computer Vision</h3><p>Control your mouse using hand gestures with your camera.</p><Link href="/cv" className={styles.buttonGhost}>Start Camera Mode <ArrowRight size={14}/></Link></article>
            <article className={styles.modeCard}><span className={styles.modeNum}>03</span><Image className={styles.modeImage} src="/nlp_assistant.png" alt="" width={180} height={90}/><h3>Navigate Using<br/>NLP Assistant</h3><p>Ask questions about my work, skills and experience.</p><Link href="/nlp" className={styles.buttonGhost}>Start Chat <ArrowRight size={14}/></Link></article>
          </div>
          <div className={styles.homeSocial}><span>Scroll down to learn more</span><span style={{flex:1,height:1,background:"#283c60"}}/><a href="https://github.com/Nardy11" target="_blank" rel="noreferrer"><Github size={19}/></a><a href="https://www.linkedin.com/in/nardy-attallah" target="_blank" rel="noreferrer"><Linkedin size={19}/></a><a href="mailto:nardy.attalla@gmail.com"><Mail size={19}/></a></div>
        </div>
      </section>
      <section className={styles.sectionBlock}><div className={styles.container}><div className={styles.split}><div><div className={styles.kicker}>ABOUT ME</div><h2 className={styles.sectionTitle}>Curious Mind,<br/><span className={styles.gradient}>Practical Builder.</span></h2><p className={styles.sectionIntro}>I’m a Computer Science and Engineering graduate from the German University in Cairo. I enjoy building full-stack and mobile applications while developing practical Machine Learning and Computer Vision skills.</p><Link href="/about" className={styles.buttonGhost}>More About Me <ArrowRight size={14}/></Link></div><div className={styles.cards4}><div className={styles.card}><b>Build</b><p>Turn ideas into real projects.</p></div><div className={styles.card}><b>Learn</b><p>Explore new technologies.</p></div><div className={styles.card}><b>Improve</b><p>Refine skills through practice.</p></div><div className={styles.card}><b>Collaborate</b><p>Work with amazing people.</p></div></div></div></div></section>
      <section className={styles.sectionBlock}><div className={styles.container}><div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:20}}><div><div className={styles.kicker}>FEATURED PROJECTS</div><h2 className={styles.sectionTitle}>Projects I’m Proud Of</h2></div><Link href="/projects" className={styles.buttonGhost}>View All Projects <ArrowRight size={14}/></Link></div><div className={styles.cards3} style={{marginTop:25}}>{[["/Distance_stereo.jpeg","Cooperative Perception and Control (CPAC)","Real-time object detection for connected vehicles using YOLOv8, ROS and more."],["/data analysis.png","Transaction Category Prediction","Hybrid NLP and machine-learning project using TF-IDF, K-Means and Logistic Regression."],["/ESG&.png","Environment Management App","Flutter and Firebase application for environmental data management."]].map(([img,title,desc])=><article className={styles.card} key={title}><Image src={img} alt="" width={500} height={230} style={{width:"100%",height:150,objectFit:"cover",borderRadius:8}}/><h3>{title}</h3><p>{desc}</p></article>)}</div></div></section>
    </main>
  </PageFrame>;
}