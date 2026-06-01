import Image from "next/image";
import { footerContent } from "./footer.data";

function RollLink({ label, href, className = "" }: { label: string; href: string; className?: string }) {
  return (
    <a
      href={href}
      className={`group relative block overflow-hidden font-body font-bold leading-snug ${className}`}
    >
      <span className="block transition-transform duration-300 ease-in-out text-lg group-hover:-translate-y-full">
        {label}
      </span>
      <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-in-out text-lg  group-hover:translate-y-0">
        {label}
      </span>
    </a>
  );
}

function ColLabel({ children }: { children: string }) {
  return (
    <span className="font-body text-lg font-normal text-black/50 md:text-sm">
      {children}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 flex h-[500px] flex-col justify-between overflow-hidden bg-red px-5 py-6 md:px-[30px] md:py-8">

      {/* Top — programme + columns (gap=64px in Framer between this and bottom) */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

        {/* Programme — 367px in Framer, gap=8px label→desc */}
        <div className="flex flex-col gap-2 md:max-w-[367px]">
          <ColLabel>{footerContent.programme.label}</ColLabel>
          <p className="font-headline text-sm font-semibold leading-snug tracking-tight md:text-xl">
            {footerContent.programme.description}
          </p>
        </div>

        {/* Right columns — gap=64px between each in Framer */}
        <div className="flex gap-8 md:gap-16">

          {/* Navigation — label→links gap=8px, links gap=16px */}
          <div className="flex flex-col gap-2">
            <ColLabel>{footerContent.navigation.label}</ColLabel>
            <div className="flex flex-col gap-2 pt-2 md:gap-4">
              {footerContent.navigation.links.map(({ label, href }) => (
                <RollLink key={href} label={label} href={href} className="text-lg  md:text-base" />
              ))}
            </div>
          </div>

          {/* Contact — gap=8px */}
          <div className="flex flex-col gap-2">
            <ColLabel>{footerContent.contact.label}</ColLabel>
            <div className="pt-2">
              <RollLink
                label={footerContent.contact.email}
                href={`mailto:${footerContent.contact.email}`}
                className="text-lg md:text-base"
              />
            </div>
          </div>

          {/* Connect — gap=8px throughout (label + links all same stack) */}
          <div className="flex flex-col gap-2">
            <ColLabel>{footerContent.connect.label}</ColLabel>
            <div className="flex flex-col gap-2 pt-2">
              {footerContent.connect.links.map(({ label, href }) => (
                <RollLink key={label} label={label} href={href} className="text-lg md:text-base" />
              ))}
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

        {/* Logo — always */}
        <Image
          src={footerContent.logo.src}
          alt={footerContent.logo.alt}
          width={footerContent.logo.width}
          height={footerContent.logo.height}
          className="h-[66px] w-auto self-start brightness-0 md:h-[98px]"
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
