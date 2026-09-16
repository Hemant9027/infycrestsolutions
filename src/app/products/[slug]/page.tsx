import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Code2 } from "lucide-react";
import type { IconType } from "react-icons";
import type { Demo } from "@/data/demos";
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiFirebase,
  SiVuedotjs,
  SiAngular,
  SiPython,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiSupabase,
  SiDocker,
} from "react-icons/si";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TemplateCustomizeCTA from "@/components/TemplateCustomizeCTA";
import {
  ensureProductTemplateSeed,
  productTemplates,
} from "@/lib/product-templates";
import { getProductBySlug, products } from "@/lib/products";
import type { Product } from "@/lib/products";
import { notFound } from "next/navigation";
import { cache } from "react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type ProjectRecord = Product & {
  thumbnail?: string;
  gallery?: string[];
  businessType?: string;
  previewUrl?: string;
  hasLivePreview?: boolean;
  price?: string;
  ctaText?: string;
  clientWebsite?: string;
  challenge?: string;
  outcome?: string;
  results?: string[] | string;
  mobileScreenshots?: string[];
  projectType?: string;
  type?: string;
};

function normalizeProjectKind(value?: string): "client" | "experiment" {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");

  if (!normalized) return "client";

  if (
    normalized.includes("ideal") ||
    normalized.includes("experiment") ||
    normalized.includes("concept") ||
    normalized.includes("internal") ||
    normalized.includes("prototype")
  ) {
    return "experiment";
  }

  if (
    normalized.includes("real world") ||
    normalized.includes("client work") ||
    normalized.includes("client project") ||
    normalized.includes("client") ||
    normalized.includes("commercial")
  ) {
    return "client";
  }

  return "client";
}

function normalizeProjectTypeLabel(kind: "client" | "experiment") {
  return kind === "client" ? "Client Project" : "Experimental Build";
}

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function projectSummary(project: ProjectRecord) {
  return project.shortDescription || project.description || "Project overview.";
}

function projectDescription(project: ProjectRecord) {
  return (
    project.description || project.shortDescription || projectSummary(project)
  );
}

const technologyIcons: Record<string, IconType> = {
  "Next.js": SiNextdotjs,
  Next: SiNextdotjs,
  React: SiReact,
  "Tailwind CSS": SiTailwindcss,
  Tailwind: SiTailwindcss,
  TypeScript: SiTypescript,
  "Node.js": SiNodedotjs,
  Node: SiNodedotjs,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  Firebase: SiFirebase,
  "Vue.js": SiVuedotjs,
  Vue: SiVuedotjs,
  Angular: SiAngular,
  Python: SiPython,
  PHP: SiPhp,
  Laravel: SiLaravel,
  MySQL: SiMysql,
  Supabase: SiSupabase,
  Docker: SiDocker,
};

function getTechnologyIcon(technology: string) {
  const normalized = technology.trim().toLowerCase();
  const entry = Object.entries(technologyIcons).find(
    ([name]) => name.toLowerCase() === normalized,
  );
  return entry?.[1];
}

function getHeroImage(project: ProjectRecord) {
  return (
    (project.imageUrl && String(project.imageUrl).trim()) ||
    (project.thumbnail && String(project.thumbnail).trim()) ||
    ""
  );
}

function getProjectImages(project: ProjectRecord): string[] {
  const candidates = [
    getHeroImage(project),
    ...(project.gallery ?? []),
    ...(project.mobileScreenshots ?? []),
  ];

  const unique: string[] = [];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const trimmed = String(candidate).trim();
    if (!trimmed || unique.includes(trimmed)) continue;
    unique.push(trimmed);
  }

  return unique;
}

function getProjectLiveUrl(project: ProjectRecord) {
  const liveUrl = String(project.liveUrl ?? project.previewUrl ?? "").trim();
  return liveUrl;
}

const getCachedProductBySlug = cache((slug: string) => getProductBySlug(slug));

const getTemplateProject = cache(async (slug: string) => {
  await ensureProductTemplateSeed();
  const product = await productTemplates().findOne({ slug, visible: true });
  return product as ProjectRecord | null;
});

async function getProjectNavigation(currentSlug: string) {
  const [realProjects, templateProducts] = await Promise.all([
    products()
      .find(
        { visible: true },
        { projection: { slug: 1, name: 1, displayOrder: 1 } },
      )
      .toArray(),
    productTemplates()
      .find(
        { visible: true },
        { projection: { slug: 1, name: 1, displayOrder: 1 } },
      )
      .toArray(),
  ]);

  const allProjects = [...realProjects, ...templateProducts].filter(
    (project, index, items) =>
      index === items.findIndex((entry) => entry.slug === project.slug),
  );

  const sorted = [...allProjects].sort((a, b) => {
    const orderA = a.displayOrder ?? 9999;
    const orderB = b.displayOrder ?? 9999;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  });

  const currentIndex = sorted.findIndex(
    (project) => project.slug === currentSlug,
  );
  return {
    previous: currentIndex > 0 ? sorted[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < sorted.length - 1
        ? sorted[currentIndex + 1]
        : null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [realProject, templateProject] = await Promise.all([
    getCachedProductBySlug(slug),
    getTemplateProject(slug),
  ]);
  const project = realProject ?? templateProject;
  if (!project) return {};

  const pipeline = `https://www.infycrestsolutions.com/products/${slug}`;
  const description =
    project.shortDescription ||
    project.description ||
    "Project by InfyCrest Solutions.";
  const image = getHeroImage(project);

  return {
    title: `${project.name} — Project by InfyCrest Solutions`,
    description,
    alternates: { canonical: pipeline },
    openGraph: {
      title: `${project.name} — Project by InfyCrest Solutions`,
      description,
      url: pipeline,
      siteName: "InfyCrest Solutions",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 800,
              alt: `${project.name} project`,
            },
          ]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Project by InfyCrest Solutions`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [realProduct, templateProduct, navigation] = await Promise.all([
    getCachedProductBySlug(slug),
    getTemplateProject(slug),
    getProjectNavigation(slug),
  ]);
  const project = (realProduct ?? templateProduct) as ProjectRecord | null;

  if (!project) notFound();

  const looseProject = project as unknown as Record<string, unknown>;
  const kind = normalizeProjectKind(
    String(
      project.projectType ?? project.type ?? looseProject.project_type ?? "",
    ),
  );
  const kindLabel = normalizeProjectTypeLabel(kind);
  const category = project.category || project.businessType || "Project";
  const shortDescription = projectSummary(project);
  const fullDescription = projectDescription(project);
  const liveUrl = getProjectLiveUrl(project);
  const heroImage = getHeroImage(project);
  const gallery = getProjectImages(project).filter(
    (image) => image && image !== heroImage,
  );
  const features = asArray(project.features);
  const technologies = asArray(project.technologies);
  const clientName = String(
    project.clientName ||
      (looseProject.client &&
      typeof looseProject.client === "object" &&
      "name" in looseProject.client
        ? (looseProject.client as { name?: string }).name
        : "") ||
      "",
  );
  const clientRole = String(
    project.clientRole ||
      (looseProject.client &&
      typeof looseProject.client === "object" &&
      "role" in looseProject.client
        ? (looseProject.client as { role?: string }).role
        : "") ||
      "",
  );
  const clientWebsite = String(
    project.clientWebsite ||
      looseProject.clientWebsite ||
      looseProject.clientUrl ||
      looseProject.companyWebsite ||
      "",
  );
  const challengeText = String(
    looseProject.challenge ||
      looseProject.projectChallenge ||
      looseProject.problem ||
      "",
  );
  const outcomeText = String(
    looseProject.outcome ||
      looseProject.results ||
      looseProject.projectOutcome ||
      shortDescription ||
      "",
  );
  const testimonial = String(project.testimonial || looseProject.review || "");
  const rating =
    typeof project.rating === "number" ? project.rating : undefined;

  const metadataItems = [
    { label: "INDUSTRY", value: category },
    { label: "PROJECT TYPE", value: kindLabel },
    { label: "STATUS", value: liveUrl ? "Live" : "Concept" },
    ...(technologies.length
      ? [{ label: "TECHNOLOGY", value: technologies.join(" · ") }]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": kind === "client" ? "CreativeWork" : "CreativeWork",
    name: project.name,
    description: shortDescription,
    url: `https://www.infycrestsolutions.com/products/${slug}`,
    image: heroImage || undefined,
    creator: {
      "@type": "Organization",
      name: "InfyCrest Solutions",
    },
    keywords: technologies,
    ...(testimonial && clientName
      ? {
          review: {
            "@type": "Review",
            reviewBody: testimonial,
            author: {
              "@type": "Person",
              name: clientName,
              jobTitle: clientRole || undefined,
            },
            reviewRating: rating
              ? {
                  "@type": "Rating",
                  ratingValue: Number(rating),
                  bestRating: 5,
                }
              : undefined,
          },
        }
      : {}),
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#fafaf9] text-neutral-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="mx-auto max-w-6xl px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:px-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="size-4" /> Back to Work
          </Link>

          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12">
            <div className="animate-fade-up">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                {kind === "client"
                  ? "CLIENT PROJECT"
                  : "EXPERIMENT / CONCEPT BUILD"}
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                {project.name}
              </h1>
              <p className="mt-4 text-base font-medium text-neutral-600 sm:text-lg">
                {category} ·{" "}
                {kind === "client" ? "Client Project" : "Experimental Build"}
              </p>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
                {shortDescription}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
                  >
                    Visit Live Website <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
                <TemplateCustomizeCTA
                  demo={{
                    name: project.name,
                    slug: project.slug,
                    category: category as Demo["category"],
                    tagline: shortDescription,
                    description: fullDescription,
                    thumbnail: heroImage,
                    previewUrl: liveUrl,
                    technologies,
                    priceLabel: "Custom quote",
                    featured: false,
                    includes: features,
                  }}
                />
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 transition-all hover:border-neutral-900 hover:bg-neutral-50"
                >
                  Back to Work
                </Link>
              </div>
            </div>

            <div className="animate-fade-up [animation-delay:120ms]">
              {heroImage ? (
                <div className="group relative w-full overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-100 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                  <div className="relative aspect-video w-full bg-neutral-100">
                    <Image
                      src={heroImage}
                      alt={`${project.name} project preview`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-contain transition duration-500 group-hover:scale-[1.01]"
                    />
                  </div>
                  {liveUrl ? (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-sm font-medium text-neutral-900 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                    >
                      View Live Website <ArrowUpRight className="size-4" />
                    </a>
                  ) : null}
                </div>
              ) : (
                <div className="flex aspect-video w-full items-end rounded-[28px] border border-dashed border-neutral-300 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,1),_rgba(245,245,244,1)_55%,_rgba(232,232,229,1)_100%)] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                  <div className="rounded-2xl border border-neutral-200 bg-white/80 p-5 backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Project
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                      {project.name}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">{category}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-white/70">
          <div className="mx-auto grid max-w-6xl gap-4 px-5 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-6 lg:px-10">
            {metadataItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium text-neutral-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
            <span>01</span>
            <span className="h-px flex-1 bg-neutral-200" />
            <span>THE PROJECT</span>
          </div>
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-5xl">
              Built with purpose.
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-neutral-600">
              {fullDescription
                .split(/\n+/)
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
          </div>
        </section>

        {kind === "client" ? (
          <section className="mx-auto max-w-6xl px-5 py-4 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
                <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  <span>THE CLIENT</span>
                </div>
                {clientName ? (
                  <div className="space-y-4">
                    {looseProject.clientImage ? (
                      <img
                        src={String(looseProject.clientImage)}
                        alt={`${clientName} logo`}
                        className="h-14 w-auto rounded-xl border border-neutral-200 bg-neutral-50 object-contain p-2"
                      />
                    ) : null}
                    <div>
                      <p className="text-2xl font-semibold tracking-[-0.04em] text-neutral-900">
                        {clientName}
                      </p>
                      {clientRole ? (
                        <p className="mt-1 text-sm text-neutral-500">
                          {clientRole}
                        </p>
                      ) : null}
                      {clientWebsite ? (
                        <a
                          href={
                            clientWebsite.startsWith("http")
                              ? clientWebsite
                              : `https://${clientWebsite}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
                        >
                          {clientWebsite}
                          <ArrowUpRight className="size-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-600">
                    Client information is not available for this project.
                  </p>
                )}
              </div>

              <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
                <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  <span>
                    {challengeText ? "THE CHALLENGE" : "THE APPROACH"}
                  </span>
                </div>
                <p className="text-lg leading-8 text-neutral-700">
                  {challengeText || fullDescription}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-6xl px-5 py-4 sm:px-8 lg:px-10">
            <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                <span>WHY WE BUILT IT</span>
              </div>
              <p className="text-2xl font-medium leading-[1.3] tracking-[-0.03em] text-neutral-900 sm:text-3xl">
                {project.name} is an experimental {category.toLowerCase()}{" "}
                concept created by InfyCrest Solutions to explore premium
                storytelling, modern product discovery and a high-impact digital
                experience.
              </p>
              <p className="mt-5 text-lg leading-8 text-neutral-600">
                {fullDescription}
              </p>
            </div>
          </section>
        )}

        {features.length ? (
          <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
            <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
              <span>02</span>
              <span className="h-px flex-1 bg-neutral-200" />
              <span>WHAT WE BUILT</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-5xl">
              Designed around the experience.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => (
                <article
                  key={`${feature}-${index}`}
                  className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.02)] transition-transform hover:-translate-y-0.5"
                >
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-700">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="text-base leading-7 text-neutral-700">
                    {feature}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {technologies.length ? (
          <section className="mx-auto max-w-6xl px-5 py-4 sm:px-8 lg:px-10">
            <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
              <span>03</span>
              <span className="h-px flex-1 bg-neutral-200" />
              <span>BEHIND THE BUILD</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-5xl">
              Built with modern technology.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {technologies.map((technology) => {
                const TechnologyIcon = getTechnologyIcon(technology);

                return (
                  <span
                    key={technology}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300"
                  >
                    {TechnologyIcon ? (
                      <TechnologyIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-neutral-900"
                      />
                    ) : (
                      <Code2
                        aria-hidden="true"
                        className="size-4 shrink-0 text-neutral-500"
                      />
                    )}
                    <span>{technology}</span>
                  </span>
                );
              })}
            </div>
          </section>
        ) : null}

        {gallery.length ? (
          <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
            <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
              <span>04</span>
              <span className="h-px flex-1 bg-neutral-200" />
              <span>THE EXPERIENCE</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {gallery.slice(0, 3).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={index === 0 ? "md:col-span-2" : ""}
                >
                  <img
                    src={image}
                    alt={`${project.name} gallery preview ${index + 1}`}
                    className={`w-full rounded-[28px] border border-neutral-200 bg-neutral-100 object-cover shadow-[0_14px_40px_rgba(23,23,23,0.05)] transition duration-500 hover:scale-[1.01] ${index === 0 ? "h-[420px] sm:h-[560px]" : "h-[280px] sm:h-[360px]"}`}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {Array.isArray(looseProject.mobileScreenshots) &&
        looseProject.mobileScreenshots.length ? (
          <section className="mx-auto max-w-6xl px-5 py-4 sm:px-8 lg:px-10">
            <h3 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-4xl">
              Designed for every screen.
            </h3>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {looseProject.mobileScreenshots.map(
                (image: unknown, index: number) => (
                  <img
                    key={`${String(image)}-${index}`}
                    src={String(image)}
                    alt={`${project.name} mobile preview ${index + 1}`}
                    className="w-full rounded-[24px] border border-neutral-200 bg-neutral-100 object-cover shadow-[0_10px_30px_rgba(23,23,23,0.04)]"
                  />
                ),
              )}
            </div>
          </section>
        ) : null}

        {kind === "client" && testimonial ? (
          <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
            <div className="rounded-[28px] border border-neutral-200 bg-neutral-900 p-6 text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-300">
                CLIENT FEEDBACK
              </p>
              <blockquote className="mt-6 text-xl leading-8 text-white/90 sm:text-2xl">
                “{testimonial}”
              </blockquote>
              <div className="mt-6 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {clientName || "Client"}
                  </p>
                  <p className="text-sm text-neutral-300">
                    {clientRole || "Client"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {outcomeText ? (
          <section className="mx-auto max-w-6xl px-5 py-4 sm:px-8 lg:px-10">
            <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
              <span>05</span>
              <span className="h-px flex-1 bg-neutral-200" />
              <span>OUTCOME</span>
            </div>
            <h3 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-5xl">
              {kind === "client" ? "The outcome" : "The outcome"}
            </h3>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
              {String(outcomeText)}
            </p>
          </section>
        ) : null}

        {liveUrl ? (
          <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
            <div className="rounded-[28px] border border-neutral-200 bg-white p-8 text-center shadow-[0_12px_36px_rgba(23,23,23,0.04)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                See it in action.
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-5xl">
                {kind === "client"
                  ? "Explore the live website we built."
                  : "Explore the experiment."}
              </h3>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
              >
                Visit Live Website <ArrowUpRight className="size-4" />
              </a>
            </div>
          </section>
        ) : null}

        <nav className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {navigation.previous ? (
                <Link
                  href={`/products/${navigation.previous.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900"
                >
                  <ArrowLeft className="size-4" /> {navigation.previous.name}
                </Link>
              ) : (
                <span className="text-sm text-neutral-400">
                  Previous Project
                </span>
              )}
            </div>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-900"
            >
              All Work
            </Link>

            <div className="min-w-0 text-right">
              {navigation.next ? (
                <Link
                  href={`/products/${navigation.next.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900"
                >
                  {navigation.next.name} <ArrowUpRight className="size-4" />
                </Link>
              ) : (
                <span className="text-sm text-neutral-400">Next Project</span>
              )}
            </div>
          </div>
        </nav>

        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-10">
          <div className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-[0_12px_36px_rgba(23,23,23,0.04)] sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Let&apos;s build
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-5xl">
              Have a project in mind?
            </h3>
            <p className="mt-3 max-w-2xl text-lg text-neutral-600">
              Let&apos;s build something that works for your business.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Start a Project <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-6 py-3.5 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-900"
              >
                Explore Our Work
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
