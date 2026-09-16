import { NextResponse } from "next/server";
import { getAllProducts, type ProductProjectType } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const projectType = new URL(request.url).searchParams.get("projectType");
    const allProducts = await getAllProducts(
      projectType === "ideal" || projectType === "real-world"
        ? (projectType as ProductProjectType)
        : undefined,
    );
      return NextResponse.json(
        allProducts.map((product) => ({
          ...product,
          imageUrl: `/api/products/${encodeURIComponent(product.slug)}/image`,
        })),
        { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
      );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Could not fetch products" }, { status: 500 });
  }
}
