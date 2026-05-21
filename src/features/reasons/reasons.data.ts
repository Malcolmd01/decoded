export type Reason = {
  number: string;
  title: string;
  description: string;
};

export const reasonsContent = {
  title1: "FOUR REASONS TO",
  title2: "SAY YES",
  title3:".",
  intro:
    "Internal or external. Every speaker gets a focused audience, formal recognition, and real impact.",
  reasons: [
    {
      number: "1",
      title: "Reach a focused audience",
      description:
        "You're not presenting to a passive crowd. Decoded audiences are professionals from across disciplines who will apply what you share in real work the very next day.",
    },
    {
      number: "2",
      title: "Strengthen your personal brand",
      description:
        "Your name, photo, and bio go across all Decoded communications Viva Engage, LinkedIn, and event materials. Real public reach, inside and outside the organisation.",
    },
    {
      number: "3",
      title: "Formal recognition",
      description:
        "Walk away with a Decoded Speaker Certificate, a curated gift, and a dedicated post-event LinkedIn shoutout that reaches your own professional network.",
    },
    {
      number: "4",
      title: "Network with the team",
      description:
        "Full access to the session and post-event networking. Meet other speakers, team leads, and decision-makers in a setting that actually encourages real conversation.",
    },
  ] satisfies Reason[],
} as const;
