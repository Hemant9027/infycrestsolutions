import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";

const defaults = { phoneDisplay: "+91 9027152962", phoneHref: "tel:+919027152962", email: "hemant@infycrestsolutions.com", whatsappNumber: "919027152962", facebook: "", instagram: "", youtube: "" };
export async function GET() {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const saved = await mongoDb.collection("site_settings").findOne({ key: "main" });
  return NextResponse.json({ ...defaults, ...(saved?.values as object ?? {}) });
}
export async function PATCH(request: Request) {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const values = Object.fromEntries(Object.keys(defaults).map((key) => [key, typeof body?.[key] === "string" ? String(body[key]).trim().slice(0, 320) : ""]));
  await mongoDb.collection("site_settings").updateOne({ key: "main" }, { $set: { key: "main", values, updatedAt: new Date() } }, { upsert: true });
  return NextResponse.json({ ok: true, values });
}
