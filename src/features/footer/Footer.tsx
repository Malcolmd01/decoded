import Image from "next/image";
import { footerContent } from "./footer.data";

export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 flex h-[500px] flex-col justify-end gap-9 overflow-hidden bg-red px-8 pb-8 pt-24 md:px-[30px]">
      <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-end gap-8">
    {/* Copyright */}
  <p className="font-body text-base md:text-[20px] font-normal">
    {footerContent.copyright}
  </p>
  {/* Contact Info */}
  <div className="flex flex-col items-start gap-1 md:items-end">
    <span className="font-body text-base md:text-[20px] font-normal">
      {footerContent.contactLabel}
    </span>
    <a
      href={`mailto:${footerContent.email}`}
      className="group relative overflow-hidden font-headline text-3xl font-semibold tracking-tight md:text-4xl"
    >
      <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
        {footerContent.email}
      </span>
      <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
        {footerContent.email}
      </span>
    </a>
  </div>


</div>
      <div className="flex w-full items-center justify-center">
        <Image
          src={footerContent.logo.src}
          alt={footerContent.logo.alt}
          width={footerContent.logo.width}
          height={footerContent.logo.height}
          className="h-auto w-full max-w-full brightness-0 "
        />
      </div>
    </footer>
  );
}
