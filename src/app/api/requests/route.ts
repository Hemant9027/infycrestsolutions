import { NextResponse } from "next/server";
import { projectRequests } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RequestPayload {
  name?: unknown;
  contact?: unknown;
  businessType?: unknown;
  requirements?: unknown;
  demoSlug?: unknown;
  demoName?: unknown;
  customization?: unknown;
  leadSource?: unknown;
  templateName?: unknown;
  templateSlug?: unknown;
  templateCategory?: unknown;
}

function asString(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const { db } = await import("@/db");
    const body = (await request.json().catch(() => null)) as RequestPayload | null;

    const name = asString(body?.name, 160);
    const contact = asString(body?.contact, 320);
    const demoSlug = asString(body?.demoSlug, 120);
    const demoName = asString(body?.demoName, 160);

    if (!name || !contact || !demoSlug) {
      return NextResponse.json(
        { error: "Name, contact and selected website are required." },
        { status: 400 }
      );
    }

    await db.insert(projectRequests).values({
      name,
      contact,
      businessType: asString(body?.businessType, 120) || null,
      requirements: asString(body?.requirements, 2000) || null,
      demoSlug,
      demoName: demoName || demoSlug,
      customization: asString(body?.customization, 160) || null,
      leadSource: asString(body?.leadSource, 40) || "website",
      templateName: asString(body?.templateName, 160) || null,
      templateSlug: asString(body?.templateSlug, 120) || null,
      templateCategory: asString(body?.templateCategory, 120) || null,
    });

    try {
      const { mongoDb } = await import("@/lib/mongodb");
      await mongoDb.collection("admin_requests").insertOne({
        name,
        contact,
        businessType: asString(body?.businessType, 120),
        requirements: asString(body?.requirements, 2000),
        demoSlug,
        demoName: demoName || demoSlug,
        customization: asString(body?.customization, 160),
        leadSource: asString(body?.leadSource, 40) || "website",
        templateName: asString(body?.templateName, 160),
        templateSlug: asString(body?.templateSlug, 120),
        templateCategory: asString(body?.templateCategory, 120),
        status: "New",
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (mirrorError) {
      console.error("[api/requests] admin mirror failed:", mirrorError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/requests] failed:", error);
    return NextResponse.json(
      { error: "Could not record the request right now." },
      { status: 500 }
    );
  }
}
