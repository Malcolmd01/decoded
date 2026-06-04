"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { formatImageSrc } from "./formats.data";
import type { Format, FormatMeta } from "./formats.data";

type Props = { format: Format | null; onClose: () => void; onApply?: () => void };

type RowProps = { label: string; children: React.ReactNode };

function Row({ label, children }: RowProps) {
  return (
    <div className="flex flex-col gap-5 border-t border-white/20 py-6 md:grid md:grid-cols-[140px_1fr] md:gap-12 md:py-8">
      <div className="flex items-center h-fit gap-2.5">
        <span className="mt-[3px] size-2 shrink-0 rounded-full bg-white/25" />
        <span className="font-headline uppercase text-sm font-medium text-off-white">{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

const META_LABELS: Record<keyof FormatMeta, string> = {
  duration: "Duration",
  speakers: "Speakers",
  structure: "Structure",
  slides: "Slides",
  audienceSize: "Audience size",
  moderation: "Moderation",
};

const META_KEYS: (keyof FormatMeta)[] = [
  "duration",
  "speakers",
  "structure",
  "slides",
  "audienceSize",
  "moderation",
];

export function FormatDrawer({ format, onClose, onApply }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (!format) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [format]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const imageSrc = format ? formatImageSrc(format.name) : "";

  return (
    <AnimatePresence>
      {format && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer panel — overflow-hidden so scroll recalc doesn't run during animation */}
          <motion.aside
            role="dialog"
            aria-modal
            aria-label={format.name}
            className="fixed right-0 top-0 z-60 h-full w-full border-l-2 lg:border-red/50 bg-black xl:max-w-[40vw] lg:max-w-[50vw]"
            style={{ willChange: "transform" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
          {/* Scroll container is separate from the animated element */}
          <div className="flex h-full flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-8 pt-8">
              <span className="font-headline text-[24px] lg:text-[36px] uppercase text-white">
                {format.name}
              </span>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="flex h-8 w-8 items-center justify-center text-white/80 transition-colors hover:text-white" 
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-[14px] w-[14px]"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path strokeLinecap="round" d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="mt-6 px-8">
              <div className="relative aspect-[4/3] w-full md:max-w-[75%]">
                <Image
                  src={imageSrc}
                  alt={format.name}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 37vw, 75vw"
                  className="rounded-sm object-cover"
                />
              </div>
            </div>

            {/* Content rows */}
            <div className="mt-6 px-8">
              {/* What it is */}
              <Row label="What it is">
                <p className="font-body text-[16px] leading-[1.7] text-white/70">
                  {format.whatItIs}
                </p>
              </Row>
              

              {/* Best for */}
              <Row label="Best for">
                <div className="font-body text-[16px] text-white/70">
                  {format.bestFor.map((item, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "leading-[1.9]"
                          : "mt-1.5 border-t border-white/50 pt-1.5 leading-[1.9]"
                      }
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </Row>

              {/* How it runs */}
              <Row label="How it runs">
                <div className="divide-y divide-white/50">
                  {META_KEYS.map((key) => (
                    <div key={key} className="grid grid-cols-[100px_1fr] gap-4 py-3 sm:grid-cols-[140px_1fr]">
                      <span className="font-body text-md font-medium text-white/80 self-center">
                        {META_LABELS[key]}
                      </span>
                      <span className="font-body text-[16px] text-white/50 self-center">
                        {format.meta[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </Row>

              {/* What to expect */}
              <Row label="What to expect">
                <div className="flex flex-col gap-6">
                  {format.expect.map((block, i) => (
                    <div key={i}>
                      <p className="font-body text-md font-medium text-white/80 mb-1.5">
                        {block.title}
                      </p>
                      <p className="font-body text-[16px] text-white/50">
                        {block.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Row>
            </div>

            {/* Bottom CTA */}
            <div className="mt-auto flex justify-start w-full px-8 py-8">
              <button
                onClick={() => { onClose(); onApply?.(); }}
                className="block w-full rounded-lg bg-red py-4 text-center font-body font-semibold text-white transition-opacity hover:opacity-90"
              >
                Apply to speak
              </button>
            </div>
          </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
