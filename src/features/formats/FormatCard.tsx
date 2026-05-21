import { BrutalismIcon } from "@/components";
import type { Format } from "./formats.data";

type Props = {
  format: Format;
};

export function FormatCard({ format }: Props) {
  return (
    <article className="grid w-full grid-cols-1 gap-10 rounded-2xl bg-black p-8 text-white md:grid-cols-2 md:gap-16 md:p-[30px]">
      <div className="order-last flex flex-col justify-between gap-8 md:order-first md:h-[32px]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white">
            <BrutalismIcon className="size-[20px]" />
            <span className="font-body text-base font-bold">
              {format.name}
            </span>
          </div>
          <h3 className="font-headline text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            {format.headline}
          </h3>
        </div>
        <p className="font-body text-[16px] font-semibold leading-relaxed text-white md:text-lg">
          {format.description}
        </p>
      </div>
      <div className="aspect-square w-full rounded-lg bg-white" />
    </article>
  );
}
