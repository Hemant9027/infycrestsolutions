export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  cta: string;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Automation Starter",
    price: "$499",
    description:
      "One focused automation designed to eliminate a repetitive business task.",
    cta: "Start an Automation",
    features: [
      "One automation workflow",
      "Up to 2 third-party integrations",
      "Custom business logic",
      "Responsive admin interface",
      "Testing & deployment",
      "7 days post-launch support",
    ],
  },
  {
    name: "Business Website",
    price: "$1,499",
    description:
      "A professional, conversion-focused website built for growing businesses.",
    cta: "Build My Website",
    features: [
      "Up to 7 pages",
      "Custom UI/UX design",
      "Mobile & tablet responsive",
      "Contact/lead forms",
      "Basic SEO setup",
      "Analytics integration",
      "Performance optimization",
      "14 days post-launch support",
    ],
  },
  {
    name: "Business Automation",
    price: "$2,499",
    description:
      "Connected workflows, dashboards, and integrations that help your team work smarter.",
    cta: "Automate My Business",
    features: [
      "Multiple automated workflows",
      "Custom dashboard",
      "Up to 5 integrations",
      "Database setup",
      "User authentication",
      "API integrations",
      "Testing & deployment",
      "30 days post-launch support",
    ],
  },
  {
    name: "Custom Software",
    price: "$4,999",
    description:
      "A custom web or desktop application built around your exact business process.",
    cta: "Build My Software",
    features: [
      "Custom application architecture",
      "User authentication & roles",
      "Database integration",
      "Admin dashboard",
      "API integrations",
      "Custom business logic",
      "Deployment & configuration",
      "30 days post-launch support",
    ],
  },
  {
    name: "SaaS Development",
    price: "$7,500+",
    description:
      "A scalable SaaS product foundation designed for customers, teams, and future growth.",
    cta: "Plan My SaaS",
    features: [
      "Multi-user architecture",
      "Authentication & user roles",
      "Subscription-ready billing",
      "Admin dashboard",
      "Database architecture",
      "API integrations",
      "Cloud deployment",
      "Production-ready architecture",
      "30 days post-launch support",
    ],
  },
  {
    name: "Enterprise Solutions",
    price: "$15,000+",
    description:
      "Complex internal platforms, portals, integrations, and operational systems for established organizations.",
    cta: "Discuss Your Project",
    features: [
      "Custom system architecture",
      "Advanced dashboards",
      "Multiple user roles",
      "Complex integrations",
      "Third-party APIs",
      "Security-focused development",
      "Cloud infrastructure",
      "Deployment & documentation",
      "Dedicated project management",
      "60 days post-launch support",
    ],
  },
];
