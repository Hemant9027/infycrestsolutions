import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ProductDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="bg-[#fafaf9] text-neutral-900">
        <section className="mx-auto max-w-6xl px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:px-10">
          <div className="h-4 w-28 animate-pulse rounded-full bg-neutral-200" />
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="space-y-5">
              <div className="h-4 w-40 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-16 w-full max-w-xl animate-pulse rounded-2xl bg-neutral-200" />
              <div className="h-5 w-56 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-24 w-full max-w-xl animate-pulse rounded-2xl bg-neutral-200" />
              <div className="flex gap-3">
                <div className="h-12 w-40 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-12 w-32 animate-pulse rounded-full bg-neutral-200" />
              </div>
            </div>
            <div className="rounded-[28px] border border-neutral-200 bg-white p-2 shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
              <LoadingScreen
                label="Loading project"
                compact
                className="!min-h-[260px] !w-full"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-white/70">
          <div className="mx-auto grid max-w-6xl gap-4 px-5 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-6 lg:px-10">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-20 animate-pulse rounded-2xl bg-neutral-200"
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="h-10 w-64 animate-pulse rounded-full bg-neutral-200" />
          <div className="mt-6 space-y-3">
            <div className="h-5 w-full animate-pulse rounded-full bg-neutral-200" />
            <div className="h-5 w-full animate-pulse rounded-full bg-neutral-200" />
            <div className="h-5 w-4/5 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
