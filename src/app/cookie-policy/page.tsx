import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cookie Policy",
  description: "How InfyCrest Solutions uses cookies and browser storage.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.3em] text-neutral-400">
          Privacy / 2026
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
          Cookie Policy
        </h1>
        <p className="mt-6 text-base leading-relaxed text-neutral-500">
          InfyCrest Solutions uses a small amount of browser storage to remember
          your cookie preferences. This helps us avoid showing the consent
          banner again after you make a choice.
        </p>
        <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-neutral-600">
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">
              What we use
            </h2>
            <p className="mt-3">
              The site stores your selected cookie preferences in your browser
              under{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm text-neutral-800">
                infycrest_cookie_consent
              </code>
              . It contains only your category choices, a policy version, and
              the time the choice was saved.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">
              Necessary storage
            </h2>
            <p className="mt-3">
              Necessary browser storage supports the consent experience and
              basic site functionality. It cannot be disabled through the
              preferences panel.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">
              Optional categories
            </h2>
            <p className="mt-3">
              Functional, analytics, and marketing cookies are not currently
              used by this website. We do not load Google Analytics, advertising
              pixels, or other tracking scripts.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">
              Manage your choice
            </h2>
            <p className="mt-3">
              You can reopen Cookie Settings at any time from the website footer
              and update your preferences.
            </p>
          </section>
        </div>
        <Link
          href="/"
          className="mt-12 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
