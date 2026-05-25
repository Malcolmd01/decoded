"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const snapEase   = [0.25, 1, 0.2, 1] as const;
const revealEase = [0.16, 1, 0.3, 1] as const;

const DEFAULT_TIMINGS = {
  assemble: 600,   // icon pieces swap for red logo
  reveal:   800,  // de/oded emerge from behind
  lock:     2000,  // composition moves to hero logo position
  exit:     3200,  // overlay fades out
  remove:   4000,  // component unmounts
};

const SIZE      = "h-[clamp(38px,10.5vw,134px)] w-[clamp(38px,10.5vw,134px)] shrink-0";
const TEXT_SIZE = "h-[clamp(38px,10.5vw,134px)] w-auto shrink-0";

// INTRO_SCALE: resting scale before lock.
// LOCK_SCALE_MULTIPLIER: applied on top of the measured hero scale at lock time —
// 1.0 = exact hero logo size, >1.0 = slightly larger.
const INTRO_SCALE           = 1;
const LOCK_SCALE_MULTIPLIER = 1;

interface HeroTarget { x: number; y: number; scale: number }

interface CinematicSplashProps {
  logoPiece1Src?: string;
  logoPiece2Src?: string;
  logoFullSrc?:   string;
  logoPiece3Src?: string;
  logoPiece4Src?: string;
  onComplete?: () => void;
  timings?: typeof DEFAULT_TIMINGS;
}

export function CinematicSplash({
  logoPiece1Src = "/red-logo-1.svg",
  logoPiece2Src = "/red-logo-2.svg",
  logoFullSrc   = "/red-logo.svg",
  logoPiece3Src = "/decoded-3.svg",
  logoPiece4Src = "/decoded-4.svg",
  onComplete,
  timings = DEFAULT_TIMINGS,
}: CinematicSplashProps) {
  const compositionRef = useRef<HTMLDivElement>(null);
  const rowRef         = useRef<HTMLDivElement>(null);
  const onCompleteRef  = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  const prefersReduced = useReducedMotion();

  const [showSplash, setShowSplash] = useState(!prefersReduced);
  const [assembled,  setAssembled]  = useState(false);
  const [revealed,   setRevealed]   = useState(false);
  const [locked,     setLocked]     = useState(false);
  const [exiting,    setExiting]    = useState(false);
  const [heroTarget, setHeroTarget] = useState<HeroTarget>({ x: 0, y: 0, scale: 1 });

  // Measure row (not padded wrapper) for accurate scale + centre.
  // Re-runs on resize so orientation changes stay correct.
  useEffect(() => {
    if (!revealed) return;
    const measure = () => {
      const heroEl = document.querySelector<HTMLElement>("[data-hero-logo]");
      const rowEl  = rowRef.current;
      const compEl = compositionRef.current;
      if (!heroEl || !rowEl || !compEl) return;
      const h = heroEl.getBoundingClientRect();
      const r = rowEl.getBoundingClientRect();
      const c = compEl.getBoundingClientRect();
      setHeroTarget({
        x:     (h.left + h.width  / 2) - (c.left + c.width  / 2),
        y:     (h.top  + h.height / 2) - (r.top  + r.height / 2),
        // r.width is already scaled by INTRO_SCALE via parent transform,
        // so multiply back to get the correct target scale.
        scale: (h.width / r.width) * INTRO_SCALE,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [revealed]);

  useEffect(() => {
    if (prefersReduced) { onCompleteRef.current?.(); return; }
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setAssembled(true), timings.assemble);
    const t2 = setTimeout(() => setRevealed(true),  timings.reveal);
    const t3 = setTimeout(() => setLocked(true),    timings.lock);
    const t4 = setTimeout(() => setExiting(true),   timings.exit);
    const t5 = setTimeout(() => {
      setShowSplash(false);
      document.body.style.overflow = "";
      onCompleteRef.current?.();
    }, timings.remove);
    return () => { [t1, t2, t3, t4, t5].forEach(clearTimeout); document.body.style.overflow = ""; };
  }, [timings, prefersReduced]);

  return (
    <AnimatePresence>
      {showSplash && (
        /* ── PHASE 5 · EXIT (t=exit) — full overlay fades to reveal hero ── */
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#020202]"
          animate={exiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:36px_36px]" />

          {/* ── PHASE 4 · LOCK (t=lock) — slides to hero logo position ── */}
          <motion.div
            ref={compositionRef}
            className="relative mx-auto w-fit max-w-[96vw] px-2 sm:px-4"
            animate={locked
              ? { x: heroTarget.x, y: heroTarget.y, scale: heroTarget.scale * LOCK_SCALE_MULTIPLIER }
              : { x: 0, y: 0, scale: INTRO_SCALE }
            }
            transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div ref={rowRef} className="flex items-center">

              {/* ── PHASE 3 · REVEAL (t=reveal) — "de" slides left from centre ── */}
              <motion.img
                src={logoPiece3Src}
                alt="" aria-hidden="true"
                className={`object-contain will-change-transform ${TEXT_SIZE}`}
                initial={{ x: "50%", opacity: 0 }}
                animate={revealed ? { x: 0, opacity: 1 } : { x: "50%", opacity: 0 }}
                transition={revealed ? { x: { duration: 0.75, ease: revealEase }, opacity: { duration: 0.75, ease: "easeOut" } } : {}}
              />

              {/* icon box */}
              <div className={`relative flex items-center justify-center ml-[5px] ${SIZE}`}>

                {/* ── PHASE 1 · ENTRY (t=0) — piece 2 flies in from top-right ── */}
                <motion.img
                  src={logoPiece2Src} alt="" aria-hidden="true"
                  className="absolute h-auto w-full object-contain will-change-transform"
                  initial={{ x: "50vw", y: "-54vh" }}
                  animate={{ x: 0, y: 0, opacity: assembled ? 0 : 1 }}
                  transition={{ x: { duration: 0.75, ease: snapEase }, y: { duration: 0.75, ease: snapEase }, opacity: { delay: 0.9, duration: 0.01 } }}
                />

                {/* ── PHASE 1 · ENTRY (t=0) — piece 1 flies in from bottom-left ── */}
                <motion.img
                  src={logoPiece1Src} alt="" aria-hidden="true"
                  className="absolute h-auto w-full object-contain will-change-transform"
                  initial={{ x: "-50vw", y: "54vh" }}
                  animate={{ x: 0, y: 0, opacity: assembled ? 0 : 1 }}
                  transition={{ x: { duration: 0.75, ease: snapEase }, y: { duration: 0.75, ease: snapEase }, opacity: { delay: 0.9, duration: 0.01 } }}
                />

                {/* ── PHASE 2 · ASSEMBLE (t=assemble) — red logo flashes in ── */}
                <motion.img
                  src={logoFullSrc} alt="" aria-hidden="true"
                  className="absolute h-auto w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={assembled ? { opacity: 1 } : {}}
                  transition={{ opacity: { delay: 0.2, duration: 0.01 } }}
                />
              </div>

              {/* ── PHASE 3 · REVEAL (t=reveal) — "oded" slides right from centre ── */}
              <motion.img
                src={logoPiece4Src}
                alt="" aria-hidden="true"
                className={`object-contain will-change-transform ${TEXT_SIZE}`}
                initial={{ x: "-50%", opacity: 0 }}
                animate={revealed ? { x: 0, opacity: 1 } : { x: "-50%", opacity: 0 }}
                transition={revealed ? { x: { duration: 0.75, ease: revealEase }, opacity: { duration: 0.75, ease: "easeOut" } } : {}}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
