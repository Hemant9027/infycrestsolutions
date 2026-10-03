import type { Metadata } from "next";
import ServicePageTemplate, {
  createServiceMetadata,
} from "@/components/ServicePageTemplate";

const content = {
  slug: "booking-systems",
  eyebrow: "InfyCrest / Booking Systems",
  title: "Booking & Reservation Systems That Reduce Friction",
  intro:
    "We build systems that help businesses take enquiries, reservations and bookings in a clear, practical and customer-friendly way.",
  summary:
    "A booking process should feel confident for the guest and simple for the business. If the flow is confusing or slow, people move on. We design around the real booking journey and the operational needs behind it.",
  highlights: [
    {
      title: "Guest-friendly booking flows",
      description:
        "Make it easy for visitors to understand availability, options and next steps without confusion.",
    },
    {
      title: "Direct bookings",
      description:
        "Reduce over-reliance on third-party channels and support a cleaner guest journey.",
    },
    {
      title: "WhatsApp & enquiry support",
      description:
        "Bring quick questions and follow-up conversations into a channel guests already use often.",
    },
    {
      title: "Calendar & availability management",
      description:
        "Support clearer planning, fewer back-and-forths and a more structured guest experience.",
    },
    {
      title: "Reservation logic",
      description:
        "Create rules for capacity, time slots, property types or service categories without complexity.",
    },
    {
      title: "Operational clarity",
      description:
        "Keep the business process organized while giving guests a straightforward path to action.",
    },
  ],
  useCases: [
    {
      title: "Hotels",
      description:
        "Support room selection, enquiry, or direct bookings with a smoother guest experience.",
    },
    {
      title: "Vacation rentals",
      description:
        "Let guests understand the property before they contact or reserve.",
    },
    {
      title: "Restaurants",
      description:
        "Streamline table booking and reservation follow-up without unnecessary friction.",
    },
    {
      title: "Spas & wellness",
      description:
        "Manage service slots and appointments in a more organized way.",
    },
    {
      title: "Tour operators",
      description:
        "Support enquiries and package booking steps with a cleaner, easier flow.",
    },
    {
      title: "Service businesses",
      description:
        "Offer a better appointment or consultation booking process across devices.",
    },
  ],
  process: [
    {
      title: "Map the flow",
      description:
        "We identify the exact steps a customer takes before booking or enquiring.",
    },
    {
      title: "Define requirements",
      description:
        "We decide what needs to be captured, what rules are required and how the business will manage requests.",
    },
    {
      title: "Build the booking journey",
      description:
        "We create the logic, presentation and handoff steps around the actual customer experience.",
    },
    {
      title: "Test & launch",
      description:
        "We review availability, message flow and user experience before release.",
    },
  ],
  faqs: [
    {
      question: "Can the system work with WhatsApp or email?",
      answer:
        "Yes. Many businesses benefit from combining a booking form with a WhatsApp or email handoff for quick follow-up.",
    },
    {
      question: "Do you build custom booking flows or use standard patterns?",
      answer:
        "We usually tailor the flow to the business and audience rather than forcing a generic booking template.",
    },
    {
      question: "Is this only for large businesses?",
      answer:
        "No. Smaller hospitality and service businesses often benefit the most from a clearer, better-structured booking process.",
    },
  ],
  relatedServices: [
    { label: "Website Design", href: "/website-design" },
    { label: "Hospitality", href: "/hospitality" },
    { label: "Automation", href: "/automation" },
  ],
};

export const metadata: Metadata = createServiceMetadata(content);

export default function BookingSystemsPage() {
  return <ServicePageTemplate {...content} />;
}
