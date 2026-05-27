export type Faqs = {
  question: string;
  answer: string;
};

export const faqContent = {
  title1: "FREQUENTLY ASKED",
  title2: "QUESTIONS",
  items: [
    {
      question: "HOW OFTEN DOES DECODED RUN?",
      answer:
        "Sessions are scheduled regularly, frequency depends on speaker availability and team planning.",
    },
    {
      question: "WHO CAN BE A SPEAKER?",
      answer:
        "Anyone with valuable insights, experiences, or ideas to share, including external experts, founders, researchers, as well as internal employees with something meaningful worth sharing.",
    },
    {
      question: "CAN I ATTEND REMOTELY?",
      answer:
        "Yes! Online sessions are hosted via Zoom/Teams and recorded for internal use.",
    },
    {
      question: "HOW DO I SUGGEST A SPEAKER OR TOPIC?",
      answer:
        "Reach out to the organising team (gcx@eg.dk) directly or refer an external expert through the form we share. Keep an eye out, we'll promote it widely so you can apply there. Plus, win exciting gifts on referral!",
    },

  ] satisfies Faqs[],
} as const;
