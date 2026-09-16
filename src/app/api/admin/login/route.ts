import { NextResponse } from "next/server";
import { authenticateAdmin, sessionCookie } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: unknown; password?: unknown } | null;
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !password || !(await authenticateAdmin(username, password))) return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie(username));
  return response;
}
