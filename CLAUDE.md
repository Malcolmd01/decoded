# Decoded — Engineering Context

> **Source of truth is Framer.** Match layout, spacing, copy, and hierarchy exactly. Do not invent content.

---

## Stack

- Next.js 16.2.6 (App Router) · React 19.2.4 · TypeScript strict · pnpm · ESLint
- Tailwind CSS v4 — all styling · Framer Motion v12 — all animation
- `cn()` via `clsx` + `tailwind-merge` in `lib/cn.ts`
- Forms: `react-hook-form` + `@hookform/resolvers` + `zod` v4
- Email: `nodemailer` + `@types/nodemailer` — SMTP via env vars
- No MUI, Emotion, or Radix unless explicitly requested
- Favicon: `metadata.icons: { icon: "/red-logo.svg" }` in `app/layout.tsx` — no `favicon.ico`

---

## Structure — Bulletproof React

```
src/
├── app/                        # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   ├── api/speaker-submission/ # POST route — validates + emails submission
│   └── speaker-form/           # /speaker-form page
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
│   ├── footer/
│   └── speaker-form/           # SpeakerForm.tsx — session submission form
├── hooks/                      # useReducedMotion.ts
├── lib/
│   ├── cn.ts
│   ├── email/                  # transporter.ts · send-session-submission.ts
│   └── validation/             # schema.ts — shared Zod schema (client + server)
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
<main className="flex flex-1 flex-col pb-[680px] md:pb-[600px]">
  <Hero />                    {/* sticky top-0 z-10 */}
  <div className="relative">  {/* sections scroll over Hero */}
    <About />
    <Ticker />
    <Formats />
    <Ticker />
    <Reasons />
    <Faq />
  </div>
  <Footer />                  {/* fixed bottom-0 z-0 h-[680px] md:h-[600px] */}
</main>
```

- Nav is `fixed top-0 z-50` — always above hero and all sections
- Hero is `sticky top-0 z-10` — pinned while sections scroll over it
- All body sections are `relative z-10` — same z-index, later in DOM = paint on top
- Footer is `fixed inset-x-0 bottom-0 z-0 h-[680px] md:h-[600px]` — always behind content, revealed at end
- `pb-` on main must always match footer height: `pb-[680px] md:pb-[600px]`

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

**Nav (`features/nav/Nav.tsx`):** `"use client"`. `motion.header` with `y: "-100%"` hide on scroll-down (>80px) / show on scroll-up — paused when mobile menu is open. Pill resizes `max-w-[1072px] → max-w-[834px]` (CSS transition) once scrollY > 85% of viewport height, matching Framer's `DesktopOnScroll` variant. Scroll listener adds `bg-black/70 backdrop-blur-md` at >40px. Desktop: logo left, links center (roll-up hover), "Apply to speak" → `/speaker-form` right. Mobile: burger → dropdown card with staggered links + full-width CTA → `/speaker-form`. All section links use `el.scrollIntoView({ behavior: "smooth" })`. `lastY` stored in `useRef` (not state) to avoid re-renders.

**About blinds reveal (`About.tsx`):** `"use client"`. Words rendered as `<span data-word>` on SSR (fully readable). After mount, `useEffect` calls `measureLines()` which groups words by `offsetTop` (4px tolerance) into visual lines. Each line renders as `relative block overflow-hidden` with a static text span underneath and an `absolute inset-0 bg-white` `motion.span` on top. The white panel starts at `x: 0%` (covering text) and slides to `±105%` on scroll-in. Uses `variants` with `hidden: { transition: { duration: 0 } }` for instant off-screen reset so the animation replays every time the section enters the viewport (`once: false`).

**Ticker seamless loop:** `TickerContent` uses `pl-8 md:pl-[30px]` (left padding only, not `px-8`). Right padding causes a double-gap at the loop junction. Renders **3 copies** with `x: ["0%", "-33.33%"]` (= one copy width). Two copies caused a visible gap on screens wider than ~1100px. Duration 30s (scaled from 20s to keep same visual speed with 3 copies).

**Roll-up hover (nav links, footer links):** Use Tailwind CSS transitions, not Framer Motion. Parent must be `relative block overflow-hidden group` — `block` is required; inline elements do not clip absolutely positioned children. Two stacked `<span>`s inside: first `block group-hover:-translate-y-full`; second `absolute inset-0 translate-y-full group-hover:translate-y-0`. Used in `Nav.tsx` desktop links and footer `RollLink` component.

**Footer (`features/footer/Footer.tsx`):** Fixed `bottom-0 z-0 h-[680px] md:h-[600px]` red, `px-[30px] py-8`. Structure: two sections via `justify-between`. **Top:** `( Programme )` label + Clash Display description left (max-w 367px); Navigation / Contact / Connect columns right — columns stack `flex-col` below `md`, go `flex-row` at `md+`. Navigation links are `uppercase tracking-wider font-headline`. **Bottom:** Decoded wordmark logo spans `w-[90%] lg:w-full` (`brightness-0`) + copyright bar. **Responsive:** top section stacks `flex-col` on mobile (lg → row); mobile bottom order is copyright → powered by + Amplify logo → Decoded logo; desktop bottom is logo → copyright | powered-by row. `footer.data.ts` contains all copy. Amplify logo at `public/Amplify-logo.svg`.

**FormatCard pixel mask reveal (`FormatCard.tsx`):** `"use client"`. Each card's image is covered by a 15×15 grid of cells (two stacked layers: red below, white on top). On `useInView` (`once: true`, `margin: "-10%"`), `useAnimate` fades each cell's `opacity` to 0 row-by-row from top to bottom over `REVEAL_DURATION` (0.9s) after a `REVEAL_DELAY` (0.2s). Two jitter offsets create the "scan line" look: white cells subtract a random `BLEED` (≤0.18s) so they clear early and briefly expose red below the line; red cells add a random `JITTER` (≤0.1s) so fragments linger above it. Reduced motion skips the overlay entirely. Tunables (`GRID`, `REVEAL_DELAY`, `REVEAL_DURATION`, `WHITE_DUR`, `RED_DUR`, `JITTER`, `BLEED`) are module-level constants at the top of the file. `FormatCard` accepts a `priority?: boolean` prop — `Formats.tsx` passes `priority={i === 0}` so only the first card preloads its image; the rest lazy-load. Image paths are derived from format name: `/${name.toLowerCase().replace(/\s/g, "-")}.png` — actual PNGs live in `public/` (`tech-talks.png`, `live-demo.png`, `debate.png`, `panel.png`, `fireside-chat.png`, `workshop.png`). **Layout:** the text column uses `md:self-start` so it does not stretch to match the `aspect-square` image height — without this, `justify-between` would pin the description to the bottom of a very tall cell on wide screens.

---

## Speaker Form — `/speaker-form`

Session submission flow for potential speakers. Separate page, not part of the homepage scroll.

**Page:** `app/speaker-form/page.tsx` — `bg-red min-h-screen py-24`, renders `<SpeakerForm />`.

**Form (`features/speaker-form/SpeakerForm.tsx`):** `"use client"`. `react-hook-form` + `zodResolver`. Card is `bg-black/70 backdrop-blur-md border-white/20` — opaque dark over red background. `speakerType` radio toggles employee/external field sets. `defaultValues` cast as `DefaultValues<SessionSubmissionFormValues>` to satisfy discriminated union type. On submit: loading state + disabled button → POST to `/api/speaker-submission` → `SuccessModal` on success (5s countdown + `useRouter` redirect to `/`) or inline error message on failure.

**Validation (`lib/validation/schema.ts`):** Zod v4. `z.discriminatedUnion("speakerType", [...])` intersected with `sessionFields`. All fields have explicit error messages and `max()` length caps. Same schema used on both client (RHF resolver) and server (API route `safeParse`).

**API route (`app/api/speaker-submission/route.ts`):** Parses JSON (try/catch for malformed body) → `safeParse` rejects invalid payloads with 400 → `buildAdminEmail()` produces a sectioned HTML table (About the Speaker / Session Details) with all values HTML-escaped → `sendSessionSubmissionEmail` to `SMTP_TO`. Confirmation email to applicant fired non-blocking (failure doesn't affect response).

**Email (`lib/email/`):**
- `transporter.ts` — Nodemailer SMTP transport from env vars. Port falls back to `587`.
- `send-session-submission.ts` — `sendSessionSubmissionEmail` (to admin) + `sendConfirmationEmail` (to applicant).

**Required env vars:**
```
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_TO
NEXT_PUBLIC_BASE_URL   # used for logo URL in confirmation email (production only)
```

**Email logos:** SVGs don't render in email clients. A PNG export of the logo is needed at `public/decoded-logo-email.png` for the confirmation email header to show in production.

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
