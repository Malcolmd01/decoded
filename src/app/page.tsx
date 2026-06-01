import { Hero } from "@/features/hero";
import { About } from "@/features/about";
import { Ticker } from "@/features/ticker";
import { Formats } from "@/features/formats";
import { Reasons } from "@/features/reasons";
import { Faq } from "@/features/faq";
import { Footer } from "@/features/footer";
import { Loader } from "@/features/intro";
import { Nav } from "@/features/nav/Nav";
export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <main className="flex flex-1 flex-col pb-[500px]">
      <Hero />
      <div className="relative">
        <About />
        <Ticker />
        <Formats />
        <Ticker />
        <Reasons />
        <Faq />
      </div>
      <Footer />
    </main>
    </>
  );
}
