import type { Metadata } from "next";
import ServicePageTemplate, {
  createServiceMetadata,
} from "@/components/ServicePageTemplate";

const content = {
  slug: "website-design",
  eyebrow: "InfyCrest / Website Design",
  title: "Website Design That Looks Premium and Feels Clear",
  intro:
    "We design websites that feel polished, mobile-ready and structured around how real customers browse, compare and decide.",
  summary:
    "Good design for a business website is not about decoration alone. It is about clarity, trust, and making the most important information easy to understand within a few seconds.",
  highlights: [
    {
      title: "Premium visual direction",
      description:
        "A clean, modern design language that feels credible without becoming overly generic.",
    },
    {
      title: "Clear hierarchy",
      description:
        "We structure content so the most important offer, proof points and calls to action stand out.",
    },
    {
      title: "Responsive layouts",
      description:
        "Every page is designed to work well for mobile users, as that is usually where the first decision begins.",
    },
    {
      title: "Brand alignment",
      description:
        "The design supports the business tone and positioning instead of forcing a template personality.",
    },
    {
      title: "Conversion-first sections",
      description:
        "We place enquiry and booking actions where people are most likely to engage.",
    },
    {
      title: "Better user flow",
      description:
        "Your pages are organized around the actual customer journey rather than a random collection of sections.",
    },
  ],
  useCases: [
    {
      title: "Boutique accommodation",
      description:
        "Present the property with better storytelling, property detail pages and clearer enquiry flow.",
    },
    {
      title: "Professional service firms",
      description:
        "Build trust with a structure that explains the offer and next step clearly.",
    },
    {
      title: "Restaurants & cafes",
      description:
        "Show the atmosphere, menu and reservation path in a more usable layout.",
    },
    {
      title: "Retail brands",
      description:
        "Create a stronger first impression and a smoother path from browsing to purchase.",
    },
    {
      title: "Hospitality businesses",
      description:
        "Use a premium visual style to support direct booking and visitor confidence.",
    },
    {
      title: "Startups",
      description:
        "Create a quality first impression that supports investor, customer and partnership conversations.",
    },
  ],
  process: [
    {
      title: "Review & clarify",
      description:
        "We look at the brand, audience and existing website to identify what needs to be improved.",
    },
    {
      title: "Structure",
      description:
        "We define the page hierarchy and storytelling flow so the experience feels easy to navigate.",
    },
    {
      title: "Visual system",
      description:
        "We shape the interface, typography and layout around the business and customer journey.",
    },
    {
      title: "Refine & launch",
      description:
        "We test the strongest calls to action, mobile experience and final details before go-live.",
    },
  ],
  faqs: [
    {
      question:
        "Can you update an existing website instead of building a new one?",
      answer:
        "Yes. In many cases, the better move is to improve the structure, messaging and layout without reinventing the whole system.",
    },
    {
      question: "Do you work with luxury or premium hospitality brands?",
      answer:
        "Yes. We can support premium positioning through cleaner layouts, stronger storytelling and more direct customer actions.",
    },
    {
      question: "Will the site be mobile-friendly?",
      answer:
        "Absolutely. We design with mobile usability in mind because that is often the first point where decisions are made.",
    },
  ],
  relatedServices: [
    { label: "Web Development", href: "/web-development" },
    { label: "Hospitality", href: "/hospitality" },
    { label: "SEO", href: "/seo" },
  ],
};

export const metadata: Metadata = createServiceMetadata(content);

export default function WebsiteDesignPage() {
  return <ServicePageTemplate {...content} />;
}
