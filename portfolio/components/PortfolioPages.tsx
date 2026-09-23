"use client";

import Link from "next/link";
import { Download, Github, Linkedin, Mail, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./PortfolioPages.module.css";

export default function SiteHeader({ active }: { active: string }) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);

  const links = [
    ["Home", "/"],
    ["Projects", "/projects"],
    ["Experience", "/experience"],
    ["Skills", "/skills"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandMark}>NA</span>
        <span><b>Nardy Attalla</b><small>CS Engineer | Aspiring ML Engineer</small></span>
      </Link>
      <nav>{links.map(([label, href]) => <Link key={label} className={active === label ? styles.active : ""} href={href}>{label}</Link>)}</nav>
      <div className={styles.headerActions}>
        <button aria-label="Toggle theme" onClick={() => setDark(v => !v)}>{dark ? <Moon size={16}/> : <Sun size={16}/>}</button>
        <a href="/full_stack_cv_edited.pdf" target="_blank" rel="noreferrer" className={styles.headerCv}><Download size={15}/> Download CV</a>
      </div>
    </header>
  );
}

export function Footer() {
  return <footer className={styles.footer}>
    <div className={styles.footerBrand}><span className={styles.brandMark}>NA</span><div><b>Nardy Attalla</b><small>CS Engineer | Aspiring ML Engineer</small></div></div>
    <div className={styles.footerQuote}>“Build. Learn. Improve. Repeat.”</div>
    <div className={styles.socials}>
      <a href="https://github.com/Nardy11" target="_blank" rel="noreferrer"><Github size={18}/></a>
      <a href="https://www.linkedin.com/in/nardy-attallah" target="_blank" rel="noreferrer"><Linkedin size={18}/></a>
      <a href="mailto:nardy.attalla@gmail.com"><Mail size={18}/></a>
    </div>
  </footer>;
}

export function PageFrame({ active, children }: { active: string; children: React.ReactNode }) {
  return <div className={styles.page}><SiteHeader active={active}/>{children}<Footer/></div>;
}
