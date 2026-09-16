import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogList from "@/components/BlogList";
import { getPublishedBlogPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "InfyCrest Insights — Web Development, SEO & Digital Growth",
  description:
    "Practical insights on website development, web design, SEO, AI search, performance and digital growth from InfyCrest Solutions.",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const clientPosts = posts.map((post) => ({
    ...post,
    _id: post._id ? String(post._id) : undefined,
  }));
  return (
    <>
      <Navbar />
      <main className="bg-[#fafaf9] px-5 pb-24 pt-32 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            InfyCrest / Insights
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
            InfyCrest <em className="font-display font-normal">Insights</em>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-500">
            Practical insights on websites, software, SEO, AI, design and
            digital growth.
          </p>
          <BlogList posts={clientPosts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
