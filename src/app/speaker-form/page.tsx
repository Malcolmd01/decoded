import Link from "next/link";
import { SpeakerForm } from "@/features/speaker-form";

export default function SubmitSessionPage() {
  return (
    <main className="min-h-screen bg-red px-5 pt-16 pb-24 md:px-8 md:pt-24">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="group -ml-1 mb-6 inline-flex items-center gap-1.5 rounded px-1 py-2 font-body text-sm text-white/70 transition-colors hover:text-white md:mb-8"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          Back
        </Link>
        <SpeakerForm />
      </div>
    </main>
  );
}
