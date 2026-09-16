import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";

export async function GET() {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const requests = await mongoDb.collection("admin_requests").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(requests.map(({ _id, ...request }) => ({ ...request, id: _id.toString() })));
}

export async function PATCH(request: Request) {
  if (!await currentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { id?: unknown; status?: unknown; notes?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  const status = typeof body?.status === "string" ? body.status : "New";
  const notes = typeof body?.notes === "string" ? body.notes.slice(0, 2000) : "";
  const allowed = ["New", "Contacted", "In Progress", "Converted", "Closed"];
  if (!ObjectId.isValid(id) || !allowed.includes(status)) return NextResponse.json({ error: "Invalid request update." }, { status: 400 });
  await mongoDb.collection("admin_requests").updateOne({ _id: new ObjectId(id) }, { $set: { status, notes, updatedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
