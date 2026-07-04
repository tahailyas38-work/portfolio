# Taha — Portfolio Design System

Single source of truth for every design decision on this site.  
**Always read this before making any UI changes.**

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Font | **Plus Jakarta Sans** (via `next/font/google`) |
| Data | `src/lib/data.ts` (all content lives here) |

---

## Typography

**Font family:** `Plus Jakarta Sans` — modern geometric sans-serif (Gilroy equivalent).  
Applied globally via `--font-sans` CSS variable in `layout.tsx`.

### Scale

| Role | Size | Weight | Color |
|---|---|---|---|
| Hero heading | fluid `3.25rem → 7.5rem` | `font-extrabold` | `text-gray-900` |
| Section heading | **`text-[2.5rem]` (40px)** — CONSISTENT across ALL sections | `font-bold tracking-tight` | `text-gray-900` |
| Card / item heading | `text-[17px]` | `font-bold` | `text-gray-900` |
| Body / description | `text-[15px]` | `font-normal` | `text-gray-500` |
| Small description (cards) | `text-[14px]` | `font-normal` | `text-gray-500` |
| Labels / section labels | `text-[11px] uppercase tracking-[0.14em]` | `font-bold` | `#ff791b` (orange) |
| Tag / pill text | **`text-[13px]`** — CONSISTENT across ALL sections | `font-medium` | `text-gray-500` |
| Stat value (About card) | `text-[24px]` | `font-bold` | `text-gray-900` |
| Stat label (About card) | `text-[10px] uppercase tracking-[0.12em]` | `font-semibold` | `text-gray-400` |
| CTA text | `text-[14px]` | `font-semibold` | white or `#0071e3` |

> **Rule:** Every section heading uses `text-[2.5rem]` (40px). Never use `text-3xl` or `text-4xl` for section headings.  
> **Rule:** Every tag/pill text uses `text-[13px]`. Never use `text-[12px]` for pills.

---

## Colors

| Token | Value | Usage |
|---|---|---|
| `--color-background` | `#ffffff` | Page background |
| `--color-surface` | `#f9fafb` | Card / panel background |
| `--color-foreground` | `#111827` | Primary text |
| `--color-muted` | `#6b7280` | Secondary text |
| `--color-border` | `#e6e6e6` | All borders, dividers |
| `--color-primary` | `#0071e3` | CTA buttons, links, active underlines |
| `--color-label` | `#ff791b` | Section label text (orange) |
| Stat card bg | `#ffffff` with `bg-[#e6e6e6]` gap | 2×2 grid |
| Identity header bg | `#f5f9ff` | About card top |
| Hero orbs | `#0071e3` at 15–20% opacity | Background gradient circles |
| Contact orbs | `#0071e3` at 10–20% opacity | Background gradient circles |

---

## Section Labels

All section labels use the `.section-label` CSS class defined in `globals.css`:

```css
.section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ff791b;
  margin-bottom: 1rem;
}
```

---

## Spacing & Layout

| Item | Value |
|---|---|
| Page max-width | `max-w-7xl` with `px-6 lg:px-10` on all sections |
| Section vertical padding | `py-24 lg:py-32` |
| Navigation height | `h-[72px]` |
| Navigation inner | `max-w-7xl px-6 lg:px-10 mx-auto` |
| Card border radius | `rounded-2xl` (cards) or `rounded-3xl` (About left card) |
| Card border | `border border-[#e6e6e6]` |
| Card shadow | `shadow-sm` default, `hover:shadow-lg` on hover |

### Law of Proximity (MANDATORY)

All card-like sections (Case Studies, Side Projects) must group elements:

- **Group 1** — Heading + Description: `mt-2.5` (10px)
- **Group 2** — Tags after description: `mt-3.5` (14px)  
- **Group 3** — CTA after tags: `mt-5 pt-5` (20px, no border-t)

> **Rule:** The coloured status tag (`Live` / `Concept` / `Designed`) always appears **first** in the tag list.

---

## Components

### Navigation (`Navigation.tsx`)
- `h-[72px]`, `border-b border-[#e6e6e6]`, `bg-white/96 backdrop-blur-md`
- Links scroll to sections in-page (no page navigation)
- Link order: **About → Case Studies → Work**
- Active link: blue underline `#0071e3`
- CTA: filled `bg-[#0071e3]` pill, white text

### Hero (`Hero.tsx`)
- Animated sweeping blue orbs (`hero-orb-a/b/c` keyframes)
- Dot grid texture overlay
- White fade at bottom blending into next section
- Dubizzle Labs logo inline before "Dubizzle Labs" link text
- Scroll lock active until animations complete

### About (`About.tsx`)
- Grid: `lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24`
- Left card: identity header (avatar + name + status), 2×2 stat grid (`py-6` padding, `text-[24px]` values), bottom row
- Bottom row: "Currently working in | [DL logo] Dubizzle Labs" — all grey, DL linked to dubizzlelabs.com
- Right: label → heading (40px) → description → pills → "Let's Connect" CTA
- Scroll-reveal via IntersectionObserver with staggered delays

### Tools Marquee (`ToolsMarquee.tsx`)
- `py-16 lg:py-20` (no negative margin — About section sits directly above)
- ICON_SIZE: 74px in rounded circles
- Pause on hover, tooltip shows tool name
- Two mirrored rows, opposite scroll directions

### Journey / Experience (`Journey.tsx`)
- Label: "EXPERIENCE" (orange)
- Heading: "My journey so far."
- Timeline list with blue accents and "Now" badge

### Case Studies (`FeaturedWork.tsx`)
- Label: "SELECTED WORK" (orange)
- Heading: "Products and experiences I've designed."
- Gradient placeholder backgrounds (unique per project, defined in `data.ts`)
- Tags: `text-[13px]` pill, status pill first (emerald green for Live/Designed)
- CTA: tertiary text link `#0071e3` with `→`
- **Locked:** "Case Study Locked 🔒" — same tertiary style, grey, tooltip on hover explains NDA

### Side Projects (`SideProjects.tsx`)
- Label: "BUILDING OUTSIDE THE 9–5" (orange)
- Heading: "Side projects and experiments built outside work."
- Fixed-width cards: `480px`, horizontal scroll with `‹ ›` arrow buttons
- First card aligns with page via `max-w-7xl` + `-mx-6/-mx-10` negative margin track
- Gradient placeholder backgrounds (unique per project)
- Tags: `text-[13px]` pill, status tag first
- CTA: tertiary text link `#0071e3` with `→` (or NDA lock for locked projects)
- **No `border-t`** before CTA

### Contact Banner (`Contact.tsx`)
- Label: "LET'S CONNECT" (orange)
- Heading: "Let's build something together."
- Animated blue orbs background

### Footer (`Footer.tsx`)
- Large logo watermark: `/logo-black.png`, full container width, `opacity-[0.065]`
- Aligned inside `max-w-7xl` content container

---

## Tag / Pill Styles

| Type | Style |
|---|---|
| Generic tag | `border border-[#e6e6e6] rounded-full px-3 py-1 text-[13px] font-medium text-gray-500` |
| Live (Case Studies) | `border border-emerald-200 bg-emerald-50 rounded-full px-3 py-1 text-[13px] font-semibold text-emerald-700` + pulsing dot |
| Live (Side Projects) | same as Live above |
| Concept (Side Projects) | `border border-gray-200 bg-gray-50 rounded-full px-3 py-1 text-[13px] font-semibold text-gray-500` |
| Designed (Case Studies) | same as Live but uses standard emerald styling |
| Focus area (About) | `border border-[#e6e6e6] rounded-full px-4 py-1.5 text-[13px] font-medium text-gray-500` |

---

## CTA Styles

| Type | Style |
|---|---|
| Primary (filled) | `bg-[#0071e3] text-white rounded-full px-6 py-3 text-[14px] font-semibold` |
| Tertiary (text link) | `text-[14px] font-semibold text-[#0071e3] inline-flex items-center gap-1.5` + arrow that moves on hover |
| Locked NDA | `text-[14px] font-semibold text-gray-400 inline-flex items-center gap-2` + lock icon, tooltip on hover |

---

## Gradient Placeholders

Each project has a unique `gradient` string in `data.ts`.

### Case Studies
| Project | Gradient |
|---|---|
| PropForce CRM | `linear-gradient(135deg, #e8f0fe 0%, #c7d7f8 100%)` |
| PropOne RMS Revamp | `linear-gradient(135deg, #edf2f7 0%, #c0cfe8 100%)` |
| PropOne Facility Management | `linear-gradient(135deg, #e6fffa 0%, #a8dfd4 100%)` |
| PropOne Mobile App | `linear-gradient(135deg, #faf5ff 0%, #d8b4fe 100%)` |
| Affiliate Platform Revamp | `linear-gradient(135deg, #fffbeb 0%, #fcd88a 100%)` |
| Investor Hub | `linear-gradient(135deg, #fff1f2 0%, #fda4af 100%)` |

### Side Projects
| Project | Gradient |
|---|---|
| Van-Ber | `linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)` (dark navy) |
| The Bare Edit | `linear-gradient(135deg, #fdf6f0 0%, #e8c9b0 100%)` (warm nude) |
| Protect It | `linear-gradient(135deg, #18181b 0%, #3f3f46 100%)` (dark charcoal) |
| AFJA Trading | `linear-gradient(135deg, #f0faf5 0%, #a7e8c4 100%)` (soft green) |

---

## Page Section Order

```
1. Navigation (sticky)
2. Hero
3. About
4. Tools Marquee
5. Journey (Experience)
6. Featured Work (Case Studies)
7. Side Projects
8. Contact Banner
9. Footer
```

---

## File Map

```
src/
  app/
    layout.tsx          — Plus Jakarta Sans font, root HTML
    page.tsx            — renders <HomeClient />
    globals.css         — CSS vars, keyframes, .section-label
  components/
    HomeClient.tsx      — splash + scroll lock + section order
    SplashScreen.tsx    — animated logo intro
    Navigation.tsx      — sticky nav, scroll-to-section links
    Hero.tsx            — hero section, orbs, scroll-to-about
    About.tsx           — about section, identity card, stats
    ToolsMarquee.tsx    — tools icons marquee
    Journey.tsx         — experience timeline
    FeaturedWork.tsx    — case studies grid
    SideProjects.tsx    — side projects horizontal scroll
    Contact.tsx         — contact banner, orbs
    Footer.tsx          — footer, logo watermark
    TagBadge.tsx        — shared tag pill component
  lib/
    data.ts             — ALL site content (navLinks, caseStudies, sideProjects, tools)
public/
  logo-black.png        — black Taha logo
  logo-white.png        — white Taha logo
  profile-avatar.png    — profile photo
  dubizzle-labs-logo.png — DL logo (used in Hero + About)
DESIGN_SYSTEM.md        — this file
```

---

## Do's & Don'ts

| Do ✅ | Don't ❌ |
|---|---|
| Use `text-[2.5rem]` for ALL section headings | Mix `text-3xl / text-4xl` for headings |
| Use `text-[13px]` for ALL tag/pill text | Use `text-[12px]` or `text-[11px]` for pills |
| Orange `#ff791b` for ALL section labels | Use blue or grey for section labels |
| Blue `#0071e3` for ALL primary CTAs and links | Use arbitrary blues |
| Status tag always **first** in tag list | Put status tag last or in a different position |
| Apply Law of Proximity spacing in cards | Use equal spacing between all card elements |
| Tertiary text link for "View Case Study" / "View Project" | Big pill buttons for view CTAs |
| Gradient backgrounds from `data.ts` for project cards | Shared placeholder images |
| `max-w-7xl px-6 lg:px-10` on ALL section containers | Different side paddings per section |
| `border border-[#e6e6e6]` for ALL card/pill borders | Custom border colours per component |
