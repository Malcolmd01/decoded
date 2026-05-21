import { BrutalismIcon } from "@/components";
import { ReasonCard } from "./ReasonCard";
import { reasonsContent } from "./reasons.data";

export function Reasons() {
  return (
    <section
      id="why-choose-us"
      className="relative z-10 bg-black px-5 py-24 text-white md:px-8 md:py-[100px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16">
        <header className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="flex max-w-[718px] flex-col gap-3">
            <h2 className="font-headline tracking-wide text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-red">{reasonsContent.title1}</span>
              {" "}
              <span className="text-white">{reasonsContent.title2}</span>
              <span className="text-red">{reasonsContent.title3}</span>
            </h2>
          </div>
          <p className="max-w-[467px] self-end font-body text-base font-bold leading-relaxed md:text-lg">
            {reasonsContent.intro}
          </p>
        </header>
        <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-2">
          {reasonsContent.reasons.map((reason) => (
            <ReasonCard key={reason.number} reason={reason} />
          ))}
        </div>
      </div>
    </section>
  );
}
