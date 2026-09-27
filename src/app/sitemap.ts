import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { DEMOS } from "@/data/demos";
import { getBlogSitemapPosts } from "@/lib/blog";
import { productTemplates } from "@/lib/product-templates";
import { ALL_WEBSITE_TEMPLATE_SLUGS } from "@/lib/product-template-types";
import { getAllProducts } from "@/lib/products";

const siteUrl = SITE.url.replace(/\/+$/, "");

function absoluteUrl(path: string) {
  return `${siteUrl}/${path.replace(/^\/+|\/+$/g, "")}`;
}

function addUrl(
  entries: Map<string, MetadataRoute.Sitemap[number]>,
  path: string,
  options: Omit<MetadataRoute.Sitemap[number], "url"> = {},
) {
  const url = path === "/" ? siteUrl : absoluteUrl(path);

  if (!entries.has(url)) {
    entries.set(url, { url, ...options });
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Awaited<ReturnType<typeof getBlogSitemapPosts>> = [];
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let templates: Array<{
    slug: string;
    updatedAt?: Date | string;
    createdAt?: Date | string;
  }> = [];

  try {
    posts = await getBlogSitemapPosts();
  } catch (error) {
    console.error("[sitemap] blog query failed:", error);
  }

  try {
    products = await getAllProducts();

    templates = await productTemplates()
      .find(
        { visible: true },
        {
          projection: {
            slug: 1,
            updatedAt: 1,
            createdAt: 1,
          },
        },
      )
      .toArray();
  } catch (error) {
    console.error("[sitemap] product query failed:", error);
  }

  const entries = new Map<string, MetadataRoute.Sitemap[number]>();
  const now = new Date();

  // Main public pages
  addUrl(entries, "/", {
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  });

  for (const [path, priority] of [
    ["/products", 0.8],
    ["/templates", 0.8],
    ["/template", 0.7],
    ["/services", 0.8],
    ["/contact", 0.8],
    ["/careers", 0.5],
    ["/demo", 0.8],
    ["/blog", 0.8],
    ["/cookie-policy", 0.3],
    ["/sitemap", 0.3],
  ] as const) {
    addUrl(entries, path, {
      lastModified: now,
      changeFrequency: path === "/blog" ? "daily" : "weekly",
      priority,
    });
  }

  // Demo pages
  for (const demo of DEMOS) {
    addUrl(entries, `/demo/${demo.slug}`, {
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Website template demo pages
  for (const slug of ALL_WEBSITE_TEMPLATE_SLUGS) {
    addUrl(entries, `/demo/${slug}`, {
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Products
  for (const product of products) {
    addUrl(entries, `/products/${product.slug}`, {
      lastModified: product.updatedAt || product.createdAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Visible product templates
  for (const template of templates) {
    addUrl(entries, `/products/${template.slug}`, {
      lastModified: template.updatedAt || template.createdAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Published blog posts
  for (const post of posts) {
    addUrl(entries, `/blog/${post.slug}`, {
      lastModified:
        post.updatedAt ||
        post.dateModified ||
        post.publishedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return [...entries.values()];
}