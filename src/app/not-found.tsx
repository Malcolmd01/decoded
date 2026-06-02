"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components";

export default function NotFound() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-5">
      <div className="flex flex-col items-center gap-8 md:gap-10">

        {/* 404 glitch */}
        <motion.div
          className="relative select-none"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="block font-headline font-bold leading-none tracking-tight text-white"
            style={{ fontSize: "clamp(96px, 22vw, 320px)" }}
          >
            404
          </span>

        </motion.div>

        {/* Copy + CTA */}
        <motion.div
          className="flex flex-col items-center gap-5 text-center md:gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body text-sm text-white/40 md:text-base">
            This page doesn't exist.
          </p>
          <Link href="/">
            <Button variant="light">Back to Home</Button>
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
