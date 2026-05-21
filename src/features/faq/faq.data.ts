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
        "Sessions are scheduled regularly throughout the year. Frequency depends on speaker availability and team planning. Attendance grows every quarter.",
    },
    {
      question: "WHO CAN BE A SPEAKER?",
      answer:
        "Any internal employee with something worth sharing — from any team, any level. External experts, founders, and researchers are equally welcome. No prior speaking experience required.",
    },
    {
      question: "CAN I ATTEND REMOTELY?",
      answer:
        "Yes. Online sessions are hosted via Zoom or Teams and recorded for internal use. In-person sessions include full logistics support for local and travelling speakers.",
    },
    {
      question: "HOW DO I SUGGEST A TOPIC OR SPEAKER?",
      answer:
        "Reach out at gcx@eg.dk or submit the speaker proposal form below. Team members who refer external speakers are eligible for referral recognition.",
    },
    {
      question: "HOW ARE SPEAKERS RECOGNISED?",
      answer:
        "Digital badges, a speaker certificate, branded gifts, LinkedIn shoutouts, and leadership recognition. Internal speakers are also eligible under the Amplify Awards programme.",
    },
    {
      question: "HOW MUCH TIME DOES IT TAKE?",
      answer:
        "Typically 11–22 hours across topic scoping, content creation, rehearsal, and delivery. The programme team handles all logistics, promotion, and post-event follow-up.",
    },
  ] satisfies Faqs[],
} as const;
