export type FormatMeta = {
  duration: string;
  speakers: string;
  structure: string;
  slides: string;
  audienceSize: string;
  moderation: string;
};

export type ExpectBlock = {
  title: string;
  desc: string;
};

export type Format = {
  name: string;
  description: string;
  whatItIs: string;
  bestFor: string[];
  meta: FormatMeta;
  expect: ExpectBlock[];
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
      whatItIs:
        "A focused presentation that explores a topic in depth, led by a speaker with real-world experience. More than a surface overview. This is where expertise meets storytelling, followed by an open Q&A that keeps the room engaged.",
      bestFor: [
        "Technical findings and engineering deep-dives",
        "Industry trends with a clear point of view",
        "Case studies from real projects",
        "Strong opinions backed by experience",
        "Research and data-driven insights",
      ],
      meta: {
        duration: "30–45 min",
        speakers: "1 solo speaker",
        structure: "Presentation + Q&A",
        slides: "Recommended",
        audienceSize: "Any",
        moderation: "Not required",
      },
      expect: [
        {
          title: "A single, focused perspective",
          desc: "One speaker. One topic. The depth comes from preparation and lived experience, not from covering everything, but from covering one thing properly.",
        },
        {
          title: "Real takeaways, not theory",
          desc: "The best deep-dives leave the room with something concrete: a framework, a shift in thinking, or a method they can use immediately.",
        },
        {
          title: "An open Q&A to close",
          desc: "The presentation sets the stage. The Q&A is where the real conversation happens: unscripted, audience-driven, and often the most valuable part of the session.",
        },
      ],
    },
    {
      name: "Live Demo",
      description:
        "A hands-on walkthrough that brings concepts to life through practical demonstration. Perfect for showcasing tools, workflows, products, prototypes, or technical solutions in a more engaging and visual way.",
      whatItIs:
        "A hands-on walkthrough that brings concepts to life through practical demonstration. The speaker builds, runs, or ships something live while the audience follows along in real time.",
      bestFor: [
        "Product walkthroughs and feature demos",
        "Workflow and tooling breakdowns",
        "Prototypes and technical solutions",
        "Showing what something does, not just what it is",
        "Anything better seen than explained",
      ],
      meta: {
        duration: "45–60 min",
        speakers: "1 solo speaker",
        structure: "Live demo + Q&A",
        slides: "Optional",
        audienceSize: "Any",
        moderation: "Not required",
      },
      expect: [
        {
          title: "Concepts made visible",
          desc: "Watching something get built in real time is far more memorable than hearing it described. The audience leaves knowing exactly how it works.",
        },
        {
          title: "Screen-share friendly",
          desc: "The speaker shares their screen, walks through the steps, and narrates their thinking as they go. Messy and real is often more valuable than polished and rehearsed.",
        },
        {
          title: "Immediately applicable",
          desc: "Attendees walk away with something they can try themselves. Not inspiration for someday. Tools and methods for right now.",
        },
      ],
    },
    {
      name: "Debate",
      description:
        "A structured discussion where two sides explore different perspectives on a topic or idea. Designed to spark thoughtful conversations, challenge assumptions, and encourage audience participation.",
      whatItIs:
        "A structured discussion where two speakers take opposing positions on a topic or idea. Designed to spark thoughtful conversation, challenge assumptions, and give the audience something to wrestle with.",
      bestFor: [
        "Competing approaches to the same problem",
        "Controversial ideas the industry avoids",
        "Hot takes worth having out loud",
        "Topics where reasonable people genuinely disagree",
        "Decisions that don't have a clean right answer",
      ],
      meta: {
        duration: "30–40 min",
        speakers: "2 speakers",
        structure: "Opening + rebuttals + Q&A",
        slides: "Optional",
        audienceSize: "Any",
        moderation: "Required",
      },
      expect: [
        {
          title: "Two strong positions",
          desc: "Each speaker argues their side clearly and confidently. The goal is not to win, but to sharpen thinking and surface perspectives the room may not have considered.",
        },
        {
          title: "A moderator who keeps it honest",
          desc: "The moderator ensures both sides get equal time, redirects when needed, and brings the audience into the conversation.",
        },
        {
          title: "Audience vote optional",
          desc: "Open an audience poll before and after. Seeing minds change in real time is one of the most engaging things a room can experience.",
        },
      ],
    },
    {
      name: "Panel",
      description:
        "A moderated conversation featuring multiple speakers sharing diverse experiences and viewpoints. Best suited for broader themes, emerging trends, or topics that benefit from varied industry perspectives.",
      whatItIs:
        "A moderated conversation featuring multiple speakers sharing diverse experiences and viewpoints. Best suited for broader themes, emerging trends, or topics that genuinely benefit from varied industry perspectives in the same room.",
      bestFor: [
        "Industry-wide trends and shifts",
        "Topics that look different depending on your role",
        "Cross-team or cross-company conversations",
        "Community themes with no single authority",
        "Questions worth exploring, not just answering",
      ],
      meta: {
        duration: "45–60 min",
        speakers: "3–5 panelists",
        structure: "Moderated discussion + Q&A",
        slides: "Not required",
        audienceSize: "Any",
        moderation: "Required",
      },
      expect: [
        {
          title: "Many voices, one conversation",
          desc: "The value of a panel is in the contrast. When speakers come from different backgrounds, the friction between their answers is where the insight lives.",
        },
        {
          title: "A moderator who drives depth",
          desc: "Good moderation keeps the panel from staying surface-level. The moderator pushes for specifics, follows threads, and makes sure every voice gets heard.",
        },
        {
          title: "Audience questions to close",
          desc: "The final stretch opens to the room. Often where the most honest and interesting exchanges happen.",
        },
      ],
    },
    {
      name: "Fireside Chat",
      description:
        "An informal and conversational session between a host and a guest speaker. More personal and story-driven, this format focuses on experiences, lessons, and honest insights rather than formal presentations.",
      whatItIs:
        "An informal, conversational session between a host and a guest speaker. More personal and story-driven than a formal talk. This format draws out the experiences, lessons, and honest insights that never make it into slide decks.",
      bestFor: [
        "Founder journeys and origin stories",
        "Career pivots and lessons learned the hard way",
        "Behind-the-scenes on major decisions or failures",
        "Guests who are better in conversation than on stage",
        "Honest takes that don't fit a formal format",
      ],
      meta: {
        duration: "20–30 min",
        speakers: "Host + 1 guest",
        structure: "Conversation + audience Q&A",
        slides: "Not required",
        audienceSize: "Any",
        moderation: "Host-led",
      },
      expect: [
        {
          title: "Relaxed, not rehearsed",
          desc: "No script. No slides. Just a host who asks the right questions and a guest who has something real to say. The best fireside chats feel like overhearing a conversation worth hearing.",
        },
        {
          title: "Story over structure",
          desc: "This format rewards guests with strong personal narratives. The messier and more honest the story, the more the room connects with it.",
        },
        {
          title: "Audience questions welcome",
          desc: "Leave the last few minutes open. The audience often has the one question the host did not think to ask.",
        },
      ],
    },
    {
      name: "Workshop",
      description:
        "An interactive, hands-on session where participants actively learn, build, or practice something new. Attendees leave with practical knowledge, useful takeaways, or tangible outcomes they can apply immediately.",
      whatItIs:
        "An interactive, participatory session where attendees actively learn, build, or practice something new. Everyone leaves with practical knowledge, a useful framework, or a tangible output they can apply the same day.",
      bestFor: [
        "Skills and techniques people can practice immediately",
        "Frameworks and mental models worth internalising",
        "Tools that need hands-on time to click",
        "Any topic where doing beats watching",
        "Groups who want to leave with something built",
      ],
      meta: {
        duration: "60–90 min",
        speakers: "1 facilitator",
        structure: "Intro + exercises + debrief",
        slides: "Optional",
        audienceSize: "Best under 40",
        moderation: "Facilitator-led",
      },
      expect: [
        {
          title: "Active, not passive",
          desc: "Attendees are not watching. They are doing. The facilitator guides the room through exercises designed to build understanding by working through it firsthand.",
        },
        {
          title: "Something to take home",
          desc: "Every workshop should end with a clear output. A completed exercise, a filled-in framework, a working prototype. Something the attendee can point to and use.",
        },
        {
          title: "A debrief to close",
          desc: "The final segment brings the room together to share what they built, reflect on what they learned, and ask the questions that came up along the way.",
        },
      ],
    },
  ] satisfies Format[],
};
