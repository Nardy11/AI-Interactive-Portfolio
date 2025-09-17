import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SkillBubbleProps {
  title: string;
  skills?: string[];
  width?: number; // central bubble width
  height?: number; // central bubble height
  skillSize?: number; // child bubble size
  radius?: number; // orbit radius
  orbitDuration?: number; // seconds for full orbit
}

const SkillBubble: React.FC<SkillBubbleProps> = ({
  title,
  skills = [],
  width = 96,
  height = 96,
  skillSize = 64,
  radius = 100,
  orbitDuration = 10,
}) => {
  const [open, setOpen] = useState(false);
  const [angles, setAngles] = useState<number[]>(skills.map((_, i) => (i / skills.length) * Math.PI * 2));

  // Update angles continuously to animate orbit
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setAngles((prev) =>
        prev.map((angle) => angle + (2 * Math.PI) / (orbitDuration * 60)) // approx 60fps
      );
    }, 16);

    return () => clearInterval(interval);
  }, [open, orbitDuration]);

  // Floating animation for central bubble
  const floatAnimation = {
    y: ["0%", "-10%", "0%"],
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
  };

  return (
    <div className="relative flex justify-center items-center w-[400px] h-[400px]">
      {/* Central Bubble */}
      <motion.div
        className="rounded-full text-white flex items-center justify-center cursor-pointer"
        style={{
          width,
          height,
          backgroundImage: `url('/bubble.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        onClick={() => setOpen(!open)}
        animate={floatAnimation}
      >
      <span
        className="absolute text-white font-bold pointer-events-none "
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        {title}
      </span>      </motion.div>

      {/* Skill Bubbles */}
      {skills.map((skill, index) => (
        <motion.div
          key={skill}
          className="absolute top-1/2 left-1/2 flex items-center justify-center"
          style={{
            width: skillSize,
            height: skillSize,
            marginLeft: -skillSize / 2,
            marginTop: -skillSize / 2,
            x: open ? Math.cos(angles[index]) * radius : 0,
            y: open ? Math.sin(angles[index]) * radius : 0,
            backgroundImage: `url('/bubble.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Content stays upright */}
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white"
            style={{ width: skillSize, height: skillSize }}
          >
            {skill}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkillBubble;
