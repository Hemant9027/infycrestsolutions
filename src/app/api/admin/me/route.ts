import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";

export async function GET() {
  const username = await currentAdmin();
  return username ? NextResponse.json({ authenticated: true, username }) : NextResponse.json({ authenticated: false }, { status: 401 });
}
