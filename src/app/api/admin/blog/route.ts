import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";
import { currentAdmin } from "@/lib/admin/auth";
import { mongoDb } from "@/lib/mongodb";
import { seedBlogPosts, slugify, type BlogPost, type BlogStatus } from "@/lib/blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const statuses = new Set<BlogStatus>(["draft", "published", "scheduled"]);

export async function GET() {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await seedBlogPosts();
  const posts = await mongoDb.collection<BlogPost>("blog_posts").find({}).sort({ updatedAt: -1 }).toArray();
  return NextResponse.json(posts.map(({ _id, ...post }) => ({ ...post, id: String(_id) })));
}

export async function POST(request: Request) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const title = text(body.title, 180);
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const now = new Date();
  const status = statuses.has(body.status as BlogStatus) ? body.status as BlogStatus : "draft";
  const post = { title, slug: slugify(text(body.slug, 180) || title), excerpt: text(body.excerpt, 500), content: text(body.content, 50000), featuredImage: text(body.featuredImage, 500), imageAlt: text(body.imageAlt, 240), category: text(body.category, 80) || "Web Development", tags: Array.isArray(body.tags) ? body.tags.map((tag) => text(tag, 60)).filter(Boolean).slice(0, 12) : [], author: text(body.author, 160) || "Hemant Pundir", authorRole: text(body.authorRole, 160) || "Founder, InfyCrest Solutions", primaryKeyword: text(body.primaryKeyword, 160), secondaryKeywords: Array.isArray(body.secondaryKeywords) ? body.secondaryKeywords.map((tag) => text(tag, 160)).filter(Boolean).slice(0, 12) : [], searchIntent: text(body.searchIntent, 80) || "informational", metaTitle: text(body.metaTitle, 180) || title, metaDescription: text(body.metaDescription, 320) || text(body.excerpt, 320), noindex: body.noindex === true, status, publishAt: body.publishAt ? new Date(text(body.publishAt, 40)) : undefined, publishedAt: status === "published" ? now : undefined, dateModified: now, createdAt: now, updatedAt: now, readingTime: Math.max(1, Math.round(text(body.content, 50000).split(/\s+/).length / 220)), featured: false } satisfies Omit<BlogPost, "_id">;
  const result = await mongoDb.collection<BlogPost>("blog_posts").insertOne(post);
  revalidateTag("blog-posts", "max");
  return NextResponse.json({ ok: true, id: result.insertedId });
}

export async function PATCH(request: Request) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const id = text(body.id, 100);
  const title = text(body.title, 180);
  const status = statuses.has(body.status as BlogStatus) ? body.status as BlogStatus : "draft";
  if (!id || !title) return NextResponse.json({ error: "Post id and title are required." }, { status: 400 });
  const update = { title, slug: slugify(text(body.slug, 180) || title), excerpt: text(body.excerpt, 500), content: text(body.content, 50000), featuredImage: text(body.featuredImage, 500), imageAlt: text(body.imageAlt, 240), category: text(body.category, 80), tags: Array.isArray(body.tags) ? body.tags.map((tag) => text(tag, 60)).filter(Boolean).slice(0, 12) : [], author: text(body.author, 160) || "Hemant Pundir", authorRole: text(body.authorRole, 160) || "Founder, InfyCrest Solutions", primaryKeyword: text(body.primaryKeyword, 160), secondaryKeywords: Array.isArray(body.secondaryKeywords) ? body.secondaryKeywords.map((tag) => text(tag, 160)).filter(Boolean).slice(0, 12) : [], searchIntent: text(body.searchIntent, 80), metaTitle: text(body.metaTitle, 180) || title, metaDescription: text(body.metaDescription, 320), noindex: body.noindex === true, status, publishAt: body.publishAt ? new Date(text(body.publishAt, 40)) : undefined, ...(status === "published" ? { publishedAt: new Date() } : {}), dateModified: new Date(), updatedAt: new Date(), readingTime: Math.max(1, Math.round(text(body.content, 50000).split(/\s+/).length / 220)) };
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });
  const result = await mongoDb.collection<BlogPost>("blog_posts").updateOne({ _id: new ObjectId(id) as never }, { $set: update });
  if (!result.matchedCount) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  revalidateTag("blog-posts", "max");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "Post id is required." }, { status: 400 });
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });
  await mongoDb.collection<BlogPost>("blog_posts").deleteOne({ _id: new ObjectId(id) as never });
  revalidateTag("blog-posts", "max");
  return NextResponse.json({ ok: true });
}
