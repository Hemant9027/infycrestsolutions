import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { currentAdmin } from "@/lib/admin/auth";
import { products } from "@/lib/products";

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid product id" }, { status: 400 });

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

  const update: Record<string, unknown> = {
    name,
    slug,
    category,
    projectType,
    shortDescription,
    description,
    liveUrl,
    technologies,
    features,
    displayOrder,
    visible,
    featured,
    testimonial,
    clientName,
    clientRole,
    rating,
    updatedAt: new Date(),
  };

  if (imageUrl) update.imageUrl = imageUrl;

  try {
    const collection = products();
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
    revalidateTag("products", "max");
    return result.matchedCount
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "Product not found." }, { status: 404 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate")) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Could not update the product." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid product id" }, { status: 400 });

  const collection = products();
  await collection.deleteOne({ _id: new ObjectId(id) });
  revalidateTag("products", "max");
  return NextResponse.json({ ok: true });
}
