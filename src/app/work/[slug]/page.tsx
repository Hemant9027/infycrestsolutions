import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductBySlug } from "@/lib/products";
import { SITE } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProductBySlug(slug);
  if (!project) return {};

  const title = `${project.name} Case Study`;
  return {
    title,
    description: project.shortDescription || project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description: project.shortDescription || project.description,
      url: `${SITE.url}/work/${project.slug}`,
      images: [{ url: `/api/products/${encodeURIComponent(project.slug)}/image` }],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProductBySlug(slug);
  if (!project) notFound();

  const features = project.features ?? [];
  const technologies = project.technologies ?? [];
  const imageUrl = `/api/products/${encodeURIComponent(project.slug)}/image`;

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#fafaf9] pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Link
              href="/#demos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <ArrowLeft className="size-4" /> Back to featured work
            </Link>
            <div className="mt-10 max-w-4xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                Case study / {project.category}
              </p>
              <h1 className="mt-5 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-7xl">
                {project.name}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
                {project.shortDescription || project.description}
              </p>
            </div>
            <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-100 shadow-[0_30px_80px_-45px_rgba(10,10,10,0.35)]">
              <Image
                src={imageUrl}
                alt={`${project.name} project preview`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1152px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                Project overview
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                A digital experience shaped around the brief.
              </h2>
            </div>
            <div>
              <p className="text-base leading-8 text-neutral-600">
                {project.description || project.shortDescription}
              </p>
              {features.length > 0 ? (
                <div className="mt-10">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Features implemented
                  </h3>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm text-neutral-700">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-neutral-900" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {technologies.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-100 bg-neutral-50 py-20 sm:py-24">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                Next step
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
                Start a similar project.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  data-analytics-event="live-project"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900"
                >
                  Visit live project <ArrowUpRight className="size-4" />
                </a>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Start a Similar Project <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
