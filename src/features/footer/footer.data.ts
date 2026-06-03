export const footerContent = {
  programme: {
    label: "( Programme )",
    description: "A knowledge-sharing programme for people who build things.",
  },
  navigation: {
    label: "( Navigation )",
    links: [
      { label: "Home",     href: "#hero" },
      { label: "About",    href: "#about" },
      { label: "Formats", href: "#formats" },
      { label: "Reasons",  href: "#reasons" },
    ],
  },
  contact: {
    label: "( Contact )",
    email: "gcx@eg.dk",
  },
  connect: {
    label: "( Connect )",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "LinkedIn",  href: "https://linkedin.com" },
    ],
  },
  copyright: "© 2026 EG. All rights reserved.",
  poweredBy: "Powered by:",
  logo: {
    src: "/decoded_logo_footer.svg",
    alt: "Decoded",
    width: 1239,
    height: 134,
  },
} as const;
