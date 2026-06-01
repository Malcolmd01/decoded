// lib/validations/session-form.ts

import { z } from "zod";

export const speakerTypeSchema = z.enum([
  "employee",
  "external",
]);

const employeeSchema = z.object({
  speakerType: z.literal("employee"),
  fullName: z.string().min(1),
  businessUnit: z.string().min(1, "Business Unit is required"),
  team: z.string().min(1, "Team is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  email: z.email("Invalid email"),
  linkedin: z.url().refine(
  (url) => url.includes("linkedin.com"),
  "Must be a LinkedIn URL",
)
});

const externalSpeakerSchema = z.object({
  speakerType: z.literal("external"),
  fullName: z.string().min(1),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  email: z.email("Invalid email"),
  linkedin: z.url().refine(
  (url) => url.includes("linkedin.com"),
  "Must be a LinkedIn URL",
),
  phoneNumber: z.string().min(1),
});

const sessionFields = z.object({
  proposedTopic: z.string().min(1),

  deliveryPreference: z.enum([
    "online",
    "in-person",
    "no-preference",
  ]),

  preferredSessionFormat: z.enum([
    "tech-talk",
    "live-demo",
    "debate-panel",
    "fireside-chat",
    "workshop",
  ]),

  sessionAbstract: z.string().min(20),

  speakerBio: z.string().min(1),

  avRequirements: z.string().min(1),

  heardAboutDecoded: z.string().min(1),
});

export const sessionSubmissionSchema = z.intersection(
  z.discriminatedUnion("speakerType", [
    employeeSchema,
    externalSpeakerSchema,
  ]),
  sessionFields,
);

export type SessionSubmissionFormValues =
  z.infer<typeof sessionSubmissionSchema>;