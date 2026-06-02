"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { aboutContent } from "./about.data";

const WORDS = aboutContent.text.split(" ");

// Groups word spans by offsetTop to detect visual line breaks.
// Tolerance of 4px handles sub-pixel rounding across browsers.
function measureLines(el: HTMLElement): string[][] {
  const spans = el.querySelectorAll<HTMLElement>("[data-word]");
  const groups: string[][] = [];
  let current: string[] = [];
  let lastTop = -1;

  spans.forEach((span, i) => {
    const top = Math.round(span.offsetTop);
    if (lastTop === -1) lastTop = top;
    if (Math.abs(top - lastTop) > 4) {
      groups.push(current);
      current = [];
      lastTop = top;
    }
    current.push(WORDS[i]);
  });
  if (current.length) groups.push(current);
  return groups;
}

export function About() {
  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  // null = not yet measured (SSR + first paint show plain words)
  const [lines, setLines] = useState<string[][] | null>(null);
  const inView = useInView(headingRef, { once: false, margin: "-80px" });

  // Runs only on the client after hydration — DOM APIs safe here
  useEffect(() => {
    if (headingRef.current) setLines(measureLines(headingRef.current));
  }, []);

  const showAnimation = lines?.length && !reduced;

  return (
    <section
      id="about"
      className="relative z-10 flex min-h-screen items-center justify-center bg-black md:p-[100px] py-[100px] px-[60px] text-red md:px-8"
    >
      <h2
        ref={headingRef}
        className="max-w-[1440px] text-center font-headline text-4xl font-semibold leading-[1.05] tracking-normal md:text-5xl lg:text-6xl"
      >
        {showAnimation ? (
          // Blinds reveal — text is static underneath; a white panel covers each line
          // and slides off to alternating sides, like venetian blinds opening.
          lines!.map((lineWords, i) => (
            // overflow-hidden clips the white panel cleanly as it exits
            <span key={i} className="relative block overflow-hidden">

              {/* Static text — always present, revealed as the blind slides away */}
              <span className="block">{lineWords.join(" ")}</span>

              {/* White blind panel — covers the line at rest, then exits on scroll */}
              <motion.span
                aria-hidden
                className="absolute inset-x-0 -inset-y-px bg-white"
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                // "hidden" snaps back instantly (duration 0) so the reset is invisible off-screen
                variants={{
                  hidden: { x: "0%", transition: { duration: 0 } },
                  visible: {
                    // 105% (not 100%) prevents a 1px edge artefact after easing settles
                    x: i % 2 === 0 ? "105%" : "-105%",
                    transition: {
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.1,
                    },
                  },
                }}
              />
            </span>
          ))
        ) : (
          // Plain words — SSR, before measurement, and reduced-motion fallback
          WORDS.map((word, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span data-word>{word}</span>
            </Fragment>
          ))
        )}
      </h2>
    </section>
  );
}
