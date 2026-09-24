"use client";
import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { LampContainer } from "./ui/lamp";
import { TypewriterEffect } from "./ui/TypewriterEffectSmooth";
import { BackgroundGradient } from "./ui/background-gradient";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Hero from "./Hero";
import type { Mode } from "./Hero";

/** Welcome offers a third choice, "normal", which leaves Hero and goes to the dashboard. */
type WelcomeMode = Mode | "normal";

const Welcome = () => {
  const [showHero, setShowHero] = useState(false);
  const [selectedMode, setSelectedMode] = useState<WelcomeMode>("normal");

  const words = [
    { text: "Welcome" }, { text: "to" }, { text: "my" }, { text: "portfolio." },
    { text: "Please" }, { text: "select" }, { text: "how" }, { text: "you" },
    { text: "would" }, { text: "like" }, { text: "to" }, { text: "navigate" },
    { text: "it." },
  ];

  const cards = [
    { title: <>Navigate Using Computer Vision<br /><br /></>, img: "/cv.png", mode: "cv" },
    { title: <>Normal Navigation<br /><br /><br /></>, img: "/normal_navigation.png", mode: "normal" },
    { title: <>Navigate Using NLP Assistant</>, img: "/nlp_assistant.png", mode: "nlp" },
  ];

  useEffect(() => {
    if (showHero) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showHero]);

  return (
    <AnimatePresence mode="wait">
      {!showHero && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto -top-14"
        >
          <LampContainer>
            <motion.div layoutId="avatar">
              <BackgroundGradient
                className="w-36 h-36 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 m-1"
                containerClassName="rounded-full"
              >
                <img
                  src="/picprofile.png"
                  alt="my profile pic"
                  width={220}
                  height={220}
                  className="object-cover w-full h-full rounded-full"
                />
              </BackgroundGradient>
            </motion.div>
            <div className="text-center w-full max-w-3xl px-4 sm:px-0 translate-y-9">
              <TypewriterEffect words={words} />
            </div>
          </LampContainer>

          <CardContainer className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-5 px-4 sm:px-6 md:px-4 -top-64">
            {cards.map((card, idx) => (
              <CardBody
                key={idx}
                className="group relative flex flex-col bg-gray-50 dark:bg-black border border-black/10 dark:border-white/20 rounded-xl p-3 sm:p-4 w-full max-w-[330px] md:flex-1 md:max-w-[300px] hover:scale-105 transition-transform"
              >
                <CardItem
                  translateZ="50"
                  className="text-lg sm:text-xl font-bold text-neutral-700 dark:text-white mb-1"
                >
                  {card.title}
                </CardItem>
                <CardItem translateZ="100" className="w-full mb-2">
                  <img
                    src={card.img}
                    alt="thumbnail"
                    className="h-36 sm:h-44 w-full object-cover rounded-xl transition-shadow group-hover:shadow-xl"
                  />
                </CardItem>
                <div className="flex justify-center mt-auto">
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-5 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold"
                    onClick={() => {
                      setSelectedMode(card.mode as WelcomeMode);
                      setShowHero(true);
                    }}
                  >
                    Start
                  </CardItem>
                </div>
              </CardBody>
            ))}
          </CardContainer>
        </motion.div>
      )}

      {showHero && (
        <motion.div
          key="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full min-h-screen"
        >
          <motion.div layoutId="avatar">
            <Hero initialMode={selectedMode === "normal" ? "cv" : selectedMode} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Welcome;
