"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  type FormEvent,
  type CSSProperties,
} from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Clock,
  MapPin,
  Menu as MenuIcon,
  Phone,
  UtensilsCrossed,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                          CUSTOMER TYPES & DEMO DATA                        */
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
  image?: string;
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
  description?: string;
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

// Maps to your public/restaurant/ 1-28 images
export const restImg = (num: number) => `/restaurant/${num}.jpg`;

export const TIME_SLOTS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
] as const;

export const demoAureliaCustomer: NewCustomer = {
  slug: "aurelia-dining",
  businessName: "Aurelia",
  theme: { accent: "#d8ad69" },
  CTA: { label: "Reserve a table" },
  hero: {
    eyebrow: "Food with a point of view",
    title: "A table for the curious.",
    description:
      "A modern dining room built around fire, seasonality, and the pleasure of taking your time.",
    primaryCta: "Reserve a table",
  },
  heroImages: [restImg(1), restImg(2), restImg(3)],
  about: {
    title: "Dinner, drinks and a little magic.",
    body: "We believe that the best meals are the ones that linger. Our kitchen works closely with local foragers, farmers, and fishermen to bring the season's absolute best to your plate. Step inside, let us pour you a glass, and leave the rest to us.",
    image: restImg(4),
  },
  stats: [
    { value: "28", label: "Seats in the room" },
    { value: "12", label: "Courses in season" },
    { value: "150+", label: "Wines on the list" },
  ],
  services: [
    {
      title: "Charred coast vegetables",
      description: "Whipped ricotta, fermented chili honey, toasted pine nuts.",
      price: "24",
      tag: "Garden",
      image: restImg(5),
    },
    {
      title: "Black garlic risotto",
      description:
        "Acquerello rice, aged parmesan, wild mushrooms, truffle oil.",
      price: "32",
      tag: "Signature",
      image: restImg(6),
    },
    {
      title: "Ember-roasted sea bass",
      description: "Saffron emulsion, braised fennel, charred lemon.",
      price: "45",
      tag: "From the fire",
      image: restImg(7),
    },
    {
      title: "Dark chocolate torte",
      description: "Smoked sea salt, pistachio crumb, olive oil gelato.",
      price: "18",
      tag: "Sweet",
      image: restImg(8),
    },
  ],
  gallery: [
    { image: restImg(9), caption: "Dry-aged ribeye, bone-marrow jus" },
    { image: restImg(10), caption: "Parmesan, tableside" },
    { image: restImg(12), caption: "Candlelit, every evening" },
    { image: restImg(13), caption: "The cellar pours" },
    { image: restImg(16), caption: "Golden hour in the dining room" },
    { image: restImg(18), caption: "Fire, tended nightly" },
  ],
  contact: {
    address: "123 Culinary Lane, New York, NY 10012",
    hours: "Tuesday — Sunday, 5:00 PM — 11:00 PM",
    phone: "+1 (555) 123-4567",
    email: "hello@aurelia.example",
  },
};

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

/* -------------------------------------------------------------------------- */
/*                                   HOOKS                                    */
/* -------------------------------------------------------------------------- */

export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1,
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
      { threshold, rootMargin: "0px 0px -50px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  factor = 0.08,
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || factor === 0) return;
    let raf = 0;
    let queued = false;
    const update = () => {
      queued = false;
      const rect = el.getBoundingClientRect();
      const offset =
        (rect.top + rect.height / 2 - window.innerHeight / 2) * factor;
      el.style.transform = `translate3d(0px, ${offset.toFixed(1)}px, 0px)`;
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [factor]);
  return ref;
}

export function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

/* -------------------------------------------------------------------------- */
/*                                    ATOMS                                   */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const [ref, inView] = useInView();
  const translate =
    direction === "up"
      ? "translate-y-10"
      : direction === "left"
        ? "-translate-x-10"
        : direction === "right"
          ? "translate-x-10"
          : "";
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cx(
        "transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
        inView ? "opacity-100 transform-none" : `opacity-0 ${translate}`,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cx(
        "inline-block will-change-transform transition-transform duration-300 ease-out",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  index,
  title,
  subtitle,
  centered = false,
  tone = "ink",
}: {
  index: string;
  title: string;
  subtitle: string;
  centered?: boolean;
  tone?: "ink" | "cream";
}) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={cx("mb-12 sm:mb-16", centered && "text-center")}>
      <Reveal>
        <div
          className={cx(
            "mb-5 flex items-center gap-4",
            centered && "justify-center",
          )}
        >
          <span
            className={cx(
              "h-px w-10 origin-left bg-[var(--brand-accent)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
              inView ? "scale-x-100" : "scale-x-0",
            )}
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--brand-accent)]">
            {index} · {subtitle}
          </p>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <h2
          className={cx(
            "font-serif text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl",
            tone === "ink" ? "text-[#24221e]" : "text-[#f4f0e8]",
          )}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   EFFECTS                                  */
/* -------------------------------------------------------------------------- */

export function SmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");
    let tx = window.innerWidth / 2,
      ty = window.innerHeight / 2,
      rx = tx,
      ry = ty,
      raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      const el = e.target as HTMLElement | null;
      const labelled = el?.closest?.("[data-cursor-label]");
      const interactive = el?.closest?.('a, button, [data-cursor="link"]');
      setLabel(
        labelled ? (labelled.getAttribute("data-cursor-label") ?? "") : "",
      );
      setHovered(Boolean(interactive || labelled));
    };

    const loop = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className={cx(
          "pointer-events-none fixed left-0 top-0 z-[130] flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color,color] duration-300 ease-out",
          label
            ? "size-20 border-transparent bg-[#f4f0e8] text-[#171916]"
            : hovered
              ? "size-14 border-[var(--brand-accent)]/60 bg-[var(--brand-accent)]/15"
              : "size-9 border-white/50 mix-blend-difference",
        )}
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        {label ? (
          <span className="text-[9px] font-bold uppercase tracking-[0.25em]">
            {label}
          </span>
        ) : null}
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className={cx(
          "pointer-events-none fixed left-0 top-0 z-[131] size-1.5 rounded-full transition-colors duration-200",
          label || hovered
            ? "bg-[var(--brand-accent)]"
            : "bg-white mix-blend-difference",
        )}
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
    </>
  );
}

export function Preloader({ brand }: { brand: string }) {
  const [progress, setProgress] = useState(0);
  const [lifted, setLifted] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    let raf = 0;
    let liftTimer: ReturnType<typeof setTimeout> | undefined;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        liftTimer = setTimeout(() => setLifted(true), 260);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (liftTimer) clearTimeout(liftTimer);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!lifted) return;
    const t = setTimeout(() => {
      setGone(true);
      document.documentElement.style.overflow = "";
    }, 950);
    return () => clearTimeout(t);
  }, [lifted]);

  if (gone) return null;
  const letters = brand.split("");

  return (
    <div
      aria-hidden
      className={cx(
        "fixed inset-0 z-[110] flex flex-col items-center justify-center bg-[#171916] transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
        lifted && "-translate-y-full",
      )}
    >
      <p
        className="mb-6 text-[10px] uppercase tracking-[0.45em] text-[var(--brand-accent)]"
        style={{ opacity: lifted ? 0 : 1, transition: "opacity 400ms ease" }}
      >
        Est. 2016 · New York
      </p>
      <div className="flex overflow-hidden">
        {letters.map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            className="font-serif text-[16vw] font-light uppercase leading-none tracking-[0.12em] text-[#f4f0e8] sm:text-[9rem]"
            style={{
              transform: lifted ? "translateY(0)" : "translateY(118%)",
              animation: `lineUp 1s cubic-bezier(0.19,1,0.22,1) ${0.15 + i * 0.07}s forwards`,
              transition: "opacity 400ms ease",
              opacity: lifted ? 0 : undefined,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div
        className="mt-10 w-56"
        style={{ opacity: lifted ? 0 : 1, transition: "opacity 400ms ease" }}
      >
        <div className="h-px w-full bg-white/15">
          <div
            className="h-px bg-[var(--brand-accent)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>Preparing the room</span>
          <span className="font-serif text-2xl tracking-normal text-[#f4f0e8]">
            {progress}
          </span>
        </div>
      </div>
    </div>
  );
}

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed -inset-[50%] z-[95] size-[200%] opacity-[0.05]"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SECTIONS                                  */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: "#story", label: "Story" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
];

export function Navbar({
  customer,
  scrolled,
  hidden,
}: {
  customer: NewCustomer;
  scrolled: boolean;
  hidden: boolean;
}) {
  const [open, setOpen] = useState(false);
  const brandName = text(customer.businessName, "Aurelia");

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
          "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled
            ? "border-b border-[#24221e]/10 bg-[#f4f0e8]/90 py-3 shadow-[0_10px_40px_-18px_rgba(23,25,22,0.35)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-6",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
          <nav
            className={cx(
              "hidden flex-1 gap-8 text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors duration-500 md:flex",
              scrolled ? "text-[#24221e]" : "text-white",
            )}
          >
            {NAV_LINKS.slice(0, 2).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative transition-colors hover:text-[var(--brand-accent)]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-[var(--brand-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <a
            href="#top"
            className={cx(
              "flex-1 text-center font-serif text-3xl uppercase tracking-[0.18em] transition-colors duration-500 md:flex-none",
              scrolled ? "text-[#24221e]" : "text-white drop-shadow-md",
            )}
          >
            {brandName}
          </a>
          <div className="hidden flex-1 items-center justify-end gap-8 md:flex">
            <nav
              className={cx(
                "flex gap-8 text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors duration-500",
                scrolled ? "text-[#24221e]" : "text-white",
              )}
            >
              <a
                href="#gallery"
                className="group relative transition-colors hover:text-[var(--brand-accent)]"
              >
                Gallery
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-[var(--brand-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </nav>
            <Magnetic strength={0.22}>
              <a
                href="#reserve"
                className={cx(
                  "block border px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500",
                  scrolled
                    ? "border-[#24221e] text-[#24221e] hover:bg-[#24221e] hover:text-[#f4f0e8]"
                    : "border-white/70 text-white hover:bg-white hover:text-[#171916]",
                )}
              >
                {text(customer.CTA?.label, "Reserve")}
              </a>
            </Magnetic>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cx(
              "justify-self-end transition-colors duration-500 md:hidden",
              scrolled || open ? "text-[#24221e]" : "text-white",
            )}
          >
            {open ? <X className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </div>
      </header>

      <div
        className={cx(
          "fixed inset-0 z-40 flex flex-col justify-between bg-[#f4f0e8] px-8 pb-10 pt-28 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-6 opacity-0",
        )}
      >
        <span
          aria-hidden
          className="text-stroke-ink pointer-events-none absolute -bottom-6 left-0 select-none font-serif text-[34vw] italic leading-none"
        >
          {brandName}
        </span>
        <nav className="relative flex flex-col gap-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${200 + i * 90}ms` : "0ms" }}
              className={cx(
                "group flex items-baseline gap-4 border-b border-[#24221e]/10 py-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
              )}
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--brand-accent)]">
                0{i + 1}
              </span>
              <span className="font-serif text-5xl font-light text-[#24221e] transition-colors group-hover:text-[var(--brand-accent)]">
                {link.label}
              </span>
            </a>
          ))}
          <a
            href="#reserve"
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? "470ms" : "0ms" }}
            className={cx(
              "group flex items-baseline gap-4 py-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
            )}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--brand-accent)]">
              04
            </span>
            <span className="font-serif text-5xl font-light italic text-[var(--brand-accent)]">
              Reserve
            </span>
          </a>
        </nav>
        <div
          style={{ transitionDelay: open ? "600ms" : "0ms" }}
          className={cx(
            "relative flex items-end justify-between text-[11px] uppercase tracking-[0.2em] text-[#24221e]/60 transition-all duration-700",
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <span>{text(customer.contact?.hours, "Tue — Sun 11 PM")}</span>
          <a
            href={`tel:${text(customer.contact?.phone, "").replace(/\s+/g, "")}`}
            className="text-[#24221e]"
          >
            {text(customer.contact?.phone, "")}
          </a>
        </div>
      </div>
    </>
  );
}

export function Hero({ customer }: { customer: NewCustomer }) {
  const slides =
    customer.heroImages && customer.heroImages.length >= 3
      ? customer.heroImages.slice(0, 3)
      : [restImg(1), restImg(2), restImg(3)];
  const [current, setCurrent] = useState(0);
  const driftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      6500,
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    let raf = 0,
      queued = false;
    const update = () => {
      queued = false;
      const el = driftRef.current;
      if (!el) return;
      const y = window.scrollY;
      el.style.transform = `translate3d(0, ${(y * 0.22).toFixed(1)}px, 0)`;
      el.style.opacity = String(Math.max(0, 1 - y / 620));
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const fullTitle = text(customer.hero?.title, "A table for the curious.");
  const words = fullTitle.split(" ");
  const firstPart =
    words.length > 2
      ? words.slice(0, -2).join(" ")
      : words.slice(0, -1).join(" ");
  const lastPart =
    words.length > 2 ? words.slice(-2).join(" ") : words.slice(-1).join(" ");

  return (
    <section
      id="top"
      className="relative flex h-[100svh] min-h-[720px] items-center justify-center overflow-hidden bg-[#24221e]"
    >
      {slides.map((img, idx) => (
        <div
          key={`${img}-${idx}`}
          className={cx(
            "absolute inset-0 transition-opacity duration-[2200ms] ease-in-out",
            idx === current ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="absolute inset-0 z-10 bg-[#171916]/45 mix-blend-multiply" />
          <Image
            src={img}
            alt="Dining room atmosphere"
            fill
            priority={idx === 0}
            sizes="100vw"
            className="animate-subtlePan object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#171916]/50 via-transparent to-[#171916]/70" />
      <div
        className="hero-fade absolute right-10 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/50 [writing-mode:vertical-rl] lg:flex"
        style={{ "--d": "2.4s" } as React.CSSProperties}
      >
        <span>40.7128° 74.0060° W</span>
        <span className="h-14 w-px bg-white/25" />
      </div>
      <div
        ref={driftRef}
        className="relative z-20 mx-auto mt-16 w-full max-w-4xl px-6 text-center will-change-transform"
      >
        <div className="relative border border-white/15 bg-gradient-to-b from-[#171916]/45 to-[#171916]/25 p-10 shadow-2xl backdrop-blur-md sm:p-16 lg:p-20">
          {[
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "bottom-0 left-0 border-b border-l",
            "bottom-0 right-0 border-b border-r",
          ].map((pos) => (
            <span
              key={pos}
              className={cx(
                "hero-fade absolute size-5 border-[var(--brand-accent)]",
                pos,
              )}
              style={{ "--d": "1.9s" } as React.CSSProperties}
            />
          ))}
          <p
            className="hero-fade mb-6 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.45em] text-[var(--brand-accent)]"
            style={{ "--d": "2.0s" } as React.CSSProperties}
          >
            <UtensilsCrossed className="size-4" strokeWidth={1.5} />
            {text(customer.hero?.eyebrow, "Food with a point of view")}
          </p>
          <h1 className="font-serif text-5xl font-light leading-[1.06] text-[#f4f0e8] sm:text-7xl lg:text-8xl">
            <span className="hero-line">
              <span style={{ "--d": "2.15s" } as React.CSSProperties}>
                {firstPart}
              </span>
            </span>
            <span className="hero-line">
              <span
                className="italic text-[var(--brand-accent)]"
                style={{ "--d": "2.32s" } as React.CSSProperties}
              >
                {lastPart}
              </span>
            </span>
          </h1>
          <p
            className="hero-fade mx-auto mb-10 mt-8 max-w-xl text-sm font-light leading-relaxed tracking-wide text-[#f4f0e8]/80 sm:text-base"
            style={{ "--d": "2.55s" } as React.CSSProperties}
          >
            {text(
              customer.hero?.description,
              "A modern dining room built around fire, seasonality, and the pleasure of taking your time.",
            )}
          </p>
          <div
            className="hero-fade flex flex-col items-center justify-center gap-6 sm:flex-row"
            style={{ "--d": "2.7s" } as React.CSSProperties}
          >
            <Magnetic strength={0.22}>
              <a
                href="#reserve"
                className="group inline-flex items-center gap-3 bg-[var(--brand-accent)] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#171916] transition-colors duration-300 hover:bg-[#f4f0e8]"
              >
                {text(customer.hero?.primaryCta, "Reserve a table")}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <a
              href="#menu"
              className="group relative text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4f0e8]/85 transition-colors hover:text-[var(--brand-accent)]"
            >
              Tasting menu
              <span className="absolute -bottom-1.5 left-0 h-px w-full bg-[#f4f0e8]/40 transition-colors group-hover:bg-[var(--brand-accent)]" />
            </a>
          </div>
        </div>
      </div>
      <div
        className="hero-fade absolute bottom-8 left-6 z-20 flex flex-col items-center gap-3 lg:left-12"
        style={{ "--d": "2.9s" } as React.CSSProperties}
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/60">
          Scroll
        </span>
        <span
          className="h-14 w-px bg-[var(--brand-accent)]"
          style={{ animation: "scrollCue 2.2s ease-in-out infinite" }}
        />
      </div>
      <div
        className="hero-fade absolute bottom-8 right-6 z-20 flex items-center gap-4 lg:right-12"
        style={{ "--d": "2.9s" } as React.CSSProperties}
      >
        <span className="font-serif text-lg italic text-white/70">
          0{current + 1}
          <span className="mx-1 text-white/35">/</span>
          <span className="text-white/35">0{slides.length}</span>
        </span>
        <div className="flex gap-2">
          {slides.map((s, idx) => (
            <button
              key={`${s}-${idx}`}
              type="button"
              aria-label={`Show slide ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={cx(
                "h-px transition-all duration-700",
                idx === current
                  ? "w-10 bg-[var(--brand-accent)]"
                  : "w-5 bg-white/30 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const MARQUEE_ITEMS = [
    "Seasonal tasting menu",
    "Open fire",
    "Natural wine",
    "Foraged & fermented",
    "Chef's counter",
    "Zero-kilometre sourcing",
  ];
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <section
      aria-hidden
      className="overflow-hidden border-y border-white/5 bg-[#171916] py-6"
    >
      <div className="marquee-track flex w-max items-center gap-10 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-10">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-10">
                <span
                  className={cx(
                    "whitespace-nowrap",
                    i % 2 === 0
                      ? "font-serif text-2xl font-light italic text-[#f4f0e8]/85"
                      : "text-[10px] font-bold uppercase tracking-[0.35em] text-[#f4f0e8]/50",
                  )}
                >
                  {item}
                </span>
                <Asterisk
                  className="size-4 shrink-0 text-[var(--brand-accent)]"
                  strokeWidth={1.5}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const match = /^([\d,.]+)(.*)$/.exec(value);
  const target = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
  const suffix = match ? match[2] : "";
  const counted = useCountUp(target, inView);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cx(
        "transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      )}
    >
      <p className="mb-2 font-serif text-4xl font-light text-[#24221e] sm:text-5xl">
        {counted}
        <span className="text-[var(--brand-accent)]">{suffix}</span>
      </p>
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#24221e]/50">
        {label}
      </p>
    </div>
  );
}

function SpinningStamp({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cx("absolute z-20 size-28 lg:size-32", className)}
      style={{ animation: "spinSlow 18s linear infinite" }}
    >
      <svg viewBox="0 0 100 100" className="size-full">
        <defs>
          <path
            id="stamp-circle"
            d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        <text
          className="fill-[#24221e] font-sans text-[8px] font-bold uppercase"
          style={{ letterSpacing: "0.28em" }}
        >
          <textPath href="#stamp-circle">
            Seasonal · Fired · Foraged · Aurelia ·{" "}
          </textPath>
        </text>
      </svg>
      <Asterisk className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-[var(--brand-accent)]" />
    </div>
  );
}

export function Story({ customer }: { customer: NewCustomer }) {
  const stats =
    customer.stats && customer.stats.length > 0
      ? customer.stats.slice(0, 3)
      : [
          { value: "28", label: "Seats in the room" },
          { value: "12", label: "Courses in season" },
          { value: "150+", label: "Wines on the list" },
        ];
  const [imgWrapRef, imgInView] = useInView<HTMLDivElement>(0.2);
  return (
    <section
      id="story"
      className="relative overflow-hidden border-b border-[#24221e]/5 bg-[#f4f0e8] px-6 py-28 lg:py-40"
    >
      <span
        aria-hidden
        className="text-stroke-ink pointer-events-none absolute -top-8 left-0 select-none font-serif text-[24vw] italic leading-none lg:text-[19vw]"
      >
        {text(customer.businessName, "Aurelia")}
      </span>
      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-20 lg:grid-cols-2 lg:gap-24">
          <div className="order-2 lg:order-1">
            <SectionHeader
              index="01"
              subtitle="The Philosophy"
              title={text(
                customer.about?.title,
                "Dinner, drinks and a little magic.",
              )}
            />
            <Reveal direction="up" delay={220}>
              <p className="mb-12 max-w-xl text-lg font-light leading-relaxed text-[#24221e]/70">
                {text(
                  customer.about?.body,
                  "We believe that the best meals are the ones that linger.",
                )}
              </p>
            </Reveal>
            <div className="grid grid-cols-3 gap-6 border-t border-[#24221e]/10 pt-10">
              {stats.map((stat, idx) => (
                <Stat
                  key={`${stat.label}-${idx}`}
                  value={stat.value}
                  label={stat.label}
                  delay={idx * 140 + 260}
                />
              ))}
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <SpinningStamp className="-right-6 -top-10 lg:-right-10" />
            <div
              ref={imgWrapRef}
              className="relative h-[480px] w-full lg:h-[680px]"
            >
              <div
                className={cx(
                  "absolute inset-0 bg-[var(--brand-accent)]/15 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  imgInView
                    ? "translate-x-6 translate-y-6"
                    : "translate-x-0 translate-y-0",
                )}
              />
              <div className="absolute inset-0 overflow-hidden shadow-2xl">
                <div className="absolute -inset-y-[12%] inset-x-0">
                  <Image
                    src={text(customer.about?.image, restImg(4))}
                    alt="Chef plating a dish"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <Reveal
                direction="up"
                delay={500}
                className="absolute -bottom-8 -left-2 sm:-left-8"
              >
                <div className="max-w-[240px] bg-[#24221e] p-6 text-[#f4f0e8] shadow-xl">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--brand-accent)]">
                    The counter
                  </p>
                  <p className="font-serif text-lg font-light italic leading-snug">
                    Six seats, one fire, tonight's whole catch.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DiningMenu({ customer }: { customer: NewCustomer }) {
  const items =
    customer.services && customer.services.length > 0
      ? customer.services
      : (demoAureliaCustomer.services ?? []);
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  useEffect(() => {
    if (!canHover) return;
    let raf = 0;
    const cur = { x: 0, y: 0 };
    const loop = () => {
      cur.x += (target.current.x - cur.x) * 0.12;
      cur.y += (target.current.y - cur.y) * 0.12;
      const rot = Math.max(-8, Math.min(8, (target.current.x - cur.x) * 0.045));
      const el = previewRef.current;
      if (el)
        el.style.transform = `translate3d(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px, 0) translate(-50%, -58%) rotate(${rot.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [canHover]);

  return (
    <section
      id="menu"
      ref={sectionRef}
      onMouseMove={(e) => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (rect)
          target.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          };
      }}
      className="relative bg-[#24221e] px-6 py-28 text-[#f4f0e8] lg:py-40"
    >
      <div className="relative mx-auto max-w-4xl">
        <SectionHeader
          index="02"
          subtitle="Tasting Menu"
          title="Chef's Selection"
          centered
          tone="cream"
        />
        <div onMouseLeave={() => setActive(null)}>
          {items.map((item, index) => (
            <Reveal
              key={`${item.title}-${index}`}
              direction="up"
              delay={index * 110}
            >
              <article
                onMouseEnter={() => setActive(index)}
                data-cursor="link"
                className="group flex items-baseline gap-5 border-t border-[#f4f0e8]/10 py-8 transition-colors duration-500 last:border-b hover:bg-[#f4f0e8]/[0.03] sm:gap-8 sm:px-4"
              >
                <span className="hidden w-8 shrink-0 text-xs tracking-[0.2em] text-[#f4f0e8]/30 sm:block">
                  0{index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <h3 className="font-serif text-2xl font-light tracking-wide transition-all duration-500 group-hover:translate-x-2 group-hover:text-[var(--brand-accent)] sm:text-3xl">
                      {item.title}
                    </h3>
                    {item.tag && (
                      <span className="rounded-full border border-[var(--brand-accent)]/40 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.25em] text-[var(--brand-accent)]">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-[#f4f0e8]/55">
                    {item.description}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mb-1.5 hidden w-10 shrink-0 border-b border-dotted border-[#f4f0e8]/25 transition-all duration-500 group-hover:border-[var(--brand-accent)]/50 md:block md:w-20"
                />
                {item.price && (
                  <div className="shrink-0 font-serif text-2xl font-light text-[var(--brand-accent)]">
                    <span className="mr-0.5 text-sm align-top">$</span>
                    {item.price}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal direction="up" delay={500}>
          <p className="mt-14 text-center text-[10px] uppercase tracking-[0.3em] text-[#f4f0e8]/35">
            * The menu follows the market and changes with the season
          </p>
        </Reveal>
      </div>
      {canHover && (
        <div
          ref={previewRef}
          aria-hidden
          className={cx(
            "pointer-events-none absolute left-0 top-0 z-20 hidden h-72 w-52 overflow-hidden shadow-2xl transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block",
            active !== null ? "opacity-100" : "scale-90 opacity-0",
          )}
        >
          {items.map((item, idx) =>
            item.image ? (
              <Image
                key={`${item.title}-${idx}`}
                src={item.image}
                alt=""
                fill
                sizes="208px"
                className={cx(
                  "object-cover transition-all duration-700 ease-out",
                  active === idx
                    ? "scale-100 opacity-100"
                    : "scale-110 opacity-0",
                )}
              />
            ) : null,
          )}
          <div className="absolute inset-0 border border-white/15" />
        </div>
      )}
    </section>
  );
}

function GalleryCell({
  image,
  caption,
  index,
}: {
  image: string;
  caption?: string;
  index: number;
}) {
  const MOSAIC = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1 md:col-span-2",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1 md:col-span-2",
    "col-span-2 row-span-1 md:col-span-3",
    "col-span-2 row-span-1 md:col-span-3",
  ];
  return (
    <Reveal
      direction="up"
      delay={(index % 3) * 120}
      className={cx("min-h-40", MOSAIC[index % 6])}
    >
      <figure
        data-cursor-label="Taste"
        className="group relative h-full w-full overflow-hidden bg-[#24221e]/10"
      >
        <div className="absolute -inset-y-[14%] inset-x-0">
          <Image
            src={image}
            alt={caption ?? `Dining experience ${index + 1}`}
            fill
            sizes="(min-width: 768px) 40vw, 50vw"
            className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#171916]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <figcaption className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="max-w-[70%] text-left text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4f0e8]">
            {caption ?? "Aurelia"}
          </span>
          <span className="font-serif text-lg italic text-[var(--brand-accent)]">
            0{index + 1}
          </span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function Gallery({ customer }: { customer: NewCustomer }) {
  const items =
    customer.gallery && customer.gallery.length >= 6
      ? customer.gallery.slice(0, 6)
      : (demoAureliaCustomer.gallery ?? []).slice(0, 6);
  return (
    <section id="gallery" className="bg-[#f4f0e8] py-28 lg:py-40">
      <div className="mx-auto mb-16 max-w-7xl px-6 lg:px-12">
        <SectionHeader
          index="03"
          subtitle="Visuals"
          title="The Experience"
          centered
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid auto-rows-[9rem] grid-cols-2 gap-2 md:auto-rows-[11rem] md:grid-cols-6">
          {items.map((item, idx) => (
            <GalleryCell
              key={`${item.image}-${idx}`}
              image={item.image}
              caption={item.caption}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reservation({ customer }: { customer: NewCustomer }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [summary, setSummary] = useState<{
    name: string;
    date: string;
    time: string;
    guests: number;
    ref: string;
  } | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [minDate, setMinDate] = useState("");
  const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 8];

  useEffect(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setMinDate(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    );
  }, []);

  const isSlotPast = (slot: string) => {
    if (!date || date !== minDate) return false;
    const [h, m] = slot.split(":").map(Number);
    const now = new Date();
    const cutoff = now.getHours() + now.getMinutes() / 60 + 1;
    return h + m / 60 <= cutoff;
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    setErrorMsg("");
    try {
      // NOTE: This uses the /api/reservations endpoint defined in the source files.
      // If the API isn't present, it will catch the error and show the fallback message.
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: customer.slug ?? "aurelia-dining",
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          date,
          time,
          guests,
          notes: String(fd.get("message") ?? ""),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(
          data.error ?? "Something interrupted your request. Please try again.",
        );
        return;
      }
      const rawName = String(fd.get("name") ?? "").trim();
      setSummary({
        name: rawName.split(" ")[0] || "Guest",
        date,
        time,
        guests,
        ref: data.ref ?? "AUR-0000",
      });
      setStatus("sent");
      form.reset();
      setDate("");
      setTime("19:00");
      setGuests(2);
    } catch {
      setStatus("error");
      setErrorMsg(
        "We couldn't reach the booking desk. Please call us to reserve.",
      );
    }
  }

  const prettyDate = (iso: string) => {
    const d = new Date(`${iso}T12:00:00`);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
  };

  const inputCls =
    "w-full border-b border-[#24221e]/20 bg-transparent px-0 py-2.5 text-sm text-[#24221e] outline-none transition-colors focus:border-[var(--brand-accent)]";
  const labelCls =
    "text-[9px] font-bold uppercase tracking-[0.25em] text-[#24221e]/50";

  return (
    <section
      id="reserve"
      className="relative overflow-hidden bg-[#24221e] px-6 py-28 text-[#f4f0e8] lg:py-40"
    >
      <span
        aria-hidden
        className="text-stroke-cream pointer-events-none absolute bottom-0 right-0 select-none font-serif text-[20vw] italic leading-none"
      >
        Tonight
      </span>
      <div className="relative mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
        <div>
          <Reveal direction="up">
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-10 bg-[var(--brand-accent)]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--brand-accent)]">
                04 · Reservations
              </p>
            </div>
            <h2 className="mb-8 font-serif text-5xl font-light leading-[1.05] sm:text-6xl">
              Save a seat <br />
              <em className="text-[#f4f0e8]/45">for tonight.</em>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={140}>
            <p className="mb-12 max-w-md border-l border-[var(--brand-accent)]/40 pl-6 font-serif text-xl font-light italic leading-relaxed text-[#f4f0e8]/70">
              "Arrive hungry, leave slowly — the evening is ours to stretch."
              <span className="mt-3 block font-sans text-[9px] not-italic uppercase tracking-[0.3em] text-[var(--brand-accent)]">
                The Maître d'
              </span>
            </p>
          </Reveal>
          <Reveal direction="up" delay={240}>
            <div className="space-y-9 border-l border-[#f4f0e8]/15 pl-8 text-sm font-light text-[#f4f0e8]/70">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4f0e8]">
                  <MapPin className="size-3.5 text-[var(--brand-accent)]" />
                  Address
                </p>
                <p className="text-base">
                  {text(customer.contact?.address, "123 Culinary Lane, NY")}
                </p>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4f0e8]">
                  <Clock className="size-3.5 text-[var(--brand-accent)]" />
                  Service hours
                </p>
                <p className="text-base">
                  {text(customer.contact?.hours, "Tue — Sun, 5pm — 11pm")}
                </p>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4f0e8]">
                  <Phone className="size-3.5 text-[var(--brand-accent)]" />
                  Contact
                </p>
                <a
                  href={`tel:${text(customer.contact?.phone, "").replace(/\s+/g, "")}`}
                  className="mb-1 block text-base transition-colors hover:text-[var(--brand-accent)]"
                >
                  {text(customer.contact?.phone, "+1 (555) 123-4567")}
                </a>
                {customer.contact?.email && (
                  <a
                    href={`mailto:${customer.contact.email}`}
                    className="block text-base transition-colors hover:text-[var(--brand-accent)]"
                  >
                    {customer.contact.email}
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal direction="left" delay={250}>
          <div className="relative bg-[#f4f0e8] p-8 text-[#24221e] shadow-2xl sm:p-12">
            <div className="absolute right-0 top-0 size-16 rounded-bl-full bg-[var(--brand-accent)]/15" />
            {status === "sent" && summary ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                <svg
                  viewBox="0 0 56 56"
                  className="mb-8 size-20"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="28"
                    cy="28"
                    r="26.5"
                    stroke="var(--brand-accent)"
                    strokeWidth="1.5"
                    className="check-circle"
                  />
                  <path
                    d="M17 29.5 24.5 37 39 21.5"
                    stroke="var(--brand-accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="check-path"
                  />
                </svg>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand-accent)]">
                  Request {summary.ref}
                </p>
                <h3 className="mb-4 font-serif text-4xl font-light">
                  Noted, {summary.name}.
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-[#24221e]/60">
                  {prettyDate(summary.date)} at {summary.time} —{" "}
                  {summary.guests} {summary.guests === 1 ? "guest" : "guests"}.
                  Our maître d' will confirm shortly by email.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-10 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--brand-accent)] transition-colors hover:text-[#24221e]"
                >
                  Make another request
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="relative z-10 grid gap-7 sm:grid-cols-2"
              >
                <div className="sm:col-span-2">
                  <h3 className="font-serif text-3xl font-light">
                    Book your experience
                  </h3>
                  <p className="mt-2 text-xs text-[#24221e]/50">
                    Every request is confirmed personally by our maître d'.
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="res-name" className={labelCls}>
                    Full name
                  </label>
                  <input
                    id="res-name"
                    required
                    name="name"
                    autoComplete="name"
                    placeholder="Ada Laurent"
                    className={cx(inputCls, "placeholder:text-[#24221e]/25")}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="res-email" className={labelCls}>
                    Email
                  </label>
                  <input
                    id="res-email"
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ada@example.com"
                    className={cx(inputCls, "placeholder:text-[#24221e]/25")}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="res-date" className={labelCls}>
                    Date
                  </label>
                  <input
                    id="res-date"
                    required
                    name="date"
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <fieldset className="space-y-3 sm:col-span-2">
                  <legend className={labelCls}>Service time</legend>
                  <div className="grid grid-cols-5 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const disabled = isSlotPast(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={disabled}
                          onClick={() => setTime(slot)}
                          className={cx(
                            "border py-2.5 text-[11px] font-semibold tracking-wider transition-all duration-300",
                            time === slot
                              ? "border-[#24221e] bg-[#24221e] text-[#f4f0e8]"
                              : "border-[#24221e]/15 text-[#24221e]/70 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]",
                            disabled &&
                              "cursor-not-allowed opacity-25 hover:border-[#24221e]/15 hover:text-[#24221e]/70",
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <fieldset className="space-y-3 sm:col-span-2">
                  <legend className={labelCls}>Party size</legend>
                  <div className="flex flex-wrap gap-2">
                    {GUEST_OPTIONS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setGuests(n)}
                        className={cx(
                          "size-11 border text-[11px] font-semibold transition-all duration-300",
                          guests === n
                            ? "border-[#24221e] bg-[#24221e] text-[#f4f0e8]"
                            : "border-[#24221e]/15 text-[#24221e]/70 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]",
                        )}
                      >
                        {n === 8 ? "7+" : n}
                      </button>
                    ))}
                    <span className="ml-2 self-center text-[10px] uppercase tracking-[0.2em] text-[#24221e]/40">
                      7+ — Private dining
                    </span>
                  </div>
                </fieldset>
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="res-notes" className={labelCls}>
                    Occasions & dietary notes
                  </label>
                  <textarea
                    id="res-notes"
                    name="message"
                    rows={2}
                    placeholder="Anniversaries, allergies, window seats..."
                    className={cx(
                      inputCls,
                      "resize-none placeholder:text-[#24221e]/25",
                    )}
                  />
                </div>
                {status === "error" && (
                  <p className="text-xs leading-relaxed text-[#a4442e] sm:col-span-2">
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group mt-2 flex items-center justify-center gap-3 bg-[#24221e] px-6 py-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4f0e8] transition-colors duration-300 hover:bg-[var(--brand-accent)] hover:text-[#24221e] disabled:opacity-60 sm:col-span-2"
                >
                  {status === "sending"
                    ? "Seating your party..."
                    : "Request table"}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ customer }: { customer: NewCustomer }) {
  const brandName = text(customer.businessName, "Aurelia");
  return (
    <footer className="relative overflow-hidden bg-[#171916] px-6 pb-10 pt-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up">
          <a
            href="#top"
            data-cursor="link"
            className="text-stroke-cream block text-center font-serif text-[clamp(4.5rem,18vw,15rem)] font-light uppercase leading-[0.85] tracking-[0.08em] transition-colors duration-700 hover:text-[#f4f0e8]"
          >
            {brandName}
          </a>
        </Reveal>
        <div className="mt-20 grid gap-10 border-t border-white/10 pt-10 text-sm font-light text-[#f4f0e8]/60 md:grid-cols-4">
          <div>
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--brand-accent)]">
              Visit
            </p>
            <p className="leading-relaxed">
              {text(customer.contact?.address, "123 Culinary Lane, NY")}
            </p>
          </div>
          <div>
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--brand-accent)]">
              Hours
            </p>
            <p className="leading-relaxed">
              {text(customer.contact?.hours, "Tue — Sun, 5pm — 11pm")}
            </p>
          </div>
          <div>
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--brand-accent)]">
              Contact
            </p>
            <a
              href={`tel:${text(customer.contact?.phone, "").replace(/\s+/g, "")}`}
              className="block leading-relaxed transition-colors hover:text-[var(--brand-accent)]"
            >
              {text(customer.contact?.phone, "+1 (555) 123-4567")}
            </a>
            {customer.contact?.email && (
              <a
                href={`mailto:${customer.contact.email}`}
                className="block leading-relaxed transition-colors hover:text-[var(--brand-accent)]"
              >
                {customer.contact.email}
              </a>
            )}
          </div>
          <div className="flex items-start justify-start md:justify-end">
            <Magnetic strength={0.3}>
              <a
                href="#top"
                aria-label="Back to top"
                className="grid size-14 place-items-center rounded-full border border-white/20 text-[#f4f0e8] transition-colors duration-300 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
              >
                <ArrowUp className="size-5" strokeWidth={1.5} />
              </a>
            </Magnetic>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 text-[9px] uppercase tracking-[0.25em] text-white/30 md:flex-row">
          <span>
            © {new Date().getFullYear()} {brandName} — All rights reserved
          </span>
          <nav className="flex gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[var(--brand-accent)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <span>Designed by InfyCrest</span>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumRestaurantTemplate({
  customer = demoAureliaCustomer,
}: {
  customer?: NewCustomer;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    let queued = false;
    const update = () => {
      queued = false;
      const y = window.scrollY;
      setScrolled(y > 50);
      setNavHidden(y > lastY && y > 420);
      lastY = y;
      const bar = progressRef.current;
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const style = {
    "--brand-accent": text(customer.theme?.accent, "#d8ad69"),
  } as CSSProperties;

  return (
    <main
      style={style}
      className="relative bg-[#f4f0e8] font-sans text-[#24221e] selection:bg-[var(--brand-accent)] selection:text-[#171916]"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes subtlePan { 0% { transform: scale(1.02) translate(0, 0); } 50% { transform: scale(1.1) translate(-1.2%, -1.4%); } 100% { transform: scale(1.02) translate(0, 0); } }
        @keyframes marqueeX { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes grainShift { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(-3%, 2%); } 40% { transform: translate(2%, -3%); } 60% { transform: translate(-2%, -2%); } 80% { transform: translate(3%, 2%); } }
        @keyframes scrollCue { 0% { transform: scaleY(0); transform-origin: top; } 45% { transform: scaleY(1); transform-origin: top; } 55% { transform: scaleY(1); transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }
        @keyframes lineUp { from { transform: translateY(115%); } to { transform: translateY(0); } }
        @keyframes fadeInSoft { from { opacity: 0; } to { opacity: 1; } }
        @keyframes circleDraw { from { stroke-dashoffset: 166; } to { stroke-dashoffset: 0; } }
        @keyframes checkDraw { from { stroke-dashoffset: 48; } to { stroke-dashoffset: 0; } }
        @keyframes softPulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        .animate-subtlePan { animation: subtlePan 26s ease-in-out infinite; }
        .marquee-track { animation: marqueeX 32s linear infinite; will-change: transform; }
        .marquee-track:hover { animation-play-state: paused; }
        .grain { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E"); animation: grainShift 0.9s steps(4) infinite; }
        .hero-line { display: block; overflow: hidden; padding-bottom: 0.08em; }
        .hero-line > span { display: block; transform: translateY(118%); animation: lineUp 1.15s cubic-bezier(0.19, 1, 0.22, 1) forwards; animation-delay: var(--d, 0s); }
        .hero-fade { opacity: 0; animation: fadeInSoft 1.2s ease forwards; animation-delay: var(--d, 0s); }
        .text-stroke-cream { -webkit-text-stroke: 1.5px rgb(244 240 232 / 0.13); color: transparent; }
        .text-stroke-ink { -webkit-text-stroke: 1.5px rgb(36 34 30 / 0.12); color: transparent; }
        .check-circle { stroke-dasharray: 166; stroke-dashoffset: 166; animation: circleDraw 0.65s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
        .check-path { stroke-dasharray: 48; stroke-dashoffset: 48; animation: checkDraw 0.45s 0.5s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
        @media (pointer: fine) { .has-custom-cursor, .has-custom-cursor * { cursor: none !important; } }
      `,
        }}
      />

      <SmoothScroll />
      <Preloader brand={text(customer.businessName, "Aurelia")} />
      <CustomCursor />

      {/* Scroll progress hairline */}
      <div
        ref={progressRef}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-[var(--brand-accent)]"
      />

      <Navbar customer={customer} scrolled={scrolled} hidden={navHidden} />
      <Hero customer={customer} />
      <Marquee />
      <Story customer={customer} />
      <DiningMenu customer={customer} />
      <Gallery customer={customer} />
      <Reservation customer={customer} />
      <Footer customer={customer} />
      <GrainOverlay />
    </main>
  );
}

export const RestaurantTemplate = PremiumRestaurantTemplate;
