/**
 * Central brand, contact and URL configuration for InfyCrest Solutions.
 * Add real social/resource URLs here when available — components will pick
 * them up automatically.
 */

export const SITE = {
  name: "InfyCrest Solutions",
  shortName: "InfyCrest",
  tagline: "Websites, software and automation for ambitious businesses.",
  year: 2026,
  url: "https://www.infycrestsolutions.com",
  title: "InfyCrest Solutions — Websites, Software & Digital Solutions",
  description:
    "InfyCrest Solutions builds high-performance websites, e-commerce experiences, custom software and business automation for growing businesses.",
  email: "hemant@infycrestsolutions.com",
  emailHref: "mailto:hemant@infycrestsolutions.com",
  phoneDisplay: "+91 9027152962",
  phoneHref: "tel:+919027152962",
  whatsappNumber: "919027152962",
  defaultWhatsAppMessage:
    "Hi InfyCrest Solutions, I'm interested in building a website.",
} as const;

/** Build a wa.me deep link with a pre-filled, URL-encoded message. */
export function whatsappUrl(message: string = SITE.defaultWhatsAppMessage) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WA_LAUNCHKIT = whatsappUrl(
  "Hi InfyCrest Solutions, I'd like to get the LaunchKit website package."
);

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/#demos" },
  { label: "Templates", href: "/templates" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
] as const;

export const QUICK_LINKS = [
  { label: "Templates", href: "/template" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Process", href: "/#process" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#contact" },
] as const;

export const RESOURCE_LINKS = [{ label: "Blog", url: "/blog" }, { label: "Careers", url: "/careers" }] as const;

export interface ExternalLink {
  label: string;
  /** Empty string = placeholder, real URL not available yet. */
  url: string;
}

/** Social profiles — real URLs to be added when the handles go live. */
export const SOCIAL_LINKS: ExternalLink[] = [
  { label: "Facebook", url: "" },
  { label: "Instagram", url: "" },
  { label: "YouTube", url: "" },
];

/** Customization modes offered in the project-request flow. */
export const CUSTOMIZATION_OPTIONS = [
  {
    id: "as-is",
    label: "Use this design as-is",
    message: "use this design as-is",
  },
  {
    id: "minor",
    label: "Minor customization",
    message: "minor customization",
  },
  {
    id: "complete",
    label: "Complete customization",
    message: "complete customization",
  },
] as const;

export type CustomizationId = (typeof CUSTOMIZATION_OPTIONS)[number]["id"];
