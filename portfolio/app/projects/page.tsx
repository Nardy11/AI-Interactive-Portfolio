"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Github, Star } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import styles from "@/components/PortfolioPages.module.css";

type Project = {
  img: string;
  title: string;
  cat: string;
  badge: string;
  desc: string;
  tags: string[];
  year: number;
};

const projects: Project[] = [
  { img: "/Distance_stereo.jpeg", title: "Cooperative Perception and Control (CPAC)", cat: "Computer Vision", badge: "Computer Vision", desc: "Real-time multi-sensor perception system for connected autonomous vehicles using YOLOv5/YOLOv8, ROS and sensor fusion.", tags: ["Python", "YOLOv8", "ROS", "OpenCV"], year: 2025 },
  { img: "/data analysis.png", title: "Heart Failure Prediction", cat: "Machine Learning", badge: "Machine Learning", desc: "Predicting heart failure risk using classical ML models with feature engineering, visualization and evaluation.", tags: ["Python", "Scikit-learn", "Pandas"], year: 2025 },
  { img: "/ML.png", title: "Gold Price Prediction", cat: "Machine Learning", badge: "Machine Learning", desc: "Time series forecasting using ML models and feature engineering to predict gold prices.", tags: ["Python", "XGBoost", "Scikit-learn"], year: 2025 },
  { img: "/ESG&.png", title: "Environment Management App", cat: "Mobile App", badge: "Mobile App", desc: "Cross-platform mobile application using Flutter and Firebase for environmental data management and monitoring.", tags: ["Flutter", "Firebase", "Dart"], year: 2024 },
  { img: "/CV.webp", title: "AI Interactive Portfolio", cat: "Web Development", badge: "Web Development", desc: "An interactive portfolio with multiple navigation modes including NLP assistant and computer vision control.", tags: ["Next.js", "TypeScript", "TailwindCSS"], year: 2026 },
  { img: "/Diablo.png", title: "2D/3D Interactive Games", cat: "Game Development", badge: "Game Development", desc: "Game development projects and Unity experiments exploring gameplay mechanics and interactive environments.", tags: ["Unity", "C#", "Blender"], year: 2024 },
  { img: "/Clinic Webs.png", title: "Mentorship Internship Project", cat: "Web Development", badge: "Web Development", desc: "Web dashboard for managing mentorship programs with analytics and user management.", tags: ["React", "Node.js", "MongoDB"], year: 2025 },
  { img: "/nlp_assistant.png", title: "Portfolio Assistant (NLP)", cat: "Other", badge: "NLP / AI", desc: "NLP-based assistant that answers questions about my portfolio using semantic similarity. RAG coming soon.", tags: ["Python", "NLP", "Embeddings"], year: 2025 },
  { img: "/AR.png", title: "Microservices Migration (Customer)", cat: "Other", badge: "Backend / DevOps", desc: "Transforming a monolith into microservices using NestJS, TypeScript and deploying on cloud infrastructure.", tags: ["NestJS", "Docker", "AWS", "Terraform"], year: 2026 },
  { img: "/E-commerce App.png", title: "Shopify Development (Test)", cat: "Web Development", badge: "Full Stack", desc: "E-commerce development with modern stack, including custom themes and app integrations.", tags: ["React", "Next.js", "Shopify", "Node.js"], year: 2026 },
  { img: "/eesCalculator.jpeg", title: "Flutter Developer Intern (GUC)", cat: "Mobile App", badge: "Mobile App", desc: "Developed mobile applications using Flutter and Firebase during my internship at GUC.", tags: ["Flutter", "Firebase", "Dart"], year: 2024 },
];

const filters = ["All", "Machine Learning", "Computer Vision", "Web Development", "Mobile App", "Game Development", "Other"];

function GitHubLink({ children, className = "", ariaLabel }: { children: ReactNode; className?: string; ariaLabel?: string }) {
  return <a href="https://github.com/Nardy11" target="_blank" rel="noreferrer" className={className} aria-label={ariaLabel}>{children}</a>;
}

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("latest");

  const visible = useMemo(() => {
    const filtered = filter === "All" ? projects : projects.filter((project) => project.cat === filter);
    return [...filtered].sort((a, b) => sort === "latest" ? b.year - a.year : a.year - b.year);
  }, [filter, sort]);

  return (
    <PageFrame active="Projects">
      <main className={styles.projectsPage}>
        <section className={styles.projectsHero}>
          <div className={styles.projectsHeroCopy}>
            <div className={styles.kicker}>PROJECTS</div>
            <h1>Ideas to Real-World<br /><span>Applications</span></h1>
            <p>
              A collection of projects that showcase my skills in full-stack development,<br />
              mobile development, machine learning, computer vision and more.<br />
              Each project represents a step in my learning journey and my passion<br />
              for building impactful solutions.
            </p>
            <div className={styles.projectsHeroActions}>
              <GitHubLink className={styles.projectsPrimaryButton}><Github size={14} /> View GitHub</GitHubLink>
              <Link href="/contact" className={styles.projectsSecondaryButton}>Let&apos;s Collaborate <ArrowRight size={14} /></Link>
            </div>
          </div>

          <div className={styles.projectsHeroArt} aria-hidden="true">
            <div className={styles.heroQuote}>
              <span>&ldquo;Every project<br />is a lesson, and<br />every lesson brings<br />me closer to the future<br />I want to build.&rdquo;</span>
              <small>— Nardy Attalla</small>
            </div>
            <div className={styles.heroLaptop}>
              <div className={styles.heroLaptopScreen}>
                <div className={styles.codeBar} />
                <i /><i /><i /><i /><i /><i /><i />
              </div>
              <div className={styles.heroLaptopBase} />
            </div>
            <div className={styles.heroScript}>Code<br />Learn<br />Build<br />Improve<br />Repeat<b>↙</b></div>
          </div>
        </section>

        <section className={styles.projectsBrowser} aria-label="Project collection">
          <div className={styles.projectToolbarExact}>
            <div className={styles.projectFilters}>
              {filters.map((item) => (
                <button key={item} type="button" className={item === filter ? styles.projectFilterActive : styles.projectFilter} onClick={() => setFilter(item)}>{item}</button>
              ))}
            </div>
            <label className={styles.projectSort}>
              <span>Sort by:</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort projects">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
              <span className={styles.sortChevron}>⌄</span>
            </label>
          </div>

          <div className={styles.projectGridExact}>
            {visible.map((project) => (
              <article className={styles.projectCardExact} key={project.title}>
                <div className={styles.projectCardMedia}>
                  <Image src={project.img} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 900px) 50vw, 24vw" />
                  <span className={styles.projectCategoryBadge}>{project.badge}</span>
                  {project.title.includes("CPAC") && <span className={styles.projectFeaturedBadge}><Star size={9} fill="currentColor" /> Featured</span>}
                </div>
                <div className={styles.projectCardBody}>
                  <h2>{project.title}</h2>
                  <p>{project.desc}</p>
                  <div className={styles.projectTagRow}>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className={styles.projectCardFooter}>
                    <GitHubLink className={styles.projectDetails}>View Details <ArrowRight size={12} /></GitHubLink>
                    <div className={styles.projectIconLinks}>
                      <GitHubLink ariaLabel={project.title + " GitHub"}><Github size={14} /></GitHubLink>
                      <GitHubLink ariaLabel={project.title + " external link"}><ExternalLink size={14} /></GitHubLink>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            {filter === "All" && (
              <article className={styles.moreProjectsCard}>
                <div className={styles.moreProjectsPlus}>+</div>
                <h2>More Projects<br />Coming Soon</h2>
                <p>I&apos;m always working on new ideas.<br />Stay tuned!</p>
                <GitHubLink className={styles.moreProjectsButton}>Check GitHub <ArrowRight size={13} /></GitHubLink>
              </article>
            )}
          </div>
        </section>

        <section className={styles.projectsCta}>
          <div>
            <span>HAVE AN IDEA?</span>
            <h2>Let&apos;s Build Something <strong>Meaningful Together</strong></h2>
            <p>I&apos;m open to internships, full-time opportunities, and collaborative projects.</p>
          </div>
          <Link href="/contact" className={styles.projectsCtaButton}><span>✉</span> Get in Touch <ArrowRight size={14} /></Link>
        </section>
      </main>
    </PageFrame>
  );
}
