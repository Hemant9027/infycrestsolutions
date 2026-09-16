/**
 * Live-demo registry.
 *
 * Add a new entry here and the demo automatically gets:
 *  - a card in the Collection grid
 *  - a details modal + selection flow
 *  - a live preview route at /demo/<slug>
 */

export type DemoCategory =
  | "Business"
  | "Healthcare"
  | "Fitness"
  | "Beauty"
  | "Food"
  | "Hospitality";

export interface Demo {
  name: string;
  slug: string;
  category: DemoCategory;
  /** One-line card description. */
  tagline: string;
  /** Longer description used in modals and the demo page. */
  description: string;
  /** Preview image under /public. */
  thumbnail: string;
  /** Live preview route. */
  previewUrl: string;
  /** Running preview app URL, when the demo is available as an iframe. */
  liveUrl?: string;
  technologies: string[];
  priceLabel: string;
  priceNote?: string;
  featured: boolean;
  /** e.g. "3-PAGE WEBSITE / ADMIN PANEL" */
  scope?: string;
  includes: string[];
}

export const DEMOS: Demo[] = [
  {
    name: "LaunchKit",
    slug: "launchkit",
    category: "Business",
    tagline:
      "A polished, conversion-ready launch package for businesses that refuse to wait.",
    description:
      "A polished, conversion-ready website package for businesses that need a strong online launch without the wait. Three sharp pages, an integrated admin panel and a design system that already feels like you.",
    thumbnail: "/previews/launchkit-main.jpg",
    previewUrl: "/demo/launchkit",
    technologies: ["Next.js", "React", "Tailwind CSS", "Node.js", "PostgreSQL"],
    priceLabel: "Custom quote",
    priceNote: "Scoped to your launch",
    featured: true,
    scope: "3-PAGE WEBSITE / ADMIN PANEL",
    includes: [
      "Home, offering and contact pages",
      "Integrated admin panel",
      "Lead capture with WhatsApp handoff",
      "Launch-ready SEO foundations",
    ],
  },
  {
    name: "Dental Clinic",
    slug: "dental-clinic",
    category: "Healthcare",
    tagline: "Appointments, treatments and trust — wrapped in a calm, clinical design.",
    description:
      "A reassuring clinic website with treatment pages, a doctor profile, smile gallery and one-tap appointment booking built for patients on phones.",
    thumbnail: "/previews/dental-clinic.jpg",
    previewUrl: "/demo/dental-clinic",
    technologies: ["Next.js", "React", "Tailwind CSS", "Supabase"],
    priceLabel: "₹999",
    priceNote: "one-time starter",
    featured: false,
    scope: "LANDING PAGE + BOOKING",
    includes: [
      "Treatment & pricing sections",
      "Appointment request flow",
      "Doctor profile and reviews",
      "Maps, hours and WhatsApp booking",
    ],
  },
  {
    name: "Hospital",
    slug: "hospital",
    category: "Healthcare",
    tagline: "Departments, doctors and emergency info presented with total clarity.",
    description:
      "A structured hospital web presence with department directories, doctor listings, emergency contact prominence and patient-first navigation.",
    thumbnail: "/previews/hospital.jpg",
    previewUrl: "/demo/hospital",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    priceLabel: "₹999",
    priceNote: "one-time starter",
    featured: false,
    scope: "MULTI-SECTION WEBSITE",
    includes: [
      "Department & speciality pages",
      "Doctor directory",
      "Emergency contact bar",
      "OPD timings and enquiry forms",
    ],
  },
  {
    name: "Personal Trainer",
    slug: "personal-trainer",
    category: "Fitness",
    tagline: "Programs, results and booking — a personal brand that converts.",
    description:
      "A bold one-person-brand site with training programs, transformation stories, pricing and direct booking so clients commit before the first call.",
    thumbnail: "/previews/personal-trainer.jpg",
    previewUrl: "/demo/personal-trainer",
    technologies: ["Next.js", "React", "Tailwind CSS", "Firebase"],
    priceLabel: "₹999",
    priceNote: "one-time starter",
    featured: false,
    scope: "LANDING PAGE + PROGRAMS",
    includes: [
      "Program & coaching tiers",
      "Transformation gallery",
      "Client testimonials",
      "Trial-session booking CTA",
    ],
  },
  {
    name: "Gym",
    slug: "gym",
    category: "Fitness",
    tagline: "Memberships, schedules and facilities in one high-energy page.",
    description:
      "A high-impact gym site with membership pricing, class schedules, trainer highlights and join-now flows tuned for walk-in conversions.",
    thumbnail: "/previews/gym.jpg",
    previewUrl: "/demo/gym",
    technologies: ["Next.js", "React", "Tailwind CSS", "MongoDB"],
    priceLabel: "₹999",
    priceNote: "one-time starter",
    featured: false,
    scope: "LANDING PAGE + MEMBERSHIPS",
    includes: [
      "Membership price cards",
      "Class timetable section",
      "Facilities & equipment gallery",
      "Free-trial lead capture",
    ],
  },
  {
    name: "Salon",
    slug: "salon",
    category: "Beauty",
    tagline: "Services, stylists and instant booking with a soft luxury feel.",
    description:
      "An elegant salon presence with a service menu, stylist profiles, look-book gallery and frictionless booking that fills the calendar.",
    thumbnail: "/previews/salon.jpg",
    previewUrl: "/demo/salon",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    priceLabel: "₹999",
    priceNote: "one-time starter",
    featured: false,
    scope: "LANDING PAGE + BOOKING",
    includes: [
      "Service menu with pricing",
      "Stylist profiles",
      "Look-book gallery",
      "Slot-request booking flow",
    ],
  },
  {
    name: "Cloud Kitchen",
    slug: "cloud-kitchen",
    category: "Food",
    tagline: "A delivery-first menu experience built to drive direct orders.",
    description:
      "A mouth-watering, delivery-first site showcasing the menu, combo deals and direct ordering that cuts aggregator commissions.",
    thumbnail: "/previews/cloud-kitchen.jpg",
    previewUrl: "/demo/cloud-kitchen",
    technologies: ["Next.js", "React", "Tailwind CSS", "Firebase"],
    priceLabel: "₹999",
    priceNote: "one-time starter",
    featured: false,
    scope: "LANDING PAGE + MENU",
    includes: [
      "Visual menu with categories",
      "Combo & offer highlights",
      "Direct WhatsApp ordering",
      "Delivery-area information",
    ],
  },
  {
    name: "Bakery",
    slug: "bakery",
    category: "Food",
    tagline: "Cakes, bakes and custom orders in a warm editorial layout.",
    description:
      "A warm, editorial bakery site with a product showcase, custom-cake enquiry flow and daily specials that keep regulars coming back.",
    thumbnail: "/previews/bakery.jpg",
    previewUrl: "/demo/bakery",
    technologies: ["Next.js", "React", "Tailwind CSS", "PostgreSQL"],
    priceLabel: "₹999",
    priceNote: "one-time starter",
    featured: false,
    scope: "LANDING PAGE + CATALOGUE",
    includes: [
      "Product showcase grid",
      "Custom-cake enquiry form",
      "Daily specials section",
      "Store hours & directions",
    ],
  },
  {
    name: "Cafe",
    slug: "cafe",
    category: "Hospitality",
    tagline: "Menu, ambience and location — a cafe site that feels like the place.",
    description:
      "A minimal cafe presence with menu highlights, ambience gallery, events strip and maps integration so first visits happen sooner.",
    thumbnail: "/previews/cafe.jpg",
    previewUrl: "/demo/cafe",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    priceLabel: "₹999",
    priceNote: "one-time starter",
    featured: false,
    scope: "LANDING PAGE + MENU",
    includes: [
      "Menu highlight cards",
      "Ambience gallery",
      "Events & specials strip",
      "Hours, maps & reservations",
    ],
  },
  {
    name: "Restaurant",
    slug: "restaurant",
    category: "Hospitality",
    tagline: "A fine-dining first impression with reservations built in.",
    description:
      "A dark, editorial restaurant experience with tasting menus, reservation requests, chef notes and a gallery that sells the evening.",
    thumbnail: "/previews/restaurant.jpg",
    previewUrl: "/demo/restaurant",
    technologies: ["Next.js", "React", "Tailwind CSS", "MongoDB"],
    priceLabel: "₹999",
    priceNote: "one-time starter",
    featured: false,
    scope: "LANDING PAGE + RESERVATIONS",
    includes: [
      "Menu & tasting sections",
      "Table reservation flow",
      "Chef & story section",
      "Private events enquiry",
    ],
  },
  {
    name: "Hibiscus Inn",
    slug: "hibiscuss-inn",
    category: "Hospitality",
    tagline: "A refined inn experience with rooms, amenities and direct enquiries.",
    description:
      "A warm, editorial hospitality website for Hibiscus Inn with accommodation details, guest experiences, gallery moments and direct booking enquiries.",
    thumbnail: "/previews/restaurant.jpg",
    previewUrl: "/demo/hibiscuss-inn",
    liveUrl:
      process.env.NEXT_PUBLIC_HIBISCUS_INN_URL ?? "http://localhost:3001",
    technologies: ["Next.js", "React", "Tailwind CSS", "PostgreSQL"],
    priceLabel: "Custom quote",
    priceNote: "Scoped to your hospitality brand",
    featured: false,
    scope: "HOSPITALITY WEBSITE + ENQUIRIES",
    includes: [
      "Accommodation showcase",
      "Guest experience sections",
      "Gallery and local area highlights",
      "Direct enquiry form",
    ],
  },
];

export const COLLECTION_DEMOS = DEMOS.filter((demo) => !demo.featured);

export const FEATURED_DEMO = DEMOS.find((demo) => demo.featured) ?? DEMOS[0];

export const DEMO_CATEGORIES = [
  "All",
  ...Array.from(new Set(COLLECTION_DEMOS.map((demo) => demo.category))),
] as const;

export function getDemoBySlug(slug: string) {
  return DEMOS.find((demo) => demo.slug === slug);
}
