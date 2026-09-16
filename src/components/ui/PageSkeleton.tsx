type PageSkeletonProps = {
  kind?: "listing" | "article" | "detail";
};

function Block({ className = "" }: { className?: string }) {
  return <div className={`skeleton-block ${className}`} aria-hidden="true" />;
}

export default function PageSkeleton({ kind = "listing" }: PageSkeletonProps) {
  if (kind === "article") {
    return (
      <main
        className="mx-auto max-w-4xl px-5 pb-24 pt-32 sm:px-8"
        aria-busy="true"
        aria-label="Loading article"
      >
        <Block className="h-3 w-28" />
        <Block className="mt-6 h-14 w-full max-w-3xl" />
        <Block className="mt-3 h-14 w-4/5 max-w-2xl" />
        <Block className="mt-8 h-5 w-56" />
        <Block className="mt-12 aspect-[16/8] w-full rounded-3xl" />
        <div className="mx-auto mt-14 max-w-2xl space-y-4">
          <Block className="h-4 w-full" />
          <Block className="h-4 w-11/12" />
          <Block className="h-4 w-4/5" />
          <Block className="mt-10 h-8 w-2/5" />
          <Block className="h-4 w-full" />
          <Block className="h-4 w-10/12" />
        </div>
      </main>
    );
  }

  if (kind === "detail") {
    return (
      <main
        className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8"
        aria-busy="true"
        aria-label="Loading page"
      >
        <Block className="h-3 w-32" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Block className="h-12 w-full max-w-xl" />
            <Block className="mt-3 h-12 w-4/5" />
            <Block className="mt-7 h-5 w-full max-w-lg" />
            <Block className="mt-3 h-5 w-10/12 max-w-lg" />
            <Block className="mt-8 h-12 w-48 rounded-full" />
          </div>
          <Block className="aspect-[16/10] w-full rounded-3xl" />
        </div>
        <div className="mt-20 grid gap-5 md:grid-cols-3">
          <Block className="h-40 rounded-2xl" />
          <Block className="h-40 rounded-2xl" />
          <Block className="h-40 rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main
      className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8"
      aria-busy="true"
      aria-label="Loading page"
    >
      <Block className="h-3 w-28" />
      <Block className="mt-6 h-14 w-full max-w-3xl" />
      <Block className="mt-4 h-5 w-full max-w-xl" />
      <Block className="mt-12 h-12 w-full rounded-2xl" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            <Block className="aspect-[16/10] w-full" />
            <div className="space-y-3 p-5">
              <Block className="h-3 w-24" />
              <Block className="h-6 w-4/5" />
              <Block className="h-4 w-full" />
              <Block className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
