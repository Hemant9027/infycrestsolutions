import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { DEMOS, getDemoBySlug } from "@/data/demos";
import { whatsappUrl } from "@/config/site";
import BrowserFrame from "@/components/BrowserFrame";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SelectDemoButton from "@/components/SelectDemoButton";
import Logo from "@/components/Logo";
import RestaurantTemplate from "@/components/restaurant-template";
import ProductWebsiteTemplate from "@/components/product-website-template";
import type { ComponentType, ReactNode } from "react";
import {
  ALL_WEBSITE_TEMPLATE_SLUGS,
  PRODUCT_TEMPLATE_SLUGS,
} from "@/lib/product-template-types";
import SmilecareDentalTemplate from "@/components/smilecare-dental-template";
import MedoraHealthTemplate from "@/components/medora-health-template";
import VelouraStudioTemplate from "@/components/veloura-studio-template";
import { getPublishedCustomer } from "@/lib/new-customers";
import AureliaDiningTemplate from "@/components/aurelia-dining-template";
import AfterglowBarTemplate from "@/components/afterglow-bar-template";
import CrumbHearthTemplate from "@/components/crumb-hearth-template";
import DashbiteTemplate from "@/components/dashbite-template";
import RoastRitualTemplate from "@/components/roast-ritual-template";
import NorthlineTemplate from "@/components/northline-template";
import ScaleflowTemplate from "@/components/scaleflow-template";
import LaunchlabTemplate from "@/components/launchlab-template";
import { ForgeAthleticsTemplate } from "@/components/forge-athletics-template";
import FrameSoulTemplate from "@/components/frame-soul-template";
import IslandVillaTemplate from "@/components/island-villa-template";
import DemoAgencyShell from "@/components/DemoAgencyShell";
import DaBayAreaBonefishLodgeTemplate from "@/components/Da-Bay-Area-Bonefish-Lodge";


const productTemplateComponents: Record<string, ComponentType> = {
  "Da-Bay-Area-Bonefish-Lodge": DaBayAreaBonefishLodgeTemplate,
  "smilecare-dental": SmilecareDentalTemplate,
  "dental-clinic": SmilecareDentalTemplate,
  "medora-health": MedoraHealthTemplate,
  "veloura-studio": VelouraStudioTemplate,
  salon: VelouraStudioTemplate,
  "aurelia-dining": AureliaDiningTemplate,
  "afterglow-bar": AfterglowBarTemplate,
  "crumb-hearth": CrumbHearthTemplate,
  dashbite: DashbiteTemplate,
  "roast-ritual": RoastRitualTemplate,
  northline: NorthlineTemplate,
  scaleflow: ScaleflowTemplate,
  launchlab: LaunchlabTemplate,
  "forge-athletics": ForgeAthleticsTemplate,
  gym: ForgeAthleticsTemplate,
  "frame-soul": FrameSoulTemplate,
  "island-villa": IslandVillaTemplate,
};

interface DemoPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Array.from(
    new Set([...DEMOS.map((demo) => demo.slug), ...ALL_WEBSITE_TEMPLATE_SLUGS]),
  ).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemoBySlug(slug);
  if (!demo) {
    return ALL_WEBSITE_TEMPLATE_SLUGS.includes(slug)
      ? { title: `${slug} — Live Website Demo` }
      : {};
  }
  return {
    title: `${demo.name} — Live Website Demo`,
    description: demo.description,
    alternates: { canonical: `/demo/${demo.slug}` },
    openGraph: {
      title: `${demo.name} — InfyCrest Solutions`,
      description: demo.description,
      images: [{ url: demo.thumbnail }],
    },
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const demo = getDemoBySlug(slug);
  const renderTemplate = (template: ReactNode) => (
    <DemoAgencyShell>{template}</DemoAgencyShell>
  );
  if (!demo) {
    const ProductTemplate = productTemplateComponents[slug];
    if (ProductTemplate) return renderTemplate(<ProductTemplate />);
    if (ALL_WEBSITE_TEMPLATE_SLUGS.includes(slug))
      return renderTemplate(<ProductWebsiteTemplate slug={slug} />);
    const customer = await getPublishedCustomer(slug);
    if (customer) redirect(`/preview/${customer.slug}`);
    notFound();
  }

  const ProductTemplate = productTemplateComponents[slug];
  if (ProductTemplate) return renderTemplate(<ProductTemplate />);
  if (slug === "restaurant") return renderTemplate(<AureliaDiningTemplate />);
  if (ALL_WEBSITE_TEMPLATE_SLUGS.includes(slug))
    return renderTemplate(<ProductWebsiteTemplate slug={slug} />);

  const related = [
    ...DEMOS.filter(
      (d) => d.category === demo.category && d.slug !== demo.slug,
    ),
    ...DEMOS.filter(
      (d) => d.category !== demo.category && d.slug !== demo.slug,
    ),
  ].slice(0, 3);

  return (
    <>
      <Navbar />
      <div className="border-b border-neutral-200 bg-white pt-16 sm:pt-[72px]">
        <div className="mx-auto flex min-h-16 max-w-[1200px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link
            href="/"
            aria-label="InfyCrest Solutions home"
            className="shrink-0"
          >
            <Logo />
          </Link>
          <div className="min-w-0 text-center">
            <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Live preview · {demo.name} website · {demo.priceLabel}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs font-medium text-neutral-500">
            <Link
              href="#details"
              className="hidden transition-colors hover:text-neutral-900 sm:inline"
            >
              Back to details
            </Link>
            <Link
              href="/#collection"
              className="transition-colors hover:text-neutral-900"
            >
              <span className="hidden sm:inline">All products</span>
              <span className="sm:hidden">Products</span>
            </Link>
          </div>
        </div>
      </div>
      <main
        id="details"
        className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-14"
      >
        <Link
          href="/#collection"
          className="inline-flex items-center gap-2 rounded-full text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="size-4" strokeWidth={2.4} />
          All demos
        </Link>

        <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-[0.92fr,1.08fr] lg:gap-16">
          {/* Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {demo.category}
              </span>
              {demo.scope && (
                <span className="rounded-full bg-neutral-100 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  {demo.scope}
                </span>
              )}
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl">
              {demo.name}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-neutral-500 sm:text-lg">
              {demo.description}
            </p>

            <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="text-3xl font-semibold tracking-tight text-neutral-900">
                {demo.priceLabel}
              </p>
              {demo.priceNote && (
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">
                  {demo.priceNote}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <SelectDemoButton
                demo={demo}
                variant="dark"
                label="Select this website"
              />
              {demo.liveUrl && (
                <a
                  href={demo.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-900 px-7 py-3.5 text-[15px] font-medium text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white"
                >
                  Open live preview
                  <ArrowUpRight className="size-4" strokeWidth={2.4} />
                </a>
              )}
              <a
                href={whatsappUrl(
                  `Hi InfyCrest Solutions, I'm interested in the ${demo.name} website. I have a few questions.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-7 py-3.5 text-[15px] font-medium text-neutral-900 transition-all hover:border-neutral-900"
              >
                <MessageCircle className="size-4" strokeWidth={2.2} />
                Ask about this design
              </a>
            </div>

            <div className="mt-10 border-t border-neutral-100 pt-8">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                What&apos;s included
              </h2>
              <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {demo.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-neutral-600"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-neutral-900"
                      strokeWidth={2.6}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {demo.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            {demo.liveUrl ? (
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_32px_70px_-28px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50/90 px-3.5 py-2.5">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-neutral-300"
                  />
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-neutral-300"
                  />
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-neutral-300"
                  />
                  <span className="ml-2 flex-1 truncate rounded-md border border-neutral-200/70 bg-white px-2.5 py-1 font-mono text-[10px] text-neutral-400">
                    infycrestsolutions.com{demo.previewUrl}
                  </span>
                </div>
                <iframe
                  src={demo.liveUrl}
                  title={`${demo.name} live website preview`}
                  className="h-[680px] w-full border-0 bg-white sm:h-[760px]"
                />
              </div>
            ) : (
              <BrowserFrame
                src={demo.thumbnail}
                alt={`${demo.name} website — full homepage preview`}
                url={`infycrestsolutions.com${demo.previewUrl}`}
                priority
                sizes="(max-width: 1024px) 100vw, 54vw"
                className="shadow-[0_32px_70px_-28px_rgba(0,0,0,0.3)]"
              />
            )}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                Live concept preview
              </span>
              <span>Fully responsive · Customizable end-to-end</span>
            </div>
          </div>
        </div>

        {/* Keep exploring */}
        <div className="mt-20 border-t border-neutral-100 pt-12 sm:mt-24">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Keep exploring
            </h2>
            <Link
              href="/#collection"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 sm:inline-flex"
            >
              View the full collection
              <ArrowUpRight className="size-4" strokeWidth={2.4} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={item.previewUrl}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(0,0,0,0.25)]"
              >
                <div className="relative aspect-16/10 overflow-hidden border-b border-neutral-100">
                  <Image
                    src={item.thumbnail}
                    alt={`${item.name} website preview`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      {item.category}
                    </p>
                    <p className="mt-1 truncate text-[15px] font-semibold tracking-tight text-neutral-900">
                      {item.name}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-neutral-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900"
                    strokeWidth={2.4}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
