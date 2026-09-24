"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import PageHero, { HeroGhost, HeroPrimary } from "@/components/PageHero";
import styles from "@/components/PortfolioPages.module.css";

export default function Landing() {
  return (
    <PageFrame active="">
      <main>
        <PageHero
          eyebrow="Interactive portfolio"
          title={<>Same Engineer.<br /><em>More Possibilities.</em></>}
          lead={<>I&apos;m Nardy Attalla, a Computer Science Engineer based in Egypt. I build full-stack applications while developing practical skills in <strong>machine learning, computer vision and AI</strong>.</>}
          actions={<>
            <HeroPrimary href="/home">Start exploring <ArrowRight size={15} /></HeroPrimary>
            <HeroGhost href="/full_stack_cv_edited.pdf" external><Download size={15} /> Download CV</HeroGhost>
          </>}
          stats={[
            { value: "3+", label: "Years of experience" },
            { value: "10+", label: "Projects" },
            { value: "∞", label: "Curiosity to learn" },
          ]}
          scene="portrait"
          portrait={{ src: "/picprofile.png", alt: "Nardy Attalla", priority: true }}
          readout="home · 3 ways in"
          note={<>Build. Learn.<br />Improve. Repeat.</>}
          quote={{ text: "Turning knowledge into real-world impact.", author: "Nardy Attalla" }}
        />

        <section className={styles.heroHome}>
          <div className={styles.container}>
            <div className={styles.modeCards}>
              <article className={styles.modeCard}>
                <span className={styles.modeNum}>01</span>
                <Image className={styles.modeImage} src="/normal_navigation.png" alt="" width={180} height={90} />
                <h3>Normal Navigation</h3>
                <p>Explore my portfolio with the traditional interface.</p>
                <ul><li>Projects</li><li>Skills</li><li>Experience</li><li>And more</li></ul>
                <Link href="/home" className={styles.buttonGhost}>Start Exploring <ArrowRight size={14} /></Link>
              </article>

              <article className={styles.modeCard}>
                <span className={styles.modeNum}>02</span>
                <Image className={styles.modeImage} src="/cv.png" alt="" width={180} height={90} />
                <h3>Navigate Using<br />Computer Vision</h3>
                <p>Control your mouse using hand gestures with your camera.</p>
                <ul><li>Hand Tracking</li><li>Virtual Mouse</li><li>Click & Navigate</li></ul>
                <Link href="/cv" className={styles.buttonGhost}>Start Camera Mode <ArrowRight size={14} /></Link>
              </article>

              <article className={styles.modeCard}>
                <span className={styles.modeNum}>03</span>
                <Image className={styles.modeImage} src="/nlp_assistant.png" alt="" width={180} height={90} />
                <h3>Navigate Using<br />NLP Assistant</h3>
                <p>Ask questions about my work, skills and experience.</p>
                <ul><li>NLP Assistant</li><li>Semantic Search</li><li>Portfolio Knowledge</li><li>RAG Coming Soon</li></ul>
                <Link href="/nlp" className={styles.buttonGhost}>Start Chat <ArrowRight size={14} /></Link>
              </article>
            </div>

            <div className={styles.homeSocial}>
              <span>Scroll down to learn more</span>
              <span style={{ flex: 1, height: 1, background: "#283c60" }} />
              <a href="https://github.com/Nardy11" target="_blank" rel="noreferrer"><Github size={19} /></a>
              <a href="https://www.linkedin.com/in/nardy-attallah" target="_blank" rel="noreferrer"><Linkedin size={19} /></a>
              <a href="mailto:nardy.attalla@gmail.com"><Mail size={19} /></a>
            </div>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
