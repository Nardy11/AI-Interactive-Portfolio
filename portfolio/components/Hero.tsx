"use client";
import React, { useState, useEffect } from "react";
import { Spotlight } from "./ui/Spotlight";
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicButton from "./ui/MagicButton";
import { TypewriterEffect } from "./ui/TypewriterEffectSmooth";
import { BackgroundGradient } from "./ui/background-gradient";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarLogo,
  NavBody,
  NavItems,
} from "./ui/resizable-navbar";
import { CardSpotlight } from "./ui/card-spotlight";
import SkillBubble from "./ui/SkillBubble";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";
import { color, motion } from "framer-motion";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { LinkPreview } from "./ui/link-preview";
import { Carousel } from "./ui/carousel";

interface HeroProps {
  initialMode?: "normal" | "cv" | "nlp";
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

interface ContactIcon {
  name: string;
  href: string;
  icon: string;
}

const Hero: React.FC<HeroProps> = ({ initialMode = "normal" }) => {
  const [currentMode, setCurrentMode] = useState<HeroProps["initialMode"]>(initialMode);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentMode]);

  const words = [
    { text: "Hi!" },
    { text: "I'm" },
    { text: "Nardy" },
    { text: "👋," },
    { text: "A" },
    { text: "Web" },
    { text: "&" },
    { text: "ML" },
    { text: "Developer" },
    { text: "based" },
    { text: "in" },
    { text: "Egypt." },
  ];

  const slideData = [
    { title: "Swipe to see the projects based on their category", button: "", color: "#131e3c" },
    { title: "ML", button: "View Projects", color: "#131e3c" },
    { title: "Game Dev", button: "View Projects", color: "#131e3c" },
    { title: "Web Dev", button: "View Projects", color: "#131e3c" },
    { title: "App Dev", button: "View Projects", color: "#131e3c" },
  ];

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "Skills", link: "#skills" },
    { name: "Projects", link: "#projects" },
    { name: "Modes", link: "#modes" },
    { name: "Timeline", link: "#timeline" },
    { name: "Testimonials", link: "#testimonials" },
    { name: "Contact", link: "#contact" },
  ];
  const testimonials = [
    {
      name: "Assoc. Prof. Mervat Abu-Elkheir",
      title: "Computer Science Dept., GUC",
      quote: "Nardy is determined, focused, and worked independently on his graduation project, demonstrating diverse computer science skills and eagerness to learn. He will excel in any research environment."
    },
    {
      name: "Yomna M.I. Hassan",
      title: "Assistant Professor, GUC",
      quote: "Nardy showcased exceptional creativity and technical skills in VR/AR projects, as well as thorough research on XR for therapeutic applications. A proactive learner with a problem-solving mindset."
    },
    {
      name: "Assoc. Prof. Dr. Mohamed Hamed",
      title: "Professor of Bioinformatics & Computational Biology, GUC",
      quote: "Nardy exhibited exceptional dedication and analytical thinking in ML, successfully applying concepts in innovative ways. His communication, collaborative spirit, and research potential are outstanding."
    },
    {
      name: "Eng. Kareem El Hossainy",
      title: "ESG& Company",
      quote: "During his internship, Nardy demonstrated strong commitment, reliability, and technical skills. He proactively offered innovative suggestions and adapted quickly to new challenges."
    }
  ];

  const modeCards = React.useMemo(() => {
    if (currentMode === "normal") {
      return [
        { title: "Try Using CV", img: "/cv.png" },
        { title: "Try Using NLP", img: "/nlp_assistant.png" },
      ];
    } else if (currentMode === "nlp") {
      return [
        { title: "Try Normal Navigation", img: "/normal_navigation.png" },
        { title: "Try Using CV", img: "/cv.png" },
      ];
    } else {
      return [
        { title: "Try Normal Navigation", img: "/normal_navigation.png" },
        { title: "Try Using NLP", img: "/nlp_assistant.png" },
      ];
    }
  }, [currentMode]);

  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: { value: "#0a1a3a" } },
    fpsLimit: 60,
    particles: {
      number: { value: 80 },
      color: { value: "#00ffff" },
      opacity: { value: 0.3 },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 1, random: true },
      shape: { type: "circle" },
    },
  };
  const items = [
    { name: "Web dev fwb", url: "https://drive.google.com/file/d/1HvqmZ7ETcSElUEYU3RBHxOh4F1F8BTMG/view?usp=sharing" },
    { name: "sql sololearn", url: "https://www.sololearn.com/en/certificates/CT-DXISDL2V" },
    { name: "AI Helsinki", url: "https://certificates.mooc.fi/validate/w0kub6oay8d" },
    { name: "Building AI Helsinki", url: "https://drive.google.com/file/d/1MpLNH1ntP52X19YI6Tzd8p9KU2G_1rpu/view?usp=sharing" },
    { name: "Bachelor Project", url: "https://www.linkedin.com/posts/nardy-attallah_bscthesis-computerengineering-autonomousvehicles-activity-7337153907036450816-wBex?utm_source=share&utm_medium=member_desktop&rcm=ACoAADazzPYB-RN2yg0rDt8vIBKAbuz0lL5Ale0" },
    { name: "Valeo Competition", url: "https://www.linkedin.com/posts/nardy-attallah_innovation-valeomentorshipprogram-autonomousvehicles-activity-7337154117687042048-82j-?utm_source=share&utm_medium=member_desktop&rcm=ACoAADazzPYB-RN2yg0rDt8vIBKAbuz0lL5Ale0" },
    { name: "MIE Competition", url: "https://www.linkedin.com/posts/nardy-attallah_mie2024-bestdesignaward-autonomousvehicles-activity-7337154367872991232-fSQJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAADazzPYB-RN2yg0rDt8vIBKAbuz0lL5Ale0" },
    { name: "Stuttgart Workshop", url: "https://www.linkedin.com/posts/nardy-attallah_daad-universityofstuttgart-turtlebot3-activity-7337156766280966144-ZBf0?utm_source=share&utm_medium=member_desktop&rcm=ACoAADazzPYB-RN2yg0rDt8vIBKAbuz0lL5Ale0" },
    { name: "Flutter Dev intern ESG&", url: "https://www.linkedin.com/in/nardy-attallah/" },
    { name: "Flutter Dev intern GUC", url: "https://www.linkedin.com/in/nardy-attallah/" },
    { name: "Supervised Learning", url: "https://www.linkedin.com/posts/nardy-attallah_supervised-machine-learning-regression-and-activity-7337159723231686657-mlwo?utm_source=share&utm_medium=member_desktop&rcm=ACoAADazzPYB-RN2yg0rDt8vIBKAbuz0lL5Ale0" },
    { name: "Unsupervised Learning", url: "https://www.linkedin.com/posts/nardy-attallah_unsupervised-learning-recommendersrl-activity-7337160203462717440-A7Sa?utm_source=share&utm_medium=member_desktop&rcm=ACoAADazzPYB-RN2yg0rDt8vIBKAbuz0lL5Ale0" },
    { name: "Machine learning Specialization", url: "https://www.linkedin.com/posts/nardy-attallah_machine-learning-specialization-activity-7337160571370229760-c8cO?utm_source=share&utm_medium=member_desktop&rcm=ACoAADazzPYB-RN2yg0rDt8vIBKAbuz0lL5Ale0" },
    { name: "Machine Learning in Production", url: "https://www.linkedin.com/posts/nardy-attallah_machine-learning-in-production-activity-7337164552381370368-CiHq?utm_source=share&utm_medium=member_desktop&rcm=ACoAADazzPYB-RN2yg0rDt8vIBKAbuz0lL5Ale0" },
    { name: "Junior TA", url: "https://www.linkedin.com/in/nardy-attallah/" },

  ];
  const contactIcons: ContactIcon[] = [
    { name: "Email", href: "mailto:nardymichelle2003@gmail.com", icon: "/gmail.png" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/nardy-attallah", icon: "/linkedin.png" },
    { name: "GitHub", href: "https://github.com/Nardy11", icon: "/github.png" },
    { name: "Web CV", href: "/full stack cv edited.pdf", icon: "/CV.webp" },
    { name: "ML CV", href: "/ml_cv.pdf", icon: "/CV.webp" },
  ];

  return (
    <div className="relative bg-white dark:bg-black-100 min-h-screen">
      {/* Navbar */}
      <div className="relative w-full">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} />
          </NavBody>
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>

      {/* Spotlights */}
      <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-[150vh] absolute" fill="white" />
      <Spotlight className="-top-10 left-full h-[80vh] w-[50vw] absolute" fill="purple" />
      <Spotlight className="-top-28 left-80 h-[80vh] w-[50vw] absolute" fill="blue" />

      {/* Hero Section */}
      <div id="home" className="relative z-10 flex flex-col items-center justify-start pt-20 pb-40 px-6">
        <BackgroundGradient className="w-48 h-48 flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-900 rounded-[22px] mb-6 mt-1 mx-1">
          <img
            src="/picprofile.png"
            alt="my profile pic"
            className="object-cover w-full h-full rounded-t-full rounded-b-none"
          />
        </BackgroundGradient>

        <TextGenerateEffect
          words="Welcome to my dynamic AI-powered portfolio"
          className="text-center text-[40px] md:text-5xl lg:text-6xl mb-6"
        />
        <TypewriterEffect words={words} />
        <a href="#testimonials" className="mt-6">
          <MagicButton />
        </a>
      </div>

      {/* Skills Section */}
      <div id="skills" className="flex flex-col items-center mt-20">
        <TextGenerateEffect
          words="Skills"
          className="text-center text-[40px] md:text-5xl lg:text-6xl mt-20 font-bold"
        />
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          <SkillBubble title="Programming" skills={["Python", "JavaScript", "Java", "Dart"]} width={120} height={120} skillSize={60} radius={100} orbitDuration={10} />
          <SkillBubble title="Languages" skills={["Arabic", "English"]} width={120} height={120} skillSize={60} radius={100} orbitDuration={10} />
          <SkillBubble title="Frameworks & Libraries" skills={["Flutter", "React", "React Native", "Next.js", "Spring Boot", "TensorFlow", "PyTorch", "OpenCV", "ROS", "YOLO"]} width={120} height={120} skillSize={60} radius={100} orbitDuration={10} />
          <SkillBubble title="Backend" skills={["PostgreSQL", "MongoDB", "Firebase", "Redis", "RabbitMQ"]} width={120} height={120} skillSize={60} radius={100} orbitDuration={10} />
          <SkillBubble title="DevOps" skills={["Docker", "Nginx", "Unit Testing", "JMeter", "Git"]} width={120} height={120} skillSize={60} radius={100} orbitDuration={10} />
          <SkillBubble title="ML" skills={["ML Models", "Computer Vision", "Regression", "Classification", "Clustering", "Reinforcement Learning"]} width={120} height={120} skillSize={60} radius={100} orbitDuration={10} />
          <SkillBubble title="Soft Skills" skills={["Problem Solving", "Teamwork", "Microsoft Office", "Event Management"]} width={120} height={120} skillSize={60} radius={100} orbitDuration={10} />
          <SkillBubble title="Game Dev" skills={["Unity", "VR", "AR"]} width={120} height={120} skillSize={60} radius={100} orbitDuration={10} />
        </div>
      </div>

      {/* Projects Section */}
      <div id="projects" className="flex flex-col items-center mt-40 text-center w-full">
        <TextGenerateEffect words="Projects" className="text-center text-[40px] md:text-5xl lg:text-6xl" />
        <div className="flex justify-center w-full max-w-6xl py-10 overflow-visible">
          <Carousel slides={slideData} />
        </div>
      </div>

      {/* Modes Section */}
      <div id="modes" className="flex flex-col items-center mt-40">
        <TextGenerateEffect words="Try another Mode" className="text-center text-[40px] md:text-5xl lg:text-6xl mt-20" />
        <div className="w-full flex justify-center mt-10">
          <div className="flex flex-row items-center justify-center gap-10">
            {modeCards.map((card, idx) => (
              <CardSpotlight key={idx} className="h-96 w-96 flex flex-col items-center justify-between p-4">
                <div className="flex flex-col items-center justify-center text-center mt-4">
                  <p className="relative text-xl font-bold text-white">{card.title}</p>
                  <img src={card.img} alt={card.title} width={220} height={220} className="relative object-cover w-full h-64 mt-4" />
                </div>
                <button
                  className="relative mt-auto px-5 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold"
                  onClick={() => {
                    if (card.title.includes("CV")) setCurrentMode("cv");
                    else if (card.title.includes("NLP")) setCurrentMode("nlp");
                    else setCurrentMode("normal");
                  }}
                >
                  Start
                </button>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative flex flex-col items-center justify-center py-40  dark:bg-black-100">
        <TextGenerateEffect words="What People Say About My Work" className="text-center text-[40px] md:text-5xl lg:text-6xl" />
        <div className="h-[30rem] w-full max-w-6xl rounded-md flex flex-col antialiased bg-white dark:bg-black-100 dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden ">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />

        </div>
      </section>

{/* Timeline Section */}
<div
  id="timeline"
  className="relative flex flex-col items-center justify-center min-h-[100vh] -top-10  px-4 bg-gradient-to-b"
>
  {/* Title */}
  <TextGenerateEffect
    words="Timeline"
    className="text-center text-[40px] md:text-5xl lg:text-6xl mb-10 text-white"
  />

  {/* Zigzag Circles */}
  <div className="flex flex-col gap-12">
    {items.map((item, idx) => {
      // --- params you can tweak ---
      const cycle = 5;          // pattern length (up then down)
      const stepPx = 60;        // horizontal shift per step (px)
      // --------------------------------

      const posInCycle = idx % cycle; // 0..9
      const offsetSteps = posInCycle <= cycle / 2
        ? posInCycle
        : cycle - posInCycle;

      const blockIndex = Math.floor(idx / cycle);
      const side = blockIndex % 2 === 0 ? -1 : 1; 

      const translateX = side * offsetSteps * stepPx; // px

      const justifyClass = translateX <= 0 ? "justify-start" : "justify-end";

      return (
        <div key={idx} className={`flex ${justifyClass}`}>
          <LinkPreview url={item.url} className="block">
            <motion.div
              // x is static offset (px), y is the floating animation
              animate={{ x: translateX, y: [0, -8, 0] }}
              transition={{
                x: { duration: 0.4 }, // small smoothing for x (instantish)
                y: { duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
              }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-cyan-500 to-purple-500 shadow-lg"
            >

              {item.name}
            </motion.div>
          </LinkPreview>
        </div>
      );
    })}
</div>



</div>


      {/* Contact Section */}
      <section id="contact" className="relative flex flex-col items-center justify-center min-h-screen py-20 overflow-hidden">
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }} className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-cyan-400 glow-neon mb-10">Thank you for visiting my journey</h2>
          <div className="flex flex-row gap-8">
            {contactIcons.map((icon, idx) => (
              <motion.a key={idx} href={icon.href} target="_blank" whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.95 }} className="relative w-20 h-20 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:shadow-cyan-500/50 transition-shadow duration-300">
                <img src={icon.icon} alt={icon.name} className="w-10 h-10" />
                <span className="absolute w-24 h-24 rounded-full bg-cyan-400 opacity-20 animate-ping"></span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Hero;
