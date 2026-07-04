# Portfolio Project — Full Handoff Summary

### Project
Personal portfolio for **Muhammad Taha Madni** (Product Designer, Dubizzle Labs).  
**Path:** `/Users/muhammadtaha/Desktop/Portfolio`  
**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Plus Jakarta Sans font.  
**Run:** `npm run dev` → `localhost:3000`

---

### Page Section Order (top → bottom)
1. Navigation (sticky)
2. Hero
3. About
4. Tools Marquee
5. Journey (Experience)
6. Featured Work (Case Studies)
7. Side Projects
8. Contact Banner
9. Footer

---

### Design System Rules (CRITICAL — never break these)

- **Section headings:** always `text-[2.5rem]` (40px), `font-bold tracking-tight`, `text-gray-900`
- **Tag/pill text:** always `text-[13px]` across every section — no exceptions
- **Section labels:** `text-[11px] uppercase tracking-[0.14em] font-bold` in orange `#ff791b`, using `.section-label` CSS class from `globals.css`
- **Primary blue:** `#0071e3` (CTAs, active links, orbs)
- **Borders:** `#e6e6e6` everywhere
- **Section padding:** `py-24 lg:py-32` on all sections
- **Container:** `mx-auto max-w-7xl px-6 lg:px-10` on every section — this is what ensures consistent side padding

**Law of Proximity (mandatory in cards):**
- Heading → description: `mt-2.5`
- Description → tags: `mt-3.5`
- Tags → CTA: `mt-5 pt-5` (no `border-t`)
- Status tag (coloured) always **first** in the tag list

**CTA styles:**
- Primary filled: `bg-[#0071e3] text-white rounded-full px-6 py-3 text-[14px] font-semibold`
- Tertiary text link: `text-[14px] font-semibold text-[#0071e3] inline-flex items-center gap-1.5` + arrow that shifts right on hover
- Locked NDA: `text-[14px] font-semibold text-gray-400 inline-flex items-center gap-2` + lock icon + tooltip on hover

---

### File Map

```
src/
  app/
    layout.tsx          — Plus Jakarta Sans font, root HTML
    page.tsx            — renders <HomeClient />
    globals.css         — CSS vars, @keyframes, .section-label utility
  components/
    HomeClient.tsx      — splash + scroll lock + section order
    SplashScreen.tsx    — animated logo intro (always shows, no sessionStorage gate)
    Navigation.tsx      — sticky, h-[72px], border-b #e6e6e6, scroll-to-section links
    Hero.tsx            — hero with blue sweeping orbs + dot grid bg
    About.tsx           — about section with identity card + stats + right content
    ToolsMarquee.tsx    — dual-row marquee, pause on hover, tooltip
    Journey.tsx         — experience timeline (orange label)
    FeaturedWork.tsx    — case studies grid
    SideProjects.tsx    — horizontal scroll cards
    Contact.tsx         — contact banner with animated blue orbs
    Footer.tsx          — footer with large logo watermark
    TagBadge.tsx        — shared tag pill component
  lib/
    data.ts             — ALL site content (navLinks, caseStudies, sideProjects, tools)
public/
  logo-black.png
  logo-white.png
  profile-avatar.png
  dubizzle-labs-logo.png
DESIGN_SYSTEM.md        — full design system reference
HANDOFF.md              — this file
```

---

### Key Component Details

**Navigation**
- Height `h-[72px]`, `bg-white/96 backdrop-blur-md`, `border-b border-[#e6e6e6]`
- Link order: **About → Case Studies → Work** (all scroll in-page, no routing)
- CTA: `bg-[#0071e3]` filled pill "Let's Connect"

**About (left card)**
- Grid: `lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24`
- Identity header: avatar (ring on hover), name "Muhammad Taha Madni", "Available for work" green dot, `14px`
- 2×2 stat grid: `px-6 py-8`, labels `text-[10px] uppercase`, values `text-[28px] font-bold`
- Stats: `3+` Years Experience, `2` Companies, `20+` Products Designed, `17` Tools
- Bottom row: "Currently working in" (grey `text-gray-400`) + DL logo + "Dubizzle Labs" linked to `https://www.dubizzlelabs.com/` (grey, underlines on hover) — **no divider line**
- Right side: orange label → 40px heading → description → focus area pills → "Let's Connect" primary CTA (scrolls to contact)

**Tools Marquee**
- `py-16 lg:py-20` (no negative margin)
- Icon size 74px in rounded circles
- Hover pauses wave + shows tooltip

**Case Studies (FeaturedWork)**
- Label: "SELECTED WORK", Heading: "Products and experiences I've designed."
- **Gradient placeholder backgrounds** (no image files — defined per project in `data.ts`)
- Locked projects: "Case Study Locked 🔒" tertiary text-link style (grey), tooltip explains NDA on hover
- Status pill (Live/Designed) always first tag

**Side Projects**
- Label: "BUILDING OUTSIDE THE 9–5", Heading: "Side projects and experiments built outside work."
- Cards: `480px` fixed width, horizontal scroll
- Alignment fix: scroll track uses `max-w-7xl` wrapper + `-mx-6/-mx-10` negative margin so first card aligns with page content
- Arrow buttons `‹ ›` top right for scrolling
- CTA: tertiary text link style (same as case studies)
- **No `border-t`** before CTA

**Footer**
- Large `logo-black.png` watermark, full container width, `opacity-[0.065]`

---

### data.ts Schema

```typescript
caseStudies: {
  id, title, description,
  tags: string[],
  status: "Live" | "Designed",
  gradient: string,   // CSS gradient for placeholder bg
  locked?: boolean
}

sideProjects: {
  id, title, description,
  tags: string[],
  status: "Live" | "Concept",
  gradient: string,   // CSS gradient for placeholder bg
  locked?: boolean,
  href?: string
}
```

**Current case studies (6):** PropForce CRM (locked), PropOne RMS Revamp (locked), PropOne Facility Management (locked), PropOne Mobile App, Affiliate Platform Revamp, Investor Hub

**Current side projects (4):** Van-Ber (locked/NDA), The Bare Edit, Protect It, AFJA Trading

**Navigation links:** About (→ `#about-section`), Case Studies (→ `#featured-work`), Work (→ `#side-projects`)

---

### Known Behaviour
- **Splash screen** always shows on load (removed `sessionStorage` gate). Scroll is locked (`overflow: hidden` on `html` + `body`) until hero animations complete.
- All images in case studies and side projects are **gradient CSS placeholders** — user will replace with real screenshots later.
- Dubizzle Labs logo (`/dubizzle-labs-logo.png`) appears in Hero inline before "Dubizzle Labs" text and in the About card bottom row.
- `DESIGN_SYSTEM.md` in project root is fully up to date — read it before making any UI changes.
