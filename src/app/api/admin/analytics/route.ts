import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { isConversionEvent } from "@/lib/analytics";
import { mongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const conversionNames = ["whatsapp_click", "email_click", "phone_click", "contact_form_submit", "template_inquiry_submit", "start_project_click", "estimate_complete", "template_customize_click"];
const dateStart = (period: string) => {
  const now = new Date();
  const days = period === "yesterday" ? 1 : period === "7d" ? 7 : period === "30d" ? 30 : 0;
  if (period === "yesterday") now.setUTCDate(now.getUTCDate() - 1);
  now.setUTCHours(0, 0, 0, 0);
  if (days > 1) now.setUTCDate(now.getUTCDate() - (days - 1));
  return now;
};

export async function GET(request: Request) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const period = new URL(request.url).searchParams.get("period") ?? "today";
  const start = dateStart(period);
  const end = period === "yesterday" ? new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1) : new Date();
  const sessions = mongoDb.collection("analytics_sessions");
  const events = mongoDb.collection("analytics_events");
  const sessionFilter = { startedAt: { $gte: start, $lte: end } };
  const eventFilter = { timestamp: { $gte: start, $lte: end } };
  const [sessionCount, newVisitors, pageViews, leads, engagedSessions, sources, pages, devices, countries, campaigns, timeline, live, recent] = await Promise.all([
    sessions.countDocuments(sessionFilter),
    sessions.countDocuments({ ...sessionFilter, $expr: { $eq: ["$startedAt", "$lastActiveAt"] } }),
    events.countDocuments({ ...eventFilter, eventName: "page_view" }),
    events.countDocuments({ ...eventFilter, eventName: { $in: conversionNames } }),
    sessions.countDocuments({ ...sessionFilter, $or: [{ engaged: true }, { pageCount: { $gt: 1 } }] }),
    sessions.aggregate([{ $match: sessionFilter }, { $group: { _id: "$source", visitors: { $sum: 1 }, sessions: { $sum: 1 } } }, { $sort: { visitors: -1 } }, { $limit: 20 }]).toArray(),
    events.aggregate([{ $match: { ...eventFilter, eventName: "page_view", pagePath: { $not: /^\/admin/ } } }, { $group: { _id: "$pagePath", views: { $sum: 1 }, visitors: { $addToSet: "$sessionId" } } }, { $project: { _id: 1, views: 1, visitors: { $size: "$visitors" } } }, { $sort: { views: -1 } }, { $limit: 20 }]).toArray(),
    sessions.aggregate([{ $match: sessionFilter }, { $group: { _id: "$device", visitors: { $sum: 1 } } }, { $sort: { visitors: -1 } }]).toArray(),
    sessions.aggregate([{ $match: sessionFilter }, { $group: { _id: "$country", visitors: { $sum: 1 } } }, { $sort: { visitors: -1 } }, { $limit: 20 }]).toArray(),
    sessions.aggregate([{ $match: { ...sessionFilter, campaign: { $nin: ["", null] } } }, { $group: { _id: { campaign: "$campaign", source: "$source", medium: "$medium" }, visitors: { $sum: 1 } } }, { $sort: { visitors: -1 } }, { $limit: 20 }]).toArray(),
    events.aggregate([{ $match: { ...eventFilter, eventName: "page_view" } }, { $group: { _id: { $dateToString: { date: "$timestamp", format: period === "today" || period === "yesterday" ? "%H:00" : "%Y-%m-%d" } }, value: { $sum: 1 } } }, { $sort: { _id: 1 } }]).toArray(),
    sessions.find({ lastActiveAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } }).sort({ lastActiveAt: -1 }).limit(50).project({ _id: 1, country: 1, device: 1, source: 1, currentPage: 1, lastActiveAt: 1, pageCount: 1 }).toArray(),
    events.find(eventFilter).sort({ timestamp: -1 }).limit(30).project({ _id: 0, eventName: 1, pagePath: 1, timestamp: 1, source: 1 }).toArray(),
  ]);
  return NextResponse.json({
    period,
    lastUpdated: new Date().toISOString(),
    hasData: sessionCount > 0 || pageViews > 0,
    kpis: { visitors: sessionCount, newVisitors, sessions: sessionCount, pageViews, engagedSessions, leads, conversionRate: sessionCount ? Math.round((leads / sessionCount) * 10000) / 100 : 0 },
    sources, pages, devices, countries, campaigns, timeline,
    live: live.map((item) => ({ ...item, anonymousId: `Visitor #${String(item._id).slice(0, 4).toUpperCase()}`, lastActiveAt: item.lastActiveAt })),
    recent: recent.map((item) => ({ ...item, timestamp: item.timestamp })),
    searchConsole: { connected: false, message: "Search Console is not connected." },
    conversionEvents: conversionNames.filter(isConversionEvent),
  });
}
