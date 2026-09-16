import { NextResponse } from "next/server";
import { mongoDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await mongoDb.collection("projects").find({ published: { $ne: false } }).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(projects.map(({ _id, image, ...project }) => ({ ...project, id: _id.toString(), thumbnail: image })));
}
