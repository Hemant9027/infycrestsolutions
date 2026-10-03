import type { Metadata } from "next";
import ServicePageTemplate, {
  createServiceMetadata,
} from "@/components/ServicePageTemplate";

const content = {
  slug: "custom-software",
  eyebrow: "InfyCrest / Custom Software",
  title: "Custom Software for Operational Clarity",
  intro:
    "We build software that helps businesses automate repetitive work, manage operations more cleanly, and give teams a better way to handle day-to-day processes.",
  summary:
    "Software should solve a real operational problem. We focus on practical tools that reduce manual work, improve clarity and help teams move faster without adding unnecessary complexity.",
  highlights: [
    {
      title: "Workflow support",
      description:
        "Map and simplify internal processes so the business can operate more consistently.",
    },
    {
      title: "Custom admin tools",
      description:
        "Create dashboards and interfaces that make it easier to manage information and approvals.",
    },
    {
      title: "Operational visibility",
      description:
        "Give teams a cleaner way to understand data, status, tasks and handoffs.",
    },
    {
      title: "Better process control",
      description:
        "Support automation and rules that reduce bottlenecks and repetitive administrative work.",
    },
    {
      title: "Scalable foundations",
      description:
        "Build software that can grow with the business rather than forcing a rework later.",
    },
    {
      title: "Clear business logic",
      description:
        "Keep the system aligned with how the company actually works instead of copying a generic tool.",
    },
  ],
  useCases: [
    {
      title: "Field and operations teams",
      description:
        "Improve task flow, status tracking and internal coordination.",
    },
    {
      title: "Small businesses",
      description:
        "Reduce manual admin work with more structured digital workflows.",
    },
    {
      title: "Hospitality and service businesses",
      description:
        "Support bookings, enquiries and operational handovers in one place.",
    },
    {
      title: "Agencies & consultants",
      description:
        "Create cleaner task tracking and client communication processes.",
    },
    {
      title: "Multi-step business operations",
      description:
        "Support approvals, data entry, handoffs and reporting in a more manageable flow.",
    },
    {
      title: "Internal systems",
      description:
        "Replace spreadsheets and disconnected processes with something easier to maintain and scale.",
    },
  ],
  process: [
    {
      title: "Understand the workflow",
      description:
        "We review the current process, bottlenecks and operational pain points before choosing the right solution.",
    },
    {
      title: "Define the scope",
      description:
        "We clarify what the tool needs to do, what users need and what data is required to keep it usable.",
    },
    {
      title: "Build & test",
      description:
        "We implement the workflow, interfaces and logic around real usage patterns, then test it from the user point of view.",
    },
    {
      title: "Launch & improve",
      description:
        "We support the rollout and tune the system as the team gets familiar with the process.",
    },
  ],
  faqs: [
    {
      question: "Do you build full business applications?",
      answer:
        "Yes, depending on the workflow, complexity and operational needs we can build a custom system or a focused dashboard for the business.",
    },
    {
      question: "Can this replace spreadsheets or manual forms?",
      answer:
        "Often yes. We can turn manual processes into a cleaner and easier-to-maintain digital workflow.",
    },
    {
      question: "How do you decide if a custom tool is needed?",
      answer:
        "We look at the business process, pain points, volume, and whether the workflow is better handled by a custom system than by off-the-shelf software alone.",
    },
  ],
  relatedServices: [
    { label: "Automation", href: "/automation" },
    { label: "Web Development", href: "/web-development" },
    { label: "Booking Systems", href: "/booking-systems" },
  ],
};

export const metadata: Metadata = createServiceMetadata(content);

export default function CustomSoftwarePage() {
  return <ServicePageTemplate {...content} />;
}
