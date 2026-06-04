"use client";

import { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components";

type Props = {
  onClose: () => void;
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", duration: 0.5, bounce: 0.1 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 15,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

export function ContactModal({ onClose }: Props) {
  // Lock underlying page body scrolling when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form tracking values here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim blurred backdrop overlay */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main Content Modal Card */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-[540px] rounded-2xl bg-neutral-900 border border-neutral-800 p-6 text-white md:p-10 shadow-2xl"
      >
        {/* Header Close Trigger */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-6 top-6 flex size-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
        >
          ✕
        </button>

        <div className="mb-8">
          <h2 className="font-headline text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl">
            Get in Touch
          </h2>
          <p className="mt-2 font-body text-sm text-neutral-400">
            Fill out the form details below and our team will get right back to you.
          </p>
        </div>

        {/* Input Control Container Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="modal-name" className="font-body text-xs font-bold uppercase tracking-wider text-neutral-400">
              Full Name
            </label>
            <input
              required
              type="text"
              id="modal-name"
              placeholder="John Doe"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-3 font-body text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-red focus:ring-1 focus:ring-red"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="modal-email" className="font-body text-xs font-bold uppercase tracking-wider text-neutral-400">
              Email Address
            </label>
            <input
              required
              type="email"
              id="modal-email"
              placeholder="john@example.com"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-3 font-body text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-red focus:ring-1 focus:ring-red"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="modal-message" className="font-body text-xs font-bold uppercase tracking-wider text-neutral-400">
              Your Message
            </label>
            <textarea
              required
              id="modal-message"
              rows={4}
              placeholder="Tell us about your project..."
              className="w-full resize-none rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-3 font-body text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-red focus:ring-1 focus:ring-red"
            />
          </div>

          <div className="mt-4 flex w-full justify-end">
            <Button variant="light" type="submit" className="w-full md:w-auto">
              Submit Request
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}