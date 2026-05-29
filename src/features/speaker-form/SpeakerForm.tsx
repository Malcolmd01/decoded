"use client";

import { useState } from "react";
import { Button } from "@/components";

const formats = ["Tech Talks", "Live Demo", "Debate", "Panel", "Fireside Chat", "Workshop"];

function Field({
  label, name, type, required,
}: {
  label: string; name: string; type: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-xs font-semibold uppercase tracking-widest text-white/40">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="border-b border-white/20 bg-transparent pb-3 font-body text-base font-semibold text-white transition-colors focus:border-white focus:outline-none"
      />
    </div>
  );
}

export function SpeakerForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="apply"
      className="relative z-10 bg-black px-5 py-24 text-white md:px-8 md:py-[100px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16">
        <header className="max-w-[718px]">
          <h2 className="font-headline text-[32px] font-semibold leading-[1.05] tracking-wide md:text-[48px] lg:text-[64px]">
            <span className="text-red">APPLY TO</span>
            {" "}
            <span className="text-white">SPEAK</span>
          </h2>
        </header>

        {submitted ? (
          <p className="font-body text-xl font-semibold text-red">
            Thank you — we&apos;ll be in touch soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex max-w-[718px] flex-col gap-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="First name"  name="firstName" type="text"  required />
              <Field label="Last name"   name="lastName"  type="text"  required />
              <Field label="Email"       name="email"     type="email" required />
              <Field label="Company"     name="company"   type="text"  required />
              <Field label="Job title"   name="jobTitle"  type="text" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-semibold uppercase tracking-widest text-white/40">
                Session format
              </label>
              <select
                name="format"
                required
                defaultValue=""
                className="border-b border-white/20 bg-transparent pb-3 font-body text-base font-semibold text-white transition-colors focus:border-white focus:outline-none"
              >
                <option value="" disabled className="bg-black text-white/40">
                  Select a format
                </option>
                {formats.map((f) => (
                  <option key={f} value={f} className="bg-black">{f}</option>
                ))}
              </select>
            </div>

            <Field label="Talk title / topic" name="topic" type="text" required />

            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-semibold uppercase tracking-widest text-white/40">
                Abstract or bio
              </label>
              <textarea
                name="abstract"
                rows={5}
                required
                className="resize-none border-b border-white/20 bg-transparent pb-3 font-body text-base font-semibold text-white transition-colors focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <Button type="submit" variant="light">
                Submit application
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
