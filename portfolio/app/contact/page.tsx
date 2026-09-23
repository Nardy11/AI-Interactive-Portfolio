"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Github, Linkedin, Mail, MapPin, ArrowRight } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import styles from "@/components/PortfolioPages.module.css";

export default function Contact() {
  return (
    <PageFrame active="Contact">
      <main className={styles.container}>
        <section className={styles.contactHero}>
          <div>
            <div className={styles.kicker}>LET’S CONNECT</div>
            <h1 className={styles.sectionTitle} style={{ fontSize: 54 }}>
              Let’s Build<br />What’s <span className={styles.gradient}>Next</span>
            </h1>
            <p className={styles.sectionIntro}>
              I’m always open to new opportunities, interesting projects, collaborations, or a friendly chat about technology, Machine Learning, or building real-world solutions.
            </p>
          </div>
          <div className={styles.contactImage}>
            <ImagePlaceholder />
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.contactGrid}>
            <div>
              <h2 className={styles.sectionTitle} style={{ fontSize: 26 }}>Contact Information</h2>
              <div className={styles.contactCards}>
                <ContactCard icon={<Mail />} title="Email" value="nardy.attalla@gmail.com" href="mailto:nardy.attalla@gmail.com" />
                <ContactCard icon={<Linkedin />} title="LinkedIn" value="linkedin.com/in/nardy-attallah" href="https://www.linkedin.com/in/nardy-attallah" />
                <ContactCard icon={<Github />} title="GitHub" value="github.com/Nardy11" href="https://github.com/Nardy11" />
                <ContactCard icon={<MapPin />} title="Location" value="Cairo, Egypt" />
              </div>
            </div>

            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <h2>Send a Message</h2>
              <p>Have a question, an opportunity, or just want to say hi? Drop me a message.</p>
              <div className={styles.formRow}>
                <input placeholder="Your Name" />
                <input placeholder="Your Email" />
              </div>
              <input placeholder="Subject" />
              <textarea placeholder="Your Message" />
              <button className={styles.button} type="submit" style={{ width: "100%", border: 0 }}>
                Send Message <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>Find Me in <span className={styles.gradient}>Cairo</span></h2>
          <p className={styles.sectionIntro}>Based in Cairo, Egypt and open to opportunities worldwide.</p>
          <div style={{marginTop:24,overflow:"hidden",border:"1px solid #1c3b62",borderRadius:14,height:320,background:"#071629"}}>
            <iframe
              title="Cairo, Egypt map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=31.15%2C29.95%2C31.45%2C30.15&layer=mapnik&marker=30.0444%2C31.2357"
              style={{border:0,width:"100%",height:"100%"}}
              loading="lazy"
            />
          </div>
          <a href="https://www.openstreetmap.org/?mlat=30.0444&mlon=31.2357#map=12/30.0444/31.2357" target="_blank" rel="noreferrer" className={styles.buttonGhost} style={{marginTop:14,display:"inline-flex"}}>Open Map <ArrowRight size={14}/></a>
        </section>

        <section className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            Let’s Create Something <span className={styles.gradient}>Meaningful</span>
          </h2>
          <p className={styles.sectionIntro}>
            Whether it’s a project, an opportunity, or just a conversation — I’d love to hear from you.
          </p>
        </section>
      </main>
    </PageFrame>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  return (
    <div className={styles.contactCard}>
      {icon}
      <div>
        <b>{title}</b>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer">{value}</a>
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#6e8dc5", fontSize: 12 }}>
      Cairo, Egypt · Open to opportunities worldwide
    </div>
  );
}
