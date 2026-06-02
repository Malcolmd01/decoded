export type Format = {
  name: string;
  description: string;
};

export const formatsContent = {
  title: "PICK YOUR FORMAT. WE FILL THE ROOM",
  intro:
    "Six thoughtfully designed formats to suit the speaker, the subject, and the experience you want to create. We can mix and match formats to make the session your own.",
  formats: [
    {
      name: "Tech Talks",
      description:
        "A focused presentation that explores a topic in depth, led by a speaker with real-world experience. Ideal for sharing insights, technical learnings, industry trends, and followed by an interactive Q&A session.",
    },
    {
      name: "Live Demo",
      description:
        "A hands-on walkthrough that brings concepts to life through practical demonstration. Perfect for showcasing tools, workflows, products, prototypes, or technical solutions in a more engaging and visual way.",
    },
    {
      name: "Debate",
      description:
        "A structured discussion where two sides explore different perspectives on a topic or idea. Designed to spark thoughtful conversations, challenge assumptions, and encourage audience participation.",
    },
    {
      name: "Panel",
      description:
        "A moderated conversation featuring multiple speakers sharing diverse experiences and viewpoints. Best suited for broader themes, emerging trends, or topics that benefit from varied industry perspectives.",
    },
    {
      name: "Fireside Chat",
      description:
        "An informal and conversational session between a host and a guest speaker. More personal and story-driven, this format focuses on experiences, lessons, and honest insights rather than formal presentations.",
    },
    {
      name: "Workshop",
      description:
        "An interactive, hands-on session where participants actively learn, build, or practice something new. Attendees leave with practical knowledge, useful takeaways, or tangible outcomes they can apply immediately.",
    },
  ] satisfies Format[],
} as const;
