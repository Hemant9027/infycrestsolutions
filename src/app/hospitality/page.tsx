import type { Metadata } from "next";
import ServicePageTemplate, {
  createServiceMetadata,
} from "@/components/ServicePageTemplate";

const content = {
  slug: "hospitality",
  eyebrow: "InfyCrest / Hospitality",
  title: "Digital Solutions for Hospitality & Tourism",
  intro:
    "Purpose-built digital experiences for hotels, villas, resorts, vacation rentals, restaurants, marinas and tourism businesses that want stronger enquiries and smoother guest journeys.",
  summary:
    "Hospitality businesses need more than a beautiful website. They need a clear story, an easy booking path, and a digital experience that helps guests understand the stay before they ever contact the property.",
  highlights: [
    {
      title: "Hotel & Resort Websites",
      description:
        "Clear room offers, destination storytelling, and paths to enquiry or direct booking.",
    },
    {
      title: "Villa & Vacation Rental Websites",
      description:
        "Beautiful property pages, availability signals, and simple guest communication flows.",
    },
    {
      title: "Direct Booking Systems",
      description:
        "Reduce dependency on OTA friction and give guests a more transparent path to reserve.",
    },
    {
      title: "Restaurant & Reservation Systems",
      description:
        "Menus, dining details and reservation or enquiry flows that are easy to use on mobile.",
    },
    {
      title: "Marina & Yacht Websites",
      description:
        "Present charter, dock, and service offerings in a premium, easy-to-scan layout.",
    },
    {
      title: "WhatsApp Booking Integration",
      description:
        "Bring enquiries and quick booking questions into a channel guests already use every day.",
    },
  ],
  useCases: [
    {
      title: "Boutique hotels",
      description:
        "Showcase rooms, location, and guest experience with a premium booking journey.",
    },
    {
      title: "Villas & resorts",
      description:
        "Highlight amenities, seasonal stays, and direct guest enquiries without friction.",
    },
    {
      title: "Tour operators",
      description:
        "Present packages, itineraries and contact flows in a clearer, faster way.",
    },
    {
      title: "Restaurants",
      description:
        "Share menus, ambience, and reservation details in a mobile-first experience.",
    },
    {
      title: "Marinas & yacht businesses",
      description:
        "Make charter, dock, and service availability easier to understand online.",
    },
    {
      title: "Vacation rentals",
      description:
        "Give owners and guests a cleaner path to information, enquiry and calendar coordination.",
    },
  ],
  process: [
    {
      title: "Discovery",
      description:
        "We review the property, audience and current guest journey to decide what matters most.",
    },
    {
      title: "Design direction",
      description:
        "We shape the layout, story and conversion path around how guests actually browse and enquire.",
    },
    {
      title: "Build & integrate",
      description:
        "We implement the site, booking flow, payment or WhatsApp steps and mobile-first details.",
    },
    {
      title: "Launch & refine",
      description:
        "We test the guest journey before launch and keep improvements focused on enquiries and conversions.",
    },
  ],
  faqs: [
    {
      question:
        "Can you build a hospitality site with booking or WhatsApp integration?",
      answer:
        "Yes. We can create a direct enquiry path, booking form, WhatsApp handoff, or a more complete booking setup depending on the property and workflow.",
    },
    {
      question: "Do you work with small hotels and villas too?",
      answer:
        "Yes. We often work with independent properties, boutique stays, lodges and owners who need a more polished digital presence without unnecessary complexity.",
    },
    {
      question: "Can you improve an existing hotel website?",
      answer:
        "Yes. We can refine the content structure, mobile experience, enquiry flow and booking journey without rebuilding the entire business from scratch.",
    },
  ],
  relatedServices: [
    { label: "Website Design", href: "/website-design" },
    { label: "Booking Systems", href: "/booking-systems" },
    { label: "E-commerce", href: "/ecommerce" },
  ],
};

export const metadata: Metadata = createServiceMetadata(content);

export default function HospitalityPage() {
  return <ServicePageTemplate {...content} />;
}
