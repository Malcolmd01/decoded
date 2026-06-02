"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  sessionSubmissionSchema,
  type SessionSubmissionFormValues,
} from "@/lib/validation/schema";

function SuccessModal() {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-5 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-white/20 bg-black/90 p-10 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red">
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-headline text-2xl font-semibold text-white">Proposal submitted!</h2>
          <p className="font-body text-white/60">Check your inbox for a confirmation. We'll be in touch soon.</p>
        </div>
        <p className="font-body text-sm text-white/40">
          Redirecting to home in <span className="text-white/70">{count}</span>s…
        </p>
        <button
          onClick={() => router.push("/")}
          className="w-full rounded-lg bg-red py-3 font-body font-semibold text-white transition-opacity hover:opacity-90"
        >
          Go home now
        </button>
      </motion.div>
    </motion.div>
  );
}

export function SpeakerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SessionSubmissionFormValues>({
    resolver: zodResolver(sessionSubmissionSchema),
    defaultValues: {
      speakerType: "employee",
      fullName: "",
      businessUnit: "",
      team: "",
      jobTitle: "",
      email: "",
      linkedin: "",
      company: "",
      phoneNumber: "",
      proposedTopic: "",
      deliveryPreference: "no-preference",
      preferredSessionFormat: "tech-talk",
      sessionAbstract: "",
      speakerBio: "",
      avRequirements: "",
      heardAboutDecoded: "",
    } as DefaultValues<SessionSubmissionFormValues>,
    // shouldUnregister: true,
  });

  const speakerType = form.watch("speakerType");

  async function onSubmit(values: SessionSubmissionFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/speaker-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const sessionFormats = useMemo(() => [
    { value: "tech-talk", label: "Tech Talk" },
    { value: "live-demo", label: "Live Demo" },
    { value: "debate-panel", label: "Debate Panel" },
    { value: "fireside-chat", label: "Fireside Chat" },
    { value: "workshop", label: "Workshop" },
  ], []);

  return (
    <>
    <AnimatePresence>{submitted && <SuccessModal />}</AnimatePresence>
    <div className="mx-auto max-w-5xl rounded-2xl border border-white/20 bg-black/70 p-8 backdrop-blur-md md:p-10">
      <div className="mb-10">
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-white">Decoded Session Submission</h1>
        <p className="mt-2 font-body text-white/60">Submit your session proposal for consideration.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        {/* Speaker Type */}
        <div className="space-y-3">
          <label className="block font-body text-sm font-medium text-white/80">Speaker Type</label>
          <Controller
            control={form.control}
            name="speakerType"
            render={({ field }) => (
              <div className="flex gap-8">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="employee"
                    checked={field.value === "employee"}
                    onChange={field.onChange}
                    className="accent-red h-4 w-4"
                  />
                  <span className="font-body text-white">Employee</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="external"
                    checked={field.value === "external"}
                    onChange={field.onChange}
                    className="accent-red h-4 w-4"
                  />
                  <span className="font-body text-white">External Speaker</span>
                </label>
              </div>
            )}
          />
          {form.formState.errors.speakerType && (
            <p className="font-body text-sm text-red-400">{form.formState.errors.speakerType.message}</p>
          )}
        </div>

        <hr className="border-white/20" />

        {/* ABOUT YOU */}
        <section className="space-y-6">
          <h2 className="font-headline text-xl font-semibold text-white">About You</h2>

          {speakerType === "external" && (
            <div className="grid gap-6 md:grid-cols-2">
              <CustomInput form={form} name="fullName" label="Full Name" />
              <CustomInput form={form} name="company" label="Company" />
              <CustomInput form={form} name="jobTitle" label="Job Title / Role" />
              <CustomInput form={form} name="email" label="Email Address" type="email" />
              <CustomInput form={form} name="linkedin" label="LinkedIn Profile" />
              <CustomInput form={form} name="phoneNumber" label="Phone Number" type="tel" />
            </div>
          )}

          {speakerType === "employee" && (
            <div className="grid gap-6 md:grid-cols-2">
              <CustomInput form={form} name="fullName" label="Full Name" />
              <CustomInput form={form} name="businessUnit" label="Business Unit" />
              <CustomInput form={form} name="team" label="Team" />
              <CustomInput form={form} name="jobTitle" label="Job Title / Role" />
              <CustomInput form={form} name="email" label="Email Address" type="email" />
              <CustomInput form={form} name="linkedin" label="LinkedIn Profile" />
            </div>
          )}
        </section>

        <hr className="border-white/20" />

        {/* YOUR SESSION */}
        <section className="space-y-6">
          <h2 className="font-headline text-xl font-semibold text-white">Your Session</h2>

          <CustomInput form={form} name="proposedTopic" label="Proposed Topic / Title" />

          {/* Delivery Preference */}
          <div className="space-y-3">
            <label className="block font-body text-sm font-medium text-white/80">Delivery Preference <span className="text-red-400">*</span></label>
            <Controller
              control={form.control}
              name="deliveryPreference"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  {["online", "in-person", "no-preference"].map((value) => (
                    <label key={value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value={value}
                        checked={field.value === value}
                        onChange={field.onChange}
                        className="accent-red h-4 w-4"
                      />
                      <span className="font-body capitalize text-white">
                        {value.replace("-", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
            {form.formState.errors.deliveryPreference && (
              <p className="font-body text-sm text-red-400">{form.formState.errors.deliveryPreference.message}</p>
            )}
          </div>

          {/* Preferred Session Format */}
          <div className="space-y-3">
            <label className="block font-body text-sm font-medium text-white/80">Preferred Session Format <span className="text-red-400">*</span></label>
            <Controller
              control={form.control}
              name="preferredSessionFormat"
              render={({ field }) => (
                <div className="grid gap-3 md:grid-cols-2">
                  {sessionFormats.map((item) => (
                    <label key={item.value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 p-3 hover:bg-white/10">
                      <input
                        type="radio"
                        value={item.value}
                        checked={field.value === item.value}
                        onChange={field.onChange}
                        className="accent-red h-4 w-4"
                      />
                      <span className="font-body text-white">{item.label}</span>
                    </label>
                  ))}
                </div>
              )}
            />
            {form.formState.errors.preferredSessionFormat && (
              <p className="font-body text-sm text-red-400">{form.formState.errors.preferredSessionFormat.message}</p>
            )}
          </div>

          <CustomTextArea form={form} name="sessionAbstract" label="Session Abstract" />
          <CustomTextArea form={form} name="speakerBio" label="Speaker Bio" />
          <CustomInput form={form} name="avRequirements" label="AV / Tech Requirements" />
          <CustomTextArea form={form} name="heardAboutDecoded" label="How did you hear about Decoded?" />
        </section>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-red py-4 font-body text-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Submitting…" : "Submit Proposal"}
        </button>

        {submitError && (
          <p className="font-body text-center text-sm text-red-400">{submitError}</p>
        )}
      </form>
    </div>
    </>
  );
}

/* ====================== Reusable Field Components ====================== */

function CustomInput({
  form,
  name,
  label,
  type = "text",
}: {
  form: any;
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block font-body text-sm font-medium text-white/80">{label} <span className="text-red-400">*</span></label>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <input
            type={type}
            {...field}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 font-body text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
          />
        )}
      />
      {form.formState.errors[name] && (
        <p className="font-body text-sm text-red-400">{form.formState.errors[name]?.message}</p>
      )}
    </div>
  );
}

function CustomTextArea({
  form,
  name,
  label,
}: {
  form: any;
  name: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block font-body text-sm font-medium text-white/80">{label} <span className="text-red-400">*</span></label>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <textarea
            {...field}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 min-h-[140px] font-body text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
          />
        )}
      />
      {form.formState.errors[name] && (
        <p className="font-body text-sm text-red-400">{form.formState.errors[name]?.message}</p>
      )}
    </div>
  );
}
