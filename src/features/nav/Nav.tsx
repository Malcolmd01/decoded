"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components";

const links = [
  { label: "About",   href: "#about" },
  { label: "Formats", href: "#formats" },
  { label: "Reasons", href: "#reasons" },
];

function scrollTo(href: string) {
  if (href === "#hero") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-5 pt-4 md:px-8">
      {/* Nav pill */}
      <nav
        className={`flex w-full max-w-[1072px] items-center justify-between rounded-3xl px-4 py-3 transition-all duration-300 ${
          scrolled || menuOpen ? "bg-black/70 backdrop-blur-md" : ""
        }`}
        aria-label="Main navigation"
      >
        <a
          href="#hero"
          className="flex items-center"
          onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollTo("#hero"); }}
        >
          <Image src="/red-logo.svg" alt="Decoded" width={32} height={32} />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                className="group relative block overflow-hidden rounded-full px-3 py-2"
              >
                <span className="block font-body text-lg font-semibold text-white transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                  {label}
                </span>
                <span className="absolute inset-0 flex items-center justify-center font-body text-lg font-semibold text-white translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#apply"
          className="hidden md:block"
          onClick={(e) => { e.preventDefault(); scrollTo("#apply"); }}
        >
          <Button variant="light">Apply to speak</Button>
        </a>

        {/* Burger — mobile only */}
        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-full md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={`block h-[2px] w-5 bg-white transition-transform duration-300 ${menuOpen ? "translate-y-[8px] rotate-45" : ""}`} />
          <span className={`block h-[2px] w-5 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-[2px] w-5 bg-white transition-transform duration-300 ${menuOpen ? "-translate-y-[8px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile dropdown panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mt-2 w-full max-w-[1072px] overflow-hidden rounded-3xl bg-black/80 backdrop-blur-md md:hidden"
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            style={{ transformOrigin: "top" }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Links */}
            <ul className="flex flex-col items-center py-8 gap-1">
              {links.map(({ label, href }, i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: 0.06 + i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                >
                  <a
                    href={href}
                    onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollTo(href); }}
                    className="font-body block px-6 py-4 text-2xl font-semibold text-white/80 transition-colors duration-150 hover:text-white"
                  >
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, delay: 0.06 + links.length * 0.05 }}
              className="px-4 pb-4"
            >
              <a
                href="#apply"
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollTo("#apply"); }}
                className="block w-full rounded-2xl bg-white py-4 text-center font-body text-base font-bold text-black transition-colors duration-150 hover:bg-off-white"
              >
                Apply to speak
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
