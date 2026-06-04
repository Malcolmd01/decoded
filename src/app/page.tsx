import dynamic from "next/dynamic";
import { HomeClient } from "./HomeClient";
import { About } from "@/features/about";
import { Ticker } from "@/features/ticker";
import { Footer } from "@/features/footer";

const Reasons = dynamic(() =>
  import("@/features/reasons").then((m) => ({ default: m.Reasons }))
);
const Faq = dynamic(() =>
  import("@/features/faq").then((m) => ({ default: m.Faq }))
);

export default function Home() {
  return (
    <HomeClient
      before={
        <>
          <About />
          <Ticker />
        </>
      }
      after={
        <>
          <Ticker />
          <Reasons />
          <Faq />
        </>
      }
      footer={<Footer />}
    />
  );
}
