"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { NAV_LINKS, SITE, whatsappUrl } from "@/config/site";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      setOpen(false);

      const scrollToElement = () => {
        const id = href.slice(2);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };

      if (pathname !== "/") {
        router.push(href);
      } else {
        scrollToElement();
      }
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);

    if (pathname === "/") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return;
    }

    router.push("/", { scroll: true });
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-neutral-200/80 bg-white/85 shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-xl"
            : "border-b border-transparent bg-white",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:h-[72px] sm:px-8">
          <Link
            href="/"
            aria-label="InfyCrest Solutions — home"
            className="rounded-lg"
            onClick={handleHomeClick}
          >
            <Logo />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) =>
                  link.href === "/"
                    ? handleHomeClick(e)
                    : handleAnchorClick(e, link.href)
                }
                className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="hidden items-center gap-1.5 rounded-full border border-neutral-900 px-4.5 py-2.5 text-[13.5px] font-medium text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white sm:inline-flex"
            >
              Product
            </Link>
            <Link
              href="/#contact"
              onClick={(e) => handleAnchorClick(e, "/#contact")}
              className="hidden items-center gap-1.5 rounded-full bg-neutral-900 px-4.5 py-2.5 text-[13.5px] font-medium text-white transition-all hover:bg-black hover:shadow-[0_8px_20px_rgba(0,0,0,0.18)] sm:inline-flex"
            >
              Let&apos;s Build
              <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:border-neutral-900 lg:hidden"
            >
              {open ? (
                <X className="size-[18px]" strokeWidth={2.2} />
              ) : (
                <Menu className="size-[18px]" strokeWidth={2.2} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu sheet */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-white pt-24 transition-all duration-300 ease-out lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 pb-6">
          <ul className="divide-y divide-neutral-100">
            {NAV_LINKS.map((link, index) => (
              <li
                key={link.label}
                style={{
                  transitionDelay: open ? `${60 + index * 45}ms` : "0ms",
                }}
                className={cn(
                  "transition-all duration-500 ease-out",
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
                )}
              >
                <Link
                  href={link.href}
                  onClick={(e) => {
                    link.href === "/"
                      ? handleHomeClick(e)
                      : handleAnchorClick(e, link.href);
                  }}
                  className="group flex items-baseline justify-between py-4"
                  tabIndex={open ? 0 : -1}
                >
                  <span className="text-[26px] font-semibold tracking-tight text-neutral-900 transition-transform duration-300 group-hover:translate-x-1">
                    {link.label}
                  </span>
                  <span className="font-mono text-xs text-neutral-300">
                    0{index + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            style={{
              transitionDelay: open ? `${60 + NAV_LINKS.length * 45}ms` : "0ms",
            }}
            className={cn(
              "mt-8 space-y-3 transition-all duration-500 ease-out",
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <Link
              href="/templates"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-900 px-6 py-4 text-[15px] font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
            >
              Templates
            </Link>
            <Link
              href="/#contact"
              onClick={(e) => {
                handleAnchorClick(e, "/#contact");
              }}
              tabIndex={open ? 0 : -1}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-black"
            >
              Let&apos;s Build Together
              <ArrowUpRight className="size-4" strokeWidth={2.4} />
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={SITE.phoneHref}
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-3.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-900"
              >
                <Phone className="size-4" strokeWidth={2.2} />
                Call us
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-3.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-900"
              >
                WhatsApp
                <ArrowUpRight className="size-4" strokeWidth={2.2} />
              </a>
            </div>
            <p className="pt-2 text-center text-xs text-neutral-400">
              {SITE.email} · {SITE.phoneDisplay}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
