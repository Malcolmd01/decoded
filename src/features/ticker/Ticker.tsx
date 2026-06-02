"use client";
import { Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { tickerWords } from "./ticker.data";

function TickerContent() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8 md:gap-[30px] md:pr-[30px]">
      {tickerWords.map((word) => (
        <Fragment key={word}>
          <span className="font-headline text-[48px] font-semibold tracking-tight text-black uppercase">
            {word}
          </span>
          <Image src="/red-logo.svg" alt="" aria-hidden width={72} height={72} className="block shrink-0 size-[72px] md:size-[64px]" />
        </Fragment>
      ))}
    </div>
  );
}

export function Ticker() {
  return (
    <section
      aria-hidden
      className="relative z-10 flex h-[110px] items-center overflow-hidden bg-white"
    >
      <motion.div
        className="flex w-max"
        // 3 copies — move exactly one copy width (1/3 of total track) for a seamless loop
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 35 // Bumped up slightly to compensate for moving a longer track distance
        }}
      >
        <TickerContent />        
        <TickerContent />
        <TickerContent />
        <TickerContent />
      </motion.div>
    </section>
  );
}