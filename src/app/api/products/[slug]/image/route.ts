import { NextResponse } from "next/server";
import { products } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await products().findOne(
    { slug, visible: true },
    { projection: { imageUrl: 1 } },
  );
  const imageUrl = product?.imageUrl ?? "";
  const match = imageUrl.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match) {
    if (!imageUrl) return new NextResponse(null, { status: 404 });
    return NextResponse.redirect(new URL(imageUrl, request.url));
  }

  return new NextResponse(Buffer.from(match[2], "base64"), {
    headers: {
      "Content-Type": match[1],
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}