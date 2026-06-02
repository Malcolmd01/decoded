import { z } from "zod";

export const speakerTypeSchema = z.enum([
  "employee",
  "external",
]);

const employeeSchema = z.object({
  speakerType: z.literal("employee"),
  fullName:     z.string().min(1, "Full name is required").max(100),
  businessUnit: z.string().min(1, "Business unit is required").max(100),
  team:         z.string().min(1, "Team is required").max(100),
  jobTitle:     z.string().min(1, "Job title is required").max(100),
  email:        z.email("Invalid email address"),
  linkedin:     z.url("Must be a valid URL").refine(
    (url) => url.includes("linkedin.com"),
    "Must be a LinkedIn URL",
  ),
});

const externalSpeakerSchema = z.object({
  speakerType: z.literal("external"),
  fullName:    z.string().min(1, "Full name is required").max(100),
  jobTitle:    z.string().min(1, "Job title is required").max(100),
  company:     z.string().min(1, "Company is required").max(100),
  email:       z.email("Invalid email address"),
  linkedin:    z.url("Must be a valid URL").refine(
    (url) => url.includes("linkedin.com"),
    "Must be a LinkedIn URL",
  ),
  phoneNumber: z.string().min(1, "Phone number is required").max(30),
});

const sessionFields = z.object({
  proposedTopic:          z.string().min(1, "Topic is required").max(200),
  deliveryPreference:     z.enum(["online", "in-person", "no-preference"]),
  preferredSessionFormat: z.enum([
    "tech-talk",
    "live-demo",
    "debate-panel",
    "fireside-chat",
    "workshop",
  ]),
  sessionAbstract:   z.string().min(20, "Abstract must be at least 20 characters").max(3000),
  speakerBio:        z.string().min(1, "Bio is required").max(1000),
  avRequirements:    z.string().min(1, "Please describe your AV requirements").max(500),
  heardAboutDecoded: z.string().min(1, "This field is required").max(500),
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
