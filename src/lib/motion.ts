import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const stagger = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const marqueeAnimation = {
  animate: {
    x: ["0%", "-50%"],
    transition: { repeat: Infinity, ease: "linear", duration: 20 },
  },
};

export const accordionVariants: Variants = {
  open: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  closed: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

export const viewport = { once: true, margin: "-80px" };
