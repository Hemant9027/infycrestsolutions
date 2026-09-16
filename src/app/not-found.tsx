import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-[1200px] flex-col items-center justify-center px-5 pt-24 text-center sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
          404 / Not found
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          This page went off-script.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist — but the
          collection of live website concepts does.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
        >
          <ArrowLeft className="size-4" strokeWidth={2.4} />
          Back to homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
