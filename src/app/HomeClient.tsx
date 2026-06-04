"use client";

import { useState } from "react";
import { Loader } from "@/features/intro";
import { Nav } from "@/features/nav/Nav";
import { Hero } from "@/features/hero";
import { Formats } from "@/features/formats";
import { SpeakerFormModal } from "@/features/speaker-form";

export function HomeClient({
  before,
  after,
  footer,
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const open = () => setFormOpen(true);

  return (
    <>
      <Loader />
      <Nav onApply={open} />
      <main id="main-content" className="flex flex-1 flex-col pb-[680px] md:pb-[650px]">
        <Hero onApply={open} />
        <div className="relative">
          {before}
          <Formats onApply={open} />
          {after}
        </div>
        {footer}
      </main>
      <SpeakerFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
