import Image from "next/image";
import { Button } from "@/components";
import { heroContent } from "./hero.data";
import { HeroWave } from "./HeroWave";

export function Hero() {
  return (
    <section
      id="hero"
      className="sticky top-0 z-10 flex min-h-screen w-full flex-col items-center justify-center gap-16 overflow-hidden bg-black px-0 py-[100px] text-white"
    >
      <HeroWave />
<div className="relative z-[2] flex w-full max-w-[1440px] flex-col items-center justify-center overflow-hidden px-5 mt-12 md:px-8">
  <div className="flex w-full flex-col items-center justify-center">
    <Image
      src={heroContent.logo.src}
      alt={heroContent.logo.alt}
      width={heroContent.logo.width}
      height={heroContent.logo.height}
      priority
      style={{
        width: "100%",
        maxWidth: "auto",
        height: "auto",
      }}
    />
  </div>

  <div className="lg:mt-32 mt-12 md:mt-24 flex w-full lg:w-[1000px] md:w-[600px] flex-col items-center justify-center gap-8 text-center">
    <h1 className=" w-[1000px] max-w-full font-body text-xl font-semibold leading-snug tracking-normal text-white lg:text-[20px] text-[16px]">
      {heroContent.headline}
    </h1>

    <Button variant="light" aria-label={heroContent.cta}>
      {heroContent.cta}
    </Button>
  </div>
</div>
    </section>
  );
}
