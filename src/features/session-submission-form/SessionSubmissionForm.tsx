"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sessionSubmissionSchema,
  type SessionSubmissionFormValues,
} from "@/lib/validation/schema";

export function SessionSubmissionForm() {
  const form = useForm<SessionSubmissionFormValues>({
    resolver: zodResolver(sessionSubmissionSchema),
    defaultValues: {
      speakerType: "employee",
      businessUnit: "",
      team: "",
      jobTitle: "",
      email: "",
      linkedin: "",
      proposedTopic: "",
      deliveryPreference: "no-preference",
      preferredSessionFormat: "tech-talk",
      sessionAbstract: "",
      speakerBio: "",
      avRequirements: "",
      heardAboutDecoded: "",
      // Add these if they exist in your schema
      // fullName: "",
      // company: "",
      // phoneNumber: "",
    },
    // shouldUnregister: true,
  });

  const speakerType = form.watch("speakerType");

  async function onSubmit(values: SessionSubmissionFormValues) {
    console.log(values);
    await fetch("/api/session-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  }

  const sessionFormats = useMemo(() => [
    { value: "tech-talk", label: "Tech Talk" },
    { value: "live-demo", label: "Live Demo" },
    { value: "debate-panel", label: "Debate Panel" },
    { value: "fireside-chat", label: "Fireside Chat" },
    { value: "workshop", label: "Workshop" },
  ], []);

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Decoded Session Submission</h1>
        <p className="mt-2 text-gray-600">Submit your session proposal for consideration.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        {/* Speaker Type */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Speaker Type</label>
          <Controller
            control={form.control}
            name="speakerType"
            render={({ field }) => (
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="employee"
                    checked={field.value === "employee"}
                    onChange={field.onChange}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span>Employee</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="external"
                    checked={field.value === "external"}
                    onChange={field.onChange}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span>External Speaker</span>
                </label>
              </div>
            )}
          />
          {form.formState.errors.speakerType && (
            <p className="text-sm text-red-500">{form.formState.errors.speakerType.message}</p>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* ABOUT YOU */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">About You</h2>

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

        <hr className="border-gray-200" />

        {/* YOUR SESSION */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Your Session</h2>

          <CustomInput form={form} name="proposedTopic" label="Proposed Topic / Title" />

          {/* Delivery Preference */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Delivery Preference</label>
            <Controller
              control={form.control}
              name="deliveryPreference"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  {["online", "in-person", "no-preference"].map((value) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={value}
                        checked={field.value === value}
                        onChange={field.onChange}
                        className="accent-red-600 w-4 h-4"
                      />
                      <span className="capitalize">
                        {value.replace("-", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
            {form.formState.errors.deliveryPreference && (
              <p className="text-sm text-red-500">{form.formState.errors.deliveryPreference.message}</p>
            )}
          </div>

          {/* Preferred Session Format */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preferred Session Format</label>
            <Controller
              control={form.control}
              name="preferredSessionFormat"
              render={({ field }) => (
                <div className="grid gap-3 md:grid-cols-2">
                  {sessionFormats.map((item) => (
                    <label key={item.value} className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <input
                        type="radio"
                        value={item.value}
                        checked={field.value === item.value}
                        onChange={field.onChange}
                        className="accent-red-600 w-4 h-4"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              )}
            />
            {form.formState.errors.preferredSessionFormat && (
              <p className="text-sm text-red-500">{form.formState.errors.preferredSessionFormat.message}</p>
            )}
          </div>

          <CustomTextArea form={form} name="sessionAbstract" label="Session Abstract" />
          <CustomTextArea form={form} name="speakerBio" label="Speaker Bio" />
          <CustomInput form={form} name="avRequirements" label="AV / Tech Requirements" />
          <CustomTextArea form={form} name="heardAboutDecoded" label="How did you hear about Decoded?" />
        </section>

        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 py-4 text-lg font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Submit Proposal
        </button>
      </form>
    </div>
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
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <input
            type={type}
            {...field}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-red-500 focus:outline-none"
          />
        )}
      />
      {form.formState.errors[name] && (
        <p className="text-sm text-red-500">{form.formState.errors[name]?.message}</p>
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
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <textarea
            {...field}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[140px] focus:border-red-500 focus:outline-none"
          />
        )}
      />
      {form.formState.errors[name] && (
        <p className="text-sm text-red-500">{form.formState.errors[name]?.message}</p>
      )}
    </div>
  );
}