# Decoded — Engineering Context

> **Source of truth is Framer.** Match layout, spacing, copy, and hierarchy exactly. Do not invent content.

---

## Stack

- Next.js 16.2.6 (App Router) · React 19.2.4 · TypeScript strict · pnpm · ESLint
- Tailwind CSS v4 — all styling · Framer Motion v12 — all animation
- `cn()` via `clsx` + `tailwind-merge` in `lib/cn.ts`
- Forms: `react-hook-form` + `@hookform/resolvers` + `zod` v4
- Email: `@aws-sdk/client-sesv2` — AWS SES v2
- Icons: `@phosphor-icons/react` — used for `ArrowCircleUpRight` in FormatCard and anywhere directional icons are needed
- No MUI, Emotion, or Radix unless explicitly requested
- Favicon: `metadata.icons: { icon: "/red-logo.svg" }` in `app/layout.tsx` — no `favicon.ico`

---

## Structure — Bulletproof React

```
src/
├── app/                        # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   ├── HomeClient.tsx          # Client boundary — manages SpeakerFormModal open state
│   └── api/speaker-submission/ # POST route — validates + emails submission
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
│   └── speaker-form/           # SpeakerForm.tsx · SpeakerFormModal.tsx
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

`page.tsx` is a Server Component. Static sections are passed as props to `HomeClient`, which holds the `SpeakerFormModal` open state and distributes `onApply` callbacks.

```tsx
{/* app/page.tsx — Server Component */}
<HomeClient
  before={<><About /><Ticker /></>}
  after={<><Ticker /><Reasons /><Faq /></>}
  footer={<Footer />}
/>

{/* HomeClient renders: */}
<Loader />
<Nav onApply={open} />                {/* fixed top-0 z-50 */}
<main className="flex flex-1 flex-col pb-[680px] md:pb-[650px]">
  <Hero onApply={open} />             {/* sticky top-0 z-10 */}
  <div className="relative">
    {before}                          {/* About, Ticker */}
    <Formats onApply={open} />
    {after}                           {/* Ticker, Reasons, Faq */}
  </div>
  {footer}                            {/* Footer — fixed bottom-0 z-0 */}
</main>
<SpeakerFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} />
```

- Nav is `fixed top-0 z-50` — always above hero and all sections
- Hero is `sticky top-0 z-10` — pinned while sections scroll over it
- All body sections are `relative z-10` — same z-index, later in DOM = paint on top
- Footer is `fixed inset-x-0 bottom-0 z-0 h-[680px] md:h-[650px]` — always behind content, revealed at end
- `pb-` on main must always match footer height: `pb-[680px] md:pb-[650px]`

---

## Framer MCP — Before Every Section

MCP plugin must stay open in Framer (`Cmd/Ctrl+K` → search `MCP`).

1. `mcp__framer-mcp__getProjectXml` — fetch latest layout
2. `mcp__framer-mcp__getNodeXml` — read target node
3. Extract all copy from Framer — never hardcode placeholders

**Node IDs:** Homepage `/` `augiA20Il` · Footer `SfyLHF1Qk` · Footer email link `DXmBIrfwT` · Basic card `yGpvNnjfT` · Formats card `qNoQUxbRC` · "ye" / Learn more button `j75bhEKWC` · FAQs `V_ypTBFNP` · Accordion `RhoLTykGG` · Button `qgP76QxBv` · Nav Bar `MRYrCOnoR` · Nav Bar Item `AwheYFvjb` · Email template design page `gxEyqJLt6`

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
}

@theme inline {
  --font-headline: var(--next-font-headline);
  --font-body: var(--next-font-body);
}
```

**Important:** fonts must use `@theme inline` (not `@theme`) so Tailwind inlines `var(--next-font-*)` directly into utilities rather than wrapping in a second CSS variable. Double `var()` indirection breaks font resolution in form elements and non-homepage routes.

Fonts self-hosted in `public/fonts/`, loaded via `next/font/local` in `app/layout.tsx` (variables `--next-font-headline` / `--next-font-body`). **Do not use Inter, Roboto, or system fonts.**

`<body>` has `overscroll-none` — prevents rubber-band scroll (iOS/macOS) from revealing the fixed footer behind the content at the top/bottom of the page.

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

**Page loader (`features/intro/Loader.tsx`):** `"use client"`. Full-screen black overlay (`z-[9999]`, `bg-black`). Centered `red-logo.svg` (95×95px mobile, 172×175px desktop) with `clipPath: inset(${100 - count}% 0 0 0)` filling upward. Counter at bottom-center in Clash Display bold (`clamp(36px,5vw,96px)`). Animates via Framer Motion `animate()` — 0.1s delay, 1.5s linear. After 150ms hold, `body.overflow` restored and `setVisible(false)` triggers exit (`y: "-100%"`, 1.25s, `[0.76, 0, 0.85, 1]`). **Replay on back navigation:** `popstate` listener checks `window.location.pathname` vs `lastPathname` ref — replays only if the pathname actually changed (ignores hash-only changes from footer/nav anchor links). Increments `resetKey` to re-trigger the animation `useEffect`. `next.config.ts` sets `staleTimes: { static: 0, dynamic: 0 }` so the router cache doesn't preserve `visible: false` state between navigations. Reduced motion: skips instantly.

**Hero wave background (`HeroWave.tsx`):** Two blurred div layers, each with a `motion.path` that morphs between 3 random SVG keyframes. `COUNT = 10` fixed interior peaks; x positions are generated once per layer (`makeXs()`) and held constant across keyframes so morphing only interpolates Y — producing a natural mountain-range silhouette. Layer 1: ambient glow (`blur(90px)`, opacity 0.25, dur 5–12s). Layer 2: definition glow (`blur(35px)`, opacity 0.65, dur 7–16s). Both use `repeatType: "mirror"` for seamless back-and-forth. No Y-axis translation on the wrapper — the wave base stays anchored to the bottom. Peak shape tuning: adjust `baseY / minY / maxY` in the `buildKeyframes()` calls inside `useEffect`. Outer wrapper fades in `opacity: 0 → 1` over 2s after 1s delay.

**Hero content animation (`Hero.tsx`):** `"use client"`. Logo, headline, and CTA button each fade in (`opacity: 0→1, y: 12→0`, 0.8s ease `[0.4, 0, 0.2, 1]`) with staggered delays timed to after the Loader exits: `LOGO_DELAY = 2.5s`, `TEXT_DELAY = 3.0s`, `BUTTON_DELAY = 3.3s`. `fadeIn(delay)` helper returns `{}` when `useReducedMotion()` is true. CTA calls `onApply` prop to open `SpeakerFormModal`.

**Nav (`features/nav/Nav.tsx`):** `"use client"`. `motion.header` with `y: "-100%"` hide on scroll-down (>80px) / show on scroll-up — paused when mobile menu is open. Fixed `max-w-[1440px]` pill — no shrink behavior. Scroll listener adds `bg-black/70 backdrop-blur-md` at >40px. `onScroll()` called immediately on mount so blur state is correct on page reload mid-scroll. Desktop: logo left, links `absolute left-1/2 -translate-x-1/2` (true geometric center), CTA right. Mobile: burger → dropdown card with staggered links + full-width CTA. Both CTAs call `onApply: () => void` prop (passed from `HomeClient`) to open `SpeakerFormModal`. All section links use `el.scrollIntoView({ behavior: "smooth" })`. `lastY` stored in `useRef` (not state) to avoid re-renders.

**About blinds reveal (`About.tsx`):** `"use client"`. Words rendered as `<span data-word>` on SSR (fully readable). After mount, `useEffect` calls `measureLines()` which groups words by `offsetTop` (4px tolerance) into visual lines. Each line renders as `relative block overflow-hidden` with a static text span underneath and an `absolute inset-0 bg-white` `motion.span` on top. The white panel starts at `x: 0%` (covering text) and slides to `±105%` on scroll-in. Uses `variants` with `hidden: { transition: { duration: 0 } }` for instant off-screen reset so the animation replays every time the section enters the viewport (`once: false`).

**Ticker seamless loop:** `TickerContent` uses `pr-8 md:pr-[30px]` (right padding only — provides the gap between the last word of one copy and the first word of the next). Renders **3 copies** animating `x: ["0%", "-33.33%"]`. Duration 35s. Separator between words is `next/image` `red-logo.svg` (`size-[72px] md:size-[64px]`), replacing the old inline Bauhaus SVG.

**Roll-up hover (nav links, footer links):** Use Tailwind CSS transitions, not Framer Motion. Parent must be `relative block overflow-hidden group` — `block` is required; inline elements do not clip absolutely positioned children. Two stacked `<span>`s inside: first `block group-hover:-translate-y-full`; second `absolute inset-0 translate-y-full group-hover:translate-y-0`. Used in `Nav.tsx` desktop links and footer `RollLink` component.

**Footer (`features/footer/Footer.tsx`):** `"use client"` (needed for smooth scroll). Fixed `bottom-0 z-0 h-[680px] md:h-[650px]` red, `px-[30px] py-8`. Hash links (`#hero`, `#about`, etc.) use same `scrollIntoView({ behavior: "smooth" })` as the nav — `mailto:` and external links use default browser behaviour. **Top:** `( Programme )` label + Clash Display description left (max-w 367px); Navigation / Contact / Connect columns right — stack `flex-col` below `md`, go `flex-row` at `md+`. Navigation links are `uppercase tracking-wider font-headline`. **Bottom:** Decoded wordmark logo spans `w-full` (`brightness-0`) + copyright bar. **Responsive:** top section stacks `flex-col` on mobile (lg → row); mobile bottom order is copyright → powered by + Amplify logo → Decoded logo; desktop bottom is logo → copyright | powered-by row. `footer.data.ts` contains all copy. Amplify logo at `public/Amplify-logo.svg`.

**FormatCard pixel mask reveal (`FormatCard.tsx`):** `"use client"`. Image covered by a single `<canvas>` (replaces old 450-div grid — 1 DOM node vs 2,700). `PixelCanvas` component: `ResizeObserver` syncs buffer at `displaySize × devicePixelRatio`; draws white cover before animation starts. On `inView`, one `rAF` loop runs: red pass first (behind), white pass on top — per-cell opacities computed from `Float32Array` timings built once at start. `BLEED` (≤0.18s early white start) exposes red below the scan line; `JITTER` (≤0.1s extra red delay) leaves fragments above it. Loop cancels itself after all cells clear. Tunables: `GRID / REVEAL_DELAY / REVEAL_DURATION / WHITE_DUR / RED_DUR / JITTER / BLEED`. `onOpen?: () => void` prop — clicking the image or "Learn more" button opens `FormatDrawer`. Image paths: `/${name.toLowerCase().replace(/\s/g, "-")}.png`. Reduced motion skips canvas entirely. **Learn more button** matches Framer's "ye" component (`j75bhEKWC`): `w-full bg-grey/30 rounded-lg p-6 md:p-[30px]`, space-between flex, `ArrowCircleUpRight` from `@phosphor-icons/react` (24px, nudges up-right on hover), hover bg `grey/50`.

**FormatDrawer (`features/formats/FormatDrawer.tsx`):** `"use client"`. Fixed right panel `w-full lg:max-w-[50vw]` (`z-60`, `bg-black`), scrollable. Slides in `x: "100%" → 0` ease `[0.22, 1, 0.36, 1]` over 450ms. Backdrop (`bg-black/70 backdrop-blur-sm`, `z-60`) closes on click. `Escape` key closes; body scroll locked while open. `Formats.tsx` holds `active: Format | null` state. Layout (top→bottom): header row (format name left + close button right) · image (`w-full md:max-w-[55%]`, `aspect-[4/3]`, `object-cover`) · four `Row` content sections (dot label left + content right, stacks vertically on mobile via `flex-col md:grid`) · "Apply to speak" CTA (`w-4/5` centered, `bg-red`) calls `onApply` prop to open `SpeakerFormModal` · footer `mt-auto`. **Four rows:** "What it is" (paragraph) · "Best for" (list with `border-white/70` item dividers) · "How it runs" (2-col table: label `text-white/25` | value `text-white/50`, `divide-white/70`) · "What to expect" (3 blocks: bold title + dim description). All row separators use `border-white/70`. Data comes from `formats.data.ts` — `FormatMeta` + `ExpectBlock` types, rich content for all 6 formats (heroTitle, tag, drawerTitle, whatItIs, bestFor, meta, expect).

---

## Speaker Form — Modal

Session submission flow for potential speakers. Rendered as an overlay modal on the homepage — no separate page.

**Modal (`features/speaker-form/SpeakerFormModal.tsx`):** `"use client"`. `AnimatePresence` wraps a full-screen backdrop (`bg-black/80 backdrop-blur-sm`, `z-[9998]`). Inner card: `max-w-2xl rounded-2xl bg-grey/60 backdrop-blur-md`. Slides in `opacity: 0, y: 24 → 1, 0` (350ms, `[0.22, 1, 0.36, 1]`). Back button (arrow SVG) calls `onClose`. Body scroll locked via `document.body.style.overflow = "hidden"` while open. Renders `<SpeakerForm onSuccess={onClose} />`. Triggered by `onApply` callbacks on `Nav`, `Hero`, and `Formats` — state lives in `HomeClient`.

**Form (`features/speaker-form/SpeakerForm.tsx`):** `"use client"`. `react-hook-form` + `zodResolver`. Card is `bg-black/70 backdrop-blur-md border-white/20`. `speakerType` defaults to `undefined` — form is hidden until a type is selected. Selecting a type reveals an animated **Continue** button (slides up, bouncing arrow). Clicking Continue locks the radios (disabled + unselected fades to 25% opacity) and reveals the full form with a `y: 0, opacity: 1` entrance. `defaultValues` cast as `DefaultValues<SessionSubmissionFormValues>` to satisfy the discriminated union type. `gcx@eg.dk` rendered as `<a href="mailto:gcx@eg.dk">`. On submit: loading state + disabled button → POST `/api/speaker-submission` → `SuccessModal` (5s countdown + calls `onSuccess`) or inline error.

**Validation (`lib/validation/schema.ts`):** Zod v4. `z.discriminatedUnion("speakerType", [...])` intersected with `sessionFields`. All fields have explicit error messages and `max()` caps. Shared between client (RHF resolver) and server (`safeParse` in route).

**API route (`app/api/speaker-submission/route.ts`):** JSON parse (try/catch) → `safeParse` (400 on invalid) → `buildAdminEmail()` (sectioned HTML table, all values HTML-escaped) → `sendSessionSubmissionEmail` → fire-and-forget `sendConfirmationEmail`. **Email sends are live** — remove the Azure env vars to disable.

**Email (`lib/email/`):**
- `transporter.ts` — `SESv2Client` from `@aws-sdk/client-sesv2`. Region hardcoded to `eu-central-1`. No credentials passed — SDK auto-picks the ECS task role via the container credentials endpoint. Exports `sendMail({ to, subject, html, text? })` helper (returns `MessageId`), `SENDER_EMAIL` (`no-reply@insights.amplify.egsync.com`), and `ADMIN_EMAILS` (from env, comma-separated string array).
- `send-session-submission.ts` — `sendSessionSubmissionEmail` (admin notification) + `sendConfirmationEmail` (applicant). Both functions call `sendMail` directly — **emails are live**. Confirmation email is a fully responsive dark HTML template (`max-width:640px`, `#1e1e1e` bg) with: red header bar (`#e81a2d`) holding `decoded-logo-email.png` + `EG Logo V2 1.png` left and `Decoded Icon V3 1.png` overflowing right (`margin-bottom:-28px`); "WE GOT YOUR PROPOSAL" heading; body copy; "WHAT HAPPENS NEXT" 3-step table (Review / Discovery call / Confirmed); CTA banner (`rgb(72,18,18)`) with `gcx@eg.dk` + "GET IN TOUCH" button; footer (black, `decoded-logo-email.png` + copyright). **Fonts:** `@font-face` loads `ClashDisplay-Semibold.woff2` (headings) and `Aileron-600/700.woff2` (body) from `${NEXT_PUBLIC_BASE_URL}/fonts/` — falls back to `sans-serif`. **Responsive:** `@media (max-width:600px)` stacks step rows and CTA banner columns.

**Required env vars:**
```
ADMIN_EMAILS=email@eg.dk,another@eg.dk   # comma-separated — no AWS keys needed (ECS task role)
NEXT_PUBLIC_BASE_URL                      # base URL for font + image paths in emails
```

**Email assets in `public/`:** `decoded-logo-email.png` (wordmark, header + footer) · `Decoded Icon V3 1.png` (overflowing header icon) · `EG Logo V2 1.png` (header, beside wordmark) · `Decoded Logo V4 1.png` (alternate wordmark). SVGs do not render in email clients — always use PNG.

---

## 404 Page — `app/not-found.tsx`

Built from Framer's `/404` page (`nodeId="BigvQa7Dl"`). `"use client"` for Framer Motion.

- **Background:** `bg-black` full-screen centered stack
- **404 number:** `font-headline font-bold` with `fontSize: clamp(96px, 22vw, 320px)` — Clash Display Bold
- **Colours:** main `text-red` (`#E81A2D`) on top; static shadow `text-red-light` (`#FF8A7A`) offset right via `translate-x-[10px] sm:translate-x-[20px] lg:translate-x-[35px]` — no animation
- **Button:** `<Button variant="light">Back to Home</Button>` in `<Link href="/">` — matches Framer's Light variant
- No Nav, no Footer — standalone full-screen page

---

## next.config.ts

```ts
experimental: {
  staleTimes: { static: 0, dynamic: 0 }
}
```

Disables the client-side router cache so navigating back to any page forces a fresh component mount. Required for the Loader animation to replay correctly on back navigation.

---

## Rules

**FAQ Accordion (`features/faq/Accordion.tsx`):** `linkifyAnswer(text)` helper splits answer strings on email regex and wraps matches in `<a href="mailto:…">` — answers render as JSX, not plain strings. Add new email addresses to `faq.data.ts` answer text; they auto-link.

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
