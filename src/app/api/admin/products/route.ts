import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { currentAdmin } from "@/lib/admin/auth";
import { products } from "@/lib/products";

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET() {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const collection = products();
  const allProducts = await collection.find({}).sort({ displayOrder: 1 }).toArray();
  return NextResponse.json(allProducts);
}

export async function POST(request: Request) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  const name = text(body?.name, 100);
  const slug = text(body?.slug, 80)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
  const category = text(body?.category, 60);
  const projectType = body?.projectType === "ideal" ? "ideal" : "real-world";
  const shortDescription = text(body?.shortDescription, 240);
  const description = text(body?.description, 1200);
  const liveUrl = text(body?.liveUrl, 500);
  const imageUrl = text(body?.imageUrl, 4_000_000);
  const technologies = Array.isArray(body?.technologies)
    ? body.technologies.map((item) => text(item, 40)).filter(Boolean).slice(0, 12)
    : [];
  const features = Array.isArray(body?.features)
    ? body.features.map((item) => text(item, 160)).filter(Boolean).slice(0, 12)
    : [];
  const displayOrder = typeof body?.displayOrder === "number" ? body.displayOrder : 0;
  const visible = body?.visible === true;
  const featured = body?.featured === true;
  const testimonial = text(body?.testimonial, 500);
  const clientName = text(body?.clientName, 100);
  const clientRole = text(body?.clientRole, 100);
  const rating = typeof body?.rating === "number" ? Math.min(5, Math.max(1, body.rating)) : undefined;

  if (!name || !slug || !category || !shortDescription || !description || !liveUrl) {
    return NextResponse.json(
      { error: "Name, slug, category, descriptions, and live URL are required." },
      { status: 400 },
    );
  }

  if (imageUrl && !/^data:image\/(png|jpeg|webp|gif);base64,/.test(imageUrl)) {
    return NextResponse.json(
      { error: "Image must be a valid base64 PNG, JPG, WEBP or GIF." },
      { status: 400 },
    );
  }

  if (imageUrl && imageUrl.length > 4_000_000) {
    return NextResponse.json(
      { error: "Image must be smaller than 3 MB." },
      { status: 400 },
    );
  }

  try {
    const collection = products();
    const result = await collection.insertOne({
      name,
      slug,
      category,
      projectType,
      shortDescription,
      description,
      liveUrl,
      imageUrl,
      technologies,
      features,
      displayOrder,
      visible,
      featured,
      ...(testimonial ? { testimonial } : {}),
      ...(clientName ? { clientName } : {}),
      ...(clientRole ? { clientRole } : {}),
      ...(rating ? { rating } : {}),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    revalidateTag("products", "max");
    return NextResponse.json({ ok: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate")) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Could not save the product." }, { status: 500 });
  }
}
