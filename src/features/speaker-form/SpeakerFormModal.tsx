"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpeakerForm } from "./SpeakerForm";

export function SpeakerFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-start justify-center overflow-y-auto bg-black/80 px-5 py-16 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            role="dialog"
            aria-modal={true}
            aria-label="Apply to speak"
            className="w-full max-w-2xl rounded-2xl bg-grey/60 backdrop-blur-md p-4 md:p-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              className="group mb-4 -ml-1 inline-flex items-center gap-1.5 rounded px-1 py-2 font-body text-sm text-white/70 transition-colors hover:text-white"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 8H3M7 4L3 8l4 4" />
              </svg>
              Back
            </button>
            <SpeakerForm onSuccess={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
