"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  Github,
  Infinity,
  Linkedin,
  Mail,
  Smartphone,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { PageFrame } from "./PortfolioPages";
import styles from "./DashboardHome.module.css";

const projects = [
  {
    image: "/Distance_stereo.jpeg",
    category: "Computer Vision",
    icon: BrainCircuit,
    title: "Cooperative Perception and Control (CPAC)",
    description: "Real-time object detection for connected vehicles using YOLOv6/YOLOv8 and ROS.",
    tags: ["Python", "YOLOv8", "ROS", "OpenCV"],
  },
  {
    image: "/ML.png",
    category: "Machine Learning",
    icon: Sparkles,
    title: "Gold Price Prediction",
    description: "Time series forecasting using ML models and feature engineering.",
    tags: ["Python", "Scikit-learn", "XGBoost"],
  },
  {
    image: "/ESG&.png",
    category: "Mobile App",
    icon: Smartphone,
    title: "Environment Management App",
    description: "Flutter app with Firebase for environmental data management.",
    tags: ["Flutter", "Firebase", "Dart"],
  },
  {
    image: "/nlp_assistant.png",
    category: "Web Development",
    icon: Code2,
    title: "AI Interactive Portfolio",
    description: "A modern portfolio with an NLP assistant and multiple navigation modes.",
    tags: ["Next.js", "Tailwind", "OpenAI (embeddings)"],
  },
];

const technicalSkills = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Flutter", "Dart", "Firebase", "MongoDB",
  "SQL", "Linux", "Docker", "Git", "OpenCV",
  "TensorFlow", "Scikit-learn", "YOLO", "ROS", "Tailwind",
];

const devOpsSkills = [
  "Git", "GitHub", "Docker", "Linux", "AWS", "Terraform",
  "REST APIs", "CI/CD", "Vercel", "Postman", "MongoDB", "SQL",
];

const softSkills = [
  "Problem Solving", "Continuous Learning", "Communication",
  "Collaboration", "Adaptability", "Research", "Time Management",
  "Technical Writing",
];

const experiences = [
  ["2026", "Present", "Full-Stack / Software Engineer", "Poseidon X · Prime Softworks", "Full-time"],
  ["2025–2026", "", "Backend Systems Engineer", "Huawei Technologies", "Full-time"],
  ["2025", "", "Flutter Developer", "Egyptian Electrical Solution", "Internship"],
  ["2024", "", "Flutter Developer", "GUC", "Internship"],
  ["2024", "", "Flutter Developer", "ESG & Company", "Internship"],
  ["2024–2025", "", "Bachelor Project Mentorship", "Valeo · CPAC for Connected Vehicles", "Mentorship"],
];

const testimonials = [
  {
    quote: "Nardy showed strong creativity and technical skill in VR/AR work, with thorough research and a proactive problem-solving mindset.",
    name: "Yomna M.I. Hassan",
    role: "Assistant Professor, GUC",
    image: "https://i1.rgstatic.net/ii/profile.image/11431281319539270-1742714583711_Q128/Yomna-Hassan-8.jpg",
  },
  {
    quote: "Nardy demonstrated strong dedication and analytical thinking in ML, applying concepts creatively with excellent communication.",
    name: "Assoc. Prof. Dr. Mohamed Hamed",
    role: "Professor of Bioinformatics & Computational Biology, GUC",
    image: "https://profile-images.xing.com/images/c8b61fc1c26d681a04db17d84591663a-1/mohamed-hamed.256x256.jpg",
  },
  {
    quote: "Nardy worked independently on his graduation project and showed diverse CS skills, focus and eagerness to learn.",
    name: "Assoc. Prof. Mervat Abu-Elkheir",
    role: "Computer Science Dept., GUC",
    image: "https://ui-avatars.com/api/?name=Mervat+Abu-Elkheir&background=6d5cff&color=fff&size=96",
  },
  {
    quote: "Nardy showed strong commitment, reliability and technical skill during his internship, adapting quickly to new challenges.",
    name: "Eng. Kareem El Hossainy",
    role: "ESG& Company",
    image: "https://ui-avatars.com/api/?name=Kareem+El+Hossainy&background=367dff&color=fff&size=96",
  },
];

export default function DashboardHome() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [skillMode, setSkillMode] = useState<"Technical Skills" | "Tools & DevOps" | "Soft Skills">("Technical Skills");
  const skills = skillMode === "Technical Skills" ? technicalSkills : skillMode === "Tools & DevOps" ? devOpsSkills : softSkills;
  const visibleTestimonials = [0, 1].map(offset => testimonials[(testimonialIndex + offset) % testimonials.length]);

  return (
    <PageFrame active="Home" variant="dashboard">
      <main className={styles.home}>
        <section className={styles.hero}>
          <div className={styles.heroGridLines} />
          <div className={styles.heroGlow} />
          <div className={styles.earth} aria-hidden="true">
            <div className={styles.earthImage} />
          </div>

          <div className={styles.homeContainer}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <span className={styles.kicker}>COMPUTER SCIENCE ENGINEER</span>
                <h1>
                  Building Solutions
                  <br />
                  with <span>Code &amp; AI</span>
                </h1>
                <p>
                  I&apos;m Nardy Attalla, a Computer Science Engineer based in Egypt. I build
                  full-stack web and mobile applications while developing practical skills in{" "}
                  <strong>Machine Learning, Computer Vision</strong> and AI.
                </p>

                <div className={styles.heroActions}>
                  <Link href="/projects" className={styles.primaryButton}>
                    View My Projects <ArrowRight size={15} />
                  </Link>
                  <Link href="/skills" className={styles.secondaryButton}>
                    My Learning Journey
                  </Link>
                  <div className={styles.heroSocials}>
                    <a href="https://github.com/Nardy11" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
                    <a href="https://www.linkedin.com/in/nardy-attallah" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
                    <a href="mailto:nardy.attalla@gmail.com" aria-label="Email"><Mail size={18} /></a>
                    <a href="/full_stack_cv_edited.pdf" target="_blank" rel="noreferrer" aria-label="CV"><Download size={17} /></a>
                  </div>
                </div>
              </div>

              <div className={styles.heroVisual}>
                <div className={styles.learningNote}>
                  <span>Always</span>
                  <span>learning,</span>
                  <span>always building.</span>
                  <i />
                </div>

                <div className={styles.portraitCard}>
                  <Image
                    src="/picprofile.png"
                    alt="Nardy Attalla"
                    fill
                    priority
                    sizes="260px"
                  />
                </div>

                <div className={styles.heroQuote}>
                  <p>“Stay hungry.<br />Stay foolish.”</p>
                  <span>— Steve Jobs</span>
                </div>

                <div className={styles.heroStats}>
                  <div><UsersRound size={20} /><span><b>3+</b>Years of Experience</span></div>
                  <div><BriefcaseBusiness size={19} /><span><b>10+</b>Projects Completed</span></div>
                  <div><Infinity size={22} /><span><b>∞</b>Endless Curiosity</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featured}>
          <div className={styles.homeContainer}>
            <div className={styles.sectionHeading}>
              <div className={styles.sectionTitleWrap}>
                <i />
                <h2>Featured Projects</h2>
                <p>A selection of my recent work across different domains.</p>
              </div>
              <Link href="/projects" className={styles.viewAll}>
                View All Projects <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.projectGrid}>
              {projects.map((project) => {
                const Icon = project.icon;
                return (
                  <article className={styles.projectCard} key={project.title}>
                    <div className={styles.projectMedia}>
                      <Image src={project.image} alt="" fill sizes="25vw" />
                      <span className={styles.projectCategory}><Icon size={10} />{project.category}</span>
                    </div>
                    <div className={styles.projectBody}>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className={styles.projectTags}>
                        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                      <Link href="/projects" className={styles.projectOpen} aria-label={`Open ${project.title}`}>
                        ↗
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.lower}>
          <div className={styles.homeContainer}>
            <div className={styles.lowerGrid}>
              <div className={styles.lowerColumn}>
                <div className={styles.sectionHeadingCompact}>
                  <div><i /><h2>Experience &amp; Education</h2><p>My professional journey so far.</p></div>
                </div>

                <div className={styles.miniTimeline}>
                  {experiences.map(([year, present, title, company, badge], index) => (
                    <div className={styles.timelineRow} key={title}>
                      <div className={styles.timelineDate}>{year}{present && <span>{present}</span>}</div>
                      <div className={styles.timelineLine}>
                        <span className={index === 0 ? styles.activeDot : ""} />
                      </div>
                      <div className={styles.timelineContent}>
                        <b>{title}</b>
                        <small>{company}</small>
                      </div>
                      <em className={badge === "Competition" || badge === "Graduated" ? styles.greenBadge : ""}>{badge}</em>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.lowerColumn}>
                <div className={styles.sectionHeadingCompact}>
                  <div><i /><h2>Skills</h2><p>Technologies I work with and keep learning.</p></div>
                </div>

                <div className={styles.skillTabs}>
                  {(["Technical Skills", "Tools & DevOps", "Soft Skills"] as const).map((mode) => (
                    <button key={mode} className={skillMode === mode ? styles.skillTabActive : ""} onClick={() => setSkillMode(mode)}>
                      {mode}
                    </button>
                  ))}
                </div>

                <div key={skillMode} className={styles.skillCloud}>
                  {skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>

                <div className={styles.learningCard}>
                  <div className={styles.learningHeader}>
                    <b>Currently Learning</b>
                    <span>⌁</span>
                  </div>
                  <div className={styles.learningItems}>
                    {["Deep Learning", "MLOps", "RAG", "LLMs"].map((item) => (
                      <span key={item}><Sparkles size={11} />{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.lowerColumn}>
                <div className={styles.sectionHeadingCompact}>
                  <div><i /><h2>What People Say</h2><p>Feedback from professors, mentors and collaborators.</p></div>
                  <div className={styles.testimonialArrows}><button type="button" aria-label="Previous testimonial" onClick={() => setTestimonialIndex(i => (i - 1 + testimonials.length) % testimonials.length)}><ChevronLeft size={13} /></button><button type="button" aria-label="Next testimonial" onClick={() => setTestimonialIndex(i => (i + 1) % testimonials.length)}><ChevronRight size={13} /></button></div>
                </div>

                <div key={testimonialIndex} className={styles.testimonialGrid}>
                  {visibleTestimonials.map((item) => (
                    <article className={styles.testimonial} key={item.name}>
                      <p>“{item.quote}”</p>
                      <div>
                        <img src={item.image} alt={`${item.name} profile`} width={38} height={38} />
                        <span><b>{item.name}</b><small>{item.role}</small></span>
                      </div>
                    </article>
                  ))}
                </div>

                <div className={styles.opportunity}>
                  <div className={styles.opportunityIcon}><Code2 size={22} /></div>
                  <div className={styles.opportunityCopy}>
                    <b>Let&apos;s Build Something Amazing Together</b>
                    <p>I&apos;m open to internships, collaborative projects, and<br />full-time opportunities.</p>
                  </div>
                  <Link href="/contact">Get in Touch <ArrowRight size={13} /></Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
