export const PRODUCT_CATEGORIES = [
  "All",
  "Healthcare & Wellness",
  "Food & Beverage",
  "Business & Tech",
  "Fitness & Creative",
  "Real Estate & Hospitality",
  "Hotel & Homestays",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type PublishTemplateKey =
  | "smilecare-dental"
  | "medora-health"
  | "veloura-studio"
  | "aurelia-dining"
  | "afterglow-bar"
  | "crumb-hearth"
  | "dashbite"
  | "roast-ritual"
  | "northline"
  | "scaleflow"
  | "launchlab"
  | "forge-athletics"
  | "frame-soul"
  | "island-villa";

export const PUBLISH_TEMPLATE_OPTIONS: Array<{
  key: PublishTemplateKey;
  label: string;
  category: Exclude<ProductCategory, "All">;
  businessType: string;
}> = [
  { key: "smilecare-dental", label: "SmileCare Dental", category: "Healthcare & Wellness", businessType: "Dental Clinic" },
  { key: "medora-health", label: "Medora Health", category: "Healthcare & Wellness", businessType: "Hospital" },
  { key: "veloura-studio", label: "Veloura Studio", category: "Healthcare & Wellness", businessType: "Beauty Salon" },
  { key: "aurelia-dining", label: "Aurelia Dining", category: "Food & Beverage", businessType: "Fine Dining Restaurant" },
  { key: "afterglow-bar", label: "Afterglow Bar", category: "Food & Beverage", businessType: "Pub / Cocktail Bar" },
  { key: "crumb-hearth", label: "Crumb & Hearth", category: "Food & Beverage", businessType: "Bakery" },
  { key: "dashbite", label: "DashBite", category: "Food & Beverage", businessType: "Cloud Kitchen" },
  { key: "roast-ritual", label: "Roast & Ritual", category: "Food & Beverage", businessType: "Cafe" },
  { key: "northline", label: "Northline", category: "Business & Tech", businessType: "Fashion E-commerce" },
  { key: "scaleflow", label: "ScaleFlow", category: "Business & Tech", businessType: "SaaS" },
  { key: "launchlab", label: "LaunchLab", category: "Business & Tech", businessType: "Startup / Digital Agency" },
  { key: "forge-athletics", label: "Forge Athletics", category: "Fitness & Creative", businessType: "Gym" },
  { key: "frame-soul", label: "Frame & Soul", category: "Fitness & Creative", businessType: "Photographer" },
  { key: "island-villa", label: "Island Villa", category: "Hotel & Homestays", businessType: "Luxury Villa" },
];

export type ProductTemplate = {
  id?: string;
  name: string;
  slug: string;
  category: Exclude<ProductCategory, "All">;
  businessType: string;
  shortDescription: string;
  description: string;
  features: string[];
  thumbnail: string;
  gallery: string[];
  technologies: string[];
  tags: string[];
  price?: string;
  visible: boolean;
  featured: boolean;
  hasLivePreview: boolean;
  previewUrl: string;
  templateKey: string;
  displayOrder: number;
  ctaText: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export const ALL_WEBSITE_TEMPLATE_SLUGS = [
  "smilecare-dental",
  "medora-health",
  "veloura-studio",
  "aurelia-dining",
  "afterglow-bar",
  "crumb-hearth",
  "dashbite",
  "roast-ritual",
  "northline",
  "scaleflow",
  "launchlab",
  "forge-athletics",
  "frame-soul",
  "island-villa",
  "dental-clinic",
  "hospital",
  "salon",
  "restaurant",
  "pub-bar",
  "bakery",
  "cloud-kitchen",
  "cafe",
  "ecommerce",
  "saas",
  "startup-agency",
  "gym",
  "photographer",
  "villa",
];

export const PRODUCT_TEMPLATE_SLUGS = ALL_WEBSITE_TEMPLATE_SLUGS.slice(0, 14);
