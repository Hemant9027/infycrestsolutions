import { sql } from "drizzle-orm";

export const dynamic = "force-static";

export async function GET() {
  return Response.json({ ok: true });
}
