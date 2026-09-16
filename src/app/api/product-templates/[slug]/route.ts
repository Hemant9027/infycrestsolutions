import { NextResponse } from "next/server";
import { ensureProductTemplateSeed, productTemplates } from "@/lib/product-templates";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  await ensureProductTemplateSeed();
  const { slug } = await params;
  const product = await productTemplates().findOne({ slug, visible: true });
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const { _id, ...result } = product;
  return NextResponse.json({ ...result, id: _id.toString() });
}
