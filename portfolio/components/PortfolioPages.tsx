"use client";
import type { ReactNode } from "react";
import { Download, Github, Linkedin, Instagram, Mail, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./PortfolioPages.module.css";

const links = [["Home","/home"],["Projects","/projects"],["Experience","/experience"],["Skills","/skills"],["About","/about"],["Contact","/contact"]] as const;

export default function SiteHeader({
  active,
  interactive = false,
}: {
  active?: string;
  interactive?: boolean;
}) {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") {
      setDark(saved === "dark");
    }
  }, []);

  useEffect(() => {
    const theme = dark ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [dark]);

  return (
    <header className={`${styles.header} ${active === "About" ? styles.aboutHeader : ""} ${active === "Contact" ? styles.contactHeader : ""}`}>
      <a href="/home" className={styles.brand}>
        <span className={styles.brandMark}>NA</span>
        <span className={styles.brandText}>
          <b>Nardy Attalla</b>
          <small>CS Engineer | Aspiring ML Engineer</small>
        </span>
      </a>

      <nav className={styles.mainNav}>
        {links.map(([label, href]) => (
          <a key={label} className={(active === label || pathname === href) ? styles.active : ""} href={href}>
            {label}
          </a>
        ))}
      </nav>

      <div className={styles.headerActions}>
        <label className={styles.headerSearch}>
          <Search size={13} />
          <input
            aria-label={active === "Projects" ? "Search projects" : "Search"}
            placeholder={active === "Projects" ? "Search projects..." : "Search..."}
          />
        </label>

        <button
          className={styles.themeButton}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={!dark}
          onClick={() => setDark(value => !value)}
        >
          {dark ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {interactive && <a href="/cv" className={styles.modeButton}>✋ CV Mode</a>}
        {interactive && <a href="/nlp" className={styles.modeButton}>✣ NLP Assistant</a>}

        <a href="/full_stack_cv_edited.pdf" target="_blank" rel="noreferrer" className={styles.headerCv}>
          <Download size={15} /> Download CV
        </a>
      </div>
    </header>
  );
}

export function Footer({ variant = "default" }: { variant?: "default" | "dashboard" }) {
  return (
    <footer className={`${styles.footer} ${variant === "dashboard" ? styles.dashboardFooter : ""}`}>
      <div className={styles.footerBrand}>
        <span className={styles.brandMark}>NA</span>
        <div>
          <b>Nardy Attalla</b>
          <small>CS Engineer | Aspiring ML Engineer</small>
        </div>
      </div>
      <div className={styles.footerQuote}>“The important thing is to never stop questioning.” — Albert Einstein</div>
      {variant === "dashboard" && <div className={styles.dashboardFooterMiddle}>Build <span>•</span> Learn <span>•</span> Improve <span>•</span> Repeat</div>}
      <div className={styles.socials}>
        <a href="https://github.com/Nardy11" target="_blank" rel="noreferrer"><Github size={18} /></a>
        <a href="https://www.linkedin.com/in/nardy-attallah" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
        <a href="mailto:nardy.attalla@gmail.com"><Mail size={18} /></a>
        
      </div>
      {variant === "dashboard" && <span className={styles.dashboardFooterLocation}>Cairo, Egypt&nbsp; | &nbsp;Open to opportunities worldwide</span>}
    </footer>
  );
}

export function PageFrame({
  active,
  children,
  interactive = false,
  variant = "default",
}: {
  active: string;
  children: ReactNode;
  interactive?: boolean;
  variant?: "default" | "dashboard";
}) {
  return (
    <div className={styles.page}>
      <SiteHeader active={active} interactive={interactive} />
      {children}
      <Footer variant={variant} />
    </div>
  );
}
