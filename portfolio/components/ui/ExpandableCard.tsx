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

  // Dictionary of project lists
  const projectLists: Record<string, Card[]> = {
    "ML": [
      {
        description: "Machine Learning Project 1",
        title: "Image Classifier",
        src: "https://placehold.co/400x200/png",
        ctaText: "View Repo",
        ctaLink: "https://github.com/example/ml1",
        content: () => <p>A CNN for classifying images into categories.</p>,
      },
      {
        description: "Machine Learning Project 2",
        title: "Stock Predictor",
        src: "https://placehold.co/400x200/png",
        ctaText: "View Repo",
        ctaLink: "https://github.com/example/ml2",
        content: () => <p>Predicting stock trends using LSTMs and time-series data.</p>,
      },
    ],
    "Game Dev": [
      {
        description: "2D Platformer Game",
        title: "JumpQuest",
        src: "https://placehold.co/400x200/png",
        ctaText: "Play",
        ctaLink: "https://example.com/game1",
        content: () => <p>A fun platformer built with Unity and C#.</p>,
      },
    ],
    "Web Dev": [
      {
        description: "Portfolio Website",
        title: "My Portfolio",
        src: "https://placehold.co/400x200/png",
        ctaText: "Visit",
        ctaLink: "https://example.com",
        content: () => <p>A responsive portfolio built with React and TailwindCSS.</p>,
      },
    ],
    "App Dev": [
      {
        description: "Cross-platform App",
        title: "Task Manager",
        src: "https://placehold.co/400x200/png",
        ctaText: "Download",
        ctaLink: "https://play.google.com/store/apps/details?id=taskmanager",
        content: () => <p>A task manager app built with Flutter.</p>,
      },
    ],
  };

  // Get the cards for the selected category
  const cards = projectLists[selected ?? ""] ?? [];

  // Automatically open the first card when selected changes
  useEffect(() => {
    if (cards.length > 0) {
      setActive(null); // reset modal
    }
  }, [selected]);

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
    <div className="w-full max-w-3xl mx-auto">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl shadow hover:shadow-lg transition"
        >
          ← Back
        </button>
      )}

      {/* Card Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => setActive(card)}
          >
            <img src={card.src} alt={card.title} className="rounded-lg mb-2" />
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              ref={ref}
              layoutId={`card-${id}-${active.title}`}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 relative shadow-lg">
                <button
                  onClick={() => setActive(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"
                >
                  ✕
                </button>
                <img src={active.src} alt={active.title} className="rounded-lg mb-4" />
                <h2 className="text-2xl font-bold mb-2">{active.title}</h2>
                <p className="mb-4">{active.description}</p>
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
