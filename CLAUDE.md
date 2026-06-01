# Decoded — Engineering Context

> **Source of truth is Framer.** Match layout, spacing, copy, and hierarchy exactly. Do not invent content.

---

## Stack

- Next.js 16.2.6 (App Router) · React 19.2.4 · TypeScript strict · pnpm · ESLint
- Tailwind CSS v4 — all styling · Framer Motion v12 — all animation
- `cn()` via `clsx` + `tailwind-merge` in `lib/cn.ts`
- No MUI, Emotion, or Radix unless explicitly requested
- Favicon: `metadata.icons: { icon: "/red-logo.svg" }` in `app/layout.tsx` — no `favicon.ico`

---

## Structure — Bulletproof React

```
src/
├── app/                        # Next.js App Router (layout.tsx, page.tsx, globals.css)
├── components/                 # Shared primitives: Button, BrutalismIcon
├── features/                   # One folder per page section — self-contained
│   ├── intro/
│   ├── nav/
│   ├── hero/
│   ├── about/
│   ├── ticker/
│   ├── formats/
│   ├── reasons/
│   ├── faq/
│   └── footer/
├── hooks/                      # useReducedMotion.ts
├── lib/                        # cn.ts
└── types/                      # Shared TypeScript types
```

Each feature folder:
```
features/hero/
├── index.ts          # Barrel export — public API
├── Hero.tsx          # Component
├── hero.data.ts      # Static copy / content
└── hero.types.ts     # Local types (if needed)
```

**Rules:**
- Import features via barrel only: `import { Hero } from "@/features/hero"`
- Cross-feature imports are forbidden — lift shared code to `components/` or `lib/`
- `"use client"` pushed as low as possible; wrap only interactive leaves

---

## Page Layout — `app/page.tsx`

```tsx
<Nav />                       {/* fixed top-0 z-50 — above everything */}
<main className="flex flex-1 flex-col pb-[500px]">
  <Hero />                    {/* sticky top-0 z-10 */}
  <div className="relative">  {/* sections scroll over Hero */}
    <About />
    <Ticker />
    <Formats />
    <Ticker />
    <Reasons />
    <Faq />
  </div>
  <Footer />                  {/* fixed bottom-0 z-0 h-[500px] */}
</main>
```

- Nav is `fixed top-0 z-50` — always above hero and all sections
- Hero is `sticky top-0 z-10` — pinned while sections scroll over it
- All body sections are `relative z-10` — same z-index, later in DOM = paint on top
- Footer is `fixed inset-x-0 bottom-0 z-0 h-[500px]` — always behind content, revealed at end
- `pb-[500px]` on main creates the scroll room to uncover the footer (mirrors Framer's 500px spacer Frame)

---

## Framer MCP — Before Every Section

MCP plugin must stay open in Framer (`Cmd/Ctrl+K` → search `MCP`).

1. `mcp__framer-mcp__getProjectXml` — fetch latest layout
2. `mcp__framer-mcp__getNodeXml` — read target node
3. Extract all copy from Framer — never hardcode placeholders

**Node IDs:** Homepage `/` `augiA20Il` · Footer `SfyLHF1Qk` · Footer email link `DXmBIrfwT` · Basic card `yGpvNnjfT` · Formats card `qNoQUxbRC` · FAQs `V_ypTBFNP` · Accordion `RhoLTykGG` · Button `qgP76QxBv` · Nav Bar `MRYrCOnoR` · Nav Bar Item `AwheYFvjb`

---

## Design Tokens — `src/app/globals.css`

Tailwind v4 uses `@theme {}` in CSS — **no `tailwind.config.ts`**.

```css
@import "tailwindcss";

@theme {
  --color-black: rgb(14 14 12);
  --color-white: rgb(255 255 255);
  --color-grey: rgb(93 100 114);
  --color-off-white: rgb(244 239 233);
  --color-red: rgb(232 26 45);
  --color-red-light: rgb(255 138 122);
  --color-blue: rgb(70 113 255);
  --color-blue-light: rgb(105 164 255);
  --color-orange: rgb(246 133 31);
  --color-orange-light: rgb(249 161 89);

  --font-headline: var(--next-font-headline), sans-serif;
  --font-body: var(--next-font-body), sans-serif;
}
```

Fonts self-hosted in `public/fonts/`, loaded via `next/font/local` in `app/layout.tsx` (variables `--next-font-headline` / `--next-font-body`). **Do not use Inter, Roboto, or system fonts.**

Tailwind classes: `text-black`, `bg-red`, `text-off-white`, `font-headline`, `font-body`.

---

## Section Order (do not reorder)

Hero → About → Ticker → Formats → Ticker → Reasons → FAQs → Footer

| Section | bg | Notes |
|---|---|---|
| Hero | black | sticky, min-h-screen · animated SVG wave bg (`HeroWave.tsx`) |
| About | black | h-screen, text-red |
| Ticker | white | infinite marquee, 110px height, Clash Display · starts fully visible, scrolls left |
| Formats | red | 6 stacked cards |
| Reasons | black | 2×2 grid, red card bg |
| FAQs | black | accordion, grey/30 container |
| Footer | red | fixed, 500px, z-0 |

---

## Spacing

- Section padding: `px-5 md:px-8` (20px mobile, 32px desktop)
- Section vertical: `py-24 md:py-[100px]`
- Max content width: `max-w-[1440px] mx-auto`
- Left column max-width: `max-w-[718px]`
- Right column max-width: `max-w-[467px]`
- Card grid gap: `gap-[30px]`
- H2 section heading scale: `text-[32px] md:text-[48px] lg:text-[64px]` (Formats, Reasons)

---

## Motion

All animation via Framer Motion. No CSS keyframes for transitions. Variants and transitions are defined inline per component.

Reduced motion: `useReducedMotion()` from `hooks/useReducedMotion.ts` — pass `{}` variants when true.

**Page loader (`features/intro/Loader.tsx`):** `"use client"`. Full-screen black overlay (`z-[9999]`, `bg-black`). No scroll-restore override — browser handles scroll position naturally. Centered `red-logo.svg` (95×95px mobile, 172×175px desktop) with `clipPath: inset(${100 - count}% 0 0 0)` so it fills in upward as the count rises. Counter at bottom-center (`bottom-8 left-1/2 -translate-x-1/2`) in Clash Display bold (`clamp(36px,5vw,96px)`). Counter animates via Framer Motion `animate()` — 0.1s delay, 1.5s linear. After 150ms hold at 100%, `body.overflow` is restored and `setVisible(false)` triggers exit. Exit: overlay slides up (`y: "-100%"`) over 1.25s with ease `[0.76, 0, 0.85, 1]`, then `AnimatePresence` detaches from DOM. Reduced motion: skips instantly.

**Hero wave background (`HeroWave.tsx`):** Two blurred div layers, each with a `motion.path` that morphs between 3 random SVG keyframes. `COUNT = 10` fixed interior peaks; x positions are generated once per layer (`makeXs()`) and held constant across keyframes so morphing only interpolates Y — producing a natural mountain-range silhouette. Layer 1: ambient glow (`blur(90px)`, opacity 0.25, dur 5–12s). Layer 2: definition glow (`blur(35px)`, opacity 0.65, dur 7–16s). Both use `repeatType: "mirror"` for seamless back-and-forth. No Y-axis translation on the wrapper — the wave base stays anchored to the bottom. Peak shape tuning: adjust `baseY / minY / maxY` in the `buildKeyframes()` calls inside `useEffect`. Outer wrapper fades in `opacity: 0 → 1` over 2s after 1s delay.

**Nav (`features/nav/Nav.tsx`):** `"use client"`. Fixed `top-0 z-50`, flex column (pill + dropdown). Desktop: logo left (`red-logo.svg` 32×32), links center with roll-up hover (two stacked spans, `group-hover:-translate-y-full` / `translate-y-full→0`), "Apply to speak" Button right. Max-width 1072px matches Framer Nav Bar component. Scroll listener adds `bg-black/70 backdrop-blur-md` to the pill at >40px scroll. Mobile: burger button (3 lines → ✕ via CSS transforms) toggles a dropdown card (`rounded-3xl bg-black/80 backdrop-blur-md mt-2`) below the pill — not full-screen. Links stagger in via Framer Motion; CTA is a full-width `rounded-2xl bg-white` button at the bottom of the card. All links use `el.scrollIntoView({ behavior: "smooth" })` — no native anchor jumps.

**About blinds reveal (`About.tsx`):** `"use client"`. Words rendered as `<span data-word>` on SSR (fully readable). After mount, `useEffect` calls `measureLines()` which groups words by `offsetTop` (4px tolerance) into visual lines. Each line renders as `relative block overflow-hidden` with a static text span underneath and an `absolute inset-0 bg-white` `motion.span` on top. The white panel starts at `x: 0%` (covering text) and slides to `±105%` on scroll-in. Uses `variants` with `hidden: { transition: { duration: 0 } }` for instant off-screen reset so the animation replays every time the section enters the viewport (`once: false`).

**Ticker seamless loop:** `TickerContent` uses `pl-8 md:pl-[30px]` (left padding only, not `px-8`). Right padding causes a double-gap at the loop junction. Renders **3 copies** with `x: ["0%", "-33.33%"]` (= one copy width). Two copies caused a visible gap on screens wider than ~1100px. Duration 30s (scaled from 20s to keep same visual speed with 3 copies).

**Roll-up hover (nav links, footer links):** Use Tailwind CSS transitions, not Framer Motion. Parent must be `relative block overflow-hidden group` — `block` is required; inline elements do not clip absolutely positioned children. Two stacked `<span>`s inside: first `block group-hover:-translate-y-full`; second `absolute inset-0 translate-y-full group-hover:translate-y-0`. Used in `Nav.tsx` desktop links and footer `RollLink` component.

**Footer (`features/footer/Footer.tsx`):** Rebuilt to match Framer (`SfyLHF1Qk`). Fixed `bottom-0 z-0 h-[500px]` red, `px-[30px] py-8`. Structure: two sections via `justify-between`. **Top:** `( Programme )` label + Clash Display description left (max-w 367px); Navigation / Contact / Connect columns right (gap 64px between columns, 8px label→links, 16px between nav links, 8px between connect links). All links use `RollLink` component (roll-up hover). **Bottom:** logo (`h-[66px] md:h-[98px]` left-aligned, `brightness-0`) + copyright bar. **Responsive:** top section stacks `flex-col` on mobile; mobile bottom order is copyright → powered by + Amplify logo → Decoded logo (`md:hidden` / `hidden md:flex` splits); desktop bottom is logo → copyright | powered-by row. `footer.data.ts` contains all copy: programme, navigation (Home/About/Sessions/Reasons), contact email, connect (Instagram/LinkedIn), copyright, poweredBy. Amplify logo at `public/Amplify-logo.svg`.

**FormatCard pixel mask reveal (`FormatCard.tsx`):** `"use client"`. Each card's image is covered by a 15×15 grid of cells (two stacked layers: red below, white on top). On `useInView` (`once: true`, `margin: "-10%"`), `useAnimate` fades each cell's `opacity` to 0 row-by-row from top to bottom over `REVEAL_DURATION` (0.9s) after a `REVEAL_DELAY` (0.2s). Two jitter offsets create the "scan line" look: white cells subtract a random `BLEED` (≤0.18s) so they clear early and briefly expose red below the line; red cells add a random `JITTER` (≤0.1s) so fragments linger above it. Reduced motion skips the overlay entirely. Tunables (`GRID`, `REVEAL_DELAY`, `REVEAL_DURATION`, `WHITE_DUR`, `RED_DUR`, `JITTER`, `BLEED`) are module-level constants at the top of the file. `FormatCard` accepts a `priority?: boolean` prop — `Formats.tsx` passes `priority={i === 0}` so only the first card preloads its image; the rest lazy-load. Image paths are derived from format name: `/${name.toLowerCase().replace(/\s/g, "-")}.png` — actual PNGs live in `public/` (`tech-talks.png`, `live-demo.png`, `debate.png`, `panel.png`, `fireside-chat.png`, `workshop.png`). **Layout:** the text column uses `md:self-start` so it does not stretch to match the `aspect-square` image height — without this, `justify-between` would pin the description to the bottom of a very tall cell on wide screens.

---

## Rules

**Do:** match Framer spacing exactly · semantic HTML · `aria-expanded/controls` on accordion · `aria-hidden` on ticker · `next/image` for all images · `next/dynamic` + `ssr:false` for heavy client sections

**Don't:** invent copy · add dark mode · use inline styles for static values · import across features · files > 150 lines · non-transform animation props (`left/top/width` in motion)

---

## Priorities

1. Framer layout accuracy
2. Typography fidelity (correct fonts at all breakpoints)
3. Smooth motion (GPU transforms, no jank)
4. Responsive (mobile-first Tailwind)
5. Accessibility (keyboard, ARIA, reduced motion)
6. Architecture (modular, typed, Bulletproof structure)
