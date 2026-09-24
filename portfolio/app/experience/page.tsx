"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, BriefcaseBusiness, CalendarDays, GraduationCap, MapPin, Plane, Target } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import styles from "@/components/PortfolioPages.module.css";

type ExperienceItem = {
  date: string;
  company: string;
  role: string;
  place: string;
  tags: string[];
  description: string;
  logo: string;
  logoAlt: string;
};

const experiences: ExperienceItem[] = [
  {
    date: "Jul 2026\n– Present",
    company: "Poseidon X",
    role: "Full-Stack / Software Engineer",
    place: "Nasr City, Cairo (Onsite)",
    tags: ["React", "TypeScript", "NestJS", "PostgreSQL"],
    description: "Working on production software projects through the Prime Softworks × Poseidon X team, covering frontend, backend, APIs, testing and delivery. The role includes React, React Native, TypeScript, NestJS, REST APIs, PostgreSQL/Supabase and Docker.",
    logo: "https://primesoftworks.com/favicon.ico",
    logoAlt: "Poseidon X / Prime Softworks",
  },
  {
    date: "Dec 2025\n– Jun 2026",
    company: "Huawei Technologies",
    role: "Linux & Database Administrator",
    place: "Cairo, Egypt (Onsite)",
    tags: ["Linux", "Databases", "Monitoring", "Telecom"],
    description: "Worked in a UAE telecom client environment (du), supporting Linux-based production systems through monitoring, incident and change management, log analysis, SQL/database operations and reporting.",
    logo: "/experience-huawei.png",
    logoAlt: "Huawei",
  },
  {
    date: "Mar 2025",
    company: "Egyptian Electrical Solution (EES)",
    role: "Flutter Developer",
    place: "Cairo, Egypt",
    tags: ["Flutter", "Firebase", "Web Dashboard"],
    description: "Built a Flutter mobile app and a web dashboard using Firebase, contributing to a complete full-stack solution.",
    logo: "/experience-ees.png",
    logoAlt: "Egyptian Electrical Solution",
  },
  {
    date: "Aug 2024\n– Oct 2024",
    company: "German University in Cairo (GUC)",
    role: "Flutter Developer Intern",
    place: "Cairo, Egypt",
    tags: ["Flutter", "Firebase", "Dart", "Mobile"],
    description: "Developed and improved cross-platform mobile applications using Flutter during my internship at GUC.",
    logo: "/experience-guc.png",
    logoAlt: "German University in Cairo",
  },
  {
    date: "Jun 2024\n– Aug 2024",
    company: "ESG & Company",
    role: "Flutter Developer Intern",
    place: "Cairo, Egypt",
    tags: ["Flutter", "Firebase", "API Integration", "Mobile"],
    description: "Implemented production mobile applications with Firebase authentication and API integrations.",
    logo: "/ESG&.png",
    logoAlt: "ESG & Company",
  },
  {
    date: "2024\n– 2025",
    company: "Valeo",
    role: "Graduation Project Mentorship",
    place: "GUC · Cairo, Egypt",
    tags: ["CPAC", "Connected Vehicles", "Computer Vision", "Research"],
    description: "Completed the bachelor project Cooperative Perception And Control (CPAC) for Connected Vehicles under Valeo mentorship. The thesis received an A+ and focused on computer vision and connected-vehicle perception.",
    logo: "",
    logoAlt: "Valeo",
  },
  {
    date: "2023",
    company: "MIE Competition – Egypt",
    role: "Participant",
    place: "Cairo, Egypt",
    tags: ["Competition", "Innovation", "Teamwork"],
    description: "Participated in the Microsoft Innovation in Education competition, working on innovative technology solutions.",
    logo: "/experience-mie.png",
    logoAlt: "Microsoft Innovation in Education",
  },
];

const coursework = [
  "Data Structures & Algorithms",
  "Machine Learning",
  "Computer Vision",
  "Databases",
  "Software Engineering",
  "Computer Networks",
];

const certificates = [
  { mark: "IBM", title: "AI Workflow Specialization", provider: "Coursera", className: "ibm" },
  { mark: "C", title: "Machine Learning Specialization", provider: "Coursera", className: "coursera" },
  { mark: "✦", title: "Building AI", provider: "Helsinki", className: "helsinki" },
  { mark: "S", title: "SQL", provider: "SoloLearn", className: "sololearn" },
];

function BrandLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={styles.experienceBrandMark}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span>{alt.includes("Prime") ? "PS" : "SU"}</span>}
    </div>
  );
}

export default function Experience() {
  const [certOffset,setCertOffset]=useState(0);
  const visibleCertificates=certificates.map((_,i)=>certificates[(i+certOffset)%certificates.length]);
  return (
    <PageFrame active="Experience">
      <main className={styles.experiencePage}>
        <section className={styles.experienceHero}>
          <div className={styles.experienceHeroCopy}>
            <div className={styles.kicker}>EXPERIENCE &amp; EDUCATION</div>
            <h1>My Journey <span>So Far</span></h1>
            <p className={styles.experienceLead}>A journey of learning, building and continuously improving.</p>
            <p className={styles.experienceDescription}>
              From working in industry, to building real-world projects, to diving deeper
              into Machine Learning and AI — every step has shaped who I am today
              and where I want to go next.
            </p>
            <div className={styles.experienceHeroButtons}>
              <a href="/full_stack_cv_edited.pdf" target="_blank" rel="noreferrer" className={styles.button}>
                ↓&nbsp; Download CV
              </a>
              <a href="https://www.linkedin.com/in/nardy-attallah" target="_blank" rel="noreferrer" className={styles.buttonGhost}>
                View LinkedIn <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className={styles.experienceHeroImage}>
            <div className={styles.experienceMountain} />
            <div className={styles.experienceHeroQuote}>
              <span>“The best way to predict your future<br />is to create it.”</span>
              <small>— Peter Drucker</small>
            </div>
          </div>

          <div className={styles.experienceHeroFacts}>
            <article><GraduationCap /><div><b>B.Sc. Computer Science<br />and Engineering</b><span>German University in Cairo</span><small>2021 – 2025</small></div></article>
            <article><MapPin /><div><b>Based in</b><span>Cairo, Egypt</span></div></article>
            <article><Target /><div><b>Goal</b><span>Build impactful solutions<br />with ML &amp; Software Engineering</span></div></article>
          </div>
        </section>

        <section className={styles.experienceSection}>
          <div className={styles.experienceMainColumn}>
            <div className={styles.experienceSectionHeading}>
              <h2><BriefcaseBusiness /> Professional Experience</h2>
              <em>Real experience. Real impact.</em>
            </div>

            <div className={styles.experienceTimeline}>
              {experiences.map((item) => (
                <article className={styles.experienceTimelineItem} key={item.company}>
                  <div className={styles.experienceDate}>{item.date.split("\n").map((line, index) => <span key={index}>{line}</span>)}</div>
                  <div className={styles.experienceNode} />
                  <div className={styles.experienceCard}>
                    <BrandLogo src={item.logo} alt={item.logoAlt} />
                    <div className={styles.experienceCardContent}>
                      <div className={styles.experienceCardTop}>
                        <div>
                          <b>{item.company}</b>
                          <h3>{item.role}</h3>
                        </div>
                        <span><MapPin size={10} /> {item.place}</span>
                      </div>
                      <div className={styles.experienceTags}>{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className={styles.experienceAside}>
            <div className={styles.quickFactsExact}>
              <h3>♙&nbsp; Quick Facts</h3>
              <div><BriefcaseBusiness /><strong>7+</strong><span>Professional, Research &amp;<br />Mentorship Experiences</span></div>
              <div><div className={styles.factFolder}>▰</div><strong>10+</strong><span>Projects Completed</span></div>
              <div><GraduationCap /><strong>B.Sc.</strong><span>Computer Science and Engineering<br />(GUC)</span></div>
              <div><MapPin /><strong>Cairo, Egypt</strong><span>Open to opportunities worldwide</span></div>
            </div>

            <div className={styles.experienceQuoteCard}>
              <p>“The best time to plant a tree was 10 years ago. The second best time is now.”</p>
              <span>— Chinese Proverb</span>
              <div className={styles.experienceQuoteMountains} />
            </div>

            <div className={styles.opportunityCard}>
              <h3><i /> Open to Opportunities</h3>
              <p>I&apos;m currently open to full-time opportunities in Full-Stack Software Engineering, Backend Engineering and Machine Learning.</p>
              <Link href="/contact">✈&nbsp; Let&apos;s Connect <ArrowRight size={13} /></Link>
            </div>
          </aside>
        </section>

        <section className={styles.experienceEducation}>
          <div className={styles.experienceSectionHeading}>
            <h2><GraduationCap /> Education</h2>
          </div>
          <div className={styles.educationExactGrid}>
            <article className={styles.educationExactCard}>
              <BrandLogo src="/experience-guc.png" alt="German University in Cairo" />
              <div>
                <b>German University in Cairo (GUC)</b>
                <h3>B.Sc. Computer Science and Engineering</h3>
                <div className={styles.educationTags}><span>Computer Science</span><span>Software Engineering</span><span>Machine Learning</span></div>
                <p>Studied Computer Science and Engineering with a focus on software systems, AI and emerging technologies. Graduated in July 2025.</p>
              </div>
              <span className={styles.educationPlace}><MapPin size={10}/> Cairo, Egypt</span>
            </article>
            <article className={styles.courseworkExact}>
              <h3><BookOpen size={14} /> Relevant Coursework</h3>
              <ul>{coursework.map(item => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
        </section>

        <section className={styles.experienceCertifications}>
          <div className={styles.certHeading}>
            <h2><Award /> Certifications &amp; Learning</h2>
            <em>Always learning. Always improving.</em>
          </div>
          <div key={certOffset} className={styles.certExactGrid}>
            {visibleCertificates.map(cert => (
              <article className={styles.certExactCard} key={cert.title}>
                <div className={`${styles.certLogo} ${styles[cert.className as keyof typeof styles]}`}>{cert.mark}</div>
                <div className={styles.certCopy}>
                  <b>{cert.title}</b>
                  <span>{cert.provider}</span>
                  <a href="/full_stack_cv_edited.pdf" target="_blank" rel="noreferrer">View Certificate <ArrowRight size={11} /></a>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.certArrows}><button type="button" aria-label="Previous certifications" onClick={()=>setCertOffset(o=>(o-1+certificates.length)%certificates.length)}>←</button><button type="button" aria-label="Next certifications" onClick={()=>setCertOffset(o=>(o+1)%certificates.length)}>→</button></div>
        </section>
      </main>
    </PageFrame>
  );
}
