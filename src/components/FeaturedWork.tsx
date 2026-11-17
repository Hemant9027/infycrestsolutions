"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import Reveal, { Eyebrow } from "./Reveal";

export default function FeaturedWork() {
  const [projects, setProjects] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?projectType=real-world")
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed to fetch projects: ${response.status}`);
        return response.json();
      })
      .then((data: Product[]) => setProjects(data.slice(0, 3)))
      .catch((error: unknown) =>
        console.error("Error fetching featured projects:", error),
      );
  }, []);

  return (
    <section id="demos" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Eyebrow>01 / Featured Work</Eyebrow>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Real-world projects, built around real business goals.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-lg text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              A look at three projects delivered for businesses across different
              industries, each shaped around its audience and goals.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {projects.map((item, i) => {
            const isSocialMediaProject = i === 2;
            const projectName = isSocialMediaProject
              ? "Social Media Handling"
              : item.name;
            const projectCategory = isSocialMediaProject
              ? "Social Media"
              : item.category;
            const projectDescription = isSocialMediaProject
              ? "Social media handling to build a consistent and engaging online presence."
              : item.shortDescription;
            const projectImage = isSocialMediaProject
              ? "/Featured-Work-5.webp"
              : item.imageUrl;
            const projectUrl = isSocialMediaProject
              ? "https://www.instagram.com/th.jayant_rana/"
              : `/work/${item.slug}`;

            return (
              <Reveal
                key={item.slug}
                delay={i * 130}
                className={i === 1 ? "md:translate-y-8" : ""}
              >
                <article className="group h-full rounded-[28px] border border-neutral-200 bg-white p-3 shadow-[0_24px_60px_-35px_rgba(10,10,10,0.28)] transition-transform duration-300 hover:-translate-y-1">
                <Link
                  href={projectUrl}
                  aria-label={`View ${projectName} project`}
                  target={isSocialMediaProject ? "_blank" : undefined}
                  rel={isSocialMediaProject ? "noreferrer" : undefined}
                  className="block rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-4"
                >
                  <div className="relative aspect-video overflow-hidden rounded-[22px] bg-neutral-100">
                    <Image
                      src={projectImage}
                      alt={`${projectName} project preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </Link>

                <div className="mt-5 px-1">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-neutral-500">
                    {projectCategory}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <h3 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-neutral-900">
                      {projectName}
                    </h3>
                    <Link
                      href={projectUrl}
                      aria-label={`View ${projectName} project`}
                      target={isSocialMediaProject ? "_blank" : undefined}
                      rel={isSocialMediaProject ? "noreferrer" : undefined}
                      className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                    >
                      <ArrowUpRight className="size-4 shrink-0 text-neutral-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900" />
                    </Link>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-neutral-600">
                    {projectDescription}
                  </p>
                  {item.features.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.features.slice(0, 3).map((feature) => (
                        <li
                          key={feature}
                          className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
