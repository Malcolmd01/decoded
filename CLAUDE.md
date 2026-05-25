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
│   ├── hero/
│   ├── about/
│   ├── ticker/
│   ├── formats/
│   ├── reasons/
│   ├── faq/
│   └── footer/
├── hooks/                      # useReducedMotion.ts
├── lib/                        # cn.ts · motion.ts
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

**Node IDs:** Homepage `/` `augiA20Il` · Footer `SfyLHF1Qk` · Footer email link `DXmBIrfwT` · Basic card `yGpvNnjfT` · Formats card `qNoQUxbRC` · FAQs `V_ypTBFNP` · Accordion `RhoLTykGG` · Button `qgP76QxBv`

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

## Motion — `lib/motion.ts`

All animation via Framer Motion. No CSS keyframes for transitions.

```ts
// Available exports from lib/motion.ts
fadeUp            // opacity 0→1, y 40→0, whileInView
fadeIn            // opacity only
stagger(n)        // container variant with staggerChildren
marqueeAnimation  // (exported, currently unused — Ticker has its own inline motion)
accordionVariants // open/close height + opacity
viewport          // { once: true, margin: "-80px" }
```

Reduced motion: `useReducedMotion()` from `hooks/useReducedMotion.ts` — pass `{}` variants when true.

**Cinematic intro splash (`features/intro/CinematicSplash.tsx`):** `"use client"`. 5-phase timed animation that runs once on first load. SVG assets in `public/`: `red-logo-1.svg` + `red-logo-2.svg` (two halves), `red-logo.svg` (assembled icon), `decoded-3.svg` ("de"), `decoded-4.svg` ("oded"). Phase sequence: **ENTRY** (t=0) pieces 1+2 fly in diagonally → **ASSEMBLE** (t=600ms) swap for red logo → **REVEAL** (t=800ms) "de"/"oded" slide out from behind the icon → **LOCK** (t=2000ms) composition translates+scales to match the `[data-hero-logo]` element's exact position → **EXIT** (t=3200ms) overlay fades to black, component unmounts at t=4000ms. `rowRef` (inner flex row) is measured separately from `compositionRef` (padded wrapper) so scale and x/y are accurate. Scale formula: `(heroWidth / rowWidth) × INTRO_SCALE` — compensates for the parent transform already applied at measure time. Piece sizing: text pieces `h-[clamp(40px,11vw,140px)] w-auto`; icon box `h-[clamp(38px,10.5vw,134px)]` (95.5% of text height) — this ratio matches the hero logo SVG's internal proportions (icon = 13.5% of total width) so the post-lock icon size lands within 1 px of the hero. Icon box has `ml-[5px]` for horizontal fine-tuning. `window.scrollTo(0, 0)` is called at mount to prevent browser scroll-restore from starting mid-page. Reduced motion: instant-skip via `useReducedMotion()` — splash never shows, `onComplete` fires immediately. `onComplete` is stabilised with a ref so the timer effect never restarts on re-render.

**Hero wave background (`HeroWave.tsx`):** Two `motion.path` layers morph through 6 randomly generated SVG path keyframes (`repeatType: "mirror"`). Paths are generated client-side only in `useEffect` (never on server) to avoid hydration mismatch — initial state uses `STATIC_PATH` on both server and client. Both arrays are batched into a single `wavePaths` state object. Layer 1: ambient glow (`stdDeviation 90`, opacity 0.25, 15s). Layer 2: definition glow (`stdDeviation 35`, opacity 0.65, 22s) — different durations let layers drift for organic motion. `generateWavePath` uses `base 700` / `spread 250` for the current amplitude. Static preview at `public/hero-wave.svg`. `feGaussianBlur` filter bounds must use `x/y/width/height` percentage overrides or the blur clips at the SVG edge. The outer wrapper is a `motion.div` that starts at `opacity: 0` and eases in to `opacity: 1` over 2 s with a 3.2 s delay — synced to the splash EXIT phase so the wave fades in as the overlay fades out.

**About blinds reveal (`About.tsx`):** `"use client"`. Words rendered as `<span data-word>` on SSR (fully readable). After mount, `useEffect` calls `measureLines()` which groups words by `offsetTop` (4px tolerance) into visual lines. Each line renders as `relative block overflow-hidden` with a static text span underneath and an `absolute inset-0 bg-white` `motion.span` on top. The white panel starts at `x: 0%` (covering text) and slides to `±105%` on scroll-in. Uses `variants` with `hidden: { transition: { duration: 0 } }` for instant off-screen reset so the animation replays every time the section enters the viewport (`once: false`).

**Ticker seamless loop:** `TickerContent` uses `pl-8 md:pl-[30px]` (left padding only, not `px-8`). Right padding causes a double-gap at the loop junction. Renders **3 copies** with `x: ["0%", "-33.33%"]` (= one copy width). Two copies caused a visible gap on screens wider than ~1100px. Duration 30s (scaled from 20s to keep same visual speed with 3 copies).

**Roll-up hover (e.g. footer email):** Use Tailwind CSS transitions, not Framer Motion. Pattern: `overflow-hidden` container with two stacked `<span>`s; first: `group-hover:-translate-y-full`; second: `translate-y-full group-hover:translate-y-0`. Add `group` to the parent link.

**FormatCard pixel mask reveal (`FormatCard.tsx`):** `"use client"`. Each card's image is covered by a 20×20 grid of cells (two stacked layers: red below, white on top). On `useInView` (`once: true`, `margin: "-10%"`), `useAnimate` fades each cell's `opacity` to 0 row-by-row from top to bottom over `REVEAL_DURATION` (0.9s) after a `REVEAL_DELAY` (0.2s). Two jitter offsets create the "scan line" look: white cells subtract a random `BLEED` (≤0.18s) so they clear early and briefly expose red below the line; red cells add a random `JITTER` (≤0.1s) so fragments linger above it. Reduced motion skips the overlay entirely. Tunables (`GRID`, `REVEAL_DELAY`, `REVEAL_DURATION`, `WHITE_DUR`, `RED_DUR`, `JITTER`, `BLEED`) are module-level constants at the top of the file. `FormatCard` accepts a `priority?: boolean` prop — `Formats.tsx` passes `priority={i === 0}` so only the first card preloads its image; the rest use Next.js default lazy loading and hit the browser cache (same `/placeholder.jpg` URL).

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
