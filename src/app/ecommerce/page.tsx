import type { Metadata } from "next";
import ServicePageTemplate, {
  createServiceMetadata,
} from "@/components/ServicePageTemplate";

const content = {
  slug: "ecommerce",
  eyebrow: "InfyCrest / E-commerce",
  title: "E-commerce Websites Built Around Sales and Trust",
  intro:
    "We build online stores that make it easier for customers to browse products, understand the offer and complete a purchase without friction.",
  summary:
    "An e-commerce site works best when product pages are easy to understand, the purchase flow feels trustworthy, and the business can manage inventory, pricing and customer contact without confusion.",
  highlights: [
    {
      title: "Product-first storefronts",
      description:
        "Present your offer clearly and support fast decision-making on mobile and desktop.",
    },
    {
      title: "Cart & checkout flow",
      description:
        "Create a simpler path to purchase with fewer bottlenecks and clearer next steps.",
    },
    {
      title: "Trust-building sections",
      description:
        "Use brand storytelling, product clarity and contact paths to make the purchase more comfortable.",
    },
    {
      title: "Merchandise & business categories",
      description:
        "Support simple category structures and product organization for easier browsing.",
    },
    {
      title: "SEO-ready structure",
      description:
        "Create product and category pages that are easier for search engines to understand over time.",
    },
    {
      title: "Operational support",
      description:
        "Design around how the business manages products, updates, inquiries and fulfilment.",
    },
  ],
  useCases: [
    {
      title: "Retail stores",
      description:
        "Turn product browsing into a more polished and simpler purchase experience.",
    },
    {
      title: "Hospitality merchandise",
      description:
        "Sell branded items, experiences or add-ons through a clearer storefront flow.",
    },
    {
      title: "Boutique brands",
      description:
        "Support a premium brand presence while making buying easier on mobile.",
    },
    {
      title: "Service businesses with product add-ons",
      description:
        "Create a route for bundles, gift cards or related products that complement the core offer.",
    },
    {
      title: "Regional businesses",
      description:
        "Present products in a cleaner fashion with local trust and clearer purchasing paths.",
    },
    {
      title: "Wholesale / B2B product catalogues",
      description:
        "Support product discovery and enquiry with a more structured site experience.",
    },
  ],
  process: [
    {
      title: "Product review",
      description:
        "We look at your products, customer journey and what information matters before someone buys.",
    },
    {
      title: "Store structure",
      description:
        "We map categories, landing pages and product detail pages around how people shop.",
    },
    {
      title: "Build and refine",
      description:
        "We implement the storefront, purchase flow and useful product details with a clear mobile-first approach.",
    },
    {
      title: "Launch & optimize",
      description:
        "We review the buying journey and make sure it remains simple as the store grows.",
    },
  ],
  faqs: [
    {
      question: "Do you build custom e-commerce websites or only templates?",
      answer:
        "We build custom storefronts around the business requirements, not just a generic template layout.",
    },
    {
      question: "Can you integrate payments or WhatsApp?",
      answer:
        "Yes. We can design around payment flows, enquiry handoffs and operational requirements depending on the business model.",
    },
    {
      question: "Can this be added to an existing business website?",
      answer:
        "Yes. We can either create a dedicated storefront or fold e-commerce into the current site structure where it makes sense.",
    },
  ],
  relatedServices: [
    { label: "Website Design", href: "/website-design" },
    { label: "Custom Software", href: "/custom-software" },
    { label: "Automation", href: "/automation" },
  ],
};

export const metadata: Metadata = createServiceMetadata(content);

export default function EcommercePage() {
  return <ServicePageTemplate {...content} />;
}
