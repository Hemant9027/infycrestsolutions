import { Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import {
  QUICK_LINKS,
  RESOURCE_LINKS,
  SITE,
  SOCIAL_LINKS,
  whatsappUrl,
} from "@/config/site";

const SOCIAL_URLS: Record<string, string> = {
  Facebook: "https://facebook.com/infycrestsolutions",
  Instagram: "https://instagram.com/infycrestsolutions",
  YouTube: "https://youtube.com/@infycrestsolutions",
};

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-neutral-400 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Link
              href="#top"
              aria-label="InfyCrest Solutions home"
              className="inline-flex rounded-lg bg-white p-1"
            >
              <Logo />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-500">
              Websites, automations and software designed to make your business
              look exceptional, built fast and launched with care.
            </p>
            <div className="mt-6 flex gap-2.5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={SOCIAL_URLS[social.label] ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid size-10 place-items-center rounded-full border border-white/10 text-xs font-semibold text-neutral-400 transition-all hover:border-white hover:bg-white hover:text-neutral-900"
                >
                  {social.label.slice(0, 1)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.24em] text-neutral-600">
              Resources
            </p>
            <ul className="mt-5 space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.url}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.24em] text-neutral-600">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.24em] text-neutral-600">
              Contact
            </p>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="group flex items-center gap-2.5 text-neutral-400 transition-colors hover:text-white"
                >
                  <Phone className="size-4 text-neutral-600 group-hover:text-white" />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-neutral-400 transition-colors hover:text-white"
                >
                  <MessageCircle className="size-4 text-[#25d366]" />
                  WhatsApp - chat with us
                </a>
              </li>
              <li>
                <a
                  href={SITE.emailHref}
                  className="group flex items-center gap-2.5 break-all text-neutral-400 transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-neutral-600 group-hover:text-white" />
                  {SITE.email}
                </a>
              </li>
            </ul>
            <p className="mt-5 text-xs text-neutral-600">
              Mon-Sat - 10:00-20:00 IST - Remote-first, across India
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 sm:flex-row">
          <p className="text-[13px] text-neutral-500">
            (c) {SITE.year} InfyCrest Solutions. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-end">
            <CookieSettingsButton />
            <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-neutral-600">
              Websites - Automation - SaaS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
