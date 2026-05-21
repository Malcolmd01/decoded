export type Format = {
  name: string;
  headline: string;
  description: string;
};

export const formatsContent = {
  eyebrow: "Session Formats",
  title: "PICK YOUR FORMAT. WE FILL THE ROOM",
  intro:
    "Six formats designed to match the content, the speaker, and the crowd. Formats can be combined.",
  formats: [
    {
      name: "Tech Talks",
      headline: "DEEP-DIVE TALKS",
      description:
        "45 minutes of structured insight, 15 minutes of honest Q&A. For when someone has done the work and the room needs to hear it.",
    },
    {
      name: "Live Demo",
      headline: "BUILD-ALONG SESSION",
      description:
        "Speaker codes or configures live. The audience follows. Ideal for tools, pipelines, APIs, and open source. Seeing is understanding.",
    },
    {
      name: "Debate",
      headline: "TWO SIDES, ONE STAGE",
      description:
        "SQL vs NoSQL. Build vs Buy. Microservices vs Monolith. Structured, timed, opinionated. The audience votes at the end.",
    },
    {
      name: "Panel",
      headline: "MULTI-VOICE DISCUSSION",
      description:
        "3–4 speakers, a sharp moderator, real audience questions. Best for big topics that don't have clean answers.",
    },
    {
      name: "Fireside Chat",
      headline: "INFORMAL INTERVIEW",
      description:
        "One host, one expert. Career paths, hard lessons, honest opinions. Low prep, high authenticity. Exceptional for senior leaders.",
    },
    {
      name: "Workshop",
      headline: "HANDS-ON SESSION",
      description:
        "30 min talk, 45 min group problem-solving. Highest retention of all formats. Speaker facilitates — worth the extra planning.",
    },
  ] satisfies Format[],
} as const;
