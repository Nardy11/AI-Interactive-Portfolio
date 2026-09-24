"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Star } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import PageHero, { HeroGhost, HeroPrimary } from "@/components/PageHero";
import styles from "@/components/PortfolioPages.module.css";

type Project = {
  img: string;
  title: string;
  cat: string;
  badge: string;
  desc: string;
  tags: string[];
  year: number;
  repo: string;
  repoFallback?: boolean;
};

const projects: Project[] = [
  { img: "/Distance_stereo.jpeg", title: "Cooperative Perception and Control (CPAC)", cat: "Computer Vision", badge: "Computer Vision", desc: "Real-time multi-sensor perception system for connected autonomous vehicles using YOLOv5/YOLOv8, ROS and sensor fusion.", tags: ["Python", "YOLOv8", "ROS", "OpenCV"], year: 2025, repo: "https://github.com/Nardy11/CPAC-Bachelor-Project" },
  { img: "/data analysis.png", title: "Heart Failure Prediction", cat: "Machine Learning", badge: "Machine Learning", desc: "Predicting heart failure risk using classical ML models with feature engineering, visualization and evaluation.", tags: ["Python", "Scikit-learn", "Pandas"], year: 2025, repo: "https://github.com/Nardy11/Heart_Failure_prediction" },
  { img: "/ML.png", title: "Gold Price Prediction", cat: "Machine Learning", badge: "Machine Learning", desc: "Time series forecasting using ML models and feature engineering to predict gold prices.", tags: ["Python", "XGBoost", "Scikit-learn"], year: 2025, repo: "https://github.com/MYoussef885/Gold_Price_Prediction" },
  { img: "/ESG&.png", title: "Environment Management App", cat: "Mobile App", badge: "Mobile App", desc: "Cross-platform mobile application using Flutter and Firebase for environmental data management and monitoring.", tags: ["Flutter", "Firebase", "Dart"], year: 2024, repo: "https://github.com/Nardy11/Climate-Edge-Company-Flutter-app-web" },
  { img: "/CV.webp", title: "AI Interactive Portfolio", cat: "Web Development", badge: "Web Development", desc: "An interactive portfolio with multiple navigation modes including NLP assistant and computer vision control.", tags: ["Next.js", "TypeScript", "TailwindCSS"], year: 2026, repo: "https://github.com/Nardy11/AI-Interactive-Portfolio" },
  { img: "/Diablo.png", title: "2D/3D Interactive Games", cat: "Game Development", badge: "Game Development", desc: "Game development projects and Unity experiments exploring gameplay mechanics and interactive environments.", tags: ["Unity", "C#", "Blender"], year: 2024, repo: "https://github.com/Nardy11/DiabloCrimsonAbyss" },
  { img: "/Clinic Webs.png", title: "Mentorship Internship Project", cat: "Web Development", badge: "Web Development", desc: "Web dashboard for managing mentorship programs with analytics and user management.", tags: ["React", "Node.js", "MongoDB"], year: 2025, repo: "https://github.com/Nardy11/Mentorness" },
  { img: "/nlp_assistant.png", title: "Portfolio Assistant (NLP)", cat: "Other", badge: "NLP / AI", desc: "NLP-based assistant that answers questions about my portfolio using semantic similarity. RAG coming soon.", tags: ["Python", "NLP", "Embeddings"], year: 2025, repo: "https://github.com/Nardy11/AI-Interactive-Portfolio" },
  { img: "https://images.unsplash.com/photo-1774901128302-e2bbd154da44?auto=format&fit=crop&fm=jpg&q=80&w=1200", title: "Microservices Migration (Customer)", cat: "Other", badge: "Backend / DevOps", desc: "Transforming a monolith into microservices using NestJS, TypeScript and deploying on cloud infrastructure.", tags: ["NestJS", "Docker", "AWS", "Terraform"], year: 2026, repo: "https://github.com/Nardy11/Scalable-App-Task5-RabbitMQ-HotelBooking", repoFallback: true },
  { img: "/E-commerce App.png", title: "Shopify Development (Test)", cat: "Web Development", badge: "Full Stack", desc: "E-commerce development with modern stack, including custom themes and app integrations.", tags: ["React", "Next.js", "Shopify", "Node.js"], year: 2026, repo: "https://github.com/Nardy11/basic-e-commerce-application", repoFallback: true },
  { img: "https://images.unsplash.com/photo-1757165792338-b4e8a88ae1c7?auto=format&fit=crop&fm=jpg&q=80&w=1200", title: "Flutter Developer Intern (GUC)", cat: "Mobile App", badge: "Mobile App", desc: "Developed mobile applications using Flutter and Firebase during my internship at GUC.", tags: ["Flutter", "Firebase", "Dart"], year: 2024, repo: "https://github.com/Nardy11", repoFallback: true },
];

const filters = ["All", "Machine Learning", "Computer Vision", "Web Development", "Mobile App", "Game Development", "Other"];

function GitHubLink({ children, className = "", ariaLabel, href = "https://github.com/Nardy11" }: { children: ReactNode; className?: string; ariaLabel?: string; href?: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className={className} aria-label={ariaLabel}>{children}</a>;
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
        <PageHero
          eyebrow="Projects"
          title={<>Ideas to Real-World<br /><em>Applications</em></>}
          lead="Full-stack apps, mobile builds, machine learning and computer vision. Each one is a step in the learning journey — and every repository is open."
          actions={<>
            <HeroPrimary href="https://github.com/Nardy11" external><Github size={15} /> View GitHub</HeroPrimary>
            <HeroGhost href="/contact">Let&apos;s collaborate <ArrowRight size={15} /></HeroGhost>
          </>}
          stats={[
            { value: String(projects.length), label: "Shipped projects" },
            { value: String(filters.length - 1), label: "Disciplines" },
            { value: "2024–26", label: "Active years" },
          ]}
          scene="terminal"
          readout={`projects · ${projects.length} detected`}
          note={<>Code. Learn.<br />Build. Repeat.</>}
          quote={{ text: "Stay hungry. Stay foolish.", author: "Steve Jobs" }}
        />

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
                  <img src={project.img} alt="" />
                  <span className={styles.projectCategoryBadge}>{project.badge}</span>
                  {project.title.includes("CPAC") && <span className={styles.projectFeaturedBadge}><Star size={9} fill="currentColor" /> Featured</span>}
                </div>
                <div className={styles.projectCardBody}>
                  <h2>{project.title}</h2>
                  <p>{project.desc}</p>
                  <div className={styles.projectTagRow}>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className={styles.projectCardFooter}>
                    <GitHubLink href={project.repo} className={styles.projectDetails}>View Details <ArrowRight size={12} /></GitHubLink>
                    <div className={styles.projectIconLinks}>
                      <GitHubLink href={project.repo} ariaLabel={project.title + " GitHub repository"}><Github size={14} /></GitHubLink>
                      <GitHubLink href={project.repo} ariaLabel={project.title + " repository"}><ExternalLink size={14} /></GitHubLink>
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
                <GitHubLink href="https://github.com/Nardy11" className={styles.moreProjectsButton}>Check GitHub <ArrowRight size={13} /></GitHubLink>
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
