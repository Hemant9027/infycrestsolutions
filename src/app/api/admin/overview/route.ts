import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";

export async function GET() {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [projects, requests, subscribers] = await Promise.all([
    mongoDb.collection("projects").countDocuments(),
    mongoDb.collection("admin_requests").countDocuments(),
    mongoDb.collection("admin_subscribers").countDocuments(),
  ]);
  const unread = await mongoDb.collection("admin_requests").countDocuments({ status: "New" });
  const recent = await mongoDb.collection("admin_requests").find({}).sort({ createdAt: -1 }).limit(5).toArray();
  return NextResponse.json({ counts: { projects, requests, unread, subscribers }, recent: recent.map(({ _id, ...request }) => ({ ...request, id: _id.toString() })) });
}
