"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components";

const links = [
  { label: "About",   href: "#about" },
  { label: "Formats", href: "#formats" },
  { label: "Reasons", href: "#why-choose-us" },
  { label: "FAQs",    href: "#faq" },
  { label: "Apply",   href: "#apply" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#hero"
          className="font-headline text-lg font-semibold tracking-tight text-white"
        >
          DECODED
        </a>

        <ul className="hidden items-center gap-6 md:flex md:gap-8">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="font-body text-sm font-semibold text-white/60 transition-colors duration-200 hover:text-white"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#apply" className="md:hidden">
          <Button variant="light">Apply</Button>
        </a>
      </nav>
    </header>
  );
}
