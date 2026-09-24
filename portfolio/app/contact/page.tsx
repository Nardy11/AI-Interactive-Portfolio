"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BriefcaseBusiness, ChevronDown, Github, Lightbulb, Linkedin, LockKeyhole, Mail, MapPin, Users, UserRound, FileText, PencilLine, Globe2 } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import PageHero, { HeroGhost, HeroPrimary } from "@/components/PageHero";
import styles from "@/components/ContactExact.module.css";

type ContactCardData = {
  icon: LucideIcon;
  title: string;
  value: string;
  note: string;
  /** Absent for the location card, which is informational only. */
  href?: string;
};

const cards: ContactCardData[] = [
  { icon: Mail, title: "Email", value: "nardy.attalla@gmail.com", note: "I usually respond within 24 hours.", href: "mailto:nardy.attalla@gmail.com" },
  { icon: Linkedin, title: "LinkedIn", value: "linkedin.com/in/nardy-attallah", note: "Let’s connect professionally.", href: "https://www.linkedin.com/in/nardy-attallah" },
  { icon: Github, title: "GitHub", value: "github.com/Nardy11", note: "Check out my projects and code.", href: "https://github.com/Nardy11" },
  { icon: MapPin, title: "Location", value: "Cairo, Egypt", note: "Open to remote opportunities worldwide." },
];

function ContactCard({ icon: Icon, title, value, note, href }: ContactCardData) {
  const body = <><div className={styles.contactCardIcon}><Icon /></div><div className={styles.contactCardBody}><strong>{title}</strong><span className={href ? styles.cardLink : ""}>{value}</span><small>{note}</small></div><span className={styles.cardArrow}><ArrowRight /></span></>;
  return href ? <a className={styles.contactCard} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{body}</a> : <div className={styles.contactCard}>{body}</div>;
}
function FieldIcon({ children }: { children: ReactNode }) { return <span className={styles.fieldIcon}>{children}</span>; }

export default function Contact() {
  return <PageFrame active="Contact"><main className={styles.contactPage}>
    <PageHero
      eyebrow="Let's connect"
      title={<>Let&apos;s Build<br />What&apos;s <em>Next</em></>}
      lead="I'm always open to new opportunities, interesting projects, collaborations, or just a friendly chat about technology, machine learning, or building real-world solutions."
      actions={<>
        <HeroPrimary href="mailto:nardy.attalla@gmail.com"><Mail size={15} />Email me</HeroPrimary>
        <HeroGhost href="https://www.linkedin.com/in/nardy-attallah" external><Linkedin size={15} />LinkedIn</HeroGhost>
      </>}
      marks={[
        { icon: BriefcaseBusiness, label: "Open to opportunities" },
        { icon: Users, label: "Interested in collaborations" },
        { icon: Lightbulb, label: "Happy to exchange ideas" },
      ]}
      scene="globe"
      readout="contact · reply < 24h"
      note={<>Same engineer.<br />Bigger possibilities.</>}
      quote={{ text: "Stay hungry. Stay foolish.", author: "Steve Jobs" }}
    />

    <section className={styles.messageSection}><div className={styles.infoColumn}><div className={styles.sectionHeading}><span/><h2>Contact Information</h2></div><p className={styles.sectionIntro}>Feel free to reach out through any of the following channels.</p><div className={styles.contactCards}>{cards.map(card=><ContactCard key={card.title}{...card}/>)}</div></div><form className={styles.messageForm} onSubmit={e=>e.preventDefault()}><h2>Send a Message</h2><p>Have a question, an opportunity, or just want to say hi? Drop me a message!</p><div className={styles.formGrid}><label><FieldIcon><UserRound/></FieldIcon><input placeholder="Your Name" aria-label="Your Name"/></label><label><FieldIcon><Mail/></FieldIcon><input placeholder="Your Email" aria-label="Your Email" type="email"/></label></div><label className={styles.fullField}><FieldIcon><FileText/></FieldIcon><input placeholder="Subject" aria-label="Subject"/><ChevronDown/></label><label className={styles.messageField}><FieldIcon><PencilLine/></FieldIcon><textarea placeholder="Your Message" aria-label="Your Message"/><span>Tell me more...</span></label><button type="submit">Send Message <ArrowRight/></button><small className={styles.safeNote}><LockKeyhole/>Your information is safe with me. I&apos;ll never share it with anyone.</small></form></section>
    <section className={styles.locationSection}><div className={styles.locationHeader}><div><div className={styles.sectionHeading}><span/><h2>Where I&apos;m Based</h2></div><p>Currently in Cairo, Egypt, but open to opportunities worldwide.</p></div><div className={styles.locationNote}>Different places<br/>Same passion<i/></div></div><div className={styles.mapCard}><iframe title="Cairo, Egypt map" src="https://www.openstreetmap.org/export/embed.html?bbox=29.35%2C29.35%2C32.05%2C30.85&layer=mapnik&marker=30.0444%2C31.2357" loading="lazy"/><div className={styles.mapOverlay}><div><MapPin/><strong>Cairo, Egypt</strong></div><span><Globe2/>Open to<br/>Remote Work<br/>Worldwide</span></div><div className={styles.mapLabel}>Cairo<small>Egypt</small></div></div></section>
    <section className={styles.cta}><div><h2>Let&apos;s Create Something <span>Meaningful</span></h2><p>Whether it&apos;s a project, an opportunity, or just a conversation — I&apos;d love to hear from you.</p></div><a href="mailto:nardy.attalla@gmail.com">Get in Touch <ArrowRight/></a></section>
  </main></PageFrame>;
}