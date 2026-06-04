"use client";

import Image from "next/image";
import { footerContent } from "./footer.data";
import { useCallback } from "react";


function RollLink({ label, href, className = "" }: { label: string; href: string; className?: string }) {
  const isHash = href.startsWith("#");
  
  const scrollTo = useCallback((href: string) => {
  if (href === "#hero") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(href.replace("#", ""));
  el?.scrollIntoView({ behavior: "smooth" });
}, []);

  return (
    <a
      href={href}
      onClick={isHash ? (e) => { e.preventDefault(); scrollTo(href); } : undefined}
      aria-label={label}
      className="group relative block overflow-hidden font-bold leading-snug"
    >
      <span className="block transition-transform duration-300 group-hover:-translate-y-full" aria-hidden="true">
        {label}
      </span>
      <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0" aria-hidden="true">
        {label}
      </span>
      {/* Visible to screen readers only */}
      <span className="sr-only">{label}</span>
    </a>
  );
}

function ColLabel({ children }: { children: string }) {
  return (
    <span className="font-body text-xs font-normal text-black md:text-[18px]">
      {children}
    </span>
  );
}

export function Footer() {
  return (
<footer 
  className="fixed inset-x-0 bottom-0 z-0 flex flex-col justify-between overflow-hidden 
             bg-red px-5 py-6 md:px-8 lg:px-12
             h-[clamp(400px, 62vh, 88vh)]"
>

      {/* Top — programme + columns (gap=64px in Framer between this and bottom) */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:pb-16">

        {/* Programme — 367px in Framer, gap=8px label→desc */}
        <div className="flex flex-col gap-2 md:max-w-[367px]">
          <ColLabel>{footerContent.programme.label}</ColLabel>
          <p className="font-body text-[24px] font-bold leading-snug tracking-tight ">
            {footerContent.programme.description}
          </p>
        </div>

        {/* Right columns — gap=64px between each in Framer */}
        <div className="flex md:flex-col flex-row gap-6 mt-2 mb-2 md:flex-row md:gap-16">

          {/* Navigation — label→links gap=8px, links gap=16px */}
          <div className="flex flex-col gap-2">
            <ColLabel>{footerContent.navigation.label}</ColLabel>
            <div className="flex flex-col gap-2 pt-1">
              {footerContent.navigation.links.map(({ label, href }) => (
                <RollLink key={href} label={label} href={href} className="text-[20px] uppercase tracking-wider lg:text-base lg:text-[28px] font-headline" />
              ))}
            </div>
          </div>

      {/* Contact + Connect Group — Sits next to Navigation on lg+ */}
        <div className="flex flex-row gap-4 md:gap-16 ">
          {/* Contact — gap=8px */}
          <div className="flex flex-col gap-2">
            <ColLabel>{footerContent.contact.label}</ColLabel>
            <div className="pt-2">
              <RollLink
                label={footerContent.contact.email}
                href={`mailto:${footerContent.contact.email}`}
                className="text-xl"
              />
            </div>
          </div>

          {/* Connect — gap=8px throughout (label + links all same stack) */}
          <div className="flex flex-col gap-2">
            <ColLabel>{footerContent.connect.label}</ColLabel>
            <div className="flex flex-col gap-2 pt-2">
              {footerContent.connect.links.map(({ label, href }) => (
                <RollLink key={label} label={label} href={href} className="text-xl font-body" />
              ))}
            </div>
          </div>
       </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-[10px]">

        {/* Mobile only (< md): copyright → powered by → logo */}
        <span className="font-body text-xs font-normal md:hidden">{footerContent.copyright}</span>
        <span className="flex items-center gap-2 font-body text-xs font-normal md:hidden">
          {footerContent.poweredBy}
          <Image src="/Amplify-logo.svg" alt="Amplify" width={281} height={75} className="h-[32px] w-auto brightness-0" />
        </span>

        {/* Logo — spans full footer width */}
        <Image
          src={footerContent.logo.src}
          alt={footerContent.logo.alt}
          width={footerContent.logo.width}
          height={footerContent.logo.height}
          className="w-full h-fit brightness-0 py-2 lg:w-full"
        />

        {/* Desktop only (md+): copyright | powered by in one row */}
        <div className="hidden items-center justify-between font-body text-sm font-normal md:flex">
          <span>{footerContent.copyright}</span>
          <span className="flex items-center gap-2">
            {footerContent.poweredBy}
            <Image src="/Amplify-logo.svg" alt="Amplify" width={281} height={75} className="h-[24px] w-auto brightness-0" />
          </span>
        </div>

      </div>

    </footer>
  );
}
