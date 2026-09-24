"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, UserRound, MapPin, GraduationCap, BriefcaseBusiness, Mail, Linkedin, Github, Globe2, BrainCircuit, Lightbulb, Users, Rocket } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import PageHero, { HeroGhost, HeroPrimary } from "@/components/PageHero";
import styles from "@/components/AboutExact.module.css";

const values = [[BrainCircuit, "Continuous Learning", "I love learning new technologies and exploring how things work under the hood."],[Lightbulb, "Building Real Solutions", "Turning ideas into practical applications that solve real-world problems."],[Users, "Collaboration", "I enjoy working with people, sharing knowledge, and learning from different perspectives."],[Rocket, "Making an Impact", "I’m motivated by using technology to create meaningful and positive change."]] as const;
function SectionHeading({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return <div className={styles.sectionHeading}><span className={styles.headingBar} /><Icon size={19} strokeWidth={2.2} /><h2>{title}</h2>{subtitle && <em>{subtitle}</em>}</div>;
}
export default function About() {
  return <PageFrame active="About"><main className={styles.aboutPage}>
    <PageHero
      eyebrow="About me"
      title={<>More Than<br />Just <em>Code</em></>}
      lead="I'm Nardy Attalla, a Full-Stack Software Engineer and Computer Science Engineer from Egypt. I build and deploy web and mobile applications with modern JavaScript/TypeScript stacks, while developing practical expertise in Machine Learning, Computer Vision and AI."
      actions={<>
        <HeroPrimary href="/full_stack_cv_edited.pdf" download><Download size={15} />Download CV</HeroPrimary>
        <HeroGhost href="/contact">Let&apos;s connect <ArrowRight size={15} /></HeroGhost>
      </>}
      scene="skyline"
      portrait={{ src: "/picprofile.png", alt: "Nardy Attalla", priority: true }}
      readout="about · cairo, eg"
      note={<>Curious learner.<br />Problem solver.<br />Builder.</>}
      quote={{ text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" }}
    />

    <section className={styles.storySection}><div className={styles.storyGrid}>
      <div className={styles.storyColumn}><SectionHeading icon={BrainCircuit} title="My Story" subtitle="A journey of curiosity, hard work and continuous learning." /><p>I&apos;m a Computer Science and Engineering graduate from the German University in Cairo (GUC), where I completed my B.Sc. from 2020 to 2025. My journey started with a strong interest in technology and problem-solving, which grew into a passion for building software and exploring how AI can make a real impact.</p><p>Since university, I&apos;ve worked across full-stack software engineering, Operations Engineer L1, mobile applications, research and machine learning. I&apos;ve contributed to production web projects at Prime Softworks × Poseidon X, worked with Linux and backend production environments at Huawei, and completed Flutter, Firebase and computer vision internships. I&apos;m turning ideas into practical solutions and I&apos;m always eager to learn new technologies and take on challenging projects.</p><p>I&apos;m currently focused on building production-quality full-stack systems while deepening my knowledge in Machine Learning, MLOps and AI. My toolkit includes React, Next.js, TypeScript, Node.js, NestJS, FastAPI, PostgreSQL, Supabase, MongoDB, Docker, GitHub Actions, AWS and Vercel.</p><div className={styles.storyQuote}><p>“Nothing in life is to be feared, it is only to be understood.”</p><small>— Marie Curie</small></div></div>
      <div className={styles.personalColumn}><SectionHeading icon={UserRound} title="Personal Details" /><div className={styles.personalCard}><div className={styles.detailRow}><UserRound /><span>Nardy Attalla</span></div><div className={styles.detailRow}><MapPin /><span>Cairo, Egypt (From Sohag)</span></div><div className={styles.detailRow}><GraduationCap /><span>B.Sc. Computer Science and Engineering<br /><b>German University in Cairo (GUC)</b><br />2021 – 2025</span></div><div className={styles.detailRow}><BriefcaseBusiness /><span>Open to opportunities worldwide</span></div><a className={styles.detailRow} href="mailto:nardy.attalla@gmail.com"><Mail /><span>nardy.attalla@gmail.com</span></a><a className={styles.detailRow} href="https://www.linkedin.com/in/nardy-attallah" target="_blank" rel="noreferrer"><Linkedin /><span>linkedin.com/in/nardy-attallah</span></a><a className={styles.detailRow} href="https://github.com/Nardy11" target="_blank" rel="noreferrer"><Github /><span>github.com/Nardy11</span></a></div></div>
      <div className={styles.polaroids}><div className={styles.polaroidBerlin}><div className={styles.polaroidImage} /><span>Semester<br />abroad in<br />Berlin</span><i /></div><div className={styles.polaroidCity}><div className={styles.cityImage} /></div><p className={styles.polaroidCaption}>“New places,<br />new perspectives,<br />same passion.”</p></div>
    </div></section>
    <section className={styles.drivesSection}><SectionHeading icon={BrainCircuit} title="What Drives Me" subtitle="The values and interests that keep me motivated." /><div className={styles.valueGrid}>{values.map(([Icon,title,text])=><article className={styles.valueCard} key={title}><Icon size={28}/><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className={styles.connectSection}><SectionHeading icon={Mail} title="Let&apos;s Connect" subtitle="I&apos;m always open to interesting conversations, collaborations, and opportunities." /><div className={styles.connectGrid}><div className={styles.connectLinks}><a href="mailto:nardy.attalla@gmail.com"><Mail/><span>Email</span><b>nardy.attalla@gmail.com</b></a><a href="https://www.linkedin.com/in/nardy-attallah" target="_blank" rel="noreferrer"><Linkedin/><span>LinkedIn</span><b>linkedin.com/in/nardy-attallah</b></a><a href="https://github.com/Nardy11" target="_blank" rel="noreferrer"><Github/><span>GitHub</span><b>github.com/Nardy11</b></a><a href="#opportunities"><MapPin/><span>Location</span><b>Cairo, Egypt</b></a><Link href="/contact" className={styles.opportunityButton}><Globe2/>Open to opportunities worldwide</Link></div><div className={styles.messageCard}><div className={styles.formRow}><input placeholder="Your Name" aria-label="Your Name"/><input placeholder="Your Email" aria-label="Your Email" type="email"/></div><textarea placeholder="Your Message" aria-label="Your Message"/><a href="mailto:nardy.attalla@gmail.com?subject=Portfolio%20Inquiry" className={styles.messageButton}>Send Message <ArrowRight size={14}/></a></div><div className={styles.connectArt}><img className={styles.earthImage} src="https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Earth_seen_from_Apollo_17.jpg?width=1400" alt="" /><div className={styles.connectNote}>Let&apos;s build<br />something<br />great together!<i/></div></div></div></section>
  </main></PageFrame>;
}