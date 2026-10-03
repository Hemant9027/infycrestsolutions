import type { Metadata } from "next";
import ServicePageTemplate, {
  createServiceMetadata,
} from "@/components/ServicePageTemplate";

const content = {
  slug: "seo",
  eyebrow: "InfyCrest / SEO",
  title: "SEO Foundations That Help Your Website Get Found",
  intro:
    "We help businesses improve the technical and on-page foundations that make it easier for search engines and customers to understand what they offer.",
  summary:
    "SEO is not just about rankings. It is about making a website clearer, more relevant and easier to understand for the people who actually matter to the business. We focus on the part that supports discovery, trust and easier decision-making.",
  highlights: [
    {
      title: "Technical setup",
      description:
        "Improve how search engines crawl and understand the site with a stronger technical foundation.",
    },
    {
      title: "On-page clarity",
      description:
        "Write clearer page titles, headings and content that match what users are actually looking for.",
    },
    {
      title: "Internal linking",
      description:
        "Connect key pages in a way that helps both users and search engines understand the site structure.",
    },
    {
      title: "Performance basics",
      description:
        "Improve key page experience factors that support a smoother, faster website experience.",
    },
    {
      title: "Local and service relevance",
      description:
        "Strengthen how specific offers, locations and business categories appear online.",
    },
    {
      title: "Scalable content support",
      description:
        "Set up a website structure that can grow with the business without becoming disorganized.",
    },
  ],
  useCases: [
    {
      title: "Service businesses",
      description:
        "Improve visibility for the services people search for and the locations they are in.",
    },
    {
      title: "Travel & hospitality",
      description:
        "Support destination, room, resort or package discovery with better structure and metadata.",
    },
    {
      title: "Local businesses",
      description:
        "Make the website easier to understand and better aligned with local search intent.",
    },
    {
      title: "E-commerce brands",
      description:
        "Improve product and category discovery, trust and indexability.",
    },
    {
      title: "Professional services",
      description:
        "Better communicate credentials, service pages and relevant offerings online.",
    },
    {
      title: "Data-heavy sites",
      description:
        "Improve the structure around content and search visibility without losing usability.",
    },
  ],
  process: [
    {
      title: "Audit",
      description:
        "We review the site structure, current content and technical basics to identify the most useful wins.",
    },
    {
      title: "Prioritize",
      description:
        "We identify the pages and keywords that matter most to the target audience and business goals.",
    },
    {
      title: "Implement",
      description:
        "We improve titles, metadata, structure, page clarity and internal linking around the actual business offer.",
    },
    {
      title: "Refine",
      description:
        "We review performance and content quality over time to keep the system aligned with user intent and business growth.",
    },
  ],
  faqs: [
    {
      question: "Does SEO guarantee rankings?",
      answer:
        "No. We do not promise guaranteed rankings. We focus on the technical and content foundations that improve a website's relevance and discoverability over time.",
    },
    {
      question: "Can you improve an existing site?",
      answer:
        "Yes. Many websites benefit from targeted SEO work on structure, metadata, headings and internal linking without needing a full redesign.",
    },
    {
      question: "How long does SEO take to show results?",
      answer:
        "It depends on the market, competition and the current quality of the website, but the best approach is to build the foundations in a way that supports long-term visibility.",
    },
  ],
  relatedServices: [
    { label: "Web Development", href: "/web-development" },
    { label: "Website Design", href: "/website-design" },
    { label: "Hospitality", href: "/hospitality" },
  ],
};

export const metadata: Metadata = createServiceMetadata(content);

export default function SEOPage() {
  return <ServicePageTemplate {...content} />;
}
