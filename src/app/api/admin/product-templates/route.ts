import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { ensureProductTemplateSeed, productTemplates } from "@/lib/product-templates";
import type { ProductTemplate } from "@/lib/product-template-types";

function cleanSlug(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80) : "";
}
function text(value: unknown, max = 1200) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function list(value: unknown, max = 12) { return Array.isArray(value) ? value.map((item) => text(item, 160)).filter(Boolean).slice(0, max) : []; }

export async function GET() {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureProductTemplateSeed();
  const products = await productTemplates().find({}).sort({ displayOrder: 1, createdAt: -1 }).toArray();
  return NextResponse.json(products.map(({ _id, ...product }) => ({ ...product, id: _id.toString() })));
}

export async function POST(request: Request) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Partial<ProductTemplate> | null;
  const name = text(body?.name, 100);
  const slug = cleanSlug(body?.slug);
  const category = text(body?.category, 80) as ProductTemplate["category"];
  const businessType = text(body?.businessType, 100);
  const shortDescription = text(body?.shortDescription, 300);
  const thumbnail = text(body?.thumbnail, 4_000_000);
  if (!name || !slug || !category || !businessType || !shortDescription || !thumbnail) return NextResponse.json({ error: "Name, slug, category, business type, description and thumbnail are required." }, { status: 400 });
  try {
    const result = await productTemplates().insertOne({
      name, slug, category, businessType, shortDescription,
      description: text(body?.description) || shortDescription,
      features: list(body?.features), gallery: list(body?.gallery, 8), technologies: list(body?.technologies), tags: list(body?.tags),
      thumbnail, price: text(body?.price, 80), visible: body?.visible !== false, featured: body?.featured === true,
      hasLivePreview: body?.hasLivePreview === true, previewUrl: text(body?.previewUrl, 300), templateKey: text(body?.templateKey, 80),
      displayOrder: Number(body?.displayOrder ?? 99), ctaText: text(body?.ctaText, 80) || "Let's Build This", createdAt: new Date(), updatedAt: new Date(),
    });
    return NextResponse.json({ ok: true, id: result.insertedId.toString() }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save product template. Check that the slug is unique." }, { status: 409 });
  }
}
