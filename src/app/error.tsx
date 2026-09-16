"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[60vh] place-items-center bg-[#fafaf9] px-5 py-24 text-center">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
          InfyCrest / Something went wrong
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-900">
          This page could not finish loading.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-500">
          Please try the request again. Your information has not been submitted.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
