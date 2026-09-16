"use client";

import React, {
  useEffect,
  useId,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type FormEvent,
  type CSSProperties,
} from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Check,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Martini,
  Phone,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

export type CustomerHero = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCta?: string;
};
export type CustomerAbout = {
  title?: string;
  body?: string;
};
export type CustomerStat = {
  value: string;
  label: string;
};
export type CustomerService = {
  title: string;
  description: string;
  price?: string;
  tag?: string;
  image?: string | null;
};
export type CustomerGalleryItem = {
  image: string;
  caption?: string;
};
export type CustomerContact = {
  address?: string;
  hours?: string;
  phone?: string;
  email?: string;
};
export type CustomerTheme = {
  accent?: string;
};
export type CustomerCTA = {
  label?: string;
};
export type NewCustomer = {
  id?: string | number;
  slug?: string;
  businessName: string;
  hero: CustomerHero;
  about: CustomerAbout;
  CTA: CustomerCTA;
  theme: CustomerTheme;
  contact: CustomerContact;
  heroImages?: string[];
  stats?: CustomerStat[];
  services?: CustomerService[];
  gallery?: CustomerGalleryItem[];
};

export const pubImg = (num: number) => `/Pub-Cocktail/${num}.jpg`;

const localPubImg = (value: unknown, fallback: number) =>
  typeof value === "string" && /^\/Pub-Cocktail\/\d+\.jpg$/.test(value)
    ? value
    : pubImg(fallback);

export const demoNewCustomer: NewCustomer = {
  slug: "the-velvet-hour",
  businessName: "The Velvet Hour",
  theme: { accent: "#ef9c68" },
  CTA: { label: "Reserve a table" },
  hero: {
    eyebrow: "Late-night cocktails · Vinyl only · Low light",
    title: "Pour the night slow.",
    description:
      "A low-lit room of rare bottles, hand-cut ice and records played loud enough to feel. Come for one — stay for the B-side.",
    primaryCta: "Plan your night",
  },
  heroImages: [pubImg(1), pubImg(3), pubImg(7), pubImg(12)],
  about: {
    title: "Low light, loud records, honest pours.",
    body: "The Velvet Hour is a listening bar for people who take their drinks slowly. Every bottle on the back shelf earned its place, every record is played start to finish, and the lights never come up before you're ready. Find the green door on Lantern Street, follow the bass line, and ask the bar what's off-menu tonight.",
  },
  stats: [
    { value: "120+", label: "Rare bottles" },
    { value: "9", label: "Years behind the bar" },
    { value: "2am", label: "Last record spins" },
  ],
  services: [
    {
      title: "Smoked Cherry Negroni",
      description:
        "House campari blend, mezcal, sweet vermouth, cherrywood smoke trapped under glass.",
      price: "17",
      tag: "House icon",
      image: pubImg(2),
    },
    {
      title: "Salted Espresso Martini",
      description:
        "Cold-brew liqueur, small-batch vodka, a fresh pull and a whisper of sea salt.",
      price: "16",
      tag: "After dinner",
      image: pubImg(4),
    },
    {
      title: "Yuzu Highball",
      description:
        "Japanese whisky, fresh yuzu, charged soda and one hand-carved column of ice.",
      price: "15",
      tag: "Bright",
      image: pubImg(8),
    },
    {
      title: "Afterglow Old Fashioned",
      description:
        "Brown-butter washed bourbon, demerara, angostura and a flamed orange coin.",
      price: "18",
      tag: "Slow sipper",
      image: pubImg(14),
    },
    {
      title: "Phonograph Martini",
      description:
        "Fig-leaf gin, fino sherry and an olive-brine mist, served in a frozen coupe.",
      price: "18",
      tag: "Bartender's pick",
      image: pubImg(9),
    },
    {
      title: "Velvet Sour",
      description:
        "Rye, amaro, black lemon and velvet falernum under a slow-set egg-white cloud.",
      price: "16",
      tag: "Silky",
      image: pubImg(6),
    },
  ],
  gallery: [
    { image: pubImg(2), caption: "Smoked, never rushed" },
    { image: pubImg(4), caption: "The salted crema" },
    { image: pubImg(6), caption: "Vinyl only, always" },
    { image: pubImg(8), caption: "Highball hour" },
    { image: pubImg(9), caption: "Tools of the trade" },
    { image: pubImg(14), caption: "The Afterglow" },
  ],
  contact: {
    address: "47 Lantern Street, Shoreditch, London E2 7DA",
    hours: "Tue — Sun — 6 PM till 2 AM",
    phone: "+44 20 7946 0821",
    email: "hello@thevelvethour.bar",
  },
};

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.18,
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

export function useCountUp(target: number, active: boolean, duration = 1700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || target <= 0) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

export function useParallax(strength = 0.08) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const delta =
        (rect.top + rect.height / 2 - window.innerHeight / 2) * strength;
      el.style.transform = `translate3d(0, ${delta.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}

/* -------------------------------------------------------------------------- */
/*                                SHARED ATOMS                                */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cx("reveal", inView && "is-visible", className)}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  index,
  label,
  tone = "dark",
  className,
}: {
  index: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cx(
        "flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.35em]",
        tone === "dark" ? "text-(--brand-accent)" : "text-[#a05c35]",
        className,
      )}
    >
      <span
        className={cx(
          "h-px w-10",
          tone === "dark" ? "bg-(--brand-accent)/60" : "bg-[#a05c35]/50",
        )}
      />
      <span>{index}</span>
      <span className="opacity-50">—</span>
      <span>{label}</span>
    </p>
  );
}

export function SpinBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={cx("relative grid place-items-center", className)}>
      <svg
        viewBox="0 0 120 120"
        className="size-full animate-[spin_18s_linear_infinite]"
        aria-hidden="true"
      >
        <defs>
          <path
            id={`badge-circle-${id}`}
            d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
            fill="none"
          />
        </defs>
        <text
          className="fill-current text-[8.5px] font-medium uppercase"
          style={{ letterSpacing: "3.2px" }}
        >
          <textPath href={`#badge-circle-${id}`}>{label}</textPath>
        </text>
      </svg>
      <Asterisk className="absolute size-5 text-(--brand-accent)" />
    </div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  const [ref, inView] = useInView();
  const match = /^(\d+)(.*)$/.exec(value.trim());
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match?.[2] ?? "";
  const counted = useCountUp(target, inView && !!match);

  return (
    <div ref={ref}>
      <p className="mb-2 font-serif text-3xl font-light text-[#f7eee4] sm:text-4xl">
        {match ? `${counted}${suffix}` : value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.25em] text-(--brand-accent)">
        {label}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: "#story", label: "The Room", index: "01" },
  { href: "#menu", label: "Menu", index: "02" },
  { href: "#gallery", label: "Gallery", index: "03" },
];

export function Navbar({
  customer,
  scrolled,
}: {
  customer: NewCustomer;
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          scrolled
            ? "border-b border-white/5 bg-[#181315]/85 py-3 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-6",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#top" className="group flex items-baseline gap-2">
            <Asterisk className="size-4 translate-y-px text-(--brand-accent) transition-transform duration-700 group-hover:rotate-180" />
            <span className="font-serif text-xl uppercase tracking-[0.22em] text-[#f7eee4]">
              {customer.businessName}
            </span>
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[10px] uppercase tracking-[0.3em] text-[#f7eee4]/65 transition-colors hover:text-[#f7eee4]"
              >
                <sup className="mr-1.5 text-[8px] text-(--brand-accent)/80">
                  {link.index}
                </sup>
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-(--brand-accent) transition-all duration-500 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          <a
            href="#reserve"
            className="hidden items-center gap-2 rounded-full border border-(--brand-accent) px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] text-(--brand-accent) transition-all duration-300 hover:bg-(--brand-accent) hover:text-[#181315] md:inline-flex"
          >
            {text(customer.CTA?.label, "Reserve")}
            <ArrowUpRight className="size-3.5" />
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-(--brand-accent) hover:text-(--brand-accent) md:hidden"
          >
            {open ? <X className="size-4" /> : <MenuIcon className="size-4" />}
          </button>
        </div>

        {/* Scroll progress */}
        <span
          className="absolute bottom-0 left-0 block h-px bg-(--brand-accent) transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={cx(
          "fixed inset-0 z-40 flex flex-col justify-between bg-[#141012] px-6 pb-10 pt-28 transition-all duration-500 md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex flex-col gap-2">
          {[
            ...NAV_LINKS,
            { href: "#reserve", label: "Reservations", index: "04" },
          ].map((link, i) => (
            <div key={link.href} className="overflow-hidden">
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
                className={cx(
                  "flex items-baseline gap-4 border-b border-white/5 py-5 font-serif text-4xl font-light text-[#f7eee4] transition-all duration-700 ease-out",
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0",
                  link.href === "#reserve" && "text-(--brand-accent)",
                )}
              >
                <span className="text-xs tracking-[0.3em] text-(--brand-accent)/70">
                  {link.index}
                </span>
                {link.label}
              </a>
            </div>
          ))}
        </nav>

        <div
          style={{ transitionDelay: open ? "480ms" : "0ms" }}
          className={cx(
            "space-y-2 text-[11px] uppercase tracking-[0.25em] text-white/40 transition-all duration-700",
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <p>{text(customer.contact?.address, "")}</p>
          <p>{text(customer.contact?.hours, "")}</p>
          <p className="text-(--brand-accent)">
            {text(customer.contact?.phone, "")}
          </p>
        </div>
      </div>
    </>
  );
}

const FALLBACK_SLIDES = [pubImg(1), pubImg(3), pubImg(7), pubImg(12)];
const SLIDE_NAMES = ["The Bar", "The Room", "The Toast", "Last Call"];
const HERO_DURATION = 6000;

export function Hero({ customer }: { customer: NewCustomer }) {
  const slides = FALLBACK_SLIDES;

  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      HERO_DURATION,
    );
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    start();
    return () => {
      clearTimeout(t);
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const go = (index: number) => {
    setCurrent(index);
    start();
  };

  const title = text(customer.hero?.title, customer.businessName);
  const words = title.split(" ").filter(Boolean);
  const head =
    words.length > 2
      ? words.slice(0, -2).join(" ")
      : words.slice(0, -1).join(" ");
  const tail =
    words.length > 2 ? words.slice(-2).join(" ") : words.slice(-1).join(" ");
  const city = text(customer.contact?.address, "").split(",").pop()?.trim();

  return (
    <section
      id="top"
      className="relative flex h-svh min-h-[720px] items-end overflow-hidden"
    >
      {slides.map((img, idx) => (
        <div
          key={`${img}-${idx}`}
          className={cx(
            "absolute inset-0 transition-opacity ease-in-out duration-1800",
            idx === current ? "opacity-100" : "opacity-0",
          )}
        >
          <div
            key={current}
            className={cx(
              "absolute inset-0",
              idx === current && "animate-kenburns",
            )}
          >
            <Image
              src={img}
              alt="Bar atmosphere"
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      ))}

      <div className="absolute inset-0 z-10 bg-linear-to-t from-[#181315] via-[#181315]/40 to-[#181315]/10" />
      <div className="absolute inset-0 z-10 bg-linear-to-r from-[#181315]/70 via-transparent to-transparent" />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 10%, transparent 55%, rgba(14,10,11,0.55) 100%)",
        }}
      />

      <p className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 text-[10px] uppercase tracking-[0.45em] text-white/40 [writing-mode:vertical-rl] lg:block">
        A late-night listening bar — {city || "London"}
      </p>

      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pb-28 lg:px-10 lg:pb-32">
        <div className="block overflow-hidden">
          <p
            style={{ transitionDelay: "100ms" }}
            className={cx(
              "mb-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-(--brand-accent) transition-transform duration-1100 ease-[cubic-bezier(0.19,1,0.22,1)]",
              mounted ? "translate-y-0" : "translate-y-[130%]",
            )}
          >
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-(--brand-accent)" />
            {text(
              customer.hero?.eyebrow,
              "Late-night cocktails · Vinyl · Mood",
            )}
          </p>
        </div>

        <h1 className="max-w-5xl font-serif text-[clamp(3.4rem,9.5vw,8.5rem)] font-light leading-[0.92] text-[#f7eee4]">
          <span className="block overflow-hidden pb-1">
            <span
              style={{ transitionDelay: "220ms" }}
              className={cx(
                "block transition-transform duration-1300 ease-[cubic-bezier(0.19,1,0.22,1)]",
                mounted ? "translate-y-0" : "translate-y-[115%]",
              )}
            >
              {head}
            </span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span
              style={{ transitionDelay: "360ms" }}
              className={cx(
                "block transition-transform duration-1300 ease-[cubic-bezier(0.19,1,0.22,1)]",
                mounted ? "translate-y-0" : "translate-y-[115%]",
              )}
            >
              <em className="italic text-(--brand-accent)">{tail}</em>
            </span>
          </span>
        </h1>

        <p
          style={{ transitionDelay: "520ms" }}
          className={cx(
            "mt-8 max-w-xl font-serif text-lg italic leading-relaxed text-white/65 transition-all duration-1000 ease-out",
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          &ldquo;
          {text(
            customer.hero?.description,
            `The night starts here. Discover ${customer.businessName}.`,
          )}
          &rdquo;
        </p>

        <div
          style={{ transitionDelay: "660ms" }}
          className={cx(
            "mt-11 flex flex-wrap items-center gap-5 transition-all duration-1000 ease-out",
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <a
            href="#reserve"
            className="group inline-flex items-center gap-3 rounded-full bg-(--brand-accent) px-8 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#181315] transition-all duration-300 hover:bg-white"
          >
            {text(customer.hero?.primaryCta, "Plan your night")}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#menu"
            className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60 transition-colors hover:text-(--brand-accent)"
          >
            Explore the menu
            <ArrowDown className="size-3.5 animate-bounce" />
          </a>
        </div>

        <div className="absolute bottom-24 right-6 z-20 hidden flex-col gap-3.5 md:flex lg:right-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => go(idx)}
              className="group flex items-center justify-end gap-3"
            >
              <span
                className={cx(
                  "text-[9px] uppercase tracking-[0.3em] transition-colors",
                  idx === current
                    ? "text-(--brand-accent)"
                    : "text-white/35 group-hover:text-white/70",
                )}
              >
                {SLIDE_NAMES[idx] ?? `0${idx + 1}`}
              </span>
              <span
                className={cx(
                  "text-[10px] tabular-nums transition-colors",
                  idx === current ? "text-white/90" : "text-white/35",
                )}
              >
                0{idx + 1}
              </span>
              <span className="relative h-px w-16 overflow-hidden bg-white/15">
                {idx === current && (
                  <span
                    key={current}
                    className="block h-full animate-fillbar bg-(--brand-accent)"
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-6 z-20 hidden flex-col items-center gap-3 lg:left-10 lg:flex">
        <span className="text-[9px] uppercase tracking-[0.45em] text-white/45 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative h-16 w-px bg-white/15">
          <span className="absolute left-1/2 top-0 size-[3px] -translate-x-1/2 animate-scroll-dot rounded-full bg-(--brand-accent)" />
        </span>
      </div>
    </section>
  );
}

export function Ticker({ items }: { items: string[] }) {
  const list = items.filter(Boolean);
  if (list.length === 0) return null;

  const row = (hidden: boolean) => (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {list.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span
            className={cx(
              "whitespace-nowrap text-xl sm:text-2xl",
              i % 2 === 0
                ? "font-serif font-light italic text-[#f7eee4]/85"
                : "text-stroke-soft font-sans uppercase tracking-[0.22em]",
            )}
          >
            {item}
          </span>
          <span className="mx-8 inline-block size-1.5 rotate-45 bg-(--brand-accent)" />
        </span>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Highlights"
      className="group relative overflow-hidden border-y border-white/5 bg-[#141012] py-5"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#141012] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#141012] to-transparent" />
    </section>
  );
}

export function Story({ customer }: { customer: NewCustomer }) {
  const roomImage = localPubImg(customer.gallery?.[2]?.image, 3);
  const detailImage = pubImg(12);

  const stats =
    customer.stats && customer.stats.length > 0
      ? customer.stats.slice(0, 3)
      : [
          { value: "120+", label: "Rare bottles" },
          { value: "9", label: "Years behind the bar" },
          { value: "2am", label: "Last record spins" },
        ];

  const title = text(
    customer.about?.title,
    "Low light, loud records, honest pours.",
  );
  const words = title.split(" ").filter(Boolean);
  const titleHead = words.slice(0, -1).join(" ");
  const titleTail = words.slice(-1).join(" ");

  return (
    <section
      id="story"
      className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36"
    >
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow index="01" label="The Room" />
            </Reveal>
            <Reveal delay={120}>
              <h2 className="mt-8 font-serif text-5xl font-light leading-[1.04] text-[#f7eee4] sm:text-6xl">
                {titleHead}{" "}
                <em className="italic text-(--brand-accent)">{titleTail}</em>
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-9 max-w-md text-[15px] font-light leading-[1.9] text-[#f7eee4]/60 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[3.4rem] first-letter:font-light first-letter:leading-[0.85] first-letter:text-(--brand-accent)">
                {text(
                  customer.about?.body,
                  `${customer.businessName} is a room for crafted cocktails, curated vinyl, and the kind of conversations that only happen after dark. Stay for one more.`,
                )}
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
                {stats.map((stat) => (
                  <Stat
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <Reveal delay={150} className="relative">
            <div className="relative w-[84%]">
              <div className="absolute -left-4 -top-4 h-full w-full border border-(--brand-accent)/25" />
              <div className="relative aspect-4/5 overflow-hidden bg-[#201a1c]">
                <div className="absolute -bottom-14 -top-14 left-0 right-0">
                  <Image
                    src={roomImage}
                    alt="Inside the bar"
                    fill
                    sizes="(min-width: 1024px) 46vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-[#181315]/45 via-transparent to-transparent" />
              </div>
              <p className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
                <span className="h-px w-8 bg-(--brand-accent)/60" />— 01 · The
                back bar, mid-set
              </p>
            </div>
          </Reveal>

          <Reveal
            delay={350}
            className="relative z-10 ml-auto -mt-[16%] w-[56%] lg:-mt-[18%]"
          >
            <div className="relative aspect-4/3 overflow-hidden border-10 border-[#181315] bg-[#201a1c] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <Image
                src={detailImage}
                alt="A candlelit table at last call"
                fill
                sizes="(min-width: 1024px) 30vw, 60vw"
                className="object-cover transition-transform duration-1400 ease-out hover:scale-108"
              />
            </div>
            <p className="mt-4 flex items-center justify-end gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
              02 · Last call, table four
              <span className="h-px w-8 bg-(--brand-accent)/60" />
            </p>
          </Reveal>

          <SpinBadge
            label={`${text(customer.businessName, "The Bar")} · after dark · after dark · `.toUpperCase()}
            className="absolute -top-10 right-6 hidden size-32 text-white/60 md:grid lg:right-14"
          />
        </div>
      </div>
    </section>
  );
}

const FALLBACK_ITEMS: CustomerService[] = [
  {
    title: "Smoked Cherry Negroni",
    description:
      "House campari blend, mezcal, sweet vermouth, cherrywood smoke.",
  },
  {
    title: "Salted Espresso Martini",
    description:
      "Cold brew liqueur, premium vodka, fresh espresso, sea salt dusting.",
  },
  {
    title: "Yuzu Highball",
    description: "Japanese whisky, fresh yuzu, soda, hand-carved ice.",
  },
  {
    title: "Afterglow Old Fashioned",
    description: "Brown butter washed bourbon, angostura, flamed orange.",
  },
];
const PREVIEW_IMAGES = [
  pubImg(2),
  pubImg(4),
  pubImg(8),
  pubImg(14),
  pubImg(9),
  pubImg(6),
];
const FALLBACK_PRICES = ["17", "16", "15", "18", "18", "16", "15", "17"];

export function DrinksMenu({ customer }: { customer: NewCustomer }) {
  const items =
    customer.services && customer.services.length > 0
      ? customer.services
      : FALLBACK_ITEMS;

  const [hover, setHover] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      setPos({ x: clientX, y: clientY });
    });
  };

  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const previewSrc = (index: number) =>
    localPubImg(
      items[index]?.image,
      [2, 4, 8, 14, 9, 6][index % PREVIEW_IMAGES.length],
    );

  return (
    <section
      id="menu"
      className="relative bg-[#f7eee4] px-6 py-24 text-[#181315] lg:px-10 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow index="02" label="Tonight's Pour" tone="light" />
            </Reveal>
            <Reveal delay={120}>
              <h2 className="mt-8 font-serif text-5xl font-light leading-[1.02] sm:text-6xl">
                Drinks worth{" "}
                <em className="italic text-[#a05c35]">remembering.</em>
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-7 max-w-xs text-sm font-light leading-[1.9] text-[#181315]/60">
                Built on a back bar of one hundred and twenty bottles. Stirred,
                smoked, clarified — never rushed. Hover a pour to see it in the
                glass.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-10 flex items-start gap-4 border border-[#181315]/15 p-6">
                <Martini className="mt-0.5 size-5 shrink-0 text-[#a05c35]" />
                <p className="text-xs leading-[1.8] text-[#181315]/60">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#181315]">
                    Off-menu on request
                  </span>
                  Tell the bar your spirit, your mood, your record — they will
                  build the rest.
                </p>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <a
                href="#reserve"
                className="group mt-9 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#a05c35]"
              >
                Reserve for tonight
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8" onMouseMove={onMove}>
          <Reveal delay={150}>
            <ul className="border-t border-[#181315]/15">
              {items.map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  <a
                    href="#reserve"
                    onMouseEnter={() => canHover() && setHover(index)}
                    onMouseLeave={() => setHover(null)}
                    className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 border-b border-[#181315]/15 py-7 transition-colors duration-500 hover:bg-[#181315]/4 sm:gap-8 sm:py-8"
                  >
                    <span className="w-8 text-xs font-medium tabular-nums text-[#a05c35]/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="transition-transform duration-500 ease-out group-hover:translate-x-3">
                      <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="font-serif text-2xl font-light tracking-wide transition-colors duration-300 group-hover:text-[#a05c35] sm:text-[1.8rem]">
                          {item.title}
                        </span>
                        {item.tag && (
                          <span className="rounded-full border border-[#181315]/20 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-[#181315]/45">
                            {item.tag}
                          </span>
                        )}
                      </span>
                      <span className="mt-2.5 block max-w-md text-sm font-light leading-relaxed text-[#181315]/60">
                        {item.description}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-serif text-xl text-[#a05c35]">
                        $
                        {text(
                          item.price,
                          FALLBACK_PRICES[index % FALLBACK_PRICES.length],
                        )}
                      </span>
                      <ArrowUpRight className="size-4 -translate-x-1 text-[#a05c35] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.25em] text-[#181315]/40">
              <span>Prices include tax</span>
              <span>Dahlia, our resident cat, approves all pours</span>
            </div>
          </Reveal>
        </div>
      </div>

      {hover !== null && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:block"
          style={{
            transform: `translate3d(${pos.x + 30}px, ${Math.max(
              20,
              pos.y - 200,
            )}px, 0)`,
          }}
        >
          <div
            key={hover}
            className="relative h-[300px] w-[228px] -rotate-2 animate-preview overflow-hidden bg-[#181315] shadow-[0_36px_90px_rgba(24,19,21,0.5)]"
          >
            <Image
              src={previewSrc(hover)}
              alt={items[hover]?.title ?? "Cocktail preview"}
              fill
              sizes="228px"
              className="object-cover"
            />
            <span className="absolute bottom-3 left-3 bg-[#181315]/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-[#f7eee4] backdrop-blur-sm">
              {text(items[hover]?.tag, "House pour")}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

const DEFAULT_CAPTIONS = [
  "The back bar",
  "Golden hour coupes",
  "Side A, track one",
  "Highball, hand-cut ice",
  "Closing time",
  "The Afterglow",
];
const FALLBACK_IMAGES = [
  pubImg(2),
  pubImg(4),
  pubImg(6),
  pubImg(8),
  pubImg(9),
  pubImg(14),
];
const ASPECTS = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
];

type Frame = { src: string; caption: string };

export function Gallery({ customer }: { customer: NewCustomer }) {
  const frames: Frame[] =
    customer.gallery && customer.gallery.length > 0
      ? customer.gallery.slice(0, 6).map((g, i) => ({
          src: localPubImg(g.image, [2, 4, 6, 8, 9, 14][i]),
          caption: text(
            g.caption,
            DEFAULT_CAPTIONS[i % DEFAULT_CAPTIONS.length],
          ),
        }))
      : FALLBACK_IMAGES.map((src, i) => ({
          src,
          caption: DEFAULT_CAPTIONS[i],
        }));

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIdx((idx) =>
        idx === null ? idx : (idx + dir + frames.length) % frames.length,
      ),
    [frames.length],
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIdx, close, step]);

  return (
    <section
      id="gallery"
      className="border-t border-white/5 bg-[#181315] px-6 py-24 lg:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <Eyebrow index="03" label="The Vibe" />
            </Reveal>
            <Reveal delay={120}>
              <h2 className="mt-8 font-serif text-5xl font-light leading-[1.02] text-[#f7eee4] sm:text-6xl">
                Step inside{" "}
                <em className="italic text-(--brand-accent)">the hour.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={220}>
            <p className="pb-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
              {String(frames.length).padStart(2, "0")} frames — click to expand
            </p>
          </Reveal>
        </div>

        <div className="mt-14 columns-2 gap-4 md:columns-3">
          {frames.map((frame, idx) => (
            <Reveal
              key={`${frame.src}-${idx}`}
              delay={(idx % 3) * 110}
              className="mb-4 break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(idx)}
                className={cx(
                  "group relative block w-full overflow-hidden bg-[#201a1c]",
                  ASPECTS[idx % ASPECTS.length],
                )}
              >
                <Image
                  src={frame.src}
                  alt={frame.caption}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover opacity-75 saturate-[0.85] transition-all duration-1200 ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:saturate-100"
                />
                <span className="absolute inset-0 bg-linear-to-t from-[#181315]/80 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-left">
                    <span className="block text-[9px] uppercase tracking-[0.3em] text-(--brand-accent)">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-serif text-sm italic text-white/90">
                      {frame.caption}
                    </span>
                  </span>
                  <Plus className="size-4 shrink-0 text-white/80 transition-transform duration-500 group-hover:rotate-90" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={close}
          className="fixed inset-0 z-90 flex items-center justify-center bg-[#100c0d]/95 p-6 backdrop-blur-md"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-6 top-6 grid size-11 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-(--brand-accent) hover:text-(--brand-accent)"
          >
            <X className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-(--brand-accent) hover:text-(--brand-accent) sm:left-8"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-(--brand-accent) hover:text-(--brand-accent) sm:right-8"
          >
            <ArrowRight className="size-4" />
          </button>
          <figure
            key={openIdx}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl animate-lightbox"
          >
            <div className="relative h-[74vh] w-full">
              <Image
                src={frames[openIdx].src}
                alt={frames[openIdx].caption}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-5 flex items-baseline justify-between">
              <span className="font-serif text-lg italic text-white/85">
                {frames[openIdx].caption}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                {String(openIdx + 1).padStart(2, "0")} /{" "}
                {String(frames.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full border-b border-white/12 bg-transparent px-0 py-2.5 text-sm font-light text-white outline-none transition-colors placeholder:text-white/25 focus:border-[var(--brand-accent)]";
const labelClass =
  "text-[10px] uppercase tracking-[0.25em] text-[var(--brand-accent)]";

export function Reservation({ customer }: { customer: NewCustomer }) {
  const [status, setStatus] = useState<Status>("idle");
  const [summary, setSummary] = useState<{
    name: string;
    date: string;
    time: string;
    guests: string;
  } | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      date: String(fd.get("date") ?? ""),
      time: String(fd.get("time") ?? ""),
      guests: String(fd.get("guests") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    setStatus("sending");

    try {
      /*
       * Assuming you want this to work without the actual backend API endpoint,
       * we simulate a network request delay. If you do have the API set up,
       * uncomment the fetch logic and remove the setTimeout.
       */

      // const res = await fetch("/api/requests", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error("request failed");

      setTimeout(() => {
        setSummary({
          name: payload.name.trim().split(" ")[0] || "friend",
          date: payload.date,
          time: payload.time,
          guests: payload.guests,
        });
        setStatus("sent");
        form.reset();
      }, 1500);
    } catch {
      setStatus("error");
    }
  }

  const contactRows = [
    {
      icon: MapPin,
      label: "Find us",
      value: text(customer.contact?.address, "47 Lantern Street, London"),
    },
    {
      icon: Clock,
      label: "Hours",
      value: text(customer.contact?.hours, "Tue — Sun — 6 PM till 2 AM"),
    },
    {
      icon: Phone,
      label: "Reservations",
      value: text(customer.contact?.phone, "+44 20 7946 0821"),
      href: `tel:${text(customer.contact?.phone, "").replace(/\s+/g, "")}`,
    },
    ...(customer.contact?.email
      ? [
          {
            icon: Mail,
            label: "Private hire",
            value: customer.contact.email,
            href: `mailto:${customer.contact.email}`,
          },
        ]
      : []),
  ];

  return (
    <section
      id="reserve"
      className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-36"
    >
      <div>
        <Reveal>
          <Eyebrow index="04" label="Reservations" />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-8 font-serif text-5xl font-light leading-[1.04] text-[#f7eee4] sm:text-6xl">
            Save a seat <br />
            <em className="italic text-white/50">for tonight.</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-7 flex max-w-sm items-start gap-3 text-sm font-light leading-relaxed text-white/50">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-(--brand-accent)" />
            Walk-ins are always welcome at the bar — tables are for those who
            plan their night properly.
          </p>
        </Reveal>
        <Reveal delay={280}>
          <div className="mt-12 space-y-7">
            {contactRows.map((row) => (
              <div key={row.label} className="group flex items-start gap-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 text-(--brand-accent) transition-colors duration-500 group-hover:border-(--brand-accent)/60">
                  <row.icon className="size-4" />
                </span>
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {row.label}
                  </p>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="text-sm font-light text-white/80 transition-colors hover:text-(--brand-accent)"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <p className="text-sm font-light text-white/80">
                      {row.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={180}>
        <div className="relative border border-white/10 bg-[#201a1c] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.35)] sm:p-12">
          <span className="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-(--brand-accent)/70 to-transparent" />
          <SpinBadge
            label={`${text(customer.CTA?.label, "Reserve a table")} · tonight · `.toUpperCase()}
            className="absolute -right-7 -top-12 hidden size-28 rounded-full border border-white/5 bg-[#181315] p-1.5 text-white/50 md:grid"
          />

          {status === "sent" && summary ? (
            <div className="flex flex-col items-center py-14 text-center">
              <svg viewBox="0 0 64 64" className="size-20" aria-hidden="true">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="2"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke="var(--brand-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="189"
                  strokeDashoffset="189"
                  transform="rotate(-90 32 32)"
                  className="animate-ring"
                />
                <path
                  d="M20 33 L28 41 L44 24"
                  fill="none"
                  stroke="var(--brand-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="36"
                  strokeDashoffset="36"
                  className="animate-check"
                />
              </svg>
              <h3 className="mt-8 font-serif text-3xl font-light text-white sm:text-4xl">
                See you tonight, {summary.name}.
              </h3>
              <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-white/50">
                {summary.date
                  ? `We're holding${summary.guests ? ` ${summary.guests}` : " your table"}${
                      summary.time
                        ? ` on ${summary.date} at ${summary.time}`
                        : ` for ${summary.date}`
                    }. Our host will confirm by email within the hour.`
                  : "Your request is on its way — our host will confirm by email within the hour."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setSummary(null);
                }}
                className="mt-9 text-[10px] uppercase tracking-[0.3em] text-(--brand-accent) underline-offset-4 hover:underline"
              >
                Make another request
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className={labelClass}>Request a table</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Replies within the hour
                </p>
              </div>

              <form
                onSubmit={submit}
                className="mt-9 grid gap-x-8 gap-y-8 sm:grid-cols-2"
              >
                <div className="space-y-1.5">
                  <label htmlFor="res-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="res-name"
                    required
                    name="name"
                    placeholder="Ada Lovelace"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="res-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="res-email"
                    required
                    name="email"
                    type="email"
                    placeholder="ada@example.com"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="res-date" className={labelClass}>
                    Date
                  </label>
                  <input
                    id="res-date"
                    required
                    name="date"
                    type="date"
                    min={today}
                    className={`${inputClass} scheme-dark`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="res-time" className={labelClass}>
                    Seating
                  </label>
                  <select
                    id="res-time"
                    required
                    name="time"
                    defaultValue=""
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" disabled className="bg-[#201a1c]">
                      Select a time
                    </option>
                    {[
                      "6:00 PM",
                      "7:30 PM",
                      "9:00 PM",
                      "10:30 PM",
                      "Midnight",
                    ].map((t) => (
                      <option key={t} value={t} className="bg-[#201a1c]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="res-guests" className={labelClass}>
                    Guests
                  </label>
                  <select
                    id="res-guests"
                    required
                    name="guests"
                    defaultValue=""
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" disabled className="bg-[#201a1c]">
                      Select party size
                    </option>
                    {[
                      "2 guests",
                      "3 guests",
                      "4 guests",
                      "5+ guests",
                      "Private booth",
                    ].map((g) => (
                      <option key={g} value={g} className="bg-[#201a1c]">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="res-phone" className={labelClass}>
                    Occasion
                  </label>
                  <input
                    id="res-phone"
                    name="occasion"
                    placeholder="Optional"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="res-message" className={labelClass}>
                    Special requests
                  </label>
                  <textarea
                    id="res-message"
                    name="message"
                    rows={2}
                    placeholder="Seating preference, allergies, the record you want to hear..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                {status === "error" && (
                  <p className="text-xs text-[#f2a0a0] sm:col-span-2">
                    Something went wrong sending that — please try again, or
                    call {text(customer.contact?.phone, "the bar")} instead.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cx(
                    "group mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-(--brand-accent) px-6 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#181315] transition-all duration-300 sm:col-span-2",
                    status === "sending"
                      ? "cursor-wait opacity-70"
                      : "hover:bg-white",
                  )}
                >
                  {status === "sending" ? (
                    <>
                      Sending
                      <Loader2 className="size-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Request a table
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}

export function Footer({ customer }: { customer: NewCustomer }) {
  const year = new Date().getFullYear();

  const nav = [
    { href: "#story", label: "The Room" },
    { href: "#menu", label: "Menu" },
    { href: "#gallery", label: "Gallery" },
    { href: "#reserve", label: "Reservations" },
  ];
  const socials = ["Instagram", "Facebook", "X"];

  return (
    <footer className="overflow-hidden border-t border-white/5 bg-[#120e0f]">
      <div className="mx-auto max-w-7xl px-6 pt-20 lg:px-10">
        <Reveal>
          <div className="grid gap-14 pb-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <a href="#top" className="flex items-baseline gap-2">
                <Asterisk className="size-4 translate-y-px text-(--brand-accent)" />
                <span className="font-serif text-xl uppercase tracking-[0.22em] text-[#f7eee4]">
                  {customer.businessName}
                </span>
              </a>
              <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-white/45">
                {text(
                  customer.hero?.eyebrow,
                  "Late-night cocktails · Vinyl only · Low light",
                )}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                {socials.map((social) => (
                  <a
                    key={social}
                    href="#top"
                    className="group inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] text-white/50 transition-colors duration-300 hover:text-(--brand-accent)"
                  >
                    {social}
                    <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-(--brand-accent)">
                Explore
              </p>
              <ul className="mt-6 space-y-3.5">
                {nav.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm font-light text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-(--brand-accent)">
                Visit
              </p>
              <p className="mt-6 text-sm font-light leading-[1.9] text-white/60">
                {text(customer.contact?.address, "47 Lantern Street, London")}
              </p>
              <a
                href={`tel:${text(customer.contact?.phone, "").replace(/\s+/g, "")}`}
                className="mt-2 block text-sm font-light text-white/60 transition-colors hover:text-white"
              >
                {text(customer.contact?.phone, "+44 20 7946 0821")}
              </a>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-(--brand-accent)">
                Hours
              </p>
              <p className="mt-6 text-sm font-light leading-[1.9] text-white/60">
                {text(customer.contact?.hours, "Tue — Sun — 6 PM till 2 AM")}
              </p>
              <p className="mt-2 text-sm font-light text-white/40">
                Walk-ins welcome · Kitchen till 11
              </p>
            </div>
          </div>
        </Reveal>

        {/* Giant wordmark */}
        <Reveal delay={100}>
          <p
            aria-hidden="true"
            className="text-stroke select-none whitespace-nowrap text-center font-serif text-[clamp(3.2rem,12.5vw,11rem)] font-light uppercase leading-[0.95] tracking-[0.14em] hover:text-[#f7eee4]/10"
          >
            {customer.businessName}
          </p>
        </Reveal>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-[10px] uppercase tracking-[0.28em] text-white/35 sm:flex-row lg:px-10">
          <span>
            © {year} {customer.businessName}
          </span>
          <span>Designed by InfyCrest</span>
          <a
            href="#top"
            aria-label="Back to top"
            className="grid size-10 place-items-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-(--brand-accent) hover:bg-(--brand-accent) hover:text-[#181315]"
          >
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export function PremiumBarTemplate({
  customer = demoNewCustomer,
}: {
  customer?: NewCustomer;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowTop(window.scrollY > 640);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const style = {
    "--brand-accent": text(customer.theme?.accent, "#ef9c68"),
  } as CSSProperties;

  const tickerItems = [
    ...(customer.services ?? []).slice(0, 4).map((s) => s.title),
    "Vinyl only",
    "Hand-cut ice",
    `Est. ${new Date().getFullYear() - 9}`,
    "Till 2AM",
  ].filter(Boolean);

  return (
    <div
      style={style}
      className="bg-[#181315] font-sans text-[#f7eee4] selection:bg-(--brand-accent) selection:text-[#181315]"
    >
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar customer={customer} scrolled={scrolled} />

      <main>
        <Hero customer={customer} />
        <Ticker items={tickerItems} />
        <Story customer={customer} />
        <DrinksMenu customer={customer} />
        <Gallery customer={customer} />
        <Reservation customer={customer} />
      </main>

      <Footer customer={customer} />

      <a
        href="#top"
        aria-label="Back to top"
        className={cx(
          "fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full border border-white/15 bg-[#181315]/80 text-white/70 backdrop-blur-md transition-all duration-500 hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-[#181315]",
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ArrowUp className="size-4" />
      </a>
    </div>
  );
}

export default PremiumBarTemplate;
