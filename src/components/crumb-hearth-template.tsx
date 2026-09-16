"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  type ReactNode,
  type FormEvent,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Lenis from "lenis";
import {
  AnimatePresence,
  animate,
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Croissant,
  Flame,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Minus,
  Plus,
  Phone,
  ShoppingBag,
  Wheat,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

// Deterministic random image selector for 1.jpg to 37.jpg
const getBakeryImg = (index: number) =>
  `/Bakery/${((index * 13) % 37) + 1}.jpg`;

export type BakeCategory = "morning" | "loaves" | "cakes" | "catering" | "all";

export type Bake = {
  id: number;
  name: string;
  description: string;
  category: BakeCategory;
  priceCents: number;
  tag: string | null;
  image: string;
  available: boolean;
};

export type NewCustomer = {
  slug?: string;
  businessName: string;
  theme: { accent?: string };
  hero?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    primaryCta?: string;
  };
  about?: { title?: string; body?: string; image?: string };
  bakes?: Bake[];
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    hours?: { day: string; time: string; note?: string }[];
  };
};

export const demoBakeryCustomer: NewCustomer = {
  businessName: "Crumb & Hearth",
  theme: { accent: "#ba7650" }, // Clay
  hero: {
    eyebrow: "Made warm every morning",
    title: "Good bread. Good company.",
    description:
      "Naturally leavened loaves, three-day croissants and cakes worth crossing town for — from a little wood-fired bakery on Fournier Lane.",
    primaryCta: "See today's bakes",
  },
  contact: {
    address: "214 Fournier Lane, Marlowe District",
    phone: "(503) 555-0184",
    email: "hello@crumbhearth.example",
    hours: [
      { day: "Tuesday — Friday", time: "7:00 — 3:00" },
      { day: "Saturday", time: "8:00 — 4:00" },
      { day: "Sunday", time: "8:00 — 1:00" },
      { day: "Monday", time: "Ovens rest", note: "dough doesn't" },
    ],
  },
  bakes: [
    {
      id: 1,
      name: "Butter Croissant",
      description:
        "Eighty-one layers of cultured butter, laminated over three days. Shatteringly crisp outside, honeycomb inside.",
      category: "morning",
      priceCents: 395,
      tag: null,
      image: getBakeryImg(1),
      available: true,
    },
    {
      id: 2,
      name: "Pain au Chocolat",
      description:
        "Two batons of dark chocolate folded into the same three-day dough. Best eaten slightly warm, obviously.",
      category: "morning",
      priceCents: 450,
      tag: null,
      image: getBakeryImg(2),
      available: true,
    },
    {
      id: 3,
      name: "Cardamom Morning Bun",
      description:
        "Croissant dough swirled with cardamom sugar and orange zest. Our most argued-over pastry.",
      category: "morning",
      priceCents: 475,
      tag: "Bestseller",
      image: getBakeryImg(3),
      available: true,
    },
    {
      id: 4,
      name: "Brown Butter Banana Bread",
      description:
        "Toasted crumb, a whisper of espresso. Sold thick-sliced — griddled with salted butter on request.",
      category: "morning",
      priceCents: 425,
      tag: null,
      image: getBakeryImg(4),
      available: true,
    },
    {
      id: 5,
      name: "Ham & Gruyère Croissant",
      description:
        "Smoked ham and twelve-month gruyère in laminated dough, baked until the cheese escapes a little.",
      category: "morning",
      priceCents: 650,
      tag: null,
      image: getBakeryImg(5),
      available: true,
    },
    {
      id: 6,
      name: "Country Sourdough",
      description:
        "30% wholegrain, natural levain, a 36-hour cold ferment. The loaf this bakery is named after.",
      category: "loaves",
      priceCents: 900,
      tag: "Bestseller",
      image: getBakeryImg(6),
      available: true,
    },
    {
      id: 7,
      name: "Seeded Rye",
      description:
        "Dark rye with flax, sunflower and toasted pumpkin seeds. Dense in the best possible way.",
      category: "loaves",
      priceCents: 950,
      tag: null,
      image: getBakeryImg(7),
      available: true,
    },
    {
      id: 8,
      name: "Walnut & Fig Levain",
      description:
        "Toasted walnuts and dried black figs in a levain crumb made for salty cheese and long lunches.",
      category: "loaves",
      priceCents: 1050,
      tag: "Seasonal",
      image: getBakeryImg(8),
      available: true,
    },
    {
      id: 9,
      name: "Rosemary Focaccia",
      description:
        "Dimpled and olive-oil-crisped, finished with flaky salt and garden rosemary. Out of the oven at ten.",
      category: "loaves",
      priceCents: 750,
      tag: null,
      image: getBakeryImg(9),
      available: true,
    },
    {
      id: 10,
      name: "Hearth Milk Bread",
      description:
        "Feather-soft pullman loaf, weekends only. Gone by nine, honestly — set an alarm.",
      category: "loaves",
      priceCents: 800,
      tag: "Weekend only",
      image: getBakeryImg(10),
      available: true,
    },
    {
      id: 11,
      name: "Burnt Basque Cheesecake",
      description:
        "Deeply bronzed, molten-centred, entirely unapologetic. Whole only, with 72 hours' notice.",
      category: "cakes",
      priceCents: 4600,
      tag: "72h notice",
      image: getBakeryImg(11),
      available: true,
    },
    {
      id: 12,
      name: "Fig & Mascarpone Layer Cake",
      description:
        "Brown-sugar sponge, whipped mascarpone, roasted figs and thyme honey. Celebration, sorted.",
      category: "cakes",
      priceCents: 5800,
      tag: "Seasonal",
      image: getBakeryImg(12),
      available: true,
    },
    {
      id: 13,
      name: "Brown Sugar Meringue Tart",
      description:
        "Torched peaks over brown-butter pastry cream in one very crisp shell. By the slice or whole.",
      category: "cakes",
      priceCents: 650,
      tag: null,
      image: getBakeryImg(13),
      available: true,
    },
    {
      id: 14,
      name: "Rye Chocolate Chip Cookie",
      description:
        "Rye flour, dark chocolate, flaky salt. Crisp edge, soft middle, zero regrets.",
      category: "cakes",
      priceCents: 425,
      tag: "Bestseller",
      image: getBakeryImg(14),
      available: true,
    },
    {
      id: 15,
      name: "The Hearth Board",
      description:
        "Sliced sourdough, whipped butter, preserves and quick pickles — generous for eight to ten people.",
      category: "catering",
      priceCents: 6400,
      tag: "Serves 8-10",
      image: getBakeryImg(15),
      available: true,
    },
    {
      id: 16,
      name: "Morning Pastry Box",
      description:
        "A dozen of whatever is best at dawn, boxed and tied with string. Offices remember you for this.",
      category: "catering",
      priceCents: 5200,
      tag: "Bestseller",
      image: getBakeryImg(16),
      available: true,
    },
  ],
};

const BAKE_CATEGORIES = [
  { id: "all", label: "Everything" },
  { id: "morning", label: "Morning bakes" },
  { id: "loaves", label: "Loaves & sourdough" },
  { id: "cakes", label: "Cakes & sweets" },
  { id: "catering", label: "For the table" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  morning: "Morning bakes",
  loaves: "Loaves & sourdough",
  cakes: "Cakes & sweets",
  catering: "For the table",
};

const PICKUP_TIMES = ["8:00", "9:00", "10:00", "11:00", "12:00"];

const NAV_LINKS = [
  { label: "Bakes", href: "#bakes" },
  { label: "Our craft", href: "#story" },
  { label: "Pre-order", href: "#order" },
  { label: "Visit", href: "#visit" },
];

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export const EASE = [0.22, 1, 0.36, 1];

function BrandMark({ brandName }: { brandName: string }) {
  const [first, second] = brandName.split("&").map((part) => part.trim());
  return (
    <>
      {first}
      {second && (
        <>
          <em className="not-italic text-[#ba7650]">&amp;</em> {second}
        </>
      )}
    </>
  );
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit & { once?: boolean } = {
    threshold: 0.1,
    rootMargin: "-10% 0px -10% 0px",
  },
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.once) observer.disconnect();
      } else if (!options.once) {
        setInView(false);
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

/* -------------------------------------------------------------------------- */
/*                              MOTION PRIMITIVES                             */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 34,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const { ref, inView } = useInView({
    once: true,
    rootMargin: "-10% 0px -10% 0px",
  });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function RevealLine({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView({ once: true, rootMargin: "-8% 0px" });
  return (
    <span ref={ref} className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : { y: "110%" }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SectionLabel({
  index,
  children,
  dark = false,
  align = "left",
}: {
  index: string;
  children: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  const accent = dark ? "text-[#f0c39f]" : "text-[#ba7650]";
  const rule = dark ? "bg-[#f0c39f]/30" : "bg-[#ba7650]/30";
  return (
    <div
      className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${accent} ${align === "center" ? "justify-center" : ""}`}
    >
      <span className="font-serif text-sm italic normal-case tracking-normal opacity-80">
        ({index})
      </span>
      <span className={`h-px w-10 ${rule}`} aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INTERACTIVE FX                               */
/* -------------------------------------------------------------------------- */

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    (window as any).__lenis = lenis;
    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const destination = document.querySelector(hash);
      if (!destination) return;
      event.preventDefault();
      lenis.scrollTo(destination as HTMLElement, {
        offset: -64,
        duration: 1.5,
      });
      window.history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.stop();
      lenis.destroy();
      (window as any).__lenis = undefined;
    };
  }, []);
  return <>{children}</>;
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

export function SiteHeader({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandName = text(customer.businessName, "Crumb & Hearth");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-[#402c23]/10 bg-[#fbf2e7]/85 text-[#402c23] shadow-[0_8px_30px_rgba(64,44,35,0.06)] backdrop-blur-md" : "border-b border-transparent text-[#fbf2e7]"}`}
      >
        <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between px-5 md:h-20 lg:px-10">
          <a
            href="#top"
            className="font-serif text-xl tracking-tight md:text-2xl"
          >
            <BrandMark brandName={brandName} />
          </a>
          <nav className="hidden items-center gap-9 text-[11px] font-bold uppercase tracking-[0.24em] lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-2 transition-opacity hover:opacity-70"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#order"
              className="hidden rounded-full bg-[#ba7650] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#fbf2e7] transition-colors duration-300 hover:bg-[#9d5c38] sm:inline-flex md:px-6 md:py-3"
            >
              Order something good
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`inline-flex size-10 items-center justify-center rounded-full border transition-colors lg:hidden ${scrolled ? "border-[#402c23]/15 hover:bg-[#402c23]/5" : "border-[#fbf2e7]/25 hover:bg-[#fbf2e7]/10"}`}
            >
              <MenuIcon className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-[#291a12] text-[#fbf2e7]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex h-16 items-center justify-between px-5 md:h-20">
              <span className="font-serif text-xl tracking-tight">
                <BrandMark brandName={brandName} />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-10 items-center justify-center rounded-full border border-[#fbf2e7]/25 transition-colors hover:bg-[#fbf2e7]/10"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}
                  className="group flex items-baseline gap-4 border-b border-[#fbf2e7]/10 py-5"
                >
                  <span className="font-serif text-sm italic text-[#f0c39f]">
                    0{i + 1}
                  </span>
                  <span className="font-serif text-5xl font-light transition-colors group-hover:text-[#f0c39f]">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-between gap-4 px-8 pb-10 text-xs uppercase tracking-[0.2em] text-[#fbf2e7]/55"
            >
              <span>
                {text(
                  customer.contact?.address?.split(",")[0],
                  "214 Fournier Lane",
                )}
              </span>
              <Wheat className="size-4 text-[#f0c39f]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Hero({ customer }: { customer: NewCustomer }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const fullTitle = text(customer.hero?.title, "Good bread. Good company.");
  const words = fullTitle.split(". ");
  const firstPart = words[0] ? words[0] + "." : "";
  const secondPart = words[1] ? words[1] + (words.length > 2 ? "." : "") : "";

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <motion.div
        style={{ y: imageY, scale: 1.08 }}
        className="absolute inset-0"
      >
        <Image
          src={getBakeryImg(37)}
          alt="Fresh sourdough"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#291a12] via-[#291a12]/30 to-[#291a12]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#291a12]/55 via-transparent to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[92rem] px-6 pb-24 pt-44 md:pb-28 lg:px-12"
      >
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 rounded-full border border-[#fbf2e7]/25 bg-[#fbf2e7]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[#fbf2e7] backdrop-blur-sm"
        >
          <Flame className="size-3.5 text-[#f0c39f]" />
          {text(customer.hero?.eyebrow, "Made warm every morning")}
        </motion.p>
        <h1 className="mt-7 font-serif text-[clamp(3.6rem,10.5vw,9.25rem)] font-light leading-[0.9] tracking-[-0.02em] text-[#fbf2e7]">
          <RevealLine delay={0.3} className="inline-block">
            {firstPart}
          </RevealLine>
          {secondPart && (
            <RevealLine delay={0.42} className="italic text-[#f0c39f] block">
              {secondPart}
            </RevealLine>
          )}
        </h1>
        <div className="mt-10 flex flex-wrap items-end gap-x-14 gap-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-md text-base leading-relaxed text-[#fbf2e7]/75"
          >
            {text(
              customer.hero?.description,
              "Naturally leavened loaves, three-day croissants and cakes worth crossing town for — from a little wood-fired bakery on Fournier Lane.",
            )}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.78,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#bakes"
              className="group inline-flex items-center gap-2 rounded-full bg-[#ba7650] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fbf2e7] transition-colors duration-300 hover:bg-[#9d5c38]"
            >
              {text(customer.hero?.primaryCta, "See today's bakes")}{" "}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
            </a>
            <a
              href="#order"
              className="inline-flex items-center gap-2 rounded-full border border-[#fbf2e7]/30 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fbf2e7] backdrop-blur-sm transition-colors duration-300 hover:bg-[#fbf2e7]/10"
            >
              Pre-order a box
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-24 right-12 z-10 hidden w-72 rounded-3xl border border-[#fbf2e7]/15 bg-[#291a12]/45 p-6 text-[#fbf2e7] backdrop-blur-md xl:block"
      >
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f0c39f]">
          <Clock3 className="size-3.5" /> Today at the hearth
        </p>
        <ul className="mt-4 space-y-3">
          {[
            { item: "Country sourdough", time: "8:00" },
            { item: "Rosemary focaccia", time: "10:00" },
            { item: "Basque by the slice", time: "12:00" },
          ].map((drop) => (
            <li key={drop.item} className="flex items-baseline gap-3 text-sm">
              <span className="text-[#fbf2e7]/85">{drop.item}</span>
              <span
                aria-hidden
                className="flex-1 border-b border-dotted border-[#fbf2e7]/25"
              />
              <span className="font-serif italic text-[#f0c39f]">
                {drop.time}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-serif text-sm italic text-[#fbf2e7]/55">
          Sold till crumbs.
        </p>
      </motion.aside>

      <p
        aria-hidden
        className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.5em] text-[#fbf2e7]/45 [writing-mode:vertical-rl] lg:block"
      >
        Est. 2016 · Fournier Lane
      </p>

      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#fbf2e7]/50">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-[#fbf2e7]/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-[#f0c39f]"
            animate={{ y: ["-100%", "220%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}

export function MarqueeBand() {
  const ITEMS = [
    "Naturally leavened",
    "Wood-fired hearth",
    "Stone-milled flour",
    "Baked at 4:30 a.m.",
    "Sold till crumbs",
    "Cakes to order",
  ];
  return (
    <section
      aria-hidden
      className="relative z-20 -my-6 overflow-hidden py-6 select-none"
    >
      <div className="rotate-[-1.5deg] scale-x-[1.03] bg-[#ba7650] py-4 text-[#fbf2e7] shadow-[0_14px_44px_rgba(64,44,35,0.28)]">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex items-center gap-10 pr-10"
              aria-hidden={copy === 1}
            >
              {ITEMS.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.32em] whitespace-nowrap"
                >
                  {item} <Wheat className="size-4 shrink-0 text-[#f0c39f]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  suffix = "",
  label,
}: {
  value: number | null;
  suffix?: string;
  label: string;
}) {
  const { ref, inView } = useInView({ once: true, rootMargin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || value === null) return;
    const controls = animate(0, value, {
      duration: 1.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref}>
      <p className="font-serif text-5xl font-light text-[#402c23] lg:text-6xl">
        {value === null ? (
          <span className="italic text-[#ba7650]">4:30</span>
        ) : (
          <>
            {display.toLocaleString()}
            {suffix && <span className="italic text-[#ba7650]">{suffix}</span>}
          </>
        )}
      </p>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#402c23]/55">
        {label}
      </p>
    </div>
  );
}

export function Story({ customer }: { customer: NewCustomer }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const archY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const ovenY = useTransform(scrollYProgress, [0, 1], [110, -40]);
  const ovenRotate = useTransform(scrollYProgress, [0, 1], [-7, 3]);

  return (
    <section
      id="story"
      ref={ref}
      className="relative mx-auto max-w-[92rem] scroll-mt-24 px-6 py-28 lg:px-12 lg:py-40"
    >
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel index="01">Our craft</SectionLabel>
          </Reveal>
          <h2 className="mt-9 font-serif text-[clamp(2.5rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.01em]">
            <RevealLine delay={0.05}>
              {text(customer.about?.title, "Small-batch bread,")}
            </RevealLine>
            <RevealLine delay={0.13}>pastry — and reasons</RevealLine>
            <RevealLine delay={0.21}>
              <em className="text-[#ba7650]">to linger.</em>
            </RevealLine>
          </h2>
          <Reveal delay={0.15} className="mt-10 max-w-xl">
            <p className="text-lg leading-relaxed text-[#402c23]/70 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.78] first-letter:text-[#ba7650]">
              {text(
                customer.about?.body,
                "Everything at Crumb & Hearth begins the night before — levain fed at dusk, doughs folded by hand while the street sleeps. We ferment slowly because slow tastes better, and we bake in a wood-fired hearth because fire has opinions worth listening to.",
              )}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-[#402c23]/70">
              The flour is stone-milled an hour away, the butter is cultured,
              and the jam is whatever the market had too much of. If we
              can&apos;t name the farm, it doesn&apos;t go in the dough.
            </p>
            <p className="mt-10 flex items-center gap-4">
              <span className="font-serif text-3xl italic text-[#402c23]">
                Marta &amp; Jonah
              </span>
              <span className="h-px w-8 bg-[#402c23]/20" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#402c23]/50">
                Bakers, founders, morning people
              </span>
            </p>
          </Reveal>
        </div>
        <div className="relative lg:col-span-7">
          <div className="relative h-[520px] sm:h-[600px] lg:h-[680px]">
            <motion.div
              style={{ y: archY }}
              className="absolute right-0 top-0 w-[70%] overflow-hidden rounded-b-[2rem] rounded-t-[999px] shadow-[0_30px_80px_rgba(64,44,35,0.25)]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={getBakeryImg(35)}
                  alt="Hands folding dough"
                  fill
                  sizes="(max-width: 1024px) 70vw, 40vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </motion.div>
            <motion.div
              style={{ y: ovenY, rotate: ovenRotate }}
              className="absolute bottom-4 left-0 w-[46%] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_rgba(41,26,18,0.35)] ring-8 ring-[#fbf2e7]"
            >
              <div className="relative aspect-square">
                <Image
                  src={getBakeryImg(36)}
                  alt="Pulling loaves from the oven"
                  fill
                  sizes="(max-width: 1024px) 46vw, 28vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-[38%] top-8 -rotate-3 rounded-2xl bg-[#402c23] px-5 py-4 text-[#fbf2e7] shadow-xl lg:top-14"
            >
              <p className="flex items-center gap-2 font-serif text-xl italic">
                <Flame className="size-4 text-[#f0c39f]" />
                36-hour ferment
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbf2e7]/55">
                Slow, on purpose
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-[#402c23]/10 pt-12 md:grid-cols-4">
        <Stat value={9} label="Years at the counter" />
        <Stat value={1200} suffix="+" label="Loaves each Saturday" />
        <Stat value={36} suffix="hr" label="Cold ferment, minimum" />
        <Stat value={null} label="First bake of the day" />
      </div>
    </section>
  );
}

export function MenuSection({ bakes }: { bakes: Bake[] }) {
  const [category, setCategory] = useState<BakeCategory | "all">("all");
  const [hovered, setHovered] = useState<Bake | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 140, damping: 18, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 140, damping: 18, mass: 0.4 });

  const filtered = useMemo(
    () =>
      category === "all"
        ? bakes
        : bakes.filter((bake) => bake.category === category),
    [bakes, category],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const bake of bakes) {
      map.set(bake.category, (map.get(bake.category) ?? 0) + 1);
    }
    return map;
  }, [bakes]);

  return (
    <section
      id="bakes"
      className="relative scroll-mt-16 overflow-hidden bg-[#291a12] py-28 text-[#fbf2e7] lg:py-36"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(52rem 30rem at 85% -5%, rgba(186,118,80,0.22), transparent 60%), radial-gradient(40rem 26rem at -10% 90%, rgba(217,160,91,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[92rem] px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-10">
          <div>
            <Reveal>
              <SectionLabel index="02" dark>
                From the oven
              </SectionLabel>
            </Reveal>
            <h2 className="mt-8 font-serif text-[clamp(2.6rem,5.5vw,5rem)] font-light leading-[0.98]">
              <RevealLine delay={0.05}>Baked this morning,</RevealLine>
              <RevealLine delay={0.15}>
                <em className="text-[#f0c39f]">gone by noon.</em>
              </RevealLine>
            </h2>
          </div>
          <Reveal delay={0.2} className="max-w-sm">
            <p className="text-base leading-relaxed text-[#fbf2e7]/55">
              The menu bends with the market and the miller — this is
              today&apos;s lineup, priced like we want you back tomorrow.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14">
          <div className="flex flex-wrap gap-2.5">
            {BAKE_CATEGORIES.map((cat) => {
              const active = category === cat.id;
              const count =
                cat.id === "all" ? bakes.length : (counts.get(cat.id) ?? 0);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as BakeCategory | "all")}
                  className={`rounded-full border px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${active ? "border-[#f0c39f] bg-[#f0c39f] text-[#291a12]" : "border-[#fbf2e7]/20 text-[#fbf2e7]/60 hover:border-[#fbf2e7]/50 hover:text-[#fbf2e7]"}`}
                >
                  {cat.label}{" "}
                  <span className="ml-2 font-serif normal-case italic tracking-normal opacity-70">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          className="mt-12"
          onMouseMove={(event) => {
            mouseX.set(event.clientX);
            mouseY.set(event.clientY);
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((bake, i) => (
              <motion.article
                layout
                key={bake.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHovered(bake)}
                onMouseLeave={() => setHovered(null)}
                className={`group border-t border-[#fbf2e7]/12 py-7 md:py-8 ${i === filtered.length - 1 ? "border-b" : ""}`}
              >
                <div className="flex items-baseline gap-4 md:gap-6">
                  <span className="w-8 shrink-0 font-serif text-sm italic text-[#fbf2e7]/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-2xl font-light transition-colors duration-300 group-hover:text-[#f0c39f] md:text-[2.1rem]">
                    {bake.name}
                    {bake.tag && (
                      <span className="ml-3 inline-block -translate-y-1 rounded-full border border-[#f0c39f]/40 px-3 py-1 align-middle font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-[#f0c39f]">
                        {bake.tag}
                      </span>
                    )}
                  </h3>
                  <span
                    aria-hidden
                    className="hidden flex-1 border-b border-dotted border-[#fbf2e7]/20 transition-colors duration-300 group-hover:border-[#f0c39f]/40 md:block"
                  />
                  <span className="ml-auto shrink-0 font-serif text-xl text-[#f0c39f] md:ml-0 md:text-2xl">
                    {formatPrice(bake.priceCents)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-6 pl-12 md:pl-14">
                  <p className="max-w-2xl text-sm leading-relaxed text-[#fbf2e7]/50">
                    {bake.description}
                  </p>
                  <span className="relative ml-auto hidden size-16 shrink-0 overflow-hidden rounded-xl lg:hidden md:block">
                    <Image
                      src={bake.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <p className="font-serif text-lg italic text-[#fbf2e7]/55">
            Sold out is a compliment — come early, or pre-order the night
            before.
          </p>
          <a
            href="#order"
            className="group inline-flex items-center gap-2 rounded-full bg-[#ba7650] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fbf2e7] transition-colors duration-300 hover:bg-[#9d5c38]"
          >
            Skip the line — pre-order{" "}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </div>
      </div>

      <motion.div
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.id}
              initial={{ opacity: 0, scale: 0.72, rotate: -9 }}
              animate={{ opacity: 1, scale: 1, rotate: -4 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 2 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative ml-8 mt-[-7rem] h-52 w-64 overflow-hidden rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.5)] ring-1 ring-[#fbf2e7]/25"
            >
              <Image
                src={hovered.image}
                alt={hovered.name}
                fill
                sizes="256px"
                className="object-cover"
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

export function OrderSection({ bakes }: { bakes: Bake[] }) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState(tomorrowISO());
  const [pickupTime, setPickupTime] = useState(PICKUP_TIMES[0]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    code: string;
    totalCents: number;
  } | null>(null);

  const selected = useMemo(
    () => bakes.filter((bake) => (quantities[bake.id] ?? 0) > 0),
    [bakes, quantities],
  );
  const totalCents = useMemo(
    () =>
      selected.reduce(
        (sum, bake) => sum + bake.priceCents * (quantities[bake.id] ?? 0),
        0,
      ),
    [selected, quantities],
  );
  const itemCount = selected.reduce(
    (count, bake) => count + (quantities[bake.id] ?? 0),
    0,
  );

  const setQty = (id: number, qty: number) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(24, qty)),
    }));

  const GROUP_ORDER = ["morning", "loaves", "cakes", "catering"] as const;
  const groups = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        id: group,
        label: CATEGORY_LABELS[group],
        items: bakes.filter((bake) => bake.category === group),
      })).filter((group) => group.items.length > 0),
    [bakes],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (selected.length === 0) {
      setError("Your box is empty — add something delicious first.");
      return;
    }
    setStatus("submitting");

    setTimeout(() => {
      setConfirmation({
        code: `CH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        totalCents,
      });
      setStatus("success");
    }, 1500);
  }

  function reset() {
    setQuantities({});
    setNotes("");
    setConfirmation(null);
    setStatus("idle");
    setError(null);
  }

  const inputClass =
    "w-full rounded-xl border border-[#fbf2e7]/15 bg-[#fbf2e7]/[0.07] px-4 py-3 text-sm text-[#fbf2e7] outline-none transition-colors placeholder:text-[#fbf2e7]/35 focus:border-[#f0c39f]/70";

  return (
    <section
      id="order"
      className="relative scroll-mt-24 px-4 py-24 sm:px-6 lg:px-12 lg:py-32"
    >
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2.5rem] bg-[#f5e9d7] px-6 py-16 ring-1 ring-[#402c23]/10 sm:px-10 lg:px-16 lg:py-24">
        <Wheat
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-80 rotate-12 text-[#402c23]/[0.05]"
        />
        <div className="relative text-center">
          <Reveal>
            <SectionLabel index="03" align="center">
              Pre-order
            </SectionLabel>
          </Reveal>
          <h2 className="mt-8 font-serif text-[clamp(2.5rem,5vw,4.75rem)] font-light leading-[0.98]">
            <RevealLine delay={0.05}>Skip the line,</RevealLine>
            <RevealLine delay={0.15}>
              <em className="text-[#ba7650]">not the warm part.</em>
            </RevealLine>
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#402c23]/60">
              Order by 6 p.m. and we&apos;ll bake it overnight. Swing by in the
              morning — it&apos;ll be boxed, tied with string, and still
              thinking it&apos;s dawn.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-14 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <Reveal delay={0.1}>
            <p className="flex items-baseline justify-between text-[11px] font-bold uppercase tracking-[0.24em] text-[#402c23]/55">
              Build your box{" "}
              <span className="font-serif normal-case italic tracking-normal text-[#ba7650]">
                tap + to add
              </span>
            </p>
            <div
              data-lenis-prevent
              className="mt-5 max-h-[34rem] space-y-8 overflow-y-auto pr-3 no-scrollbar"
            >
              {groups.map((group) => (
                <div key={group.id}>
                  <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#ba7650]">
                    {group.label}{" "}
                    <span className="h-px flex-1 bg-[#ba7650]/20" aria-hidden />
                  </p>
                  <ul className="mt-2">
                    {group.items.map((bake) => {
                      const qty = quantities[bake.id] ?? 0;
                      return (
                        <li
                          key={bake.id}
                          className={`flex items-center gap-4 border-b border-[#402c23]/10 py-4 transition-colors ${qty > 0 ? "bg-[#ba7650]/[0.06]" : ""}`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-lg leading-tight">
                              {bake.name}
                            </p>
                            <p className="mt-0.5 text-xs text-[#402c23]/50">
                              {formatPrice(bake.priceCents)}
                              {bake.tag ? ` · ${bake.tag.toLowerCase()}` : ""}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1 rounded-full border border-[#402c23]/15 bg-[#fbf2e7] p-1">
                            <button
                              type="button"
                              onClick={() => setQty(bake.id, qty - 1)}
                              disabled={qty === 0}
                              className="inline-flex size-7 items-center justify-center rounded-full text-[#402c23]/60 transition-colors hover:bg-[#402c23]/10 disabled:opacity-30"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span
                              className={`w-6 text-center text-sm font-bold tabular-nums ${qty > 0 ? "text-[#9d5c38]" : "text-[#402c23]/40"}`}
                            >
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(bake.id, qty + 1)}
                              className="inline-flex size-7 items-center justify-center rounded-full bg-[#ba7650] text-[#fbf2e7] transition-colors hover:bg-[#9d5c38]"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2} className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait">
              {status === "success" && confirmation ? (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl bg-[#291a12] p-8 text-[#fbf2e7] shadow-[0_30px_80px_rgba(41,26,18,0.35)] lg:p-10"
                >
                  <BadgeCheck className="size-12 text-[#f0c39f]" />
                  <h3 className="mt-5 font-serif text-4xl font-light">
                    See you at <em className="text-[#f0c39f]">the hearth.</em>
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#fbf2e7]/60">
                    Your order is in the book. We&apos;ll bake it overnight and
                    have it waiting — just show this code at the counter:
                  </p>
                  <p className="mt-6 inline-flex rounded-2xl border border-[#f0c39f]/30 bg-[#fbf2e7]/[0.07] px-6 py-4 font-mono text-2xl font-bold tracking-[0.3em] text-[#f0c39f]">
                    {confirmation.code}
                  </p>
                  <dl className="mt-6 space-y-2 border-t border-[#fbf2e7]/10 pt-6 text-sm">
                    <div className="flex items-baseline gap-3">
                      <dt className="text-[#fbf2e7]/45">Bakes</dt>
                      <span
                        aria-hidden
                        className="flex-1 border-b border-dotted border-[#fbf2e7]/20"
                      />
                      <dd className="font-serif italic">
                        {itemCount} item{itemCount === 1 ? "" : "s"}
                      </dd>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <dt className="text-[#fbf2e7]/45">Pickup</dt>
                      <span
                        aria-hidden
                        className="flex-1 border-b border-dotted border-[#fbf2e7]/20"
                      />
                      <dd className="font-serif italic">
                        {pickupDate} · {pickupTime}
                      </dd>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <dt className="text-[#fbf2e7]/45">Pay at counter</dt>
                      <span
                        aria-hidden
                        className="flex-1 border-b border-dotted border-[#fbf2e7]/20"
                      />
                      <dd className="font-serif text-lg italic text-[#f0c39f]">
                        {formatPrice(confirmation.totalCents)}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-8 w-full rounded-full border border-[#fbf2e7]/25 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fbf2e7] transition-colors hover:bg-[#fbf2e7]/10"
                  >
                    Place another order
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl bg-[#291a12] p-8 text-[#fbf2e7] shadow-[0_30px_80px_rgba(41,26,18,0.35)] lg:p-10"
                >
                  <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#f0c39f]">
                    <ShoppingBag className="size-4" /> Your box{" "}
                    {itemCount > 0 && (
                      <span className="ml-auto rounded-full bg-[#f0c39f] px-2.5 py-0.5 text-[10px] font-bold text-[#291a12]">
                        {itemCount}
                      </span>
                    )}
                  </p>
                  <div className="mt-5">
                    {selected.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#fbf2e7]/15 px-6 py-10 text-center">
                        <Croissant className="mx-auto size-8 text-[#fbf2e7]/25" />
                        <p className="mt-3 font-serif text-lg italic text-[#fbf2e7]/50">
                          Your box is empty — fix that on the left.
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-2.5">
                        {selected.map((bake) => (
                          <li
                            key={bake.id}
                            className="flex items-baseline gap-3 text-sm"
                          >
                            <span>
                              {bake.name}{" "}
                              <span className="ml-1.5 font-serif italic text-[#f0c39f]">
                                ×{quantities[bake.id]}
                              </span>
                            </span>
                            <span
                              aria-hidden
                              className="flex-1 border-b border-dotted border-[#fbf2e7]/20"
                            />
                            <span className="font-serif">
                              {formatPrice(
                                bake.priceCents * (quantities[bake.id] ?? 0),
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-5 flex items-baseline gap-3 border-t border-[#fbf2e7]/10 pt-5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#fbf2e7]/55">
                        Total
                      </span>
                      <span
                        aria-hidden
                        className="flex-1 border-b border-dotted border-[#fbf2e7]/20"
                      />
                      <span className="font-serif text-3xl font-light text-[#f0c39f]">
                        {formatPrice(totalCents)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbf2e7]/50">
                        Your name *
                      </span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Marta Baker"
                        className={inputClass}
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbf2e7]/50">
                        Email *
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass}
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbf2e7]/50">
                        Phone
                      </span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Optional"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbf2e7]/50">
                        Pickup day *
                      </span>
                      <input
                        type="date"
                        min={tomorrowISO()}
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbf2e7]/50">
                        Around *
                      </span>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className={`${inputClass} appearance-none`}
                      >
                        {PICKUP_TIMES.map((time) => (
                          <option
                            key={time}
                            value={time}
                            className="bg-[#291a12]"
                          >
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbf2e7]/50">
                        Notes for the bakers
                      </span>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Slice the sourdough? Writing on the cake?"
                        className={`${inputClass} resize-none`}
                      />
                    </label>
                  </div>
                  {error && (
                    <p className="mt-5 rounded-xl border border-[#d97b5f]/40 bg-[#8f3f2f]/20 px-4 py-3 text-sm text-[#f0c39f]">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ba7650] py-4.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fbf2e7] transition-all duration-300 hover:bg-[#9d5c38] disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === "submitting"
                      ? "Pinning it to the rail..."
                      : selected.length === 0
                        ? "Add something first"
                        : `Place pre-order — ${formatPrice(totalCents)}`}
                    {status !== "submitting" && selected.length > 0 && (
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                    )}
                  </button>
                  <p className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-[0.18em] text-[#fbf2e7]/40">
                    <CalendarDays className="size-3.5" />
                    Pay at pickup · order by 6pm · cakes need 72h
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Visit({ customer }: { customer: NewCustomer }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const GOOD_TO_KNOW = [
    "Sourdough drops at 8:00",
    "Cakes need 72h notice",
    "Coffee from Sundays Roasters",
  ];

  return (
    <section
      id="visit"
      ref={ref}
      className="relative mx-auto max-w-[92rem] scroll-mt-16 px-6 py-28 lg:px-12 lg:py-36"
    >
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <SectionLabel index="04">Come by</SectionLabel>
          </Reveal>
          <h2 className="mt-9 font-serif text-[clamp(2.6rem,5vw,4.75rem)] font-light leading-[0.98]">
            <RevealLine delay={0.05}>There&apos;s always</RevealLine>
            <RevealLine delay={0.15}>
              <em className="text-[#ba7650]">room at the hearth.</em>
            </RevealLine>
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#402c23]/65">
              Come for a slow coffee and something warm, or just to watch the
              loaves come out. If we&apos;re still floury, the first cup is on
              us.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <ul className="mt-10">
              {customer.contact?.hours?.map((row) => (
                <li
                  key={row.day}
                  className="flex items-baseline gap-4 border-b border-[#402c23]/10 py-4"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#402c23]/80">
                    {row.day}
                  </span>
                  <span
                    aria-hidden
                    className="flex-1 border-b border-dotted border-[#402c23]/25"
                  />
                  <span className="font-serif text-lg italic text-[#402c23]/65">
                    {row.time}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-6 flex flex-wrap gap-2">
              {GOOD_TO_KNOW.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-[#402c23]/15 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#402c23]/55"
                >
                  {note}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.35}>
            <address className="mt-10 space-y-3 text-sm not-italic text-[#402c23]/70">
              <p className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-[#ba7650]" />{" "}
                {text(
                  customer.contact?.address,
                  "214 Fournier Lane, Marlowe District",
                )}
              </p>
              <p className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-[#ba7650]" />{" "}
                {text(customer.contact?.phone, "(503) 555-0184")}
              </p>
              <p className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-[#ba7650]" />{" "}
                {text(customer.contact?.email, "hello@crumbhearth.example")}
              </p>
            </address>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#order"
                className="group inline-flex items-center gap-2 rounded-full bg-[#402c23] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fbf2e7] transition-colors duration-300 hover:bg-[#ba7650]"
              >
                Place an order{" "}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-[#402c23]/20 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#402c23] transition-colors duration-300 hover:bg-[#402c23]/5"
              >
                Get directions
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_rgba(64,44,35,0.28)] sm:aspect-[5/5]">
              <motion.div
                style={{ y: imageY, scale: 1.16 }}
                className="absolute inset-0"
              >
                <Image
                  src={getBakeryImg(32)}
                  alt="Inside the cafe"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  unoptimized
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#291a12]/35 via-transparent to-transparent" />
            </div>
            <motion.div
              animate={{ rotate: [-2.5, -1, -2.5], y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 left-6 max-w-[250px] rounded-2xl bg-[#fbf2e7] p-6 shadow-[0_20px_50px_rgba(41,26,18,0.3)] ring-1 ring-[#402c23]/10 sm:left-10"
            >
              <p className="font-serif text-xl italic leading-snug text-[#402c23]">
                Monday we rest — the dough doesn&apos;t.
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#402c23]/50">
                See you Tuesday, 7:00 sharp
              </p>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter({ customer }: { customer: NewCustomer }) {
  const brandName = text(customer.businessName, "Crumb & Hearth");

  return (
    <footer className="relative overflow-hidden bg-[#291a12] text-[#fbf2e7]">
      <div className="mx-auto max-w-[92rem] px-6 pt-24 lg:px-12">
        <div className="grid gap-14 pb-24 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-serif text-3xl tracking-tight">
              <BrandMark brandName={brandName} />
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#fbf2e7]/50">
              An artisan bakery on Fournier Lane. Naturally leavened,
              wood-fired, and always worth the walk.
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f0c39f]">
              <Wheat className="size-3.5" /> Find us
            </p>
            <p className="mt-5 text-sm leading-relaxed text-[#fbf2e7]/60">
              {text(
                customer.contact?.address,
                "214 Fournier Lane, Marlowe District",
              )}
            </p>
            <p className="mt-2 text-sm text-[#fbf2e7]/60">
              {text(customer.contact?.phone, "(503) 555-0184")}
            </p>
            <a
              href={`mailto:${customer.contact?.email}`}
              className="mt-2 inline-block border-b border-[#f0c39f]/40 pb-0.5 text-sm text-[#f0c39f] transition-colors hover:text-[#fbf2e7]"
            >
              {text(customer.contact?.email, "hello@crumbhearth.example")}
            </a>
          </div>
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f0c39f]">
              <Wheat className="size-3.5" /> Hours
            </p>
            <ul className="mt-5 space-y-2.5">
              {customer.contact?.hours?.map((row) => (
                <li key={row.day} className="flex items-baseline gap-3 text-sm">
                  <span className="text-[#fbf2e7]/55">{row.day}</span>
                  <span
                    aria-hidden
                    className="flex-1 border-b border-dotted border-[#fbf2e7]/15"
                  />
                  <span className="font-serif italic text-[#fbf2e7]/75">
                    {row.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="text-outline select-none whitespace-nowrap text-center font-serif text-[clamp(4rem,15.5vw,14rem)] font-light leading-[0.85] tracking-tight"
      >
        <BrandMark brandName={brandName} />
      </div>
      <div className="border-t border-[#fbf2e7]/10">
        <div className="mx-auto flex max-w-[92rem] flex-wrap items-center justify-between gap-4 px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbf2e7]/40 lg:px-12">
          <span>
            © {new Date().getFullYear()} {brandName} Bakery
          </span>
          <span className="hidden md:inline">
            Baked slowly on Fournier Lane
          </span>
          <span>Designed by Infycrest Solutions</span>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 transition-colors hover:text-[#f0c39f]"
          >
            Back to top{" "}
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumBakeryTemplate({
  customer = demoBakeryCustomer,
}: {
  customer?: NewCustomer;
}) {
  const style = {
    "--brand-accent": text(customer.theme?.accent, "#ba7650"),
  } as CSSProperties;

  const bakes =
    customer.bakes && customer.bakes.length > 0
      ? customer.bakes
      : demoBakeryCustomer.bakes!;

  return (
    <div
      style={style}
      className="relative overflow-x-clip bg-[#fbf2e7] font-sans text-[#402c23] selection:bg-[#ba7650] selection:text-[#fbf2e7]"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 32s linear infinite; }
        .animate-marquee-slow { animation: marquee 60s linear infinite; }
        .text-outline { color: transparent; -webkit-text-stroke: 1px color-mix(in srgb, #f0c39f 45%, transparent); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
      />

      <SmoothScroll>
        <SiteHeader customer={customer} />
        <main id="top">
          <Hero customer={customer} />
          <MarqueeBand />
          <Story customer={customer} />
          <MenuSection bakes={bakes} />
          <OrderSection bakes={bakes.filter((bake) => bake.available)} />
          <Visit customer={customer} />
        </main>
        <SiteFooter customer={customer} />
      </SmoothScroll>
    </div>
  );
}
