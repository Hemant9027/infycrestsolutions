import type { Metadata } from "next";
import ServicePageTemplate, {
  createServiceMetadata,
} from "@/components/ServicePageTemplate";

const content = {
  slug: "web-development",
  eyebrow: "InfyCrest / Web Development",
  title: "Web Development for Growth-Focused Businesses",
  intro:
    "We build websites and digital systems that help businesses present their offer clearly, improve customer journeys, and make it easier for people to enquire or buy.",
  summary:
    "A strong website does more than look good. It gives a business a clearer story, easier communication, and a practical path from interest to enquiry. We focus on the parts that increase confidence and reduce friction.",
  highlights: [
    {
      title: "Modern, conversion-aware builds",
      description:
        "Clean front-end experiences designed around your offer, audience and customer journey.",
    },
    {
      title: "Business-focused structure",
      description:
        "Pages, flows and messaging built to guide visitors toward the action you actually want.",
    },
    {
      title: "Fast, reliable delivery",
      description:
        "Practical implementation with testing, responsive layouts and a smoother user experience.",
    },
    {
      title: "Technical foundations",
      description:
        "A cleaner frontend and SEO-friendly structure that supports long-term growth.",
    },
    {
      title: "Scalable architecture",
      description:
        "Built to handle simple brochure sites as well as more complex business systems.",
    },
    {
      title: "Clear handoff",
      description:
        "A launch-ready website that is easy to maintain and expand when the business grows.",
    },
  ],
  useCases: [
    {
      title: "Service businesses",
      description:
        "Present services clearly and simplify enquiry and consultation requests.",
    },
    {
      title: "Hospitality brands",
      description:
        "Turn property details, offers and calls to action into a smoother guest experience.",
    },
    {
      title: "Retail & e-commerce",
      description:
        "Support product discovery, trust-building, and a cleaner path to purchase.",
    },
    {
      title: "Professional services",
      description:
        "Create a credible digital presence that feels polished and easy to understand.",
    },
    {
      title: "Tourism businesses",
      description:
        "Make destinations, packages and booking information easier to browse on any device.",
    },
    {
      title: "Business operations",
      description:
        "Support internal dashboards and public-facing processes with a more useful website layer.",
    },
  ],
  process: [
    {
      title: "Brief & goals",
      description:
        "We understand what you need the website to do, who it needs to serve and what action matters most.",
    },
    {
      title: "Planning",
      description:
        "We map the structure, key pages and messaging so the site feels clear, fast and purposeful.",
    },
    {
      title: "Build",
      description:
        "We implement the design, flows and any required integrations in a practical, testable way.",
    },
    {
      title: "Launch & support",
      description:
        "We refine the final experience and make sure the site feels solid for the first phase of growth.",
    },
  ],
  faqs: [
    {
      question: "Do you only build new websites?",
      answer:
        "No. We also improve existing sites, refine layouts, add better conversion points and strengthen the user journey.",
    },
    {
      question: "How long does a project usually take?",
      answer:
        "It depends on scope. We usually work in a structured phase plan so timelines stay realistic and the project remains focused on what matters most.",
    },
    {
      question: "Do you handle the technical setup too?",
      answer:
        "Yes. We can cover the website structure, implementation, custom logic, integrations and launch support needed for a working business site.",
    },
  ],
  relatedServices: [
    { label: "Website Design", href: "/website-design" },
    { label: "Custom Software", href: "/custom-software" },
    { label: "SEO", href: "/seo" },
  ],
};

export const metadata: Metadata = createServiceMetadata(content);

export default function WebDevelopmentPage() {
  return <ServicePageTemplate {...content} />;
}
