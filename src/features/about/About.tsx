import { aboutContent } from "./about.data";

export function About() {
  return (
    <section
      id="about"
      className="relative z-10 flex min-h-screen items-center justify-center bg-black px-5 py-[32px] text-red md:px-8"
    >
      <h2 className="max-w-[1440px] text-center font-headline text-4xl font-semibold leading-[1.05] tracking-wide md:text-6xl lg:text-7xl">
        {aboutContent.text}
      </h2>
    </section>
  );
}
