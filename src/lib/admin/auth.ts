import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { mongoDb } from "@/lib/mongodb";

export const ADMIN_COOKIE = "infycrest_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "infycrest-development-session-secret";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function sign(value: string) {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

function tokenFor(username: string) {
  const payload = Buffer.from(JSON.stringify({ username, exp: Date.now() + SESSION_MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString()) as { username?: string; exp?: number };
    return value.username && value.exp && value.exp > Date.now() ? value.username : null;
  } catch {
    return null;
  }
}

export async function currentAdmin() {
  return verifyToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function ensureAdminProfile() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const configuredPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const collection = mongoDb.collection("admin_profiles");
  let profile = await collection.findOne<{ username: string; passwordHash: string }>({ username });
  if (!profile) {
    await collection.insertOne({ username, passwordHash: await bcrypt.hash(configuredPassword, 12), createdAt: new Date(), updatedAt: new Date() });
    profile = await collection.findOne<{ username: string; passwordHash: string }>({ username });
  }
  return profile;
}

export async function authenticateAdmin(username: string, password: string) {
  const profile = await ensureAdminProfile();
  const normalizedUsername = username.trim().toLowerCase();
  if (!profile || profile.username.toLowerCase() !== normalizedUsername || !(await bcrypt.compare(password, profile.passwordHash))) return false;
  return true;
}

export function sessionCookie(username: string) {
  return { name: ADMIN_COOKIE, value: tokenFor(username), httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE };
}
