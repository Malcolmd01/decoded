"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useAnimate, useInView, motion } from "framer-motion";
import { ArrowCircleUpRight } from "@phosphor-icons/react";
import { BrutalismIcon } from "@/components";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Format } from "./formats.data";

// ─── How the pixel reveal works ──────────────────────────────────────────────
//
// A 15×15 grid of cells covers the image. Each cell has two colour layers:
//   White (top)  — fades out first, briefly exposing red underneath
//   Red   (below)— fades out slightly later, then the image is fully visible
//
// The wave travels top → bottom. For each row, a base timestamp is derived
// from its position. Two per-cell random offsets break up the straight edge:
//
//   BLEED  — white cells can start fading UP TO 0.18s EARLY  → red bleeds
//            through below the scan line before it arrives
//   JITTER — red cells linger UP TO 0.10s AFTER their row's base time →
//            red fragments persist above the line after white has cleared
//
// This gives the classic scan-line look: a messy red fringe travels downward
// with stray pixels above and below the edge.
//
// Rendered on a <canvas> instead of 450 divs: one DOM node, one rAF loop,
// direct pixel ops — no layout/style recalc, no Framer Motion per cell.
// ─────────────────────────────────────────────────────────────────────────────

const GRID            = 15;
const REVEAL_DELAY    = 0.5;   // seconds before wave starts
const REVEAL_DURATION = 0.6;   // seconds for wave to travel top → bottom
const WHITE_DUR       = 0.1;   // how fast each white cell fades
const RED_DUR         = 0.1;   // how fast each red cell fades
const JITTER          = 0.1;   // max extra delay on red  (lingers above line)
const BLEED           = 0.18;  // max early start on white (exposes red below)

// Pre-compute per-cell start/end times with randomness fixed at call time.
function buildTimings() {
  const N  = GRID * GRID;
  const ws = new Float32Array(N);
  const we = new Float32Array(N);
  const rs = new Float32Array(N);
  const re = new Float32Array(N);
  let   maxEnd = 0;
  for (let i = 0; i < N; i++) {
    const base = REVEAL_DELAY + (Math.floor(i / GRID) / (GRID - 1)) * REVEAL_DURATION;
    ws[i] = base - Math.random() * BLEED;
    we[i] = ws[i] + WHITE_DUR;
    rs[i] = base + Math.random() * JITTER;
    re[i] = rs[i] + RED_DUR;
    if (re[i] > maxEnd) maxEnd = re[i];
  }
  return { ws, we, rs, re, maxEnd };
}

function PixelCanvas({ play }: { play: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);
  const playedRef = useRef(false);

  // Keep canvas pixel buffer synced with CSS size; draw white cover before animation.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;

    const sync = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width  = Math.round(width  * dpr);
      canvas.height = Math.round(height * dpr);
      if (!playedRef.current) {
        const ctx = canvas.getContext("2d");
        if (ctx) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      }
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!play || playedRef.current) return;
    playedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { ws, we, rs, re, maxEnd } = buildTimings();
    const deadline = maxEnd * 1000 + 50;
    const t0       = performance.now();

    const tick = (now: number) => {
      const t  = (now - t0) / 1000;
      const w  = canvas.width;
      const h  = canvas.height;
      const cw = w / GRID;
      const ch = h / GRID;

      ctx.clearRect(0, 0, w, h);

      // Red pass — drawn first (behind white)
      ctx.fillStyle = "rgb(232,26,45)";
      for (let i = 0; i < GRID * GRID; i++) {
        const ro = t < rs[i] ? 1 : t < re[i] ? 1 - (t - rs[i]) / (re[i] - rs[i]) : 0;
        if (ro > 0.002) {
          ctx.globalAlpha = ro;
          ctx.fillRect((i % GRID) * cw, Math.floor(i / GRID) * ch, cw + 0.5, ch + 0.5);
        }
      }

      // White pass — drawn on top of red
      ctx.fillStyle = "rgb(255,255,255)";
      for (let i = 0; i < GRID * GRID; i++) {
        const wo = t < ws[i] ? 1 : t < we[i] ? 1 - (t - ws[i]) / (we[i] - ws[i]) : 0;
        if (wo > 0.002) {
          ctx.globalAlpha = wo;
          ctx.fillRect((i % GRID) * cw, Math.floor(i / GRID) * ch, cw + 0.5, ch + 0.5);
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = now - t0 < deadline ? requestAnimationFrame(tick) : null;
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [play]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

type Props = { format: Format; priority?: boolean; index: number; onOpen?: () => void };

export function FormatCard({ format, priority = false, index, onOpen }: Props) {
  const articleRef    = useRef<HTMLElement>(null);
  const [scope, animate] = useAnimate();
  const reduced       = useReducedMotion();
  const inView        = useInView(articleRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      animate("[data-animate-text]", { opacity: 1, y: 0 }, { duration: 0 });
    } else {
      animate(
        "[data-animate-text]",
        { opacity: [0, 1], y: [-24, 0] },
        { duration: 0.9, delay: (i) => i * 0.4, ease: [0.215, 0.61, 0.355, 1] },
      );
    }
  }, [inView, reduced, animate]);

  return (
    <motion.article
      ref={articleRef}
      className="grid w-full grid-cols-1 gap-10 rounded-2xl bg-black p-5 text-white md:grid-cols-2 md:gap-16 md:p-[30px]"
    >
      <div ref={scope} className="contents">
        <div className="order-last flex flex-col justify-between gap-8 h-full md:order-first md:self-start">
          <div className="flex flex-col gap-[8px]">

            <h3 data-animate-text className="font-headline text-3xl font-semibold leading-[1.05] tracking-tight md:text-4xl opacity-0 uppercase">
              {format.name}
            </h3>
          
          <p data-animate-text className="font-body text-[16px] font-normal leading-relaxed text-white md:text-lg opacity-0">
            {format.description}
          </p>
</div>
          {onOpen && (
            <button
              data-animate-text
              onClick={onOpen}
              className="group flex w-full items-center justify-between rounded-lg bg-grey/30 p-6 font-body font-semibold text-white opacity-0 transition-colors hover:bg-grey/50 md:p-[30px]"
            >
              Learn more
              <ArrowCircleUpRight className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" weight="regular" />
            </button>
          )}
        </div>

        <div
          className="relative aspect-square w-full overflow-hidden rounded-lg"
          onClick={onOpen}
          role={onOpen ? "button" : undefined}
          tabIndex={onOpen ? 0 : undefined}
          aria-label={onOpen ? `Learn more about ${format.name}` : undefined}
          onKeyDown={onOpen ? (e) => { if (e.key === "Enter" || e.key === " ") onOpen(); } : undefined}
          style={{ cursor: onOpen ? "pointer" : undefined }}
        >
          <Image
            src={`/${format.name.toLowerCase().replace(/\s/g, "-")}.png`}
            fill alt="" aria-hidden
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority={priority}
          />
          {!reduced && <PixelCanvas play={inView} />}
        </div>
      </div>
    </motion.article>
  );
}
