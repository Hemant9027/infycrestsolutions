import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReadingProgress, ShareBar } from "@/components/ArticleChrome";
import { SITE } from "@/config/site";
import {
  articleHeadings,
  getBlogPost,
  getPublishedBlogPosts,
  blogImageUrl,
  prepareArticleHtml,
  sanitizeBlogHtml,
} from "@/lib/blog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost((await params).slug);
  if (!post) return {};
  const url = `${SITE.url}/blog/${post.slug}`;
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: post.canonicalUrl?.startsWith(SITE.url)
        ? post.canonicalUrl
        : url,
    },
    robots: post.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: "article",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url,
      images: [
        {
          url: blogImageUrl(post.ogImage || post.featuredImage),
          alt: post.imageAlt,
        },
      ],
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.dateModified.toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [blogImageUrl(post.ogImage || post.featuredImage)],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    getBlogPost(slug),
    getPublishedBlogPosts(),
  ]);
  if (!post) notFound();
  const related = posts
    .filter(
      (item) =>
        item.slug !== post.slug &&
        (item.category === post.category ||
          item.tags.some((tag) => post.tags.includes(tag))),
    )
    .slice(0, 3);
  const headings = articleHeadings(post.content);
  const content = prepareArticleHtml(sanitizeBlogHtml(post.content));
  const url = `${SITE.url}/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [`${SITE.url}${post.featuredImage}`],
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
      url: SITE.url,
    },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.dateModified.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE.url}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.category,
        item: `${SITE.url}/blog`,
      },
      { "@type": "ListItem", position: 4, name: post.title, item: url },
    ],
  };
  return (
    <>
      <ReadingProgress />
      <Navbar />
      <main className="bg-[#fafaf9] px-5 pb-24 pt-32 sm:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <article className="mx-auto max-w-6xl">
          <nav className="text-xs text-neutral-400">
            <Link href="/">Home</Link>
            <span className="px-2">/</span>
            <Link href="/blog">Blog</Link>
            <span className="px-2">/</span>
            <span>{post.category}</span>
          </nav>
          <header className="mx-auto mt-12 max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              {post.category}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-neutral-950 sm:text-6xl">
              {post.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-neutral-500 sm:text-xl">
              {post.excerpt}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-500">
              <Image
                src="/hemant.jpeg"
                alt="Hemant Pundir"
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              <span className="text-left">
                <strong className="block text-neutral-900">
                  {post.author}
                </strong>
                <span>{post.authorRole}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Published{" "}
                {new Date(post.publishedAt!).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </header>
          <div className="relative mx-auto mt-12 aspect-video max-w-5xl overflow-hidden rounded-3xl bg-neutral-100">
            <Image
              src={post.featuredImage}
              alt={post.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-[190px_minmax(0,760px)] lg:justify-center">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                  On this page
                </p>
                <ol className="mt-5 space-y-3 border-l border-neutral-200 pl-4">
                  {headings.map((heading, index) => (
                    <li
                      key={heading.id}
                      className={heading.level === 3 ? "pl-3" : ""}
                    >
                      <a
                        href={`#${heading.id}`}
                        className="text-xs leading-5 text-neutral-500 hover:text-neutral-900"
                      >
                        {String(index + 1).padStart(2, "0")} {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
                <div className="mt-10">
                  <ShareBar title={post.title} />
                </div>
              </div>
            </aside>
            <div className="min-w-0">
              <div className="mb-8 lg:hidden">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                  On this page
                </p>
                <div className="flex flex-wrap gap-2">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className="rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-600"
                    >
                      {heading.text}
                    </a>
                  ))}
                </div>
              </div>
              <div className="mb-8 lg:hidden">
                <ShareBar title={post.title} />
              </div>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              {post.contentImages?.map((image) => (
                <figure key={image.src} className="my-12">
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 760px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="mt-3 text-center text-xs text-neutral-500">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </article>
        <section className="mx-auto mt-20 max-w-4xl rounded-3xl bg-neutral-900 p-8 text-white sm:p-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            Build the next step
          </p>
          <h2 className="mt-4 text-3xl font-semibold">
            Need a high-performing website?
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-neutral-300">
            Planning a new website or redesign? InfyCrest Solutions builds
            modern, fast and conversion-focused websites for businesses.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900"
            >
              Start a Project →
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white"
            >
              Explore Our Work →
            </Link>
          </div>
        </section>
        {related.length > 0 && (
          <section className="mx-auto mt-20 max-w-6xl border-t border-neutral-200 pt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Continue reading
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              More from InfyCrest Insights
            </h2>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
                    {item.category}
                  </p>
                  <h3 className="mt-3 font-semibold leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
