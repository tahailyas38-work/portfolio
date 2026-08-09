export const siteConfig = {
  name: "M. Taha Madni",
  fullName: "Muhammad Taha Madni",
  title: "Taha | Product Designer",
  role: "Product Designer | Entrepreneur | Creative Strategist",
  description:
    "Product designer, entrepreneur, and creative strategist turning complexity into clarity across enterprise, consumer, and AI products.",
  footerBlurb:
    "Product designer, entrepreneur, and creative strategist, turning complexity into clarity.",
  email: "tahailyas38@gmail.com",
  linkedin: "https://www.linkedin.com/in/muhammad-taha-madni-996a841b2",
  instagram: "https://www.instagram.com/",
  cv: "/Resume.pdf",
  ndaPassword: "Protect_ed@casestudy",
};

/** Primary nav (compact). */
export const navLinks = [
  { label: "Work", href: "#products" },
  { label: "Studies", href: "#design-studies" },
  { label: "Playground", href: "#creative-playground" },
];

/** Footer sitemap — labels match on-page section language. */
export const footerPageLinks = [
  { label: "Products", href: "#products" },
  { label: "Design Studies", href: "#design-studies" },
  { label: "Side Businesses", href: "#side-projects" },
  { label: "Playground", href: "#creative-playground" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const designStudies: {
  id: string;
  title: string;
  tagline: string;
  cardImage: string;
  fullImage: string;
  accent: string;
  sections: { image: string; note?: string[] }[];
}[] = [
  {
    id: "brainwave",
    title: "Brainwave",
    tagline: "Interface study - AI product marketing & neon UI systems.",
    cardImage: "/projects/design-studies/brainwave/card.webp",
    fullImage: "/projects/design-studies/brainwave/page-1.webp",
    accent: "#0E0C15",
    sections: [
      {
        image: "/projects/design-studies/brainwave/section-1.webp",
        note: [
          "These pages walk through an AI product story from the first hero promise",
          "to features, pricing, and sign-in - one continuous narrative, not disconnected screens.",
        ],
      },
      {
        image: "/projects/design-studies/brainwave/section-2.webp",
      },
      {
        image: "/projects/design-studies/brainwave/section-3.webp",
        note: [
          "Midway pages slow down to explain capability in digestible blocks,",
          "so each section feels like a chapter rather than another marketing panel.",
        ],
      },
      {
        image: "/projects/design-studies/brainwave/section-4.webp",
      },
      {
        image: "/projects/design-studies/brainwave/section-5.webp",
      },
      {
        image: "/projects/design-studies/brainwave/section-6.webp",
        note: [
          "Across the full set of pages, hierarchy and motion keep a complex product readable,",
          "which is the pattern I’d reuse when an interface has too much to say at once.",
        ],
      },
    ],
  },

  {
    id: "aimia",
    title: "Aimia",
    tagline: "Interface study - product marketing & storytelling.",
    cardImage: "/projects/design-studies/aimia/card.webp",
    fullImage: "/projects/design-studies/aimia/page-1.webp",
    accent: "#0E0C15",
    sections: [
      {
        image: "/projects/design-studies/aimia/section-1.webp",
        note: [
          "Aimia’s pages are built as a storytelling scroll - each section advances the brand",
          "narrative while still leaving room for a clear next action.",
        ],
      },
      {
        image: "/projects/design-studies/aimia/section-2.webp",
      },
      {
        image: "/projects/design-studies/aimia/section-3.webp",
      },
      {
        image: "/projects/design-studies/aimia/section-4.webp",
      },
      {
        image: "/projects/design-studies/aimia/section-5.webp",
      },
      {
        image: "/projects/design-studies/aimia/section-6.webp",
        note: [
          "Reading the full page sequence shows how pacing and visual breaks carry the story;",
          "without that rhythm, even strong art direction starts to feel endless.",
        ],
      },
    ],
  },

  {
    id: "edg3-labs",
    title: "Edg3 Labs",
    tagline: "Interface study - lab / tech studio presence.",
    cardImage: "/projects/design-studies/edg3-labs/card.webp",
    fullImage: "/projects/design-studies/edg3-labs/page-1.webp",
    accent: "#F8FAFC",
    sections: [
      {
        image: "/projects/design-studies/edg3-labs/section-1.webp",
        note: [
          "These pages present a technical studio with calm structure,",
          "using clarity on every screen instead of buzzwords to earn credibility.",
        ],
      },
      {
        image: "/projects/design-studies/edg3-labs/section-2.webp",
      },
      {
        image: "/projects/design-studies/edg3-labs/section-3.webp",
      },
      {
        image: "/projects/design-studies/edg3-labs/section-4.webp",
      },
      {
        image: "/projects/design-studies/edg3-labs/section-5.webp",
        note: [
          "The page sequence shows an experimental brand can still feel grounded;",
          "quiet grids and honest hierarchy do more work than visual noise.",
        ],
      },
    ],
  },

  {
    id: "foundation",
    title: "Foundation",
    tagline: "Interface study - structural clarity in layout.",
    cardImage: "/projects/design-studies/foundation/card.webp",
    fullImage: "/projects/design-studies/foundation/page-1.webp",
    accent: "#F3F0FF",
    sections: [
      {
        image: "/projects/design-studies/foundation/section-1.webp",
      },
      {
        image: "/projects/design-studies/foundation/section-2.webp",
      },
      {
        image: "/projects/design-studies/foundation/section-3.webp",
        note: [
          "Foundation’s pages are really a layout system in motion - columns, modules,",
          "and rules repeating so each screen scales without inventing a new pattern.",
        ],
      },
      {
        image: "/projects/design-studies/foundation/section-4.webp",
      },
      {
        image: "/projects/design-studies/foundation/section-5.webp",
      },
      {
        image: "/projects/design-studies/foundation/section-6.webp",
        note: [
          "Studying the full page set makes one idea obvious: when structure is honest,",
          "decoration becomes optional and the interface still feels complete.",
        ],
      },
    ],
  },

  {
    id: "gadget",
    title: "Gadget",
    tagline: "Interface study - hardware-meets-software retail.",
    cardImage: "/projects/design-studies/gadget/card.webp",
    fullImage: "/projects/design-studies/gadget/page-1.webp",
    accent: "#FFF7ED",
    sections: [
      {
        image: "/projects/design-studies/gadget/section-1.webp",
        note: [
          "Gadget’s pages move between hardware desire and software clarity,",
          "trading focus between product shots and feature strips as you scroll.",
        ],
      },
      {
        image: "/projects/design-studies/gadget/section-2.webp",
      },
      {
        image: "/projects/design-studies/gadget/section-3.webp",
      },
      {
        image: "/projects/design-studies/gadget/section-4.webp",
      },
      {
        image: "/projects/design-studies/gadget/section-5.webp",
        note: [
          "The page rhythm matters as much as the visuals - hero, proof, then purchase -",
          "so retail energy never turns into a wall of disconnected modules.",
        ],
      },
    ],
  },

  {
    id: "prefuma",
    title: "Prefuma",
    tagline: "Interface study - fragrance & sensory ecommerce.",
    cardImage: "/projects/design-studies/prefuma/card.webp",
    fullImage: "/projects/design-studies/prefuma/page-1.webp",
    accent: "#ECFDF5",
    sections: [
      {
        image: "/projects/design-studies/prefuma/section-1.webp",
      },
      {
        image: "/projects/design-studies/prefuma/section-2.webp",
        note: [
          "These pages sell a sensory product through color, type, and space,",
          "but every screen still keeps a clear path toward adding to cart.",
        ],
      },
      {
        image: "/projects/design-studies/prefuma/section-3.webp",
      },
      {
        image: "/projects/design-studies/prefuma/section-4.webp",
      },
      {
        image: "/projects/design-studies/prefuma/section-5.webp",
      },
      {
        image: "/projects/design-studies/prefuma/section-6.webp",
        note: [
          "Across the page set, atmosphere only works because the CTA never dissolves",
          "into the mood - beauty without a next step is just a moodboard.",
        ],
      },
    ],
  },

  {
    id: "speedo",
    title: "Speedo",
    tagline: "Interface study - performance & motion-led UI.",
    cardImage: "/projects/design-studies/speedo/card.webp?v=2",
    fullImage: "/projects/design-studies/speedo/page-1.webp?v=2",
    accent: "#EFF6FF",
    sections: [
      {
        image: "/projects/design-studies/speedo/section-1.webp?v=2",
        note: [
          "Speedo’s pages use motion and cutout photography to feel fast,",
          "while the ticket path stays obvious from the first screen onward.",
        ],
      },
      {
        image: "/projects/design-studies/speedo/section-2.webp?v=2",
      },
      {
        image: "/projects/design-studies/speedo/section-3.webp?v=2",
      },
      {
        image: "/projects/design-studies/speedo/section-4.webp?v=2",
      },
      {
        image: "/projects/design-studies/speedo/section-5.webp?v=2",
        note: [
          "Looking at the full page flow, performance branding stays minimal yet energetic -",
          "proof that pace can come from composition, not clutter.",
        ],
      },
    ],
  },

  {
    id: "travcyl",
    title: "Travcyl",
    tagline: "Interface study - travel booking & discovery.",
    cardImage: "/projects/design-studies/travcyl/card.webp",
    fullImage: "/projects/design-studies/travcyl/page-1.webp",
    accent: "#FDF2F8",
    sections: [
      {
        image: "/projects/design-studies/travcyl/section-1.webp",
        note: [
          "Travcyl’s pages lead with destination emotion before booking mechanics,",
          "stacking imagery, search, and trust in one readable scroll.",
        ],
      },
      {
        image: "/projects/design-studies/travcyl/section-2.webp",
      },
      {
        image: "/projects/design-studies/travcyl/section-3.webp",
        note: [
          "Mid-journey pages give cards and itineraries equal breathing room,",
          "because density is the fastest way to kill the urge to explore.",
        ],
      },
      {
        image: "/projects/design-studies/travcyl/section-4.webp",
      },
      {
        image: "/projects/design-studies/travcyl/section-5.webp",
      },
      {
        image: "/projects/design-studies/travcyl/section-6.webp",
        note: [
          "The complete page sequence inspires first, then removes friction -",
          "both halves have to be designed, or the trip never gets booked.",
        ],
      },
    ],
  },

  {
    id: "br-f",
    title: "BR.F",
    tagline: "Interface study - brand system meets digital product.",
    cardImage: "/projects/design-studies/br-f/card.webp",
    fullImage: "/projects/design-studies/br-f/page-1.webp",
    accent: "#EEF2F7",
    sections: [
      {
        image: "/projects/design-studies/br-f/section-1.webp",
      },
      {
        image: "/projects/design-studies/br-f/section-2.webp",
        note: [
          "These pages treat brand and product as one surface - typography-led layouts",
          "where every screen still feels like part of the same editorial system.",
        ],
      },
      {
        image: "/projects/design-studies/br-f/section-3.webp",
      },
      {
        image: "/projects/design-studies/br-f/section-4.webp",
      },
      {
        image: "/projects/design-studies/br-f/section-5.webp",
      },
      {
        image: "/projects/design-studies/br-f/section-6.webp",
        note: [
          "The page flow proves restraint can feel premium: fewer modules, sharper type,",
          "and enough quiet space that the mark never has to shout.",
        ],
      },
    ],
  },

  {
    id: "carza",
    title: "Carza",
    tagline: "Interface study - automotive commerce experience.",
    cardImage: "/projects/design-studies/carza/card.webp",
    fullImage: "/projects/design-studies/carza/page-1.webp",
    accent: "#F4F6FA",
    sections: [
      {
        image: "/projects/design-studies/carza/section-1.webp",
        note: [
          "Carza’s pages organize the buying journey around desire first - photography leads,",
          "then comparison and commit steps arrive without breaking the mood.",
        ],
      },
      {
        image: "/projects/design-studies/carza/section-2.webp",
      },
      {
        image: "/projects/design-studies/carza/section-3.webp",
      },
      {
        image: "/projects/design-studies/carza/section-4.webp",
        note: [
          "Later pages hold filters, cards, and sticky actions under scroll pressure,",
          "keeping trust cues visible while the shopper keeps moving.",
        ],
      },
      {
        image: "/projects/design-studies/carza/section-5.webp",
      },
      {
        image: "/projects/design-studies/carza/section-6.webp",
        note: [
          "End to end, the pages balance speed and reassurance - the two things automotive",
          "commerce usually forces you to choose between.",
        ],
      },
    ],
  },
];


export type PlaygroundSlide = string | { src: string; bg?: string };

export const playgroundCategories: {
  id: string;
  title: string;
  description: string;
  /** @deprecated Prefer slides — kept as fallback */
  cover: string;
  /** Carousel images shown in the card media well */
  slides: PlaygroundSlide[];
  /** cover fills the well; contain shows full artwork (best for portraits / lockups) */
  mediaFit?: "cover" | "contain";
  items: { id: string; title: string; image: string }[];
}[] = [
  {
    id: "graphic-design",
    title: "Graphic Design",
    description:
      "Layouts, posters, and visual systems built for clarity and punch. Work that grabs attention fast and still holds up when you look closer.",
    cover: "/projects/graphic-design/01-auto-luxury-notebooks.png",
    slides: [
      "/projects/graphic-design/01-auto-luxury-notebooks.png",
      "/projects/graphic-design/02-automotive-dropper.png",
      "/projects/graphic-design/03-exotic-car-box.png",
      "/projects/graphic-design/04-straightline-packaging.png",
      "/projects/graphic-design/05-aa-builders-signage.png",
      "/projects/graphic-design/06-5plus2-monogram.png",
    ],
    items: [],
  },
  {
    id: "branding",
    title: "Branding",
    description:
      "Marks, lockups, and brand systems that stay coherent at every scale. From first impression to everyday use across product and marketing.",
    cover: "/projects/branding/01-knight-fox.png",
    mediaFit: "contain",
    slides: [
      { src: "/projects/branding/01-knight-fox.png", bg: "#fff603" },
      { src: "/projects/branding/02-butterfly-tailors.png", bg: "#02ffff" },
      { src: "/projects/branding/03-owl.png", bg: "#fcb4a8" },
      { src: "/projects/branding/04-jackal.png", bg: "#ffa23a" },
    ],
    items: [],
  },
  {
    id: "illustration",
    title: "Illustration",
    description:
      "Characters and scenes drawn for product storytelling and campaigns. Visual narratives that make complex ideas feel human and memorable.",
    cover: "/projects/illustration/01-orange-cat.png",
    mediaFit: "contain",
    slides: [
      { src: "/projects/illustration/01-orange-cat.png", bg: "#d307da" },
      { src: "/projects/illustration/02-pikachu.png", bg: "#ffffff" },
      { src: "/projects/illustration/03-woman-red-kurta.png", bg: "#efede0" },
      { src: "/projects/illustration/04-man-polo.png", bg: "#efede0" },
      { src: "/projects/illustration/05-woman-patterned-blouse.png", bg: "#efede0" },
      { src: "/projects/illustration/06-woman-blue-blazer.png", bg: "#efede0" },
    ],
    items: [],
  },
];

export const workflowTools = [
  { name: "Figma", icon: "/tools/figma.png", role: "Design & systems" },
  { name: "Framer", icon: "/tools/framer.png", role: "Prototype & ship" },
  { name: "Miro", icon: "/tools/miro.png", role: "Research & mapping" },
  { name: "Claude", icon: "/tools/claude.png", role: "Ideate & refine" },
  { name: "Cursor", icon: "/tools/cursor.png", role: "Build & iterate" },
  { name: "Adobe", icon: "/tools/adobe.png", role: "Visual polish" },
];

export const designPrinciples = [
  {
    title: "Simplicity over noise",
    description: "Every element earns its place. Clarity beats decoration.",
    icon: "◯",
  },
  {
    title: "Systems before screens",
    description: "Scalable patterns first. Screens are expressions of the system.",
    icon: "⬡",
  },
  {
    title: "Design with business impact",
    description: "Great UX connects user needs to measurable outcomes.",
    icon: "↗",
  },
  {
    title: "Iterate fast with AI",
    description: "Use AI to explore faster, validate sooner, and ship smarter.",
    icon: "✦",
  },
];

export const howIWorkSteps = [
  { step: "Research", description: "Understand users, constraints, and business goals." },
  { step: "Simplify", description: "Distill complexity into clear flows and structures." },
  { step: "Prototype", description: "Build interactive concepts to test ideas early." },
  { step: "Validate", description: "Test with users and stakeholders, refine quickly." },
  { step: "Ship", description: "Hand off with clarity and support through launch." },
];

export const beyondDesign = [
  { label: "Building startup ideas", emoji: "🚀" },
  { label: "Exploring AI tools", emoji: "✦" },
  { label: "Watching design breakdowns", emoji: "▶" },
  { label: "Coffee + random side projects", emoji: "☕" },
];

export const featuredQuote = {
  text: "Good design is actually a lot harder to notice than poor design, because good designs fit our needs so well that the design is invisible.",
  /** Desktop line breaks — natural reading rhythm (3 lines on sm+) */
  lines: [
    "Good design is actually a lot harder to notice than poor design,",
    "because good designs fit our needs so well",
    "that the design is invisible.",
  ] as const,
  author: "Don Norman",
  role: "Author, The Design of Everyday Things",
  image: "/thoughts/don-norman.jpg",
};

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

// New order: Investor Hub, Affiliate Platform Revamp, PropOne Mobile App,
//            PropForce CRM, PropOne RMS Revamp, PropOne Facility Management
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
    id: "investor-hub",
    title: "Investor Hub",
    description:
      "Designed and revamped an investment-focused consumer platform.",
    tags: ["Web", "Consumer", "Revamp"],
    status: "Live",
    gradient: "linear-gradient(135deg, #fff1f2 0%, #fda4af 100%)",
    image: "/projects/case-studies/investor-hub.jpg",
  },
  {
    id: "affiliate-platform-revamp",
    title: "Affiliate Platform Revamp",
    description:
      "Unified multiple Zameen and Bayut affiliate platforms into one scalable global platform.",
    tags: ["Web", "Consumer", "Revamp"],
    status: "Live",
    gradient: "linear-gradient(135deg, #fffbeb 0%, #fcd88a 100%)",
    image: "/projects/case-studies/affiliate-platform-revamp.jpg",
  },
  {
    id: "propone-mobile-app",
    title: "PropOne Mobile App",
    description:
      "Designed a consumer-focused mobile application experience for property management.",
    tags: ["Mobile", "Consumer", "UX Design"],
    status: "Live",
    gradient: "linear-gradient(135deg, #faf5ff 0%, #d8b4fe 100%)",
    image: "/projects/case-studies/propone-mobile-app.jpg",
  },
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
];

// Order: The Bare Edit, Protect It, AFJA (Vanber removed)
export const sideProjects: {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "Live" | "Concept";
  gradient: string;
  image?: string;
  locked?: boolean;
  href?: string;
}[] = [
  {
    id: "the-bare-edit",
    title: "The Bare Edit",
    description:
      "Minimal jewellery e-commerce experience focused on premium UX and conversion journeys.",
    tags: ["E-Commerce", "UX/UI Design"],
    status: "Live",
    gradient: "linear-gradient(135deg, #fdf6f0 0%, #e8c9b0 100%)",
    image: "/projects/side-projects/the-bare-edit.jpg",
    href: "https://thebareedit.pk",
  },
  {
    id: "protect-it",
    title: "Protect It",
    description:
      "Automotive e-commerce platform with scalable inventory and order management workflows.",
    tags: ["E-Commerce", "UX/UI Design"],
    status: "Live",
    gradient: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)",
    image: "/projects/side-projects/protect-it.jpg",
    href: "https://protectit.pk",
  },
  {
    id: "afja-trading",
    title: "AFJA Trading",
    description:
      "Corporate website designed to improve brand clarity and digital presence.",
    tags: ["Brand", "UX/UI Design"],
    status: "Live",
    gradient: "linear-gradient(135deg, #f0faf5 0%, #a7e8c4 100%)",
    image: "/projects/side-projects/afja-trading.jpg",
    href: "https://afjatrading.com",
  },
];
