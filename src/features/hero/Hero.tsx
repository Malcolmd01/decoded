"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components";
import { heroContent } from "./hero.data";
import { HeroWave } from "./HeroWave";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Loader: 0.5s delay + 3s count + 0.3s hold = 3.8s exit start + 1.1s exit duration
const LOGO_DELAY   = 2.5;
const TEXT_DELAY   = LOGO_DELAY + 0.5;
const BUTTON_DELAY = LOGO_DELAY + 0.8;

const FADE_TRANSITION = {
  duration: 0.8,
  ease: [0.4, 0, 0.2, 1] as const,
};

export function Hero() {
  const reduced = useReducedMotion();

  const fadeIn = (delay: number) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { ...FADE_TRANSITION, delay },
    };

  return (
    <section
      id="hero"
      className="sticky top-0 z-10 flex min-h-screen w-full flex-col items-center justify-center gap-16 overflow-hidden bg-black px-0 py-[100px] text-white"
    >
      <HeroWave />
      <div className="relative z-[2] flex w-full max-w-[1440px] flex-col items-center justify-center overflow-hidden px-5 mt-12 md:px-8">
        <motion.div data-hero-logo className="flex w-full flex-col items-center justify-center" {...fadeIn(LOGO_DELAY)}>
          <Image
            src={heroContent.logo.src}
            alt={heroContent.logo.alt}
            width={heroContent.logo.width}
            height={heroContent.logo.height}
            priority
            style={{ width: "100%", maxWidth: "100%", height: "auto" }}
          />
        </motion.div>
        <div className="mt-12 md:mt-24 lg:mt-32 flex w-full md:w-[600px] lg:w-[1000px] flex-col items-center justify-center gap-8 text-center">
          <motion.h1
            className="w-[1000px] max-w-full font-body text-[16px] font-semibold leading-snug tracking-normal text-white lg:text-[20px]"
            {...fadeIn(TEXT_DELAY)}
          >
            {heroContent.headline}
          </motion.h1>
          <motion.div {...fadeIn(BUTTON_DELAY)}>
            
            <a
            // href="https://forms.cloud.microsoft/e/YM7Wky1aAG"
            href="/speaker-form"
            >
              <Button variant="light" aria-label={heroContent.cta}>
                {heroContent.cta}
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
