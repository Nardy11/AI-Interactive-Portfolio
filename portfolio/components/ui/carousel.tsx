"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useId } from "react";
import { ExpandableCardDemo } from "./ExpandableCard"; // 👈 import expandable cards

interface SlideData {
  title: string;
  button: string;
  src?: string;
  color?: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  total: number;
  onSelect: (title: string) => void; // 👈 new prop
}

const Slide = ({ slide, index, current, total, onSelect }: SlideProps) => {
  const angle = 360 / total;

  return (
    <li
      className="absolute w-[52vmin] h-[52vmin] flex items-center justify-center text-center"
      style={{
        transform: `rotateY(${index * angle}deg) translateZ(26vmin)`,
      }}
    >
      <div
        className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg transition-opacity duration-700  ${
          current === index ? "opacity-100 scale-100" : "opacity-50 scale-90"
        }`}
        style={{ backgroundColor: slide.color || "transparent" }}
      >
        {slide.src && (
          <img
            src={slide.src}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black/40 px-4">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center break-words">
            {slide.title}
          </h2>

          {slide.button.trim() !== "" && (
            <button
              className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:shadow-md transition"
              onClick={() => onSelect(slide.title)} // 👈 send title to parent
            >
              {slide.button}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

interface CarouselControlProps {
  type: "previous" | "next";
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center justify-center mx-2 bg-neutral-200 dark:bg-neutral-800 rounded-full hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null); // 👈 track selection
  const id = useId();

  const handlePreviousClick = () => {
    setCurrent((prev) => prev - 1);
  };

  const handleNextClick = () => {
    setCurrent((prev) => prev + 1);
  };

  if (selected) {
    // 👈 show ExpandableCardDemo when something is selected
    return (
      <ExpandableCardDemo
        selected={selected}
        onBack={() => setSelected(null)} // back button
      />
    );
  }

  return (
    <div
      className="relative w-[52vmin] h-[52vmin] mx-auto [perspective:3600px]"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="absolute w-full h-full [transform-style:preserve-3d] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `rotateY(-${current * (360 / slides.length)}deg)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={((current % slides.length) + slides.length) % slides.length}
            total={slides.length}
            onSelect={setSelected} // 👈 pass down
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
