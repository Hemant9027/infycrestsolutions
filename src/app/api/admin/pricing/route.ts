import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";
import { PRICING_PLANS } from "@/data/pricing";

export async function GET() {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const saved = await mongoDb.collection("site_pricing").findOne({ key: "plans" });
  return NextResponse.json(saved?.plans ?? PRICING_PLANS);
}
export async function PUT(request: Request) {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!Array.isArray(body) || body.length > 12) return NextResponse.json({ error: "Invalid pricing data." }, { status: 400 });
  const plans = body.map((plan) => ({ name: typeof plan?.name === "string" ? plan.name.trim().slice(0, 100) : "", price: typeof plan?.price === "string" ? plan.price.trim().slice(0, 60) : "", description: typeof plan?.description === "string" ? plan.description.trim().slice(0, 300) : "", cta: typeof plan?.cta === "string" ? plan.cta.trim().slice(0, 100) : "", inverted: plan?.inverted === true }));
  if (plans.some((plan) => !plan.name || !plan.price || !plan.description || !plan.cta)) return NextResponse.json({ error: "Every plan needs a name, price, description and CTA." }, { status: 400 });
  await mongoDb.collection("site_pricing").updateOne({ key: "plans" }, { $set: { key: "plans", plans, updatedAt: new Date() } }, { upsert: true });
  return NextResponse.json({ ok: true, plans });
}
