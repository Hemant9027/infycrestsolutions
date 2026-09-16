import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";
import { PUBLISH_TEMPLATE_OPTIONS, type PublishTemplateKey } from "@/lib/product-template-types";
import type { NewCustomer } from "@/lib/new-customers";

const collection = () => mongoDb.collection<NewCustomer>("new_customers");

function cleanSlug(value: unknown) {
  return typeof value === "string"
    ? value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80)
    : "";
}

function filterFor(id: string) {
  return ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id };
}

function imageValue(value: unknown) {
  if (typeof value !== "string" || value.length > 6_000_000) return "";
  return /^data:image\/(png|jpeg|webp);base64,/.test(value) ? value : "";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const businessName = typeof body?.businessName === "string" ? body.businessName.trim().slice(0, 100) : "";
  const slug = cleanSlug(body?.slug);
  const selectedTemplate = PUBLISH_TEMPLATE_OPTIONS.find((item) => item.key === body?.templateKey);
  const category = selectedTemplate?.category ?? (typeof body?.category === "string" ? body.category.trim().slice(0, 80) : "");
  const templateKey = selectedTemplate?.key ?? (body?.templateKey as PublishTemplateKey | undefined);
  const status = body?.status === "draft" ? "draft" : "published";
  if (!businessName || !slug || !category || !templateKey) return NextResponse.json({ error: "Business name, slug, category and template are required." }, { status: 400 });

  try {
    const result = await collection().updateOne(
      filterFor(id),
      { $set: {
        businessName, slug, category, templateKey, status,
        contact: { email: typeof body?.contactEmail === "string" ? body.contactEmail.trim().slice(0, 240) : "", phone: typeof body?.contactPhone === "string" ? body.contactPhone.trim().slice(0, 80) : "", address: typeof body?.contactAddress === "string" ? body.contactAddress.trim().slice(0, 240) : "", hours: typeof body?.contactHours === "string" ? body.contactHours.trim().slice(0, 160) : "By appointment" },
        "hero.image": imageValue(body?.heroImage),
        "about.image": imageValue(body?.aboutImage),
        gallery: (Array.isArray(body?.galleryImages) ? body.galleryImages : []).map(imageValue).filter(Boolean).slice(0, 8).map((image) => ({ image, alt: `${businessName} gallery image` })),
        updatedAt: new Date().toISOString(),
      } },
    );
    return result.matchedCount ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Customer website not found." }, { status: 404 });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("duplicate")) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    return NextResponse.json({ error: "Could not update the customer website." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const result = await collection().deleteOne(filterFor(id));
  return result.deletedCount ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Customer website not found." }, { status: 404 });
}
