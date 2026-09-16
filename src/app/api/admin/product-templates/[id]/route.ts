import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { currentAdmin } from "@/lib/admin/auth";
import { productTemplates } from "@/lib/product-templates";
import type { ProductTemplate } from "@/lib/product-template-types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
  const body = (await request.json().catch(() => null)) as Partial<ProductTemplate> | null;
  const update = { ...body, updatedAt: new Date() };
  delete update.id;
  delete update.createdAt;
  try {
    const result = await productTemplates().updateOne({ _id: new ObjectId(id) }, { $set: update });
    return result.matchedCount ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Product not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Could not update product template." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
  await productTemplates().deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
