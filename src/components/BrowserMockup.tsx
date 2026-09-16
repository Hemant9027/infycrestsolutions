import { cn } from "@/lib/utils";

function BrowserShell({
  children,
  dark = false,
  className,
  showAddress = true,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  showAddress?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-full w-full overflow-hidden rounded-2xl border shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)]",
        dark
          ? "border-neutral-800 bg-neutral-950 text-white"
          : "border-neutral-200 bg-white text-neutral-900",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 border-b px-4 py-3",
          dark ? "border-neutral-800" : "border-neutral-100 bg-neutral-50/80",
        )}
      >
        <span className="size-2 rounded-full bg-[#f87171]" />
        <span className="size-2 rounded-full bg-[#fbbf24]" />
        <span className="size-2 rounded-full bg-[#4ade80]" />
        {showAddress && (
          <span
            aria-hidden="true"
            className={cn(
              "ml-2 h-5 flex-1 rounded-full px-4 text-center font-mono text-[8px] leading-5",
              dark
                ? "bg-neutral-800 text-neutral-500"
                : "border border-neutral-200 bg-white text-neutral-400",
            )}
          />
        )}
      </div>
      <div className="w-full aspect-[3/2] p-5 sm:p-6">{children}</div>
    </div>
  );
}

function Lines({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-2">
      <span
        className={cn(
          "block h-2 w-3/4 rounded-full",
          dark ? "bg-neutral-300" : "bg-neutral-800",
        )}
      />
      <span
        className={cn(
          "block h-2 w-1/2 rounded-full",
          dark ? "bg-neutral-400" : "bg-neutral-800",
        )}
      />
      <span
        className={cn(
          "block h-1.5 w-2/3 rounded-full",
          dark ? "bg-neutral-600" : "bg-neutral-300",
        )}
      />
    </div>
  );
}

export function MockLanding({ className }: { className?: string }) {
  return (
    <BrowserShell className={className}>
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <span className="h-2 w-8 rounded-full bg-neutral-900" />
        <div className="w-full max-w-[220px] space-y-2 text-center">
          <span className="mx-auto block h-3 w-3/4 rounded-full bg-neutral-900" />
          <span className="mx-auto block h-2 w-1/2 rounded-full bg-neutral-700" />
        </div>
        <div className="flex gap-2">
          <span className="h-8 w-16 rounded-full bg-neutral-900" />
          <span className="h-8 w-16 rounded-full border border-neutral-300" />
        </div>
        <div className="grid w-full grid-cols-3 gap-2">
          <span className="h-14 rounded-xl bg-neutral-100" />
          <span className="h-14 rounded-xl bg-neutral-200" />
          <span className="h-14 rounded-xl bg-neutral-100" />
        </div>
      </div>
    </BrowserShell>
  );
}

export function MockEditorial({ className }: { className?: string }) {
  return (
    <BrowserShell className={cn("bg-[#f6f2ec]", className)}>
      <div className="flex h-full flex-col justify-between bg-[#f6f2ec] py-2">
        <div className="flex items-center justify-between">
          <span className="h-2 w-12 rounded-full bg-neutral-800" />
          <div className="flex gap-2">
            <span className="h-2 w-8 rounded-full bg-neutral-400" />
            <span className="h-2 w-5 rounded-full bg-neutral-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Lines />
          <div className="mt-5 grid grid-cols-[1.2fr_0.8fr] gap-3">
            <span className="h-20 rounded-xl bg-neutral-200" />
            <div className="space-y-2 pt-2">
              <span className="block h-2 rounded-full bg-neutral-400" />
              <span className="block h-2 w-3/4 rounded-full bg-neutral-300" />
              <span className="block h-7 w-14 rounded-full bg-neutral-800" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t border-neutral-300 pt-3">
          <span className="h-1.5 w-8 rounded-full bg-neutral-400" />
          <span className="h-1.5 w-8 rounded-full bg-neutral-400" />
          <span className="h-1.5 w-8 rounded-full bg-neutral-400" />
        </div>
      </div>
    </BrowserShell>
  );
}

export function MockDark({ className }: { className?: string }) {
  return (
    <BrowserShell dark className={className}>
      <div className="flex h-full flex-col justify-between py-2">
        <div className="flex items-center justify-between">
          <span className="h-2 w-12 rounded-full bg-neutral-500" />
          <span className="h-6 w-12 rounded-full bg-white" />
        </div>
        <div className="space-y-3">
          <Lines dark />
          <div className="flex gap-2">
            <span className="h-6 w-16 rounded-full bg-white" />
            <span className="h-6 w-16 rounded-full border border-neutral-700" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((item) => (
            <span
              key={item}
              className="h-12 rounded-xl border border-neutral-800 bg-neutral-900"
            />
          ))}
        </div>
      </div>
    </BrowserShell>
  );
}

export function MockDashboard({ className }: { className?: string }) {
  return (
    <BrowserShell dark className={className}>
      <div className="flex h-full gap-4 py-1">
        <aside className="hidden w-1/4 space-y-3 border-r border-neutral-800 pr-3 sm:block">
          <span className="block h-3 w-3/4 rounded bg-neutral-300" />
          {[1, 2, 3, 4].map((item) => (
            <span key={item} className="block h-2 rounded bg-neutral-700" />
          ))}
        </aside>
        <main className="flex-1 space-y-4">
          <div className="flex justify-between">
            <span className="h-3 w-1/3 rounded bg-neutral-200" />
            <span className="size-5 rounded-full bg-emerald-400" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <span key={item} className="h-12 rounded-lg bg-neutral-800" />
            ))}
          </div>
          <span className="block h-24 rounded-lg bg-neutral-800" />
        </main>
      </div>
    </BrowserShell>
  );
}

export function MockCommerce({ className }: { className?: string }) {
  return (
    <div className="h-full w-full [perspective:1200px]">
      <BrowserShell
        className={cn(
          "bg-[#f4f1ec] shadow-[0_34px_70px_-34px_rgb(35_31_27/0.4)] [transform:rotateY(-2deg)_rotateX(1deg)]",
          className,
        )}
        showAddress={false}
      >
        <div className="flex h-full flex-col bg-[#f4f1ec] px-1 py-1 text-[#282521]">
          <div className="flex items-center justify-between border-b border-[#282521]/15 pb-3">
            <span className="h-2 w-16 rounded-full bg-[#282521]" />
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-8 rounded-full bg-[#282521]/35" />
              <span className="h-1.5 w-8 rounded-full bg-[#282521]/35" />
              <span className="size-4 rounded-full border border-[#282521]/40" />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between py-5">
            <div className="grid grid-cols-[1fr_auto] items-end gap-5">
              <div className="space-y-2">
                <span className="block h-3 w-3/4 rounded-full bg-[#282521]" />
                <span className="block h-2 w-1/2 rounded-full bg-[#282521]/45" />
              </div>
              <span className="h-8 w-20 rounded-full border border-[#282521]/35" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["bg-[#d9d1c5]", "bg-[#c8c0b4]", "bg-[#ded8cf]"].map((tone) => (
                <div key={tone} className="space-y-2">
                  <div className={`aspect-[4/5] rounded-sm ${tone}`} />
                  <span className="block h-1.5 w-3/4 rounded-full bg-[#282521]/55" />
                  <span className="block h-1.5 w-1/2 rounded-full bg-[#282521]/25" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-[#282521]/15 pt-3">
              <span className="h-1.5 w-24 rounded-full bg-[#282521]/35" />
              <span className="h-1.5 w-14 rounded-full bg-[#282521]/55" />
            </div>
          </div>
        </div>
      </BrowserShell>
    </div>
  );
}
