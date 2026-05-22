"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useAnimate, useInView } from "framer-motion";
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

const GRID        = 20;
const CELLS       = Array.from({ length: GRID * GRID }, (_, i) => i);
const PIXEL_COLOR = "rgb(232, 26, 45)";

const REVEAL_DELAY    = 0.2;
const REVEAL_DURATION = 0.9;
const WHITE_DUR       = 0.1;
const RED_DUR         = 0.1;
const JITTER          = 0.1;   // red lingers this many seconds above the line
const BLEED           = 0.18;  // white clears up to this many seconds early → red bleeds below

const GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: `repeat(${GRID}, 1fr)`,
  gridTemplateRows:    `repeat(${GRID}, 1fr)`,
} as const;

type Props = { format: Format; priority?: boolean };

export function FormatCard({ format, priority = false }: Props) {
  const articleRef = useRef<HTMLElement>(null);
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();
  const inView  = useInView(articleRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!inView || reduced) return;

    CELLS.forEach((idx) => {
      const row      = Math.floor(idx / GRID);
      const progress = row / (GRID - 1);
      const base     = REVEAL_DELAY + progress * REVEAL_DURATION;

      // White: subtract a random bleed offset — some cells clear early,
      // briefly exposing red in the rows just below the scan line
      // eslint-disable-next-line react-hooks/set-state-in-effect
      animate(
        scope.current.querySelector(`[data-white][data-idx="${idx}"]`),
        { opacity: 0 },
        { duration: WHITE_DUR, delay: base - Math.random() * BLEED, ease: "easeOut" }
      );

      // Red: add a random jitter delay — fragments linger above the line
      // eslint-disable-next-line react-hooks/set-state-in-effect
      animate(
        scope.current.querySelector(`[data-red][data-idx="${idx}"]`),
        { opacity: 0 },
        { duration: RED_DUR, delay: base + Math.random() * JITTER, ease: "easeOut" }
      );
    });
  }, [inView, reduced, animate, scope]);

  return (
    <article
      ref={articleRef}
      className="grid w-full grid-cols-1 gap-10 rounded-2xl bg-black p-5 text-white md:grid-cols-2 md:gap-16 md:p-[30px]"
    >
      <div className="order-last flex flex-col justify-between gap-8 md:order-first md:h-[32px]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white">
            <BrutalismIcon className="size-[20px]" />
            <span className="font-body text-base font-bold">{format.name}</span>
          </div>
          <h3 className="font-headline text-3xl font-semibold leading-[1.05] tracking-tight md:text-4xl">
            {format.headline}
          </h3>
        </div>
        <p className="font-body text-[16px] font-normal leading-relaxed text-white md:text-lg">
          {format.description}
        </p>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src="/placeholder.jpg"
          fill
          alt=""
          aria-hidden
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
        />

        {!reduced && (
          <div ref={scope} aria-hidden className="pointer-events-none absolute inset-0">

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

          </div>
        )}
      </div>
    </article>
  );
}
