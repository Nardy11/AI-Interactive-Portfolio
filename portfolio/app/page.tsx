"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import styles from "@/components/PortfolioPages.module.css";

export default function Home() {
  return (
    <PageFrame active="Home">
      <main>
        <section className={styles.heroHome}>
          <div className={styles.container}>
            <div className={styles.homeHeroGrid}>
              <div className={styles.homeCopy}>
                <div className={styles.kicker}>INTERACTIVE PORTFOLIO</div>
                <h1>
                  Same Engineer.<br />
                  <span className={styles.gradient}>More Possibilities.</span>
                </h1>
                <p>
                  I’m Nardy Attalla, a Computer Science Engineer based in Egypt. I build full-stack applications while developing practical skills in{" "}
                  <span className={styles.gradient}>Machine Learning, Computer Vision and AI.</span>
                </p>
                <div className={styles.statsMini}>
                  <div><strong>3+</strong><small>Years of Experience</small></div>
                  <div><strong>10+</strong><small>Projects</small></div>
                  <div><strong>∞</strong><small>Curiosity to Learn</small></div>
                </div>
              </div>

              <div className={styles.heroPortrait}>
                <Image src="/picprofile.png" alt="Nardy Attalla" width={500} height={500} />
                <div className={styles.quote}>
                  “Turning knowledge into real-world impact.”
                  <b>— Nardy Attalla</b>
                </div>
                <div className={styles.steps}>
                  <span>Build</span>
                  <span>Learn</span>
                  <span>Improve</span>
                  <span>Repeat</span>
                </div>
              </div>
            </div>

            <div className={styles.modeCards}>
              <article className={styles.modeCard}>
                <span className={styles.modeNum}>01</span>
                <Image className={styles.modeImage} src="/normal_navigation.png" alt="" width={180} height={90} />
                <h3>Normal Navigation</h3>
                <p>Explore my portfolio with the traditional interface.</p>
                <ul><li>Projects</li><li>Skills</li><li>Experience</li><li>And more</li></ul>
                <Link href="/projects" className={styles.buttonGhost}>Start Exploring <ArrowRight size={14} /></Link>
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
