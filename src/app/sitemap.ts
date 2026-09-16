import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { getBlogSitemapPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Awaited<ReturnType<typeof getBlogSitemapPosts>> = [];
  try {
    posts = await getBlogSitemapPosts();
  } catch (error) {
    console.error("[sitemap] blog query failed:", error);
  }
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${SITE.url}/products`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/templates`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/template`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/cookie-policy`, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${SITE.url}/demo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${SITE.url}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    ...posts.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.dateModified || post.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
