import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";

const collection = () => mongoDb.collection("projects");
function text(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export async function GET() {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await collection().find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(projects.map(({ _id, image, ...project }) => ({ ...project, id: _id.toString(), thumbnail: image })));
}

export async function POST(request: Request) {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const name = text(body?.name, 100);
  const slug = text(body?.slug, 80).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  const category = text(body?.category, 60);
  const tagline = text(body?.tagline, 240);
  const description = text(body?.description, 1200);
  const image = text(body?.image, 4_000_000);
  const previewUrl = text(body?.previewUrl, 240) || `/demo/${slug}`;
  const priceLabel = text(body?.priceLabel, 60) || "Custom quote";
  const technologies = Array.isArray(body?.technologies) ? body.technologies.map((item) => text(item, 40)).filter(Boolean).slice(0, 12) : [];
  const includes = Array.isArray(body?.includes) ? body.includes.map((item) => text(item, 160)).filter(Boolean).slice(0, 12) : [];
  if (!name || !slug || !category || !tagline || !description || !image) return NextResponse.json({ error: "Name, slug, category, copy and an image are required." }, { status: 400 });
  if (!/^data:image\/(png|jpeg|webp|gif);base64,/.test(image) || image.length > 4_000_000) return NextResponse.json({ error: "Upload a PNG, JPG, WEBP or GIF image smaller than 3 MB." }, { status: 400 });
  try {
    const result = await collection().insertOne({ name, slug, category, tagline, description, image, previewUrl, priceLabel, priceNote: text(body?.priceNote, 120), technologies, includes, featured: body?.featured === true, createdAt: new Date(), updatedAt: new Date() });
    return NextResponse.json({ ok: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate")) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    return NextResponse.json({ error: "Could not save the project." }, { status: 500 });
  }
}
