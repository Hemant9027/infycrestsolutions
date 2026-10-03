import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { getDemoContextFromHostname, getHostnameFromRequest } from "@/lib/analytics-host";
import { mongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HIGH_INTENT_EVENTS = [
  "book_now_click",
  "whatsapp_click",
  "contact_form_submit",
  "email_click",
  "external_booking_click",
];

function dateRange(period: string) {
  const end = new Date();
  const start = new Date(end);
  if (period === "today") {
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
  if (period === "7d") {
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
  if (period === "30d") {
    start.setDate(end.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
  start.setDate(end.getDate() - 0);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

export async function GET(request: Request) {
  if (!(await currentAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const period = new URL(request.url).searchParams.get("period") ?? "7d";
  const hostname = getHostnameFromRequest(request.headers);
  const context = getDemoContextFromHostname(hostname);

  if (context.siteType !== "demo") {
    return NextResponse.json({ error: "This endpoint is only available for demo websites." }, { status: 403 });
  }

  const { start, end } = dateRange(period);
  const filter = {
    hostname: context.hostname,
    timestamp: { $gte: start, $lte: end },
  };
  const sessionFilter = {
    hostname: context.hostname,
    startedAt: { $gte: start, $lte: end },
  };

  const [sessions, visitors, newVisitors, pageViews, engagedSessions, sources, pages, devices, recent, highIntent, timeline] = await Promise.all([
    mongoDb.collection("analytics_sessions").countDocuments(sessionFilter),
    mongoDb.collection("analytics_sessions").countDocuments({ ...sessionFilter, $expr: { $eq: ["$startedAt", "$lastActiveAt"] } }),
    mongoDb.collection("analytics_events").countDocuments({ ...filter, eventName: "page_view" }),
    mongoDb.collection("analytics_sessions").countDocuments({ ...sessionFilter, $or: [{ engaged: true }, { pageCount: { $gt: 1 } }] }),
    mongoDb.collection("analytics_events").aggregate([
      { $match: { ...filter, eventName: { $in: HIGH_INTENT_EVENTS } } },
      { $group: { _id: "$eventName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray(),
    mongoDb.collection("analytics_sessions").aggregate([
      { $match: sessionFilter },
      { $group: { _id: "$source", visitors: { $sum: 1 }, sessions: { $sum: 1 } } },
      { $sort: { visitors: -1 } },
      { $limit: 8 },
    ]).toArray(),
    mongoDb.collection("analytics_events").aggregate([
      { $match: { ...filter, eventName: "page_view" } },
      { $group: { _id: "$pagePath", views: { $sum: 1 }, visitors: { $addToSet: "$sessionId" } } },
      { $project: { _id: 1, views: 1, visitors: { $size: "$visitors" } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]).toArray(),
    mongoDb.collection("analytics_sessions").aggregate([
      { $match: sessionFilter },
      { $group: { _id: "$device", visitors: { $sum: 1 } } },
      { $sort: { visitors: -1 } },
    ]).toArray(),
    mongoDb.collection("analytics_events").find({ ...filter }).sort({ timestamp: -1 }).limit(12).project({ _id: 0, eventName: 1, pagePath: 1, timestamp: 1 }).toArray(),
    mongoDb.collection("analytics_events").aggregate([
      { $match: { ...filter, eventName: { $in: HIGH_INTENT_EVENTS } } },
      { $group: { _id: "$eventName", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]).toArray(),
    mongoDb.collection("analytics_events").aggregate([
      { $match: { ...filter, eventName: "page_view" } },
      { $group: { _id: { $dateToString: { date: "$timestamp", format: period === "today" ? "%H:00" : "%Y-%m-%d" } }, value: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]).toArray(),
  ]);

  const highIntentMap = Object.fromEntries(highIntent.map((entry) => [entry._id, entry.total]));

  return NextResponse.json({
    site: {
      hostname: context.hostname,
      demoId: context.demoId,
      displayName: context.displayName,
    },
    period,
    kpis: {
      visitors: sessions,
      newVisitors: visitors,
      sessions,
      pageViews: pageViews,
      engagedSessions,
      conversions: highIntent.reduce((sum, entry) => sum + entry.total, 0),
    },
    sources,
    pages,
    devices,
    highIntent: HIGH_INTENT_EVENTS.map((eventName) => ({
      _id: eventName,
      total: highIntentMap[eventName] ?? 0,
    })),
    recent,
    timeline,
  });
}
