"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, ExternalLink, Star } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import styles from "@/components/PortfolioPages.module.css";

type Project = { img:string; title:string; cat:string; desc:string; tags:string[]; year:number };
const projects:Project[]=[
{img:"/Distance_stereo.jpeg",title:"Cooperative Perception and Control (CPAC)",cat:"Computer Vision",desc:"Real-time multi-sensor perception system for connected autonomous vehicles using YOLOv5/YOLOv8, ROS and sensor fusion.",tags:["Python","YOLOv8","ROS","OpenCV"],year:2025},
{img:"/data analysis.png",title:"Transaction Category Prediction",cat:"Machine Learning",desc:"Hybrid NLP and ML project combining TF-IDF, K-Means and Logistic Regression.",tags:["Python","Scikit-learn","NLP"],year:2025},
{img:"/ML.png",title:"Gold Price Prediction",cat:"Machine Learning",desc:"Time-series forecasting using ML models and feature engineering to predict gold prices.",tags:["Python","XGBoost","Scikit-learn"],year:2025},
{img:"/ESG&.png",title:"Environment Management App",cat:"Mobile App",desc:"Cross-platform mobile application using Flutter and Firebase for environmental data management.",tags:["Flutter","Firebase","Dart"],year:2024},
{img:"/CV.webp",title:"AI Interactive Portfolio",cat:"Web Development",desc:"An interactive portfolio with multiple navigation modes including NLP assistant and computer vision control.",tags:["Next.js","TypeScript","Tailwind CSS"],year:2026},
{img:"/Diablo.png",title:"2D/3D Interactive Games",cat:"Game Development",desc:"Game development projects and Unity experiments exploring gameplay mechanics and interactive environments.",tags:["Unity","C#","Blender"],year:2024},
{img:"/Clinic Webs.png",title:"Mentorship Internship Project",cat:"Web Development",desc:"Web dashboard for managing mentorship programs with analytics and user management.",tags:["React","Node.js","MongoDB"],year:2025},
{img:"/nlp_assistant.png",title:"Portfolio Assistant (NLP)",cat:"Other",desc:"NLP-based assistant that answers questions about my portfolio using semantic similarity.",tags:["Python","NLP","Embeddings"],year:2025},
{img:"/AR.png",title:"Microservices Migration (Customer)",cat:"Other",desc:"Transforming a monolith into TypeScript microservices and deploying the system on cloud infrastructure.",tags:["NestJS","Docker","AWS","Terraform"],year:2026},
{img:"/E-commerce App.png",title:"Shopify Development (Test)",cat:"Web Development",desc:"E-commerce development exercise with modern frontend patterns and Shopify integration concepts.",tags:["React","Next.js","Shopify","Node.js"],year:2026},
{img:"/eesCalculator.jpeg",title:"Flutter Developer Intern (GUC)",cat:"Mobile App",desc:"Mobile application development using Flutter and Firebase during my GUC internship.",tags:["Flutter","Firebase","Dart"],year:2024}
];
const filters=["All","Machine Learning","Computer Vision","Web Development","Mobile App","Game Development","Other"];

export default function Projects(){
 const [filter,setFilter]=useState("All");
 const [sort,setSort]=useState("latest");
 const visible=useMemo(()=>{const x=filter==="All"?projects:projects.filter(p=>p.cat===filter);return [...x].sort((a,b)=>sort==="latest"?b.year-a.year:a.year-b.year)},[filter,sort]);
 return <PageFrame active="Projects"><main className={styles.container}>
  <section className={styles.projectPageHero}><div><div className={styles.kicker}>PROJECTS</div><h1 className={styles.sectionTitle} style={{fontSize:52}}>Ideas to Real-World<br/><span className={styles.gradient}>Applications</span></h1><p className={styles.sectionIntro}>A collection of projects that showcase my skills in full-stack development, mobile development, machine learning, computer vision and more. Each project represents a step in my learning journey.</p><div className={styles.heroButtons}><a href="https://github.com/Nardy11" target="_blank" rel="noreferrer" className={styles.button}><Github size={15}/> View GitHub</a><Link href="/contact" className={styles.buttonGhost}>Let’s Collaborate <ArrowRight size={14}/></Link></div></div><div className={styles.projectHeroVisual}><Image src="/CV.webp" alt="" fill sizes="(max-width:900px) 100vw, 45vw"/></div></section>
  <div className={styles.projectToolbar}><div className={styles.filters}>{filters.map(x=><button type="button" className={styles.filter + (filter===x ? " "+styles.filterActive : "")} key={x} onClick={()=>setFilter(x)}>{x}</button>)}</div><select className={styles.sort} value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort projects"><option value="latest">Sort by: Latest</option><option value="oldest">Sort by: Oldest</option></select></div>
  <section className={styles.projectGridBig}>{visible.map(p=><article className={styles.projectBig} key={p.title}><div className={styles.projectBigImage}><Image src={p.img} alt="" fill sizes="(max-width:760px) 100vw, (max-width:1100px) 50vw, 25vw"/><span className={styles.projectBadge}>{p.cat}</span>{p.title.includes("CPAC")&&<span className={styles.featuredBadge}><Star size={10}/> Featured</span>}</div><div className={styles.body}><h3>{p.title}</h3><p>{p.desc}</p><div className={styles.chips}>{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className={styles.projectLinks}><a href="https://github.com/Nardy11" target="_blank" rel="noreferrer">View Details <ArrowRight size={12}/></a><a href="https://github.com/Nardy11" target="_blank" rel="noreferrer"><Github size={15}/></a><a href="https://github.com/Nardy11" target="_blank" rel="noreferrer"><ExternalLink size={14}/></a></div></div></article>)}<article className={styles.moreCard}><span>＋</span><h3>More Projects<br/>Coming Soon</h3><p>I’m always working on new ideas. Stay tuned!</p><a href="https://github.com/Nardy11" target="_blank" rel="noreferrer">Check GitHub <ArrowRight size={13}/></a></article></section>
  <section className={styles.ctaBlock}><div><span>HAVE AN IDEA?</span><h2>Let’s Build Something <b>Meaningful Together</b></h2><p>I’m open to internships, full-time opportunities, and collaborative projects.</p></div><Link href="/contact">Get in Touch <ArrowRight size={15}/></Link></section>
 </main></PageFrame>
}