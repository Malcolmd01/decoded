"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// --- Wave shape ---
// generateWavePath() creates a random wave path by varying only the Y control
// points while keeping X positions fixed — required for SVG morphing to work.
//
// To raise/lower the whole wave:  change `base` (currently 540).
//   540 = wave sits ~60% down the 900-unit viewBox. Lower = higher on screen.
//
// To increase wave amplitude (bigger crests/troughs):
//   Increase `spread` (currently 150 = ±150 units from base).
//   e.g. 200 = more dramatic peaks/troughs.
//
// Six keyframe paths are generated per layer after mount (useEffect) so that
// Math.random() never runs on the server — avoids SSR/client hydration mismatch.
// Framer Motion morphs through them with repeatType:"mirror" (reverses back
// through the sequence) so there is no jump at the loop boundary.
//
// The two layers use independent path sets and different durations (28s / 22s)
// so they slowly drift in and out of phase for an organic, non-repeating look.
function generateWavePath(): string {
  const base = 700;
  const spread = 250;
  const r = () => Math.round((Math.random() * base) + (Math.random() - 0.5) * 2 * spread);
  return `M0,${r()} C360,${r()} 720,${r()} 1080,${r()} C1260,${r()} 1380,${r()} 1440,${r()} L1440,900 L0,900 Z`;
}

// mirror loops back through the keyframes in reverse — no jump at loop point
const makeTransition = (duration: number) =>
  ({
    repeat: Infinity,
    repeatType: "mirror",
    // --- Speed ---
    // duration: seconds for one full pass through all keyframes (A → F).
    // Lower = faster wave. Recommended range: 16 (fast) – 40 (slow).
    duration,
    ease: "easeInOut",
  }) as const;

// Static starting path rendered on the server and used as the first keyframe.
// Must match on both server and client to avoid hydration mismatch.
const STATIC_PATH =
  "M0,540 C360,420 720,660 1080,540 C1260,450 1380,590 1440,540 L1440,900 L0,900 Z";

export function HeroWave() {
  const reduced = useReducedMotion();

  // Start with the static path on both server and client (hydration-safe).
  // After mount, replace with random keyframe arrays so Math.random() never
  // runs during SSR. Batched into one object to satisfy react-hooks/set-state-in-effect.
  const [wavePaths, setWavePaths] = useState<{ ambient: string[]; mid: string[] }>({
    ambient: [STATIC_PATH],
    mid: [STATIC_PATH],
  });

  // Client-only init — Math.random() must not run on the server (hydration mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWavePaths({
      ambient: Array.from({ length: 6 }, generateWavePath),
      mid: Array.from({ length: 6 }, generateWavePath),
    });
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* --- Blur / softness ---
            stdDeviation controls how far the glow spreads.
            Higher = softer/more diffuse (like the original bg image).
            Lower = harder edge, more visible wave shape.

            Ambient: recommended range 60–120
            Mid:     recommended range 20–50                          */}
          <filter id="hero-glow-ambient" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="90" />
          </filter>
          <filter id="hero-glow-mid" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="35" />
          </filter>
        </defs>

        {/* --- Ambient layer ---
          Wide, heavy blur. Creates the deep red bloom visible in the upper
          portion of the glow. Raise opacity (0–1) to intensify the halo.   */}
        <motion.path
          fill="rgb(232 26 45)"
          opacity={0.25}
          filter="url(#hero-glow-ambient)"
          d={wavePaths.ambient[0]}
          animate={reduced ? undefined : { d: wavePaths.ambient }}
          transition={makeTransition(15)}
        />

        {/* --- Definition layer ---
          Tighter blur. Gives the wave its readable shape and bright core.
          Raise opacity to make the wave more vivid / punchy.               */}
        <motion.path
          fill="rgb(232 26 45)"
          opacity={0.65}
          filter="url(#hero-glow-mid)"
          d={wavePaths.mid[0]}
          animate={reduced ? undefined : { d: wavePaths.mid }}
          transition={makeTransition(22)}
        />
      </svg>
    </div>
  );
}

// ● SVG is at public/hero-wave.svg — open it directly in a browser or drag
//   it into Figma/Illustrator to visualize the static first frame.

//   Quick reference for tuning in HeroWave.tsx:

//   ┌─────────────┬───────────────────┬────────────────────────────────┐
//   │    What     │       Where       │             Effect             │
//   ├─────────────┼───────────────────┼────────────────────────────────┤
//   │ Wave height │ base in           │ Lower number = wave sits       │
//   │             │ generateWavePath  │ higher on screen               │
//   ├─────────────┼───────────────────┼────────────────────────────────┤
//   │ Wave        │ spread in         │ Higher = bigger                │
//   │ amplitude   │ generateWavePath  │ crests/troughs                 │
//   ├─────────────┼───────────────────┼────────────────────────────────┤
//   │ Speed       │ makeTransition()  │ Lower = faster (16–40 range)   │
//   │             │ durations: 28/22  │                                │
//   ├─────────────┼───────────────────┼────────────────────────────────┤
//   │ Softness    │ stdDeviation in   │ Higher = softer glow (ambient: │
//   │             │ filters           │  60–120, mid: 20–50)           │
//   ├─────────────┼───────────────────┼────────────────────────────────┤
//   │ Intensity   │ opacity on each   │ 0–1, raise to make glow more   │
//   │             │ path              │ vivid                          │
//   └─────────────┴───────────────────┴────────────────────────────────┘
