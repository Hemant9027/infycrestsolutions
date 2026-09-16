import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { ensureNewCustomerIndexes, type NewCustomer } from "@/lib/new-customers";
import { mongoDb } from "@/lib/mongodb";
import { PUBLISH_TEMPLATE_OPTIONS, type PublishTemplateKey } from "@/lib/product-template-types";

function cleanSlug(value: unknown) {
  return typeof value === "string"
    ? value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80)
    : "";
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim().slice(0, 1200) : fallback;
}

function imageValue(value: unknown) {
  if (typeof value !== "string" || value.length > 6_000_000) return "";
  return /^data:image\/(png|jpeg|webp);base64,/.test(value) ? value : "";
}

const collection = () => mongoDb.collection<NewCustomer>("new_customers");

export async function GET() {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customers = await collection().find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(customers.map(({ _id, ...customer }) => ({ ...customer, id: customer.id || _id.toString() })));
}

export async function POST(request: Request) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const businessName = stringValue(body?.businessName, "").slice(0, 100);
  const slug = cleanSlug(body?.slug);
  const selectedTemplate = PUBLISH_TEMPLATE_OPTIONS.find((item) => item.key === body?.templateKey);
  const category = selectedTemplate?.category ?? stringValue(body?.category, "Hotel & Homestays").slice(0, 80);
  const templateKey: PublishTemplateKey = selectedTemplate?.key ?? "island-villa";
  if (!businessName || !slug) return NextResponse.json({ error: "Business name and slug are required." }, { status: 400 });

  const now = new Date().toISOString();
  const customer: NewCustomer = {
    id: crypto.randomUUID(),
    slug,
    businessName,
    category,
    templateKey,
    logo: "",
    theme: { accent: "#f59e0b" },
    hero: { eyebrow: "Built for your next chapter", title: "A more thoughtful way to move forward", description: "Clear thinking, considered details and an experience built around what matters most.", image: imageValue(body?.heroImage), primaryCta: "Get in touch", secondaryCta: "Explore" },
    about: { title: `A better experience for ${businessName}`, body: "Thoughtful service, clear communication and details that make a lasting impression.", image: imageValue(body?.aboutImage) },
    services: [
      { title: "Personal service", description: "Clear, thoughtful support from people who care about the details." },
      { title: "Built around you", description: "A flexible experience shaped around your goals and your audience." },
      { title: "Made to last", description: "A polished foundation that stays useful as your business grows." },
    ],
    whyChooseUs: [
      { title: "Clarity", description: "Straightforward communication from the first conversation." },
      { title: "Craft", description: "Every touchpoint is considered, refined and made to feel right." },
      { title: "Care", description: "A reliable partner before, during and after launch." },
    ],
    stats: [{ value: "01", label: "clear direction" }, { value: "24/7", label: "online presence" }, { value: "100%", label: "made for you" }],
    process: [{ step: "01", title: "Listen", description: "We learn what matters most to your business." }, { step: "02", title: "Shape", description: "We turn the vision into a focused customer experience." }, { step: "03", title: "Launch", description: "We make the final details feel effortless." }],
    testimonials: [{ quote: "Professional, thoughtful and easy to work with from day one.", name: "Your next client", role: "A future success story" }],
    gallery: (Array.isArray(body?.galleryImages) ? body.galleryImages : []).map(imageValue).filter(Boolean).slice(0, 8).map((image) => ({ image, alt: `${businessName} gallery image` })),
    faq: [{ question: "How do we get started?", answer: "Send a message and tell us what you are building. We will take it from there." }],
    CTA: { eyebrow: "Ready when you are", title: "Let's make something people remember", description: "Tell us what you need and we will take it from there.", label: "Get in touch" },
    contact: { email: stringValue(body?.contactEmail), phone: stringValue(body?.contactPhone), address: stringValue(body?.contactAddress), hours: stringValue(body?.contactHours, "By appointment") },
    SEO: { title: `${businessName} | Official Website`, description: `Discover ${businessName}.`, keywords: [businessName] },
    status: "published",
    createdAt: now,
    updatedAt: now,
  };

  try {
    await ensureNewCustomerIndexes();
    await collection().insertOne(customer);
    return NextResponse.json({ ok: true, customer: { id: customer.id, slug, businessName } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("duplicate")) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    return NextResponse.json({ error: "Could not publish the customer." }, { status: 500 });
  }
}