import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCatalogSwitcher from "@/components/ProjectCatalogSwitcher";

export const metadata: Metadata = {
  title: "Our Products | InfyCrest Solutions",
  description:
    "Explore our real-world products and projects built for ambitious businesses.",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="scroll-mt-28 bg-neutral-50 pb-8 pt-28 sm:pb-10 sm:pt-32">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="mb-8">
              <h1 className="text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
                Ideas for your{" "}
                <em className="font-display font-normal italic">
                  next project
                </em>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-neutral-500">
                Explore creative concepts, experimental builds, and real-world
                projects we&apos;ve delivered for businesses.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-neutral-50">
          <ProjectCatalogSwitcher />
        </section>
      </main>
      <Footer />
    </>
  );
}
