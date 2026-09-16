import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET() {
  if (!(await currentAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await mongoDb
    .collection("jobs")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(
    jobs.map(({ _id, ...job }) => ({ ...job, id: String(_id) })),
  );
}

export async function POST(request: Request) {
  if (!(await currentAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const title = text(body.title, 180);
  const type = text(body.type, 120) || "Full-time";
  const location = text(body.location, 120) || "Remote";
  const description = text(body.description, 5000);

  if (!title || !description) {
    return NextResponse.json(
      { error: "Job title and description are required." },
      { status: 400 },
    );
  }

  const now = new Date();
  const job = {
    title,
    type,
    location,
    description,
    status: body.status === "closed" ? "closed" : "open",
    createdAt: now,
    updatedAt: now,
  };

  const result = await mongoDb.collection("jobs").insertOne(job);
  return NextResponse.json({ ok: true, id: result.insertedId });
}

export async function PATCH(request: Request) {
  if (!(await currentAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const id = text(body.id, 100);
  const title = text(body.title, 180);
  const type = text(body.type, 120) || "Full-time";
  const location = text(body.location, 120) || "Remote";
  const description = text(body.description, 5000);

  if (!id || !title || !description) {
    return NextResponse.json(
      { error: "Job id, title and description are required." },
      { status: 400 },
    );
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid job id." }, { status: 400 });
  }

  const result = await mongoDb.collection("jobs").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title,
        type,
        location,
        description,
        status: body.status === "closed" ? "closed" : "open",
        updatedAt: new Date(),
      },
    },
  );

  if (!result.matchedCount) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await currentAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json({ error: "Job id is required." }, { status: 400 });
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid job id." }, { status: 400 });
  }

  await mongoDb.collection("jobs").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
