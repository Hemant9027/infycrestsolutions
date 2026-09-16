import Link from "next/link";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import type { ReactNode } from "react";

export default function DemoAgencyShell({ children }: { children: ReactNode }) {
  return (
    <div data-demo-template className="demo-template-shell">
      <header className="demo-agency-header">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 text-neutral-900">
            <span className="grid size-8 place-items-center rounded-lg bg-neutral-900 text-white">
              <span className="font-serif text-lg italic">I</span>
            </span>
            <span className="text-sm font-semibold tracking-[-0.02em]">
              InfyCrest Solutions
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-[13px] font-medium text-neutral-500 sm:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <LayoutGrid className="size-3.5" /> Products
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-white transition-colors hover:bg-black"
            >
              Let&apos;s build <ArrowUpRight className="size-3.5" />
            </Link>
          </nav>
          <Link
            href="/#products"
            aria-label="Back to products"
            className="grid size-9 place-items-center rounded-full border border-neutral-200 text-neutral-700 sm:hidden"
          >
            <LayoutGrid className="size-4" />
          </Link>
        </div>
      </header>
      <div className="demo-template-content">{children}</div>
    </div>
  );
}
