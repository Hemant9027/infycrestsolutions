import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { whatsappUrl } from "@/config/site";
import Reveal from "@/components/Reveal";

export default function FinalCTA() {
  return (
    <section id="contact" className="scroll-mt-24 pb-20 pt-2 sm:pb-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] border border-neutral-200 bg-neutral-50 px-6 py-16 text-center sm:px-12 sm:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-neutral-200/60 blur-3xl"
            />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-600 sm:text-xs">
                Start a conversation
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,5.2vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
                Ready to Improve Your Digital Presence?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-neutral-500 sm:text-base">
                Tell us what you&apos;re trying to improve. We&apos;ll recommend
                a practical digital solution based on your business and goals.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-black"
                >
                  Request a Free Concept
                  <ArrowUpRight className="size-4" strokeWidth={2.4} />
                </Link>
                <a
                  href={whatsappUrl(
                    "Hi InfyCrest Solutions, I'd like to discuss improving my digital presence.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-[15px] font-medium text-neutral-900 transition-colors hover:border-neutral-900"
                >
                  Talk on WhatsApp
                  <ArrowUpRight className="size-4" strokeWidth={2.4} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
