"use client";

import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LoaderProps {
  onComplete?: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const prefersReduced = useReducedMotion();
  const [count, setCount]     = useState(0);
  const [visible, setVisible] = useState(!prefersReduced);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    if (prefersReduced) return;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) { onCompleteRef.current?.(); return; }

    document.body.style.overflow = "hidden";

    const controls = animate(0, 100, {
      delay: 0.5,
      duration: 3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setTimeout(() => {
          document.body.style.overflow = "";
          setVisible(false);
          onCompleteRef.current?.();
        }, 300);
      },
    });

    return () => { controls.stop(); document.body.style.overflow = ""; };
  }, [prefersReduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/red-logo.svg"
              alt=""
              aria-hidden="true"
              width={172}
              height={175}
              className="w-[95px] h-[95px] md:w-[172px] md:h-[175px] object-contain"
            />
            <span className="font-headline font-bold text-white text-[clamp(36px,5vw,64px)] leading-none tabular-nums">
              {count}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
