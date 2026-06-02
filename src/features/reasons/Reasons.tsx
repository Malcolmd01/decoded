"use client";

import { motion, Variants } from "framer-motion";
import { ReasonCard } from "./ReasonCard";
import { reasonsContent } from "./reasons.data";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export function Reasons() {
  return (
    <section id="reasons" className="relative z-10 bg-black px-5 py-24 text-white md:px-8 md:py-[100px] overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto flex w-full max-w-[1440px] flex-col gap-16"
      >
        <header className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <motion.div variants={headerItemVariants} className="flex max-w-[718px] flex-col gap-3">
            <h2 className="font-headline text-[32px] font-semibold leading-[1.05] tracking-wide md:text-[48px] lg:text-[64px]">
              <span className="text-red">{reasonsContent.title1}</span>{" "}
              <span className="text-white">{reasonsContent.title2}</span>{" "}
              <span className="text-red">{reasonsContent.title3}</span>
            </h2>
          </motion.div>
          <motion.p variants={headerItemVariants} className="max-w-[467px] font-body text-base font-normal leading-relaxed text-[16px]">
            {reasonsContent.intro}
          </motion.p>
        </header>

        <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-2">
          {reasonsContent.reasons.map((reason, i) => (
            <ReasonCard key={reason.number} reason={reason} index={i} type="cascade" />
          ))}
        </div>
      </motion.div>
    </section>
  );
}