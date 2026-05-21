import { BrutalismIcon } from "@/components";
import { Accordion } from "./Accordion";
import { faqContent } from "./faq.data";

export function Faq() {
  return (
    <section
      id="faq"
      className="relative z-10 bg-black px-5 py-24 text-white md:px-8 md:py-[100px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16">
        <header className="flex w-full max-w-[718px] flex-col gap-3 self-start">
          <h2 className="font-headline text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-red">{faqContent.title1}</span>
            {" "}
            <span className="text-white">{faqContent.title2}</span>
          </h2>
        </header>
        <Accordion items={faqContent.items} />
      </div>
    </section>
  );
}
