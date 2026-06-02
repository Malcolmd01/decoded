"use client";

import { motion } from "framer-motion";
import type { Reason } from "./reasons.data";

type Props = { reason: Reason; index: number; type: "cascade" };

export function ReasonCard({ reason, index }: Props) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-8 md:gap-16 rounded-xl bg-red p-8 text-white md:flex-row lg:items-start lg:justify-between will-change-transform backface-hidden"
    >
      <div className="font-headline text-[96px] md:text-[128px] font-semibold leading-none text-black place-self-auto md:place-self-center lg:place-self-auto">
        {reason.number}
      </div>
      <div className="flex flex-col lg:justify-between lg:gap-1 md:gap-3 md:min-h-[150px] lg:min-h-[210px] py-2 lg:w-[340px]">
        <h3 className="font-headline text-2xl font-semibold leading-tight tracking-normal uppercase text-black md:text-3xl">
          {reason.title}
        </h3>
        <p className="font-body text-base font-semibold leading-relaxed text-white/90">
          {reason.description}
        </p>
      </div>
    </motion.article>
  );
}