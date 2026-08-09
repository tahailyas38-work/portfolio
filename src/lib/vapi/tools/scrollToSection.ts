import type { VapiToolHandler } from "./types";

/** Canonical section ids on the home page. */
export const SECTION_IDS = [
  "hero",
  "about",
  "products",
  "case-studies",
  "work",
  "side-projects",
  "design-studies",
  "workflow-tools",
  "creative-playground",
  "featured-thought",
  "contact",
  "footer",
] as const;

/**
 * Map tool / nav aliases → stable DOM ids.
 */
export const SECTION_ALIASES: Record<string, string> = {
  hero: "hero",
  "hero-section": "hero",
  home: "hero",
  homepage: "hero",
  top: "hero",
  start: "hero",
  beginning: "hero",
  intro: "hero",
  introduction: "hero",
  landing: "hero",
  main: "hero",
  about: "about",
  "about-section": "about",
  me: "about",
  products: "products",
  product: "products",
  "case-studies": "products",
  casestudies: "products",
  cases: "products",
  "featured-work": "products",
  featuredwork: "products",
  work: "products",
  portfolio: "products",
  "side-projects": "side-projects",
  sideprojects: "side-projects",
  projects: "side-projects",
  businesses: "side-projects",
  "side-businesses": "side-projects",
  "design-studies": "design-studies",
  designstudies: "design-studies",
  studies: "design-studies",
  tools: "workflow-tools",
  tool: "workflow-tools",
  "workflow-tools": "workflow-tools",
  workflow: "workflow-tools",
  "design-tools": "workflow-tools",
  "dev-tools": "workflow-tools",
  "development-tools": "workflow-tools",
  marquee: "workflow-tools",
  "creative-playground": "creative-playground",
  playground: "creative-playground",
  creative: "creative-playground",
  "featured-thought": "featured-thought",
  thought: "featured-thought",
  contact: "contact",
  connect: "contact",
  hire: "contact",
  footer: "footer",
  "site-footer": "footer",
  bottom: "footer",
  end: "footer",
};

const NAVBAR_HEIGHT = 96;

function normalizeSectionKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/[_/\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveSectionId(raw: string): string {
  const key = normalizeSectionKey(raw);
  if (!key) return key;

  if (SECTION_ALIASES[key]) return SECTION_ALIASES[key];

  const stripped = key.replace(/-?(section|page|area|block)$/g, "");
  if (stripped && SECTION_ALIASES[stripped]) return SECTION_ALIASES[stripped];

  // Fuzzy: "hero section please" / "my tools" style phrases from the model.
  const ranked = Object.entries(SECTION_ALIASES)
    .filter(([alias]) => key.includes(alias) || alias.includes(key))
    .sort((a, b) => b[0].length - a[0].length);

  if (ranked[0]) return ranked[0][1];

  return key;
}

function scrollElementIntoViewNavbarAware(element: HTMLElement, section: string) {
  // Hero sits at the very top — navbar offset would produce a negative target
  // and snap/scroll behavior can no-op. Match the nav "home" behavior.
  if (section === "hero") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("[scrollToSection] scrolled to hero (top: 0)");
    return;
  }

  const navbarHeight = NAVBAR_HEIGHT;
  const top = Math.max(
    0,
    element.getBoundingClientRect().top + window.pageYOffset - navbarHeight
  );

  console.log("[scrollToSection] computed scroll top:", {
    section,
    navbarHeight,
    boundingTop: element.getBoundingClientRect().top,
    pageYOffset: window.pageYOffset,
    top,
  });

  window.scrollTo({ top, behavior: "smooth" });
  console.log("[scrollToSection] window.scrollTo invoked");
}

export const scrollToSectionTool: VapiToolHandler = (args) => {
  console.log("[scrollToSection] handler invoked with args:", args);

  const rawSection = args.section ?? args.sectionId ?? args.id ?? args.target;
  console.log("[scrollToSection] raw section value:", rawSection);

  if (rawSection == null || String(rawSection).trim() === "") {
    const msg = "scrollToSection missing `section` argument";
    console.warn(`[scrollToSection] ${msg}`);
    return msg;
  }

  const section = resolveSectionId(String(rawSection));
  console.log("[scrollToSection] resolved section id:", section);

  const element = document.getElementById(section);
  console.log("[scrollToSection] document.getElementById result:", element);

  if (!element) {
    console.warn(`No element found for section: ${section}`);
    return `No element found for section: ${section}`;
  }

  scrollElementIntoViewNavbarAware(element, section);
  return `Scrolled to section: ${section}`;
};
