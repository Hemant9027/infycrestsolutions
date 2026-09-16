import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { SITE, whatsappUrl } from "@/config/site";
import ContactForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";

export default function FinalCTA() {
  return (
    <section id="contact" className="scroll-mt-24 pb-20 pt-2 sm:pb-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden bg-white px-2 py-16 text-center sm:px-12 sm:py-24">
            {/* Quiet top glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-neutral-100/60 blur-3xl"
            />

            <div className="relative mx-auto max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400 sm:text-xs">
                Let&apos;s talk / 2026
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,5.2vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
                Have a project in mind?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-neutral-500 sm:text-base">
                Tell us what you&apos;re building. We&apos;ll recommend the
                right solution and give you a clear estimate.
              </p>

              <div className="mx-auto mt-10 max-w-md">
                <ContactForm />
              </div>

              <div className="mt-8 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-neutral-200"
                />
                or reach out directly
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-neutral-200"
                />
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappUrl(
                    "Hi InfyCrest Solutions, I'd like a free consultation about my project.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-7 py-3.5 text-[15px] font-medium text-neutral-900 transition-colors hover:border-neutral-900"
                >
                  WhatsApp
                  <ArrowUpRight className="size-4" strokeWidth={2.4} />
                </a>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-7 py-3.5 text-[15px] font-medium text-neutral-900 transition-colors hover:border-neutral-900"
                >
                  <Phone className="size-4" strokeWidth={2.2} />
                  Call
                </a>
                <a
                  href={SITE.emailHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-7 py-3.5 text-[15px] font-medium text-neutral-900 transition-colors hover:border-neutral-900"
                >
                  <Mail className="size-4" strokeWidth={2.2} />
                  Email
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
