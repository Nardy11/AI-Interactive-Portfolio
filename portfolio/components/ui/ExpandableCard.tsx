"use client";

import React, { JSX, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../hooks/use-outside-click";

interface Card {
  description: string;
  title: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  content: () => JSX.Element;
}

interface ExpandableCardDemoProps {
  selected?: string | null;
  onBack?: () => void;
}

export function ExpandableCardDemo({ selected, onBack }: ExpandableCardDemoProps) {
  const [active, setActive] = useState<Card | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  // Project lists by category

const projectLists: Record<string, Card[]> = {
  "ML": [
    {
      description: "Machine Learning Project 1",
      title: "Heart Failure Prediction",
      src: "./ML.png",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/Heart_Failure_prediction",
      content: () => (
        <p>
          Healthcare-focused ML project with <b>data cleaning</b>, <b>feature engineering</b>, 
          <b>PCA</b>, <b>clustering (K-Means, Hierarchical)</b>, and <b>classification models</b> like 
          <b>Logistic Regression</b>, <b>Random Forest</b>, and <b>SVM</b>. 
          Evaluated using <b>accuracy</b>, <b>precision</b>, <b>recall</b>, <b>F1-score</b> with <b>GridSearchCV</b>.
        </p>
      ),
    },
    {
      description: "Machine Learning Project 2",
      title: "CPAC Bachelor Project",
      src: "./Distance_stereo.jpeg",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/CPAC-Bachelor-Project",
      content: () => (
        <p>
          A <b>computer vision</b> project with <b>YOLOv5</b>, <b>YOLOv8</b>, and <b>TensorFlow 2</b> for <b>object detection</b>, 
          combined with <b>optical flow tracking</b>, <b>motion prediction</b>, and <b>lane detection</b>. 
          Integrated <b>stereo/ZED cameras</b>, <b>LiDAR</b>, and <b>ROS</b> for autonomous driving tasks.
        </p>
      ),
    },
    {
      description: "Machine Learning Project 3",
      title: "Mentorness Internship",
      src: "./data analysis.png",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/Mentorness",
      content: () => (
        <p>
          Internship projects with <b>machine learning experiments</b>, <b>data analysis</b>, 
          <b>SQL</b>, <b>PowerBI</b>, and <b>data cleaning</b>.
        </p>
      ),
    },
  ],

  "App Dev": [
    {
      description: "Flutter Project 1",
      title: "E-Commerce Application",
      src: "./E-commerce App.png",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/Code_Alpha_E_COMMERCE_APPLICATION",
      content: () => (
        <p>
          Built with <b>React Native</b> and <b>Firebase</b>, featuring <b>authentication</b>, <b>product catalog</b>, and <b>cart system</b>.
        </p>
      ),
    },
    {
      description: "Flutter Project 2",
      title: "Climate Edge Company App",
      src: "./ESG&.png",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/Climate-Edge-Company-Flutter-app-web",
      content: () => (
        <p>
          Developed a <b>Flutter + Firebase</b> web app for monitoring <b>industrial pollution</b> with 
          <b>secure login</b>, <b>data submission workflows</b>, <b>pollution calculator</b>, and 
          <b>responsive UI (Figma)</b>. Focus on <b>sustainability</b> and <b>environmental compliance</b>.
        </p>
      ),
    },
    {
      description: "Flutter Project 3",
      title: "eesCalculator",
      src: "./eesCalculator.jpeg",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/eesCalculator",
      content: () => (
        <p>
          A <b>scientific calculator app</b> with <b>Flutter</b>, <b>Firebase</b>, and <b>product data storage</b>.
        </p>
      ),
    },
  ],

  "Web Dev": [
    {
      description: "Web Development Project 1",
      title: "Gaming Website",
      src: "./Gaming Web.jpeg",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/gaming-web",
      content: () => (
        <p>
          Interactive website using <b>HTML</b>, <b>CSS</b>, <b>JavaScript</b> with simple games (<b>RPS</b>, <b>XO</b>).
        </p>
      ),
    },
    {
      description: "Web Development Project 2",
      title: "El7a2ni Virtual Clinic",
      src: "./Clinic Webs.png",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/Aplus-Cant-Lose-Clinic",
      content: () => (
        <p>
          Full-stack app with <b>React</b>, <b>Redux</b>, <b>Node.js</b>, <b>Express</b>, <b>MongoDB</b>, and <b>Stripe payments</b>. 
          Features include <b>patient-doctor management</b>, <b>appointments</b>, <b>chat/video calls</b>, and 
          <b>admin dashboards</b>. Built with <b>Material-UI</b>, <b>Postman testing</b>, and <b>CI/CD (GitHub Actions)</b>.
        </p>
      ),
    },
  ],

  "Game Dev": [
    {
      description: "Game Development Project 1",
      title: "Marvel Game (Java OOP)",
      src: "./OOP.png",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/Marvel-Game-using-Java-OOP",
      content: () => (
        <p>
          Java <b>OOP</b> game inspired by Marvel characters with <b>object-oriented design patterns</b>.
        </p>
      ),
    },
    {
      description: "Game Development Project 2",
      title: "Diablo Crimson Abyss",
      src: "./Diablo.png",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/DiabloCrimsonAbyss",
      content: () => (
        <p>
          Action RPG built in <b>Unity</b> with <b>dynamic environments</b> and <b>RPG mechanics</b>.
        </p>
      ),
    },
    {
      description: "Game Development Project 3",
      title: "VR Project for L’Oreal",
      src: "./Loreal.png",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/Project_VR_L-Oreal",
      content: () => (
        <p>
          Immersive <b>VR experience</b> for L’Oreal using <b>Unity</b> and <b>AI-generated characters</b>.
        </p>
      ),
    },
    {
      description: "Game Development Project 4",
      title: "AR Project Of Yu-Gi-Oh",
      src: "./AR.png",
      ctaText: "View Repo",
      ctaLink: "https://github.com/Nardy11/Yu-Gi-Oh-Project-AR/tree/master",
      content: () => (
        <p>
          <b>AR experience</b> with <b>Unity</b> and <b>marker-based tracking</b> for Yu-Gi-Oh! project.
        </p>
      ),
    },
  ],
};


  // Get the cards for the current category
  const cards = projectLists[selected ?? ""] ?? [];

  // Reset active card when category changes
  useEffect(() => {
    setActive(null);
  }, [selected]);

  // Escape key + body scroll lock
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(false);
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
<div className="w-full max-w-3xl mx-auto">      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl shadow hover:shadow-lg transition"
        >
          ← Back
        </button>
      )}

      {/* Overlay background */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 h-full w-full z-40"
          />
        )}
      </AnimatePresence>

      {/* Expanded modal */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <div className="fixed inset-0 grid place-items-center z-50">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-lg h-fit flex flex-col bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Close button */}
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>

              {/* Image */}
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  src={active.src}
                  alt={active.title}
                  className="w-full h-64 object-cover"
                />
              </motion.div>

              {/* Content */}
              <div className="p-6">
                <motion.h3
                  layoutId={`title-${active.title}-${id}`}
                  className="text-xl font-bold mb-2"
                >
                  {active.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${active.description}-${id}`}
                  className="text-gray-600 dark:text-gray-400 mb-4"
                >
                  {active.description}
                </motion.p>
                {active.content()}
                <a
                  href={active.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                >
                  {active.ctaText}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card grid */}
      <ul className="max-w-3xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
          >
            <motion.div layoutId={`image-${card.title}-${id}`}>
              <img
                src={card.src}
                alt={card.title}
                className="h-40 w-full rounded-lg object-cover"
              />
            </motion.div>
            <div className="mt-2">
              <motion.h3
                layoutId={`title-${card.title}-${id}`}
                className="text-lg font-semibold"
              >
                {card.title}
              </motion.h3>
              <motion.p
                layoutId={`description-${card.description}-${id}`}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {card.description}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </ul>
    </div>
  );
}

