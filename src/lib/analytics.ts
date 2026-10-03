import { randomUUID } from "node:crypto";
import { mongoDb } from "@/lib/mongodb";
import { ANALYTICS_EVENTS, type AnalyticsEventName } from "@/lib/analytics-events";

type AnalyticsSession = {
  _id: string;
  startedAt: Date;
  lastActiveAt: Date;
  currentPage: string;
  landingPage: string;
  referrer: string;
  source: string;
  medium: string;
  campaign: string;
  device: string;
  browser: string;
  os: string;
  country: string;
  pageCount: number;
  engaged: boolean;
};

const CONVERSION_EVENTS = new Set<AnalyticsEventName>([
  ANALYTICS_EVENTS.WHATSAPP_CLICK,
  ANALYTICS_EVENTS.EMAIL_CLICK,
  ANALYTICS_EVENTS.PHONE_CLICK,
  ANALYTICS_EVENTS.CONTACT_FORM_SUBMIT,
  ANALYTICS_EVENTS.START_PROJECT_CLICK,
  ANALYTICS_EVENTS.ESTIMATE_COMPLETE,
  ANALYTICS_EVENTS.TEMPLATE_CUSTOMIZE_CLICK,
  ANALYTICS_EVENTS.TEMPLATE_INQUIRY_SUBMIT,
]);

export function isConversionEvent(eventName: string) {
  return CONVERSION_EVENTS.has(eventName as AnalyticsEventName);
}

export function sourceFromAttribution(referrer: string, utmSource: string) {
  if (utmSource) return utmSource.toLowerCase();
  if (!referrer) return "Direct / Unknown";
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    if (host === "infycrestsolutions.com" || host.endsWith(".infycrestsolutions.com")) return "Internal";
    if (host.includes("google.")) return "Google";
    if (host.includes("instagram.")) return "Instagram";
    if (host.includes("facebook.")) return "Facebook";
    if (host.includes("linkedin.")) return "LinkedIn";
    return host;
  } catch {
    return "Direct / Unknown";
  }
}

export function safeSessionId(value: unknown) {
  return typeof value === "string" && /^[a-f0-9-]{20,80}$/i.test(value) ? value : randomUUID();
}

export async function recordAnalyticsEvent(input: {
  anonymousSessionId: string;
  eventName: AnalyticsEventName;
  pagePath: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  metadata?: Record<string, string>;
}) {
  const now = new Date();
  const session = mongoDb.collection<AnalyticsSession>("analytics_sessions");
  const events = mongoDb.collection<Record<string, unknown>>("analytics_events");
  const existing = await session.findOne<{ _id: string }>({ _id: input.anonymousSessionId });
  const update = {
    $set: {
      lastActiveAt: now,
      currentPage: input.pagePath,
    },
    $setOnInsert: {
      _id: input.anonymousSessionId,
      startedAt: now,
      landingPage: input.pagePath,
      referrer: input.referrer ?? "",
      source: input.source ?? "Direct / Unknown",
      medium: input.medium ?? "",
      campaign: input.campaign ?? "",
      device: input.device ?? "Unknown",
      browser: input.browser ?? "Unknown",
      os: input.os ?? "Unknown",
      country: input.country ?? "Unknown",
      engaged: false,
    },
    $inc: { pageCount: input.eventName === ANALYTICS_EVENTS.PAGE_VIEW ? 1 : 0 },
  };
  await session.updateOne({ _id: input.anonymousSessionId }, update, { upsert: true });
  await events.insertOne({
    sessionId: input.anonymousSessionId,
    eventName: input.eventName,
    pagePath: input.pagePath,
    timestamp: now,
    referrer: input.referrer ?? "",
    source: input.source ?? "Direct / Unknown",
    medium: input.medium ?? "",
    campaign: input.campaign ?? "",
    metadata: input.metadata ?? {},
  });
  if (!existing && input.eventName !== ANALYTICS_EVENTS.SESSION_START) {
    await events.insertOne({
      sessionId: input.anonymousSessionId,
      eventName: ANALYTICS_EVENTS.SESSION_START,
      pagePath: input.pagePath,
      timestamp: now,
      source: input.source ?? "Direct / Unknown",
      medium: input.medium ?? "",
      campaign: input.campaign ?? "",
      metadata: {},
    });
  }
}
