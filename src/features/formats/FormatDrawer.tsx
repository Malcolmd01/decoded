"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrutalismIcon } from "@/components";
import type { Format } from "./formats.data";

type Props = { format: Format | null; onClose: () => void };

export function FormatDrawer({ format, onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (!format) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [format]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {format && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.aside
            role="dialog"
            aria-modal
            aria-label={format.headline}
            className="fixed right-0 top-0 z-40 flex h-full w-full max-w-[480px] flex-col overflow-y-auto bg-black px-8 py-10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close panel"
              className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/50 transition-colors hover:border-white/60 hover:text-white"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-[14px] w-[14px]" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>

            {/* Content */}
            <motion.div
              className="mt-12 flex flex-col gap-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Label */}
              <div className="flex items-center gap-2">
                <BrutalismIcon className="size-[18px] text-red" />
                <span className="font-body text-sm font-bold uppercase tracking-widest text-white/50">
                  {format.name}
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-headline text-[40px] font-semibold leading-[1.05] tracking-tight text-white md:text-[52px]">
                {format.headline}
              </h2>

              {/* Divider */}
              <div className="h-px w-16 bg-red" />

              {/* Description */}
              <p className="font-body text-lg leading-relaxed text-white/70">
                {format.description}
              </p>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
