"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const RED   = "rgb(232 26 45)";
const W     = 1440;
const H     = 900;
const COUNT = 10; // fixed peak count — required for path morphing

// Builds a path with exactly COUNT interior peaks.
// xs are fixed across all keyframe calls so morphing only interpolates y.
function buildKeyframes(
  xs:    number[],
  n:     number,
  baseY: number,
  minY:  number,
  maxY:  number,
): string[] {
  return Array.from({ length: n }, () => {
    const pts: [number, number][] = [[0, baseY]];

    for (let i = 0; i < COUNT; i++) {
      const y = Math.round(minY + Math.random() * (maxY - minY));
      pts.push([xs[i], y]);
    }
    pts.push([W, baseY]);

    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const dx       = Math.round((x1 - x0) / 3);
      d += ` C${x0 + dx},${y0} ${x1 - dx},${y1} ${x1},${y1}`;
    }
    return `${d} L${W},${H} L0,${H} Z`;
  });
}

function makeXs(): number[] {
  const step = W / (COUNT + 1);
  return Array.from({ length: COUNT }, (_, i) =>
    Math.round((i + 1) * step + (Math.random() - 0.5) * step * 0.3),
  );
}

type WaveCfg = {
  ambientPaths: string[];
  midPaths:     string[];
  ambientDur:   number;
  midDur:       number;
};

export function HeroWave() {
  const reduced       = useReducedMotion();
  const [cfg, setCfg] = useState<WaveCfg | null>(null);

  useEffect(() => {
    setCfg({
      ambientPaths: buildKeyframes(makeXs(), 3, 640, 400, 810),
      midPaths:     buildKeyframes(makeXs(), 3, 700, 460, 860),
      ambientDur:   5  + Math.random() * 7,
      midDur:       7  + Math.random() * 9,
    });
  }, []);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reduced ? 0 : 1, duration: 2, ease: "easeIn" }}
    >
      {cfg && (
        <>
          {/* Ambient layer — wide soft glow */}
          <div className="absolute bottom-0 left-0 h-full w-full" style={{ filter: "blur(90px)", opacity: 0.25 }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full">
              <motion.path
                fill={RED}
                d={cfg.ambientPaths[0]}
                animate={reduced ? undefined : { d: cfg.ambientPaths }}
                transition={{ d: { repeat: Infinity, repeatType: "mirror", duration: cfg.ambientDur, ease: "easeInOut" } }}
              />
            </svg>
          </div>

          {/* Definition layer — tighter glow, different period → organic drift */}
          <div className="absolute bottom-0 left-0 h-full w-full" style={{ filter: "blur(35px)", opacity: 0.65 }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full">
              <motion.path
                fill={RED}
                d={cfg.midPaths[0]}
                animate={reduced ? undefined : { d: cfg.midPaths }}
                transition={{ d: { repeat: Infinity, repeatType: "mirror", duration: cfg.midDur, ease: "easeInOut" } }}
              />
            </svg>
          </div>
        </>
      )}
    </motion.div>
  );
}
