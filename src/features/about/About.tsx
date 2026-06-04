"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { aboutContent } from "./about.data";

export function About() {
  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(headingRef, { once: false, margin: "-80px" });

  return (
    <section
      id="about"
      className="relative z-10 flex min-h-screen items-center justify-center bg-black md:p-[100px] py-[100px] px-[60px] text-red md:px-8"
    >
      <h2
        ref={headingRef}
        className="max-w-[1440px] text-center font-headline text-[24px] font-semibold leading-[1.05] tracking-normal md:text-[36px] lg:text-[48px]"
      >
        {aboutContent.lines.map((line, i) => (
          <span key={i} className="relative block overflow-hidden">
            <span className="block">{line.toUpperCase()}</span>
            {!reduced && (
              <motion.span
                aria-hidden
                className="absolute inset-x-0 -inset-y-px bg-white"
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={{
                  hidden: { x: "0%", transition: { duration: 0 } },
                  visible: {
                    x: i % 2 === 0 ? "105%" : "-105%",
                    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
                  },
                }}
              />
            )}
          </span>
        ))}
      </h2>
    </section>
  );
}
