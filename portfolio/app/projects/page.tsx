import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github } from "lucide-react";
import { PageFrame } from "@/components/PortfolioPages";
import styles from "@/components/PortfolioPages.module.css";

const projects=[
["/Distance_stereo.jpeg","Cooperative Perception and Control (CPAC)","Computer Vision","Real-time multi-sensor perception for connected autonomous vehicles using YOLOv5/YOLOv8, ROS and sensor fusion.",["Python","YOLOv8","ROS","OpenCV"]],
["/data analysis.png","Transaction Category Prediction","Machine Learning","Hybrid NLP and ML project combining TF-IDF, K-Means and Logistic Regression.",["Python","Scikit-learn","NLP"]],
["/ML.png","Gold Price Prediction","Machine Learning","Time-series forecasting project exploring ML models for gold-price prediction.",["Python","XGBoost","Scikit-learn"]],
["/ESG&.png","Environment Management App","Mobile App","Cross-platform mobile application built with Flutter and Firebase for environmental data management.",["Flutter","Firebase","Dart"]],
["/CV.webp","AI Interactive Portfolio","Web Development","Interactive portfolio with NLP assistant and computer-vision navigation modes.",["Next.js","TypeScript","Tailwind CSS"]],
["/Diablo.png","2D/3D Interactive Games","Game Development","Game-development projects and Unity experiments exploring gameplay mechanics and interactive environments.",["Unity","C#","Blender"]],
["/Clinic Webs.png","Mentorship Internship Project","Web Development","Web dashboard work for managing mentorship programs and user management.",["React","Node.js","MongoDB"]],
["/nlp_assistant.png","Portfolio Assistant (NLP)","NLP / AI","NLP-based assistant for answering questions about my portfolio using semantic similarity.",["Python","NLP","Embeddings"]],
["/AR.png","Microservices Migration (Customer)","Backend / DevOps","Transforming a monolith into TypeScript microservices and deploying the system on cloud infrastructure.",["NestJS","Docker","AWS","Terraform"]],
["/E-commerce App.png","Shopify Development Test","Full Stack","E-commerce development exercise involving modern frontend and Shopify integration concepts.",["React","Next.js","Shopify","Node.js"]],
["/eesCalculator.jpeg","Flutter Developer Internship (GUC)","Mobile App","Developed mobile applications using Flutter and Firebase during my internship at GUC.",["Flutter","Firebase","Dart"]]
];
export default function Projects(){return <PageFrame active="Projects"><main className={styles.container}>
<section className={styles.projectPageHero}><div><div className={styles.kicker}>PROJECTS</div><h1 className={styles.sectionTitle} style={{fontSize:52}}>Ideas to Real-World<br/><span className={styles.gradient}>Applications</span></h1><p className={styles.sectionIntro}>A collection of projects that showcase my skills in full-stack development, mobile development, machine learning, computer vision and more. Each project represents a step in my learning journey.</p><div style={{display:"flex",gap:12,marginTop:24}}><a href="https://github.com/Nardy11" target="_blank" className={styles.button}><Github size={15}/> View GitHub</a><Link href="/contact" className={styles.buttonGhost}>Let’s Collaborate <ArrowRight size={14}/></Link></div></div><Image src="/CV.webp" alt="" width={700} height={400} className={styles.projectHeroImg}/></section>
<div className={styles.filters}>{["All","Machine Learning","Computer Vision","Web Development","Mobile App","Game Development","Other"].map(x=><span className={styles.filter} key={x}>{x}</span>)}</div>
<section className={styles.projectGridBig}>{projects.map(([img,title,cat,desc,tags])=><article className={styles.projectBig} key={title}><Image src={img} alt="" width={500} height={250}/><div className={styles.body}><small style={{color:"#7ca6ff",fontSize:9}}>{cat}</small><h3>{title}</h3><p>{desc}</p><div className={styles.chips}>{(tags as string[]).map(t=><span key={t}>{t}</span>)}</div><div style={{marginTop:13}}><a href="https://github.com/Nardy11" target="_blank" style={{color:"#6fa7ff",fontSize:9,textDecoration:"none"}}>View Details →</a></div></div></article>)}</section>
<section className={styles.sectionBlock} style={{marginTop:70}}><h2 className={styles.sectionTitle}>Let’s Build Something <span className={styles.gradient}>Meaningful Together</span></h2><p className={styles.sectionIntro}>I’m open to internships, full-time opportunities, and collaborative projects.</p><Link href="/contact" className={styles.button}>Get in Touch <ArrowRight size={14}/></Link></section>
</main></PageFrame>}