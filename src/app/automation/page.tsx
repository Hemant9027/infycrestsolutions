import type { Metadata } from "next";
import ServicePageTemplate, {
  createServiceMetadata,
} from "@/components/ServicePageTemplate";

const content = {
  slug: "automation",
  eyebrow: "InfyCrest / Automation",
  title: "Business Automation That Removes Repetitive Work",
  intro:
    "We help businesses automate repetitive tasks, simplify admin work and keep more time focused on service, growth and real customer conversations.",
  summary:
    "When a business executes the same tasks every day, those small repeat actions add up. Automation helps reduce manual effort, reduce lost communication, and keep operations more consistent.",
  highlights: [
    {
      title: "Workflow automation",
      description:
        "Reduce manual work across repetitive tasks, follow-ups and internal handoffs.",
    },
    {
      title: "Lead handling",
      description:
        "Make sure incoming enquiry information is captured, routed and followed up in a more reliable way.",
    },
    {
      title: "Notification triggers",
      description:
        "Send updates to staff or clients when a key action happens in the process.",
    },
    {
      title: "Reporting support",
      description:
        "Keep track of forms, requests or operational steps without needing to mine spreadsheets daily.",
    },
    {
      title: "Processes that scale",
      description:
        "Build systems that can handle more volume as the business grows without adding constant admin overhead.",
    },
    {
      title: "Operational consistency",
      description:
        "A repeatable process keeps the business more predictable and easier to manage.",
    },
  ],
  useCases: [
    {
      title: "Service businesses",
      description: "Automate enquiry routing, reminders and admin follow-up.",
    },
    {
      title: "Hospitality brands",
      description:
        "Improve guest communication, lead handling and request coordination.",
    },
    {
      title: "Sales teams",
      description:
        "Move inquiry data into more useful workflows with less manual effort.",
    },
    {
      title: "Agencies & consultants",
      description:
        "Create better internal task tracking and client update processes.",
    },
    {
      title: "Local businesses",
      description:
        "Reduce time lost in repetitive tasks so teams can focus on the customer experience.",
    },
    {
      title: "Operations-heavy businesses",
      description:
        "Support process control, alerts and handoffs across business functions.",
    },
  ],
  process: [
    {
      title: "Identify friction",
      description:
        "We review the repeated tasks, bottlenecks and delays that are affecting the business day to day.",
    },
    {
      title: "Design the workflow",
      description:
        "We decide the triggers, conditions and actions that should happen automatically.",
    },
    {
      title: "Build and connect",
      description:
        "We implement the automation in the tools the business already uses and keep the rules practical.",
    },
    {
      title: "Monitor and tune",
      description:
        "We check the outcome and adjust the workflow as the business evolves.",
    },
  ],
  faqs: [
    {
      question: "What can you automate?",
      answer:
        "Common examples include lead routing, reminders, notifications, enquiry handling, internal updates, and repetitive admin tasks.",
    },
    {
      question: "Will this require a big system rebuild?",
      answer:
        "Not always. We often focus on the most repetitive, high-friction process first so the business gets value quickly.",
    },
    {
      question: "Can automation work with our existing tools?",
      answer:
        "Yes. We review the tools the business already uses and build around those systems where possible.",
    },
  ],
  relatedServices: [
    { label: "Custom Software", href: "/custom-software" },
    { label: "Booking Systems", href: "/booking-systems" },
    { label: "SEO", href: "/seo" },
  ],
};

export const metadata: Metadata = createServiceMetadata(content);

export default function AutomationPage() {
  return <ServicePageTemplate {...content} />;
}
