import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/config/site";
import { getPublishedJobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join InfyCrest Solutions and help build digital experiences that move real businesses forward.",
};

const values = [
  {
    icon: Sparkles,
    title: "Build with intention",
    description:
      "We care about quality, clarity, and outcomes — not vanity metrics or bloated processes.",
  },
  {
    icon: Users,
    title: "Work as a team",
    description:
      "Good work grows when people are trusted, challenged, and supported in the same room.",
  },
  {
    icon: Clock3,
    title: "Move quickly",
    description:
      "We ship meaningful work fast, keep feedback loops tight, and iterate with purpose.",
  },
];

const process = [
  "Share your profile and motivation",
  "Intro call with the team",
  "Practical work sample or case review",
  "Final conversation and offer",
];

export default async function CareersPage() {
  const jobs = await getPublishedJobs();

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#fafaf9] pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                InfyCrest / Careers
              </p>
              <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-7xl lg:text-[clamp(4rem,7vw,6.8rem)]">
                Build better digital work with us.
              </h1>
            </div>
            <div className="lg:pb-2">
              <p className="max-w-md text-base leading-7 text-neutral-600 sm:text-lg">
                We’re building a small, sharp team that loves designing and
                shipping thoughtful websites, software and automation for
                ambitious businesses.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="mailto:hemant@infycrestsolutions.com?subject=Career%20Application"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Apply now
                  <ArrowRight className="size-4" strokeWidth={2.2} />
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                >
                  Talk to the team
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { value: "50+", label: "Projects delivered" },
              { value: "Remote-first", label: "Flexible and collaborative" },
              { value: "India-wide", label: "Client reach" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.02)]"
              >
                <div className="text-4xl font-semibold tracking-[-0.06em] text-neutral-900">
                  {stat.value}
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              Why join us
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-neutral-900 sm:text-5xl">
              A team that values clarity, craft, and momentum.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <div className="mb-5 inline-flex rounded-full border border-neutral-200 bg-white p-3 text-neutral-900">
                  <Icon className="size-5" strokeWidth={2.2} />
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.04em] text-neutral-900">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-neutral-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                Open roles
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                Build the next chapter of digital growth.
              </h2>
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-neutral-300">
                No roles are open right now. Check back soon or reach out
                directly.
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-3">
                {jobs.map((job) => (
                  <article
                    key={job.id}
                    className="rounded-3xl border border-white/10 bg-white/3 p-6"
                  >
                    <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-300">
                      {job.type}
                    </div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                      {job.title}
                    </h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-neutral-300">
                      <MapPin className="size-4" strokeWidth={2.2} />
                      {job.location}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-neutral-300 whitespace-pre-line">
                      {job.description}
                    </p>
                    <a
                      href="mailto:hemant@infycrestsolutions.com?subject=Career%20Application"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-neutral-300"
                    >
                      Apply now
                      <ArrowRight className="size-4" strokeWidth={2.2} />
                    </a>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              Hiring process
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-neutral-900 sm:text-5xl">
              Simple, respectful, and designed to learn your strengths.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {process.map((step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-neutral-200 bg-white p-6"
              >
                <div className="mb-4 inline-flex size-9 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-neutral-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-neutral-200 bg-[#f5f5f4] px-6 py-14 text-center sm:px-8">
            <div className="mx-auto inline-flex rounded-full border border-neutral-200 bg-white p-3 text-neutral-900">
              <BriefcaseBusiness className="size-5" strokeWidth={2.2} />
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-neutral-900 sm:text-5xl">
              Ready to build something meaningful?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-600">
              We’re always interested in hearing from people who care about
              craft, teamwork, and creating digital experiences that help
              businesses grow.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${SITE.email}?subject=Career%20Application`}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Send your profile
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
              >
                Explore the work
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
