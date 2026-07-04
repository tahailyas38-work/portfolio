export const siteConfig = {
  name: "Muhammad Taha Madni",
  title: "Taha — Product Designer",
  description:
    "Product Designer at Dubizzle Labs focused on simplifying complex workflows and creating seamless experiences.",
  email: "tahailyas38@gmail.com",
  linkedin: "https://linkedin.com/in/muhammad-taha-madni-996a841b2",
};

export const navLinks = [
  { label: "About", href: "#about-section" },
  { label: "Case Studies", href: "#featured-work" },
  { label: "Work", href: "#side-projects" },
];

export const tools = [
  { name: "Figma", icon: "/tools/figma.png", size: 52 },
  { name: "Framer", icon: "/tools/framer.png", size: 52 },
  { name: "Miro", icon: "/tools/miro.png", size: 52 },
  { name: "Claude", icon: "/tools/claude.png", size: 52 },
  { name: "Cursor", icon: "/tools/cursor.png", size: 52 },
  { name: "Adobe", icon: "/tools/adobe.png", size: 52 },
  { name: "Illustrator", icon: "/tools/illustrator.png", size: 52 },
  { name: "Photoshop", icon: "/tools/photoshop.png", size: 52 },
  { name: "After Effects", icon: "/tools/after-effects.png", size: 52 },
  { name: "GitHub", icon: "/tools/github.png", size: 52 },
  { name: "Vercel", icon: "/tools/vercel.png", size: 52 },
  { name: "Firebase", icon: "/tools/firebase.png", size: 52 },
  { name: "Resend", icon: "/tools/resend.png", size: 52 },
  { name: "Meta", icon: "/tools/meta.png", size: 52 },
  { name: "Cloudinary", icon: "/tools/cloudinary.png", size: 52 },
  { name: "Sentry", icon: "/tools/sentry.png", size: 52 },
  { name: "Google Analytics", icon: "/tools/google-analytics.png", size: 52 },
];

export const caseStudies: {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "Live" | "Designed";
  gradient: string;
  image?: string;
  locked?: boolean;
}[] = [
  {
    id: "propforce-crm",
    title: "PropForce CRM",
    description:
      "Added and designed multiple workflow enhancements and features for a large-scale CRM used by Zameen and Bayut teams.",
    tags: ["CRM", "Product Design", "Features Addition"],
    status: "Designed",
    gradient: "linear-gradient(135deg, #e8f0fe 0%, #c7d7f8 100%)",
    locked: true,
  },
  {
    id: "propone-rms-revamp",
    title: "PropOne RMS Revamp",
    description:
      "Revamped the existing CRM experience to simplify workflows and improve usability.",
    tags: ["CRM", "Product Design", "Revamp"],
    status: "Designed",
    gradient: "linear-gradient(135deg, #edf2f7 0%, #c0cfe8 100%)",
    locked: true,
  },
  {
    id: "propone-facility-management",
    title: "PropOne Facility Management",
    description:
      "Designed an end-to-end facility management CRM from scratch.",
    tags: ["CRM", "Product Design", "Complete Design"],
    status: "Designed",
    gradient: "linear-gradient(135deg, #e6fffa 0%, #a8dfd4 100%)",
    locked: true,
  },
  {
    id: "propone-mobile-app",
    title: "PropOne Mobile App",
    description:
      "Designed a consumer-focused mobile application experience for property management.",
    tags: ["Mobile", "Consumer", "UX Design"],
    status: "Live",
    gradient: "linear-gradient(135deg, #faf5ff 0%, #d8b4fe 100%)",
  },
  {
    id: "affiliate-platform-revamp",
    title: "Affiliate Platform Revamp",
    description:
      "Unified multiple Zameen and Bayut affiliate platforms into one scalable global platform.",
    tags: ["Web", "Consumer", "Revamp"],
    status: "Live",
    gradient: "linear-gradient(135deg, #fffbeb 0%, #fcd88a 100%)",
  },
  {
    id: "investor-hub",
    title: "Investor Hub",
    description:
      "Designed and revamped an investment-focused consumer platform.",
    tags: ["Web", "Consumer", "Revamp"],
    status: "Live",
    gradient: "linear-gradient(135deg, #fff1f2 0%, #fda4af 100%)",
    image: "/investor-hub-case-study.jpg",
  },
];

export const sideProjects: {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "Live" | "Concept";
  gradient: string;
  locked?: boolean;
  href?: string;
}[] = [
  {
    id: "van-ber",
    title: "Van-Ber",
    description:
      "Transportation-focused mobile experience selected for exhibition showcase and linked to Cyberport University Partnership Programme 2026.",
    tags: ["Mobile", "UX Design"],
    status: "Concept",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    locked: true,
  },
  {
    id: "the-bare-edit",
    title: "The Bare Edit",
    description:
      "Minimal jewellery e-commerce experience focused on premium UX and conversion journeys.",
    tags: ["E-Commerce", "UX/UI Design"],
    status: "Live",
    gradient: "linear-gradient(135deg, #fdf6f0 0%, #e8c9b0 100%)",
  },
  {
    id: "protect-it",
    title: "Protect It",
    description:
      "Automotive e-commerce platform with scalable inventory and order management workflows.",
    tags: ["E-Commerce", "UX/UI Design"],
    status: "Live",
    gradient: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)",
  },
  {
    id: "afja-trading",
    title: "AFJA Trading",
    description:
      "Corporate website designed to improve brand clarity and digital presence.",
    tags: ["Brand", "UX/UI Design"],
    status: "Live",
    gradient: "linear-gradient(135deg, #f0faf5 0%, #a7e8c4 100%)",
  },
];

export const journey = [
  {
    role: "Product Designer",
    company: "Dubizzle Labs",
    period: "Jun 2024 — Present",
    description:
      "Designing CRM and consumer experiences across Zameen, Bayut, OLX, and Dubizzle Cars.",
  },
  {
    role: "UX/UI Designer",
    company: "Dev Dimensions",
    period: "Jul 2023 — Jun 2024",
    description:
      "Designed digital products and user interfaces for client projects.",
  },
];
