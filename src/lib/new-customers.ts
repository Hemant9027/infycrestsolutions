import { mongoDb } from "@/lib/mongodb";
import type { PublishTemplateKey } from "@/lib/product-template-types";

export type CustomerTemplateKey = PublishTemplateKey | "villa" | "restaurant";

export type NewCustomer = {
  id: string;
  slug: string;
  businessName: string;
  category: string;
  templateKey: CustomerTemplateKey;
  logo: string;
  theme: Record<string, string>;
  hero: { eyebrow: string; title: string; description: string; image: string; primaryCta: string; secondaryCta: string };
  about: { title: string; body: string; image: string };
  services: Array<{ title: string; description: string; icon?: string }>;
  whyChooseUs: Array<{ title: string; description: string }>;
  stats: Array<{ value: string; label: string }>;
  process: Array<{ step: string; title: string; description: string }>;
  testimonials: Array<{ quote: string; name: string; role: string }>;
  gallery: Array<{ image: string; alt: string }>;
  faq: Array<{ question: string; answer: string }>;
  CTA: { eyebrow: string; title: string; description: string; label: string };
  contact: { email: string; phone: string; address: string; hours: string };
  SEO: { title: string; description: string; keywords: string[] };
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

export async function getPublishedCustomer(slug: string): Promise<NewCustomer | null> {
  const customer = await mongoDb.collection<NewCustomer>("new_customers").findOne({
    slug: slug.trim().toLowerCase(),
    status: "published",
  });
  if (!customer) return null;

  const { _id, ...plainCustomer } = customer;
  return { ...plainCustomer, id: plainCustomer.id || _id.toString() };
}

export async function ensureNewCustomerIndexes() {
  await mongoDb.collection<NewCustomer>("new_customers").createIndex(
    { slug: 1 },
    { unique: true },
  );
}