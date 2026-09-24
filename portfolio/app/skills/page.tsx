"use client";

import type { ComponentType } from "react";

/** lucide and react-icons both accept these; IconComponent alone resolves to `never` props. */
type IconComponent = ComponentType<{ size?: number | string; className?: string }>;
import Link from "next/link";
import {
  ArrowRight, BrainCircuit, Code2, Eye, Monitor,
  Puzzle, Smartphone, UsersRound, Wrench, BookOpen, BarChart3,
  Boxes, Download, Cloud, ServerCog, Gauge, Layers3, Sparkles
} from "lucide-react";
import {
  SiPython, SiJavascript, SiTypescript, SiDart, SiMysql, SiCplusplus,
  SiReact, SiNextdotjs, SiNodedotjs, SiExpress, SiTailwindcss, SiHtml5,
  SiCss3, SiFlutter, SiFirebase, SiExpo, SiScikitlearn, SiTensorflow,
  SiPytorch, SiPandas, SiNumpy, SiOpencv, SiRos, SiRoboflow, SiNvidia,
  SiGit, SiDocker, SiLinux, SiAmazon, SiTerraform, SiGithub, SiNotion,
  SiPostman, SiFigma, SiUbuntu, SiGooglecolab
} from "react-icons/si";
import { PageFrame } from "@/components/PortfolioPages";
import PageHero, { HeroGhost, HeroPrimary } from "@/components/PageHero";
import styles from "@/components/SkillsExact.module.css";

type SkillItem = [IconComponent, string];
type SkillGroup = {
  title: string;
  description: string;
  icon: IconComponent;
  items: SkillItem[];
};

const technicalGroups: SkillGroup[] = [
  {
    title: "Programming Languages",
    description: "Languages I use to build, solve and experiment.",
    icon: Code2,
    items: [[SiPython,"Python"],[SiJavascript,"JavaScript"],[SiTypescript,"TypeScript"],[SiDart,"Dart"],[SiMysql,"SQL"],[SiCplusplus,"C++"]],
  },
  {
    title: "Web Development",
    description: "Building modern and responsive web applications.",
    icon: Monitor,
    items: [[SiReact,"React"],[SiNextdotjs,"Next.js"],[SiNodedotjs,"Node.js"],[SiExpress,"Express"],[SiTailwindcss,"Tailwind CSS"],[SiHtml5,"HTML/CSS"]],
  },
  {
    title: "Backend & APIs",
    description: "Building APIs, services and database-backed applications.",
    icon: ServerCog,
    items: [[SiNodedotjs,"Node.js"],[SiTypescript,"NestJS"],[Code2,"FastAPI"],[SiMysql,"PostgreSQL"],[Code2,"Supabase"],[Code2,"MongoDB"],[Code2,"REST APIs"]],
  },
  {
    title: "Backend & APIs",
    description: "Building APIs, services and database-backed applications.",
    icon: ServerCog,
    items: [[SiNodedotjs,"Node.js"],[SiTypescript,"NestJS"],[Code2,"FastAPI"],[SiMysql,"PostgreSQL"],[Code2,"Supabase"],[Code2,"MongoDB"],[Code2,"REST APIs"]],
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile app development.",
    icon: Smartphone,
    items: [[SiFlutter,"Flutter"],[SiFirebase,"Firebase"],[SiReact,"React Native"],[SiExpo,"Expo"]],
  },
  {
    title: "Machine Learning & Data",
    description: "From classical ML to deep learning, with hands-on projects.",
    icon: BrainCircuit,
    items: [[SiScikitlearn,"Scikit-learn"],[SiTensorflow,"TensorFlow"],[SiPytorch,"PyTorch"],[SiPandas,"Pandas"],[SiNumpy,"NumPy"],[BarChart3,"Matplotlib"]],
  },
  {
    title: "Computer Vision",
    description: "Building perception systems and working with real-world data.",
    icon: Eye,
    items: [[SiOpencv,"OpenCV"],[SiRoboflow,"YOLOv8"],[SiRos,"ROS"],[SiRoboflow,"Roboflow"],[SiNvidia,"NVIDIA"],[Boxes,"LiDAR"]],
  },
  {
    title: "DevOps & Tools",
    description: "Tools I use to build, deploy and manage projects.",
    icon: ServerCog,
    items: [[SiGit,"Git"],[SiDocker,"Docker"],[SiLinux,"Linux"],[SiAmazon,"AWS"],[SiTerraform,"Terraform"],[Code2,"VS Code"],[SiGithub,"GitHub Actions"],[SiPostman,"Postman"],[Gauge,"k6"]],
  },
];

const roadmap = [
  { title:"Foundations", state:"done", items:[["Python","done"],["Math &","done"],["Data","done"]] },
  { title:"Core ML", state:"done", items:[["Supervised","done"],["Unsupervised","done"],["NLP","done"],["Computer","done"]] },
  { title:"Advanced (In Progress)", state:"progress", items:[["Deep","progress"],["MLOps","progress"]] },
  { title:"Next", state:"next", items:[["RAG","next"],["LLMs","next"],["AI Agents","next"]] },
] as const;

const roadmapNodes=roadmap.flatMap(group=>group.items.map(([,state])=>state));
const journeyProgress=Math.round(roadmapNodes.reduce((sum,state)=>sum+(state==="done"?1:state==="progress"?.5:0),0)/roadmapNodes.length*100);
const dailyTools: [IconComponent,string][] = [
  [Code2,"VS Code"],[SiGithub,"GitHub"],[SiNotion,"Notion"],[SiPostman,"Postman"],
  [SiFigma,"Figma"],[SiUbuntu,"Ubuntu"],[SiDocker,"Docker"],[SiGooglecolab,"Google Colab"],
];

const learning = [
{title:"Deep Learning",icon:BrainCircuit,progress:70,meta:"In progress"},
{title:"MLOps",icon:Gauge,progress:55,meta:"In progress"},
{title:"RAG",icon:Layers3,progress:35,meta:"Building next"},
{title:"LLMs",icon:Sparkles,progress:25,meta:"Exploring"},
{title:"System Design",icon:ServerCog,progress:40,meta:"Practicing"},
{title:"Cloud Deployment",icon:Cloud,progress:30,meta:"Practicing"},
];

const softSkills = [
  [Puzzle,"Problem Solving","Breaking complex problems into simple, practical solutions."],
  [BookOpen,"Continuous Learning","Always exploring new tools, concepts and technologies."],
  [UsersRound,"Communication","Working effectively in teams and presenting ideas clearly."],
] as const;

export default function SkillsPage() {
  return (
    <PageFrame active="Skills">
      <main className={styles.skillsPage}>
        <PageHero
          eyebrow="Skills & technologies"
          title={<>Tools for Ideas,<br />Skills for <em>Impact</em></>}
          lead="Software engineering, machine learning and problem-solving — the toolkit I use to turn an idea into something people can actually run."
          actions={<>
            <HeroPrimary href="/projects">See them in use <ArrowRight size={15} /></HeroPrimary>
            <HeroGhost href="/full_stack_cv_edited.pdf" external><Download size={15} /> Download CV</HeroGhost>
          </>}
          scene="constellation"
          readout="skills · 6 domains"
          note={<>Same engineer.<br />Bigger possibilities.</>}
          quote={{ text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" }}
        />

        <section className={styles.technicalSection}>
          <SectionHeading
            icon={Code2}
            title="Technical Skills"
            right="A practical toolkit built through university, projects and real-world experience."
            farRight="Always learning, always improving."
          />
          <div className={styles.skillGrid}>
            {technicalGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <article className={styles.skillCard} key={group.title}>
                  <div className={styles.skillCardHeading}>
                    <GroupIcon className={styles.groupIcon} />
                    <div>
                      <h3>{group.title}</h3>
                      <p>{group.description}</p>
                    </div>
                  </div>
                  <div className={styles.logoGrid}>
                    {group.items.map(([Icon,name]) => <SkillLogo key={name} Icon={Icon} name={name}/>)}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.roadmapSection}>
          <SectionHeading
            icon={BrainCircuit}
            title="My Machine Learning Journey"
            right="A visual roadmap of what I’ve learned, what I’m learning, and what’s next."
          />
          <div className={styles.roadmap}>
            <svg className={styles.roadLine} viewBox="0 0 930 125" preserveAspectRatio="none" aria-hidden="true">
              <path className={styles.roadDone} d="M8 75 C65 45, 98 102, 153 72 S250 42, 310 72 S420 101, 478 72" />
              <path className={styles.roadProgress} d="M478 72 C530 44, 574 102, 635 73 S716 48, 770 72" />
              <path className={styles.roadNext} d="M770 72 C818 47, 855 95, 922 67" />
            </svg>
            {roadmap.map((group) => (
              <div className={styles.roadGroup} data-state={group.state} key={group.title}>
                <h3>{group.title}</h3>
                <div className={styles.roadItems}>
                  {group.items.map(([label,state]) => <span className={state} key={label}><i/>{label === "Math &" ? <>Math &amp;<br/>Statistics</> : label === "Data" ? <>Data<br/>Analysis</> : label === "Supervised" ? <>Supervised<br/>Learning</> : label === "Unsupervised" ? <>Unsupervised<br/>Learning</> : label === "NLP" ? <>NLP<br/>(Basics)</> : label === "Computer" ? <>Computer<br/>Vision</> : label === "Deep" ? <>Deep<br/>Learning</> : label}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.progressTrack}><span style={{width:`${journeyProgress}%`}}/><b>{journeyProgress}%</b></div>
          <div className={styles.roadLegend}>
            <span className="done">● &nbsp;Completed</span>
            <span className="progress">● &nbsp;In Progress</span>
            <span className="next">○ &nbsp;Next</span>
            <em>Learning is a continuous journey...</em>
          </div>
        </section>

        <section className={styles.workflowSection}>
          <div className={styles.dailyTools}>
            <SectionHeading icon={Wrench} title="Tools I Use Daily" right="Some of the tools and platforms in my workflow." stacked />
            <div className={styles.dailyGrid}>
              {dailyTools.map(([Icon,name]) => <div className={styles.dailyTool} data-tool={name} key={name}><span><Icon /></span><small>{name}</small></div>)}
            </div>
          </div>
          <div className={styles.currentLearning}>
            <SectionHeading icon={BarChart3} title="Currently Learning" right="Focusing on these areas to deepen my expertise." stacked />
            <div className={styles.learningGrid}>{learning.map(({title,icon:Icon,progress,meta})=><article className={styles.learningCard} key={title}><span className={styles.learningIcon}><Icon/></span><div className={styles.learningBody}><strong>{title}</strong><small>{meta}</small><i><b style={{width:`${progress}%`}}/></i></div><em>{progress}%</em></article>)}</div>
          </div>
          <blockquote className={styles.quoteCard}>
            <span>“</span>
            <p>The only way to do great work<br />is to love what you do.</p>
            <small>— Steve Jobs</small>
          </blockquote>
        </section>

        <section className={styles.softSection}>
          <SectionHeading icon={UsersRound} title="Beyond Technical Skills" showIcon />
          <div className={styles.softGrid}>
            {softSkills.map(([Icon,title,desc]) => (
              <article className={styles.softCard} key={title}>
                <Icon />
                <div><h3>{title}</h3><p>{desc}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaBackdrop} />
          <div className={styles.ctaCopy}>
            <h2>Let’s Build Something Great Together</h2>
            <p>I&apos;m always open to new opportunities, collaborations, and interesting projects.</p>
          </div>
          <Link href="/contact" className={styles.ctaButton}>Get in Touch <ArrowRight size={14}/></Link>
        </section>
      </main>
    </PageFrame>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  right,
  farRight,
  stacked=false,
  showIcon=false,
}: {
  icon: IconComponent;
  title: string;
  right?: string;
  farRight?: string;
  stacked?: boolean;
  showIcon?: boolean;
}) {
  return (
    <div className={`${styles.sectionHeading} ${stacked ? styles.stackedHeading : ""}`}>
      <div className={styles.headingTitle}>{(stacked || showIcon) ? <Icon/> : <i/>}<h2>{title}</h2></div>
      {right && <p>{right}</p>}
      {farRight && <em>{farRight}</em>}
    </div>
  );
}

function SkillLogo({Icon,name}:{Icon:IconComponent;name:string}) {
  return <div className={styles.skillLogo}><span><Icon/></span><small>{name}</small></div>;
}
