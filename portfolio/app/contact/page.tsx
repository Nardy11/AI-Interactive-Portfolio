"use client";

import type { ReactNode } from "react";
import { ArrowRight, BriefcaseBusiness, ChevronDown, Github, Lightbulb, Linkedin, LockKeyhole, Mail, MapPin, Users, UserRound, FileText, PencilLine, Globe2 } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import styles from "@/components/ContactExact.module.css";

const cards = [
  { icon: Mail, title: "Email", value: "nardy.attalla@gmail.com", note: "I usually respond within 24 hours.", href: "mailto:nardy.attalla@gmail.com" },
  { icon: Linkedin, title: "LinkedIn", value: "linkedin.com/in/nardy-attallah", note: "Let’s connect professionally.", href: "https://www.linkedin.com/in/nardy-attallah" },
  { icon: Github, title: "GitHub", value: "github.com/Nardy11", note: "Check out my projects and code.", href: "https://github.com/Nardy11" },
  { icon: MapPin, title: "Location", value: "Cairo, Egypt", note: "Open to remote opportunities worldwide." },
] as const;

function ContactCard({ icon: Icon, title, value, note, href }: typeof cards[number]) {
  const body = <><div className={styles.contactCardIcon}><Icon /></div><div className={styles.contactCardBody}><strong>{title}</strong><span className={href ? styles.cardLink : ""}>{value}</span><small>{note}</small></div><span className={styles.cardArrow}><ArrowRight /></span></>;
  return href ? <a className={styles.contactCard} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{body}</a> : <div className={styles.contactCard}>{body}</div>;
}
function FieldIcon({ children }: { children: ReactNode }) { return <span className={styles.fieldIcon}>{children}</span>; }

export default function Contact() {
  return <PageFrame active="Contact"><main className={styles.contactPage}>
    <section className={styles.contactHero}><div className={styles.heroOverlay}/><div className={styles.heroCopy}><div className={styles.kicker}>LET&apos;S CONNECT</div><h1>Let&apos;s Build<br/>What&apos;s <span>Next</span></h1><p>I&apos;m always open to new opportunities, interesting projects, collaborations, or just a friendly chat about technology, Machine Learning, or building real-world solutions.</p><div className={styles.highlights}><div><BriefcaseBusiness/><span>Open to<br/>opportunities</span></div><div><Users/><span>Interested in<br/>collaborations</span></div><div><Lightbulb/><span>Happy to<br/>exchange ideas</span></div></div></div><div className={styles.heroQuote}>“Stay hungry. Stay foolish.”<small>— Steve Jobs</small></div><div className={styles.heroAnnotation}>Same Engineer.<br/>Bigger<br/>Possibilities.<i/></div></section>
    <section className={styles.messageSection}><div className={styles.infoColumn}><div className={styles.sectionHeading}><span/><h2>Contact Information</h2></div><p className={styles.sectionIntro}>Feel free to reach out through any of the following channels.</p><div className={styles.contactCards}>{cards.map(card=><ContactCard key={card.title}{...card}/>)}</div></div><form className={styles.messageForm} onSubmit={e=>e.preventDefault()}><h2>Send a Message</h2><p>Have a question, an opportunity, or just want to say hi? Drop me a message!</p><div className={styles.formGrid}><label><FieldIcon><UserRound/></FieldIcon><input placeholder="Your Name" aria-label="Your Name"/></label><label><FieldIcon><Mail/></FieldIcon><input placeholder="Your Email" aria-label="Your Email" type="email"/></label></div><label className={styles.fullField}><FieldIcon><FileText/></FieldIcon><input placeholder="Subject" aria-label="Subject"/><ChevronDown/></label><label className={styles.messageField}><FieldIcon><PencilLine/></FieldIcon><textarea placeholder="Your Message" aria-label="Your Message"/><span>Tell me more...</span></label><button type="submit">Send Message <ArrowRight/></button><small className={styles.safeNote}><LockKeyhole/>Your information is safe with me. I&apos;ll never share it with anyone.</small></form></section>
    <section className={styles.locationSection}><div className={styles.locationHeader}><div><div className={styles.sectionHeading}><span/><h2>Where I&apos;m Based</h2></div><p>Currently in Cairo, Egypt, but open to opportunities worldwide.</p></div><div className={styles.locationNote}>Different places<br/>Same passion<i/></div></div><div className={styles.mapCard}><iframe title="Cairo, Egypt map" src="https://www.openstreetmap.org/export/embed.html?bbox=29.35%2C29.35%2C32.05%2C30.85&layer=mapnik&marker=30.0444%2C31.2357" loading="lazy"/><div className={styles.mapOverlay}><div><MapPin/><strong>Cairo, Egypt</strong></div><span><Globe2/>Open to<br/>Remote Work<br/>Worldwide</span></div><div className={styles.mapLabel}>Cairo<small>Egypt</small></div></div></section>
    <section className={styles.cta}><div><h2>Let&apos;s Create Something <span>Meaningful</span></h2><p>Whether it&apos;s a project, an opportunity, or just a conversation — I&apos;d love to hear from you.</p></div><a href="mailto:nardy.attalla@gmail.com">Get in Touch <ArrowRight/></a></section>
  </main></PageFrame>;
}