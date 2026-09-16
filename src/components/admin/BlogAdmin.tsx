"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  publishedAt?: string;
  author: string;
  authorRole: string;
  noindex?: boolean;
  featuredImage: string;
  excerpt: string;
  content: string;
  imageAlt: string;
  tags: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  metaTitle: string;
  metaDescription: string;
};
const empty: Omit<Post, "id"> = {
  title: "",
  slug: "",
  category: "Web Development",
  status: "draft",
  author: "Hemant Pundir",
  authorRole: "Founder, InfyCrest Solutions",
  noindex: false,
  featuredImage: "",
  excerpt: "",
  content: "<p></p>",
  imageAlt: "",
  tags: [],
  primaryKeyword: "",
  secondaryKeywords: [],
  searchIntent: "informational",
  metaTitle: "",
  metaDescription: "",
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<Omit<Post, "id"> & { id?: string }>(empty);
  const [message, setMessage] = useState("");
  async function load() {
    const response = await fetch("/api/admin/blog");
    if (response.ok) setPosts(await response.json());
  }
  useEffect(() => {
    void load();
  }, []);
  function edit(post: Post) {
    setForm({
      ...post,
      tags: post.tags ?? [],
      secondaryKeywords: post.secondaryKeywords ?? [],
    });
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/blog", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMessage(
      response.ok ? "Blog post saved." : "Could not save the blog post.",
    );
    if (response.ok) {
      setForm(empty);
      await load();
    }
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/blog?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await load();
  }
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form
        onSubmit={save}
        className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
              Content management
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              {form.id ? "Edit blog post" : "Add blog post"}
            </h2>
          </div>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(empty)}
              className="text-sm text-neutral-500"
            >
              Cancel
            </button>
          )}
        </div>
        <div className="mt-6 space-y-3">
          {(
            [
              ["title", "Title"],
              ["slug", "Slug"],
              ["excerpt", "Excerpt"],
              ["featuredImage", "Featured image URL"],
              ["imageAlt", "Image alt text"],
              ["category", "Category"],
              ["author", "Published by"],
              ["authorRole", "Author role"],
              ["primaryKeyword", "Primary keyword"],
              ["metaTitle", "Meta title"],
              ["metaDescription", "Meta description"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="block text-xs font-semibold text-neutral-600"
            >
              {label}
              <input
                value={form[key]}
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.value })
                }
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-neutral-900"
              />
            </label>
          ))}
          <label className="block text-xs font-semibold text-neutral-600">
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value })
              }
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-normal"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-600">
            <input
              type="checkbox"
              checked={form.noindex === true}
              onChange={(event) =>
                setForm({ ...form, noindex: event.target.checked })
              }
              className="size-4 accent-neutral-900"
            />
            Exclude from search indexing and sitemap
          </label>
          <label className="block text-xs font-semibold text-neutral-600">
            Content HTML
            <textarea
              value={form.content}
              onChange={(event) =>
                setForm({ ...form, content: event.target.value })
              }
              rows={12}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-neutral-900"
            />
          </label>
        </div>
        <button className="mt-5 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white">
          {form.id ? "Update post" : "Save draft"}
        </button>
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      </form>
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold">All posts</h2>
        <div className="mt-5 divide-y divide-neutral-100">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{post.title}</h3>
                <p className="mt-1 text-xs text-neutral-500">
                  {post.category} · {post.status} ·{" "}
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : "Not published"}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  SEO title: {post.metaTitle ? "Configured" : "Missing"} · Meta
                  description: {post.metaDescription ? "Configured" : "Missing"}{" "}
                  · Sitemap:{" "}
                  {post.status === "published" && !post.noindex
                    ? "Included"
                    : "Excluded"}{" "}
                  · Indexing:{" "}
                  {post.noindex
                    ? "Noindex"
                    : post.status === "published"
                      ? "Indexable"
                      : "Not published"}
                </p>
              </div>
              <div className="flex shrink-0 gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => edit(post)}
                  className="text-neutral-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void remove(post.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          {!posts.length && (
            <p className="py-8 text-sm text-neutral-500">No blog posts yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
