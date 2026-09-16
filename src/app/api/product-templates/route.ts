import { NextResponse } from "next/server";
import { ensureProductTemplateSeed, productTemplates } from "@/lib/product-templates";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureProductTemplateSeed();
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const category = url.searchParams.get("category") ?? "All";
  const products = await productTemplates()
    .find({ visible: true })
    .sort({ featured: -1, displayOrder: 1, createdAt: -1 })
    .toArray();
  const filtered = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const searchable = [product.name, product.category, product.businessType, product.shortDescription, ...product.tags].join(" ").toLowerCase();
    return matchesCategory && (!query || searchable.includes(query));
  });
  return NextResponse.json(filtered.map(({ _id, ...product }) => ({ ...product, id: _id.toString() })));
}

