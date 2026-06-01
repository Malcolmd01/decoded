"use client";

import { motion, Variants } from "framer-motion";
import { FormatCard } from "./FormatCard";
import { formatsContent } from "./formats.data";

// Parent Container Variant orchestrating child elements smoothly
const headerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // Premium cinematic ease-out
  }
};

const introVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export function Formats() {
  return (
    <section
      id="formats"
      className="relative z-10 bg-red px-5 py-24 text-white md:px-8 md:py-[100px] overflow-x-hidden"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16">
        
        {/* Fancy staggered header sequence */}
        <motion.header 
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col lg:justify-between gap-8 md:flex-row md:items-end"
        >
          {/* Main title slides elegantly upward */}
          <motion.h2 
            variants={titleVariants}
            className="max-w-[718px] font-headline text-[32px] font-semibold leading-[1.05] tracking-wide md:text-[48px] lg:text-[64px]"
          >
            {formatsContent.title}
          </motion.h2>
          
          {/* Intro paragraph echoes up directly behind it */}
          <motion.p 
            variants={introVariants}
            className="max-w-[467px] font-body text-[16px] font-semibold leading-relaxed text-black"
          >
            {formatsContent.intro}
          </motion.p>
        </motion.header>

        <div className="flex flex-col gap-8"> 
          {formatsContent.formats.map((format, i) => (
            <FormatCard key={format.name} format={format} index={i} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}