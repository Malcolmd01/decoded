"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAnimate, useInView, motion } from "framer-motion";
import { BrutalismIcon } from "@/components";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Format } from "./formats.data";

// direction: top-to-bottom — row 0 fades first, last row last
// White layer (top):  per-cell with small NEGATIVE jitter (BLEED) — some cells
//                     clear slightly early, exposing red BELOW the scan line
// Red layer (below):  per-cell with positive jitter — fragments linger ABOVE
//
// REVEAL_DURATION: seconds for the wave to travel top → bottom
// WHITE_DUR:       each white cell's fade duration (short = sharp edge)
// RED_DUR:         each red cell's fade duration (longer = lingers)
// JITTER:          max extra delay on red  → linger above the line
// BLEED:           max early-start on white → bleed red below the line

const GRID        = 15;
const CELLS       = Array.from({ length: GRID * GRID }, (_, i) => i);
const PIXEL_COLOR = "rgb(232, 26, 45)";

const REVEAL_DELAY    = 1;
const REVEAL_DURATION = 0.9;
const WHITE_DUR       = 0.1;
const RED_DUR         = 0.1;
const JITTER          = 0.1;   
const BLEED           = 0.18;  

const GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: `repeat(${GRID}, 1fr)`,
  gridTemplateRows:    `repeat(${GRID}, 1fr)`,
} as const;

type Props = { 
  format: Format; 
  priority?: boolean;
  index: number;
};

export function FormatCard({ format, priority = false, index }: Props) {
  const articleRef = useRef<HTMLElement>(null);
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();
// 1. Lazy-trigger visibility checking to prevent off-screen computation
  const inView  = useInView(articleRef, { once: true, margin: "0px 0px 200px 0px" });  
  // Track when the slide-in translation has finished
  const [isSlideComplete, setIsSlideComplete] = useState(false);

  useEffect(() => {
    if (!inView) return;

    // 1. Text Scoped Animations
    if (reduced) {
      animate("[data-animate-text]", { opacity: 1, y: 0 }, { duration: 0 });
    } else {
      animate(
        "[data-animate-text]",
        { opacity: [0, 1], y: [-24, 0] },
        { 
          duration: 0.9, 
          delay: (idx) => idx * 0.4, 
          ease: [0.215, 0.610, 0.355, 1.000] 
        }
      );
    }

    // 2. Pixel Reveal Grid Logic
    if (reduced) return;

    CELLS.forEach((idx) => {
      const row      = Math.floor(idx / GRID);
      const progress = row / (GRID - 1);
      const base     = REVEAL_DELAY + progress * REVEAL_DURATION;

      // White: subtract a random bleed offset — clears early, briefly exposing red below the scan line
      animate(
        scope.current.querySelector(`[data-white][data-idx="${idx}"]`),
        { opacity: 0 },
        { duration: WHITE_DUR, delay: base - Math.random() * BLEED, ease: "easeOut" }
      );

      // Red: add a random jitter delay — fragments linger above the scan line
      animate(
        scope.current.querySelector(`[data-red][data-idx="${idx}"]`),
        { opacity: 0 },
        { duration: RED_DUR, delay: base + Math.random() * JITTER, ease: "easeOut" }
      );
    });
  }, [inView, reduced, animate, scope]);

  const initialX = reduced ? 0 : index % 2 === 0 ? -180 : 180;

  return (
    //remove this animation for mobile screens 
    <motion.article
      ref={articleRef}
      // initial={{ opacity: 1, x: initialX }}
      // whileInView={{ opacity: 1, x: 0 }}
      // viewport={{ once: true}}
      // transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      // onAnimationComplete={() => setIsSlideComplete(true)}
      className="grid w-full grid-cols-1 gap-10 rounded-2xl bg-black p-5 text-white md:grid-cols-2 md:gap-16 md:p-[30px]"
    >
      <div ref={scope} className="contents">
        <div className="order-last flex flex-col justify-between gap-8 md:order-first md:h-[32px]">
          <div className="flex flex-col gap-3">
            <div data-animate-text className="flex items-center gap-2 text-white opacity-0">
              <BrutalismIcon className="size-[20px]" />
              <span className="font-body text-base font-bold">{format.name}</span>
            </div>
            <h3 data-animate-text className="font-headline text-3xl font-semibold leading-[1.05] tracking-tight md:text-4xl opacity-0">
              {format.headline}
            </h3>
          </div>
          <p data-animate-text className="font-body text-[16px] font-normal leading-relaxed text-white md:text-lg opacity-0">
            {format.description}
          </p>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={`/${format.name.toLowerCase().replace(/\s/g, "-")}.png`}
            fill
            alt=""
            aria-hidden
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority={priority}
          />

          {!reduced && (
            <div aria-hidden className="pointer-events-none absolute inset-0">
            {/* Red layer — underneath white, lingers above + bleeds below the line */}
              <div className="absolute inset-0" style={GRID_STYLE}>
                {CELLS.map((i) => (
                  <div
                    key={i}
                    data-red
                    data-idx={i}
                    style={{ backgroundColor: PIXEL_COLOR }}
                  />
                ))}
              </div>

            {/* White layer — on top, per-cell with early bleed */}
              <div className="absolute inset-0" style={GRID_STYLE}>
                {CELLS.map((i) => (
                  <div
                    key={i}
                    data-white
                    data-idx={i}
                    style={{ backgroundColor: "rgb(255, 255, 255)" }}
                  />
                ))}
              </div>

              {/* Solid white masking block that disappears ONLY after sliding stops */}
              {/* {!isSlideComplete && (
                <div 
                  className="absolute inset-0 bg-white z-10" 
                  style={{ content: '""' }}
                />
              )} */}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}