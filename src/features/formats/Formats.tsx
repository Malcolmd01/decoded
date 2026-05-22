import { FormatCard } from "./FormatCard";
import { formatsContent } from "./formats.data";

export function Formats() {
  return (
    <section
      id="formats"
      className="relative z-10 bg-red px-5 py-24 text-white md:px-8 md:py-[100px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16">
        <header className="flex flex-col lg:justify-between gap-8 md:flex-row md:items-end ">
          <h2 className="max-w-[718px] font-headline text-[32px] font-semibold leading-[1.05] tracking-wide md:text-[48px] lg:text-[64px]">
            {formatsContent.title}
          </h2>
          <p className="max-w-[467px] font-body text-[16px] font-semibold leading-relaxed text-black">
            {formatsContent.intro}
          </p>
        </header>
        <div className="flex flex-col gap-8">
          {formatsContent.formats.map((format) => (
            <FormatCard key={format.name} format={format} />
          ))}
        </div>
      </div>
    </section>
  );
}
