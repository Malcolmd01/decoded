"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const RED = "rgb(232 26 45)";

// SVG paths span 2880 units (2× the 1440 viewBox) with the wave repeating at x=1440.
// Animating translateX 0% → -50% scrolls exactly one repeat width → seamless loop.
// CSS filter:blur() sits on the wrapper div (GPU composited); SVG itself is static.

const AMBIENT_PATH =
  "M0,640 C180,580 540,700 720,640 C900,580 1260,700 1440,640 " +
  "C1620,580 1980,700 2160,640 C2340,580 2700,700 2880,640 L2880,900 L0,900 Z";

const MID_PATH =
  "M0,700 C180,650 540,750 720,700 C900,650 1260,750 1440,700 " +
  "C1620,650 1980,750 2160,700 C2340,650 2700,750 2880,700 L2880,900 L0,900 Z";

export function HeroWave() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 2, ease: "easeIn" }}
    >
      {/* Ambient layer — wide soft glow */}
      <motion.div
        className="absolute bottom-0 left-0 h-full"
        style={{ width: "200%", filter: "blur(90px)", opacity: 0.25 }}
        animate={reduced ? undefined : { x: ["0%", "-50%"], y: [0, -40, 0] }}
        transition={{
          x: { repeat: Infinity, duration: 20, ease: "linear" },
          y: { repeat: Infinity, repeatType: "mirror", duration: 15, ease: "easeInOut" },
        }}
      >
        <svg viewBox="0 0 2880 900" preserveAspectRatio="none" className="h-full w-full">
          <path fill={RED} d={AMBIENT_PATH} />
        </svg>
      </motion.div>

      {/* Definition layer — tighter glow, different scroll speed → organic drift */}
      <motion.div
        className="absolute bottom-0 left-0 h-full"
        style={{ width: "200%", filter: "blur(35px)", opacity: 0.65 }}
        animate={reduced ? undefined : { x: ["0%", "-50%"], y: [20, -30, 60] }}
        transition={{
          x: { repeat: Infinity, duration: 15, ease: "linear" },
          y: { repeat: Infinity, repeatType: "mirror", duration: 22, ease: "easeInOut" },
        }}
      >
        <svg viewBox="0 0 2880 900" preserveAspectRatio="none" className="h-full w-full">
          <path fill={RED} d={MID_PATH} />
        </svg>
      </motion.div>
    </motion.div>
  );
}
