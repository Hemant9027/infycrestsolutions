import { NextResponse } from "next/server";
import { subscribers } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { db } = await import("@/db");
    const body = (await request.json().catch(() => null)) as {
      email?: unknown;
    } | null;
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_PATTERN.test(email) || email.length > 320) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await db.insert(subscribers).values({ email }).onConflictDoNothing();

    try {
      const { mongoDb } = await import("@/lib/mongodb");
      await mongoDb.collection("admin_subscribers").updateOne(
        { email },
        { $setOnInsert: { email, createdAt: new Date() } },
        { upsert: true },
      );
    } catch (mirrorError) {
      console.error("[api/subscribe] admin mirror failed:", mirrorError);
    }

    return NextResponse.json({
      ok: true,
      message: "You're on the list — thoughtful updates only.",
    });
  } catch (error) {
    console.error("[api/subscribe] failed:", error);
    return NextResponse.json(
      { error: "Could not save your email right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
