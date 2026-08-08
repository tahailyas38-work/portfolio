import type { VapiToolHandler } from "./types";

/** Canonical section ids on the home page. */
export const SECTION_IDS = [
  "about",
  "products",
  "case-studies",
  "work",
  "side-projects",
  "design-studies",
  "creative-playground",
  "contact",
] as const;

/**
 * Map tool / nav aliases → stable DOM ids.
 */
export const SECTION_ALIASES: Record<string, string> = {
  about: "about",
  "about-section": "about",
  products: "products",
  product: "products",
  "case-studies": "products",
  casestudies: "products",
  cases: "products",
  "featured-work": "products",
  featuredwork: "products",
  work: "products",
  "side-projects": "side-projects",
  sideprojects: "side-projects",
  projects: "side-projects",
  "design-studies": "design-studies",
  designstudies: "design-studies",
  studies: "design-studies",
  "creative-playground": "creative-playground",
  playground: "creative-playground",
  contact: "contact",
};

const NAVBAR_HEIGHT = 96;

function resolveSectionId(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/^#/, "");
  return SECTION_ALIASES[key] ?? key;
}

function scrollElementIntoViewNavbarAware(element: HTMLElement, section: string) {
  const navbarHeight = NAVBAR_HEIGHT;
  const top =
    element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

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
