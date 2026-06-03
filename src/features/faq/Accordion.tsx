"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import type { Faqs } from "./faq.data";

type Props = {
  items: readonly Faqs[];
};

function PlusIcon({ open }: { open: boolean }) {
  return (
    <motion.div
      aria-hidden
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[rgba(255,72,51,0.4)]"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <line x1="6" y1="0" x2="6" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="6" x2="12" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

function linkifyAnswer(text: string) {
  const parts = text.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <a key={i} href={`mailto:${part}`} className="text-white underline underline-offset-2 transition-colors hover:text-red">{part}</a>
      : part
  );
}

export function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="flex w-full flex-col gap-1 rounded-xl bg-grey/30 p-1">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.question} className="rounded-lg bg-[rgb(18,18,18)]">
            <button
              id={buttonId}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-3 p-6 text-left font-headline text-base font-semibold uppercase tracking-normal text-white md:text-lg"
            >
              <span>{item.question}</span>
              <PlusIcon open={open} />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 font-body text-base font-semibold leading-relaxed text-white/80">
                    {linkifyAnswer(item.answer)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
