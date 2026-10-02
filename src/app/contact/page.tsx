import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/NewsletterForm";
import { SITE, whatsappUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact | Start a Project",
  description:
    "Talk to InfyCrest Solutions about your website, software, automation or digital product project.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#fafaf9] pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="pointer-events-none absolute -right-40 top-24 size-[32rem] rounded-full bg-white blur-3xl" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
            <div className="lg:pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                InfyCrest / Contact
              </p>
              <h1 className="mt-6 max-w-2xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-7xl lg:text-[clamp(4rem,6.5vw,6.8rem)]">
                Let&apos;s make your next move useful.
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-neutral-500 sm:text-lg">
                Tell us what you&apos;re building, fixing or trying to improve.
                We&apos;ll come back with a practical next step and a clear
                estimate.
              </p>

              <div className="mt-10 space-y-5 border-t border-neutral-200 pt-7 text-sm">
                <a
                  href={whatsappUrl(
                    "Hi InfyCrest Solutions, I'd like to discuss a project.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-neutral-700 transition-colors hover:text-neutral-950"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-[#25d366] text-white">
                    <MessageCircle className="size-4" fill="currentColor" />
                  </span>
                  <span>
                    <span className="block font-semibold text-neutral-900">
                      WhatsApp
                    </span>
                    <span className="text-neutral-500">
                      Usually the fastest reply
                    </span>
                  </span>
                  <ArrowUpRight className="ml-auto size-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href={SITE.emailHref}
                  className="group flex items-center gap-3 text-neutral-700 transition-colors hover:text-neutral-950"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700">
                    <Mail className="size-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-neutral-900">
                      Email
                    </span>
                    <span className="text-neutral-500">{SITE.email}</span>
                  </span>
                  <ArrowUpRight className="ml-auto size-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href={SITE.phoneHref}
                  className="group flex items-center gap-3 text-neutral-700 transition-colors hover:text-neutral-950"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700">
                    <Phone className="size-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-neutral-900">
                      Call
                    </span>
                    <span className="text-neutral-500">
                      {SITE.phoneDisplay}
                    </span>
                  </span>
                  <ArrowUpRight className="ml-auto size-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <div className="group flex items-start gap-3 text-neutral-700">
                  <span className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700">
                    <MapPin className="size-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-neutral-900">
                      India Office
                    </span>
                    <span className="text-neutral-500 whitespace-pre-line">
                      {SITE.indiaOfficeAddress}
                    </span>
                  </span>
                </div>
                <div className="group flex items-start gap-3 text-neutral-700">
                  <span className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700">
                    <MapPin className="size-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-neutral-900">
                      USA Office
                    </span>
                    <span className="text-neutral-500 whitespace-pre-line">
                      {SITE.usaOfficeAddress}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-neutral-200 bg-white p-5 shadow-[0_24px_70px_-45px_rgb(10_10_10/0.35)] sm:p-10">
              <div className="mb-8 border-b border-neutral-100 pb-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                  Start here
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                  Tell us about the project.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
                  A few details are enough. We&apos;ll respond within 12 hours.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
