import { NextResponse } from "next/server";
import { recordAnalyticsEvent, safeSessionId, sourceFromAttribution } from "@/lib/analytics";
import { ANALYTICS_EVENTS, type AnalyticsEventName } from "@/lib/analytics-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedEvents = new Set<string>(Object.values(ANALYTICS_EVENTS));
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const eventName = text(body.eventName, 64);
    const pagePath = text(body.pagePath, 240);
    if (!allowedEvents.has(eventName) || !/^\/[A-Za-z0-9/_:.?=&%-]*$/.test(pagePath) || pagePath.startsWith("/admin")) {
      return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
    }
    const referrer = text(body.referrer, 500);
    const utmSource = text(body.utmSource, 120);
    const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
      ? Object.fromEntries(Object.entries(body.metadata).slice(0, 8).map(([key, value]) => [text(key, 40), text(value, 160)]))
      : {};
    await recordAnalyticsEvent({
      anonymousSessionId: safeSessionId(body.anonymousSessionId),
      eventName: eventName as AnalyticsEventName,
      pagePath,
      referrer,
      source: sourceFromAttribution(referrer, utmSource),
      medium: text(body.utmMedium, 120),
      campaign: text(body.utmCampaign, 160),
      term: text(body.utmTerm, 160),
      content: text(body.utmContent, 160),
      device: text(body.device, 40),
      browser: text(body.browser, 40),
      os: text(body.os, 40),
      country: text(request.headers.get("x-vercel-ip-country"), 80) || "Unknown",
      metadata,
    });
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (error) {
    console.error("[analytics] event ingestion failed:", error);
    return NextResponse.json({ error: "Analytics is temporarily unavailable." }, { status: 202 });
  }
}
