import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const name = text(body?.name, 100);
  const slug = text(body?.slug, 80).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  const category = text(body?.category, 60);
  const tagline = text(body?.tagline, 240);
  const description = text(body?.description, 1200);
  const image = text(body?.image, 4_000_000);
  if (!name || !slug || !category || !tagline || !description) return NextResponse.json({ error: "Name, slug, category and copy are required." }, { status: 400 });
  if (image && (!/^data:image\/(png|jpeg|webp|gif);base64,/.test(image) || image.length > 4_000_000)) return NextResponse.json({ error: "Upload a PNG, JPG, WEBP or GIF image smaller than 3 MB." }, { status: 400 });
  const technologies = Array.isArray(body?.technologies) ? body.technologies.map((item) => text(item, 40)).filter(Boolean).slice(0, 12) : [];
  const includes = Array.isArray(body?.includes) ? body.includes.map((item) => text(item, 160)).filter(Boolean).slice(0, 12) : [];
  const update: Record<string, unknown> = { name, slug, category, tagline, description, previewUrl: text(body?.previewUrl, 240) || `/demo/${slug}`, priceLabel: text(body?.priceLabel, 60) || "Custom quote", technologies, includes, updatedAt: new Date() };
  if (image) update.image = image;
  try {
    const result = await mongoDb.collection("projects").updateOne({ _id: new ObjectId(id) }, { $set: update });
    return result.matchedCount ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Project not found." }, { status: 404 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate")) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    return NextResponse.json({ error: "Could not update the project." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  await mongoDb.collection("projects").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
