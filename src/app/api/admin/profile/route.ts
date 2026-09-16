import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";
import { ADMIN_COOKIE } from "@/lib/admin/auth";

export async function PATCH(request: Request) {
  const username = await currentAdmin();
  if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { currentPassword?: unknown; newPassword?: unknown } | null;
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
  const profile = await mongoDb.collection("admin_profiles").findOne<{ passwordHash: string }>({ username });
  if (!profile || !(await bcrypt.compare(currentPassword, profile.passwordHash))) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  if (newPassword.length < 8) return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  await mongoDb.collection("admin_profiles").updateOne({ username }, { $set: { passwordHash: await bcrypt.hash(newPassword, 12), updatedAt: new Date() } });
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: ADMIN_COOKIE, value: "", httpOnly: true, expires: new Date(0), path: "/" });
  return response;
}
