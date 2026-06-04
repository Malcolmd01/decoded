"use client";

import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LoaderProps {
  onComplete?: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const prefersReduced = useReducedMotion();
  const [resetKey, setResetKey] = useState(0);
  const [count, setCount]     = useState(0);
  const [done, setDone]       = useState(false);
  const [visible, setVisible] = useState(!prefersReduced);
  const onCompleteRef = useRef(onComplete);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { onCompleteRef.current = onComplete; });

  // Reset and replay only when navigating back to this page from a different pathname.
  // popstate also fires on hash changes (#about, #hero etc.) — those must be ignored.
  const lastPathname = useRef(typeof window !== "undefined" ? window.location.pathname : "/");
  useEffect(() => {
    const handlePop = () => {
      const incoming = window.location.pathname;
      const wasOnDifferentPage = lastPathname.current !== incoming;
      lastPathname.current = incoming;
      if (!wasOnDifferentPage || prefersReduced) return;
      setCount(0);
      setDone(false);
      setVisible(true);
      setResetKey((k) => k + 1);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) { onCompleteRef.current?.(); return; }

    document.body.style.overflow = "hidden";

    const controls = animate(0, 100, {
      delay: 0.1,
      duration: 1.5,
      ease: "linear",
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setDone(true);
        holdRef.current = setTimeout(() => {
          document.body.style.overflow = "";
          setVisible(false);
          onCompleteRef.current?.();
        }, 150);
      },
    });

    return () => {
      controls.stop();
      document.body.style.overflow = "";
      if (holdRef.current) clearTimeout(holdRef.current);
    };
  }, [prefersReduced, resetKey]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.25, ease: [0.76, 0, 0.85, 1] }}
        >
          {/* Logo — centered, 40% opacity, black mask lifts upward as count increases */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/red-logo.svg"
            alt=""
            aria-hidden="true"
            width={172}
            height={175}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95px] h-[95px] md:w-[172px] md:h-[175px] object-contain"
            style={{ clipPath: `inset(${100 - count}% 0 0 0)` }}
          />

          {/* Counter — bottom center, fades out on complete */}
          <span
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-headline font-bold text-white text-[clamp(36px,5vw,96px)] leading-none tabular-nums transition-opacity duration-200"
            style={{ opacity: done ? 0 : 1 }}
          >
            {count}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
