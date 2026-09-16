"use client";

import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
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
  useInView as useMotionInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Menu as MenuIcon,
  Plus,
  Sparkle,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

// Deterministic random image selector for 1 to 53 local Business-Tech images
const bizTechImg = (num: number) =>
  `/Business-Tech/${((num * 17) % 53) + 1}.jpg`;

export type Project = {
  title: string;
  category: string;
  year: string;
  image: string;
  alt: string;
  result: string;
};

export type ProcessStep = {
  title: string;
  text: string;
};

export type NewCustomer = {
  id?: number;
  slug?: string;
  businessName: string;
  hero: {
    eyebrow?: string;
    title?: string;
    description?: string;
    primaryCta?: string;
  };
  about: {
    title?: string;
    body?: string;
    image?: string;
  };
  stats?: { value: string; label: string }[];
  services?: { title: string; description: string; tags: string[] }[];
  projects?: Project[];
  process?: ProcessStep[];
  testimonials?: {
    quote: string;
    name: string;
    role: string;
    initials: string;
  }[];
  CTA: { label?: string };
  theme: { accent?: string };
  contact: {
    address?: string;
    phone?: string;
    email?: string;
  };
};

export const demoLaunchLabCustomer: NewCustomer = {
  slug: "launchlab-studio",
  businessName: "LaunchLab",
  theme: { accent: "#f08b54" }, // Ember
  CTA: { label: "Start a project" },
  hero: {
    eyebrow: "Ideas into momentum · Independent digital studio",
    title: "Make your next move visible.",
    description:
      "LaunchLab partners with founders to turn sharp ideas into brands people remember — and websites that make the next conversation easier.",
    primaryCta: "Start a project",
  },
  about: {
    title: "Strategy, identity & digital products for ambitious teams.",
    body: "We're a small senior team on purpose. No account layers, no hand-offs — the people on your first call are the people who design, write and ship your launch.",
    image: bizTechImg(1),
  },
  services: [
    {
      title: "Brand strategy",
      description:
        "Before a single pixel, we get ruthless about why you. Research, positioning and a narrative sharp enough that every decision after it gets easier — naming included.",
      tags: ["Positioning", "Naming", "Messaging", "Audience research"],
    },
    {
      title: "Identity design",
      description:
        "A visual system with a point of view — logotype, type, color and art direction that survive contact with the real world, from favicon to billboard to motion.",
      tags: ["Logo systems", "Art direction", "Guidelines", "Motion identity"],
    },
    {
      title: "Digital products",
      description:
        "Marketing sites and product interfaces designed and built in-house. Fast, accessible, CMS-ready — and unmistakably yours on every screen size.",
      tags: ["Web design", "Development", "E-commerce", "Prototyping"],
    },
    {
      title: "Launch & growth",
      description:
        "The launch is the starting line. Campaign concepts, content systems and measurement that keep the momentum compounding long after day one.",
      tags: ["Campaigns", "Content", "SEO", "Analytics"],
    },
  ],
  projects: [
    {
      title: "Lumen Finance",
      category: "Fintech · Brand & product",
      year: "2026",
      image: bizTechImg(2),
      alt: "Lumen Finance banking app interface",
      result: "$18M seed round closed",
    },
    {
      title: "Atelier Mar",
      category: "Fashion · E-commerce",
      year: "2026",
      image: bizTechImg(3),
      alt: "Atelier Mar fashion editorial",
      result: "3.2% conversion rate",
    },
    {
      title: "Pulse & Petal",
      category: "Wellness · App & campaign",
      year: "2025",
      image: bizTechImg(4),
      alt: "Pulse & Petal wellness campaign",
      result: "120k downloads in 90 days",
    },
    {
      title: "Cask & Co.",
      category: "Beverage · Brand & packaging",
      year: "2025",
      image: bizTechImg(5),
      alt: "Cask & Co. cold brew bottle",
      result: "National retail launch",
    },
  ],
  stats: [
    { value: "64+", label: "Products launched since 2019" },
    { value: "92%", label: "Of clients return for round two" },
    { value: "8", label: "International design awards" },
    { value: "6wks", label: "Median time from idea to launch" },
  ],
  process: [
    {
      title: "Discover",
      text: "We interrogate the idea — the market, the audience, and the sharpest possible version of why you win.",
    },
    {
      title: "Define",
      text: "Positioning, naming and messaging everyone signs off on before a single pixel gets pushed.",
    },
    {
      title: "Design",
      text: "Identity and product explored in tight weekly loops, with you in the room for every big call.",
    },
    {
      title: "Deliver",
      text: "Launch, measure, refine. We stay in the trenches with you through the first hundred days.",
    },
  ],
  testimonials: [
    {
      quote:
        "LaunchLab took a half-formed idea and turned it into something investors immediately understood. We closed our round six weeks after the site went live.",
      name: "Maya Chen",
      role: "Co-founder & CEO, Lumen Finance",
      initials: "MC",
    },
    {
      quote:
        "The most organized creative team we have worked with. Sharp thinking, zero fluff, and a brand that finally feels like us — only braver.",
      name: "Juliette Mar",
      role: "Founder, Atelier Mar",
      initials: "JM",
    },
    {
      quote:
        "Our launch campaign outperformed every benchmark the previous agency had set. Working with LaunchLab, momentum starts feeling inevitable.",
      name: "Dario Fontana",
      role: "CMO, Pulse & Petal",
      initials: "DF",
    },
  ],
  contact: {
    address: "217 NW Flanders Street, Portland, OR",
    phone: "+1 (503) 555-0198",
    email: "hello@launchlab.studio",
  },
};

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

const BUDGET_OPTIONS = [
  { id: "under-10k", label: "Under $10k" },
  { id: "10-25k", label: "$10k — $25k" },
  { id: "25-50k", label: "$25k — $50k" },
  { id: "50k-plus", label: "$50k+" },
] as const;

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit & { once?: boolean } = {
    threshold: 0.1,
    rootMargin: "-40px",
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
  once = true,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}) {
  const { ref, inView } = useInView({ once, rootMargin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function ArrowSwap({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex size-4 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <ArrowUpRight className="size-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-5 group-hover:translate-x-5" />
      <ArrowUpRight className="absolute top-5 -left-5 size-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-5 group-hover:translate-x-5" />
    </span>
  );
}

export function PillLink({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const styles =
    variant === "solid"
      ? "bg-[#f08b54] text-[#171a1c] hover:bg-[#f4f0e8]"
      : "border border-white/25 text-[#f4f0e8] hover:border-[#f08b54] hover:text-[#f08b54]";
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${styles} ${className}`}
    >
      {children}
      <ArrowSwap />
    </a>
  );
}

export function Eyebrow({
  index,
  label,
  tone = "light",
  className = "",
}: {
  index: string;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Reveal className={`flex items-center gap-4 ${className}`} y={16}>
      <span className="h-px w-10 bg-[#f08b54]" aria-hidden="true" />
      <span
        className={`text-[11px] font-medium uppercase tracking-[0.3em] ${tone === "light" ? "text-white/60" : "text-[#171a1c]/60"}`}
      >
        {index} · {label}
      </span>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INTERACTIVE FX                               */
/* -------------------------------------------------------------------------- */

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    (window as any).__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash.length < 2) return;
      event.preventDefault();
      const el = document.querySelector(hash);
      if (!el) return;
      lenis.scrollTo(el as HTMLElement, {
        offset: -72,
        duration: 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
      window.history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.stop();
      lenis.destroy();
      (window as any).__lenis = undefined;
    };
  }, []);
  return <>{children}</>;
}

type CursorVariant = "default" | "hover" | "view";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 600, damping: 55, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 600, damping: 55, mass: 0.35 });

  const VARIANT_STYLES = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "rgba(240,139,84,1)",
      borderColor: "rgba(240,139,84,0)",
      borderWidth: 0,
    },
    hover: {
      width: 46,
      height: 46,
      backgroundColor: "rgba(240,139,84,0.14)",
      borderColor: "rgba(240,139,84,0.7)",
      borderWidth: 1,
    },
    view: {
      width: 88,
      height: 88,
      backgroundColor: "rgba(240,139,84,1)",
      borderColor: "rgba(240,139,84,0)",
      borderWidth: 0,
    },
  };

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const enableTimer = window.setTimeout(() => setEnabled(true), 0);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target || typeof target.closest !== "function") return;
      if (target.closest('[data-cursor="view"]')) {
        setVariant("view");
      } else if (
        target.closest(
          'a, button, [role="button"], input, textarea, select, summary, label',
        )
      ) {
        setVariant("hover");
      } else {
        setVariant("default");
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.clearTimeout(enableTimer);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center rounded-full border-solid mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{ ...VARIANT_STYLES[variant], opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
    >
      {variant === "view" && (
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#171a1c] select-none">
          View
        </span>
      )}
    </motion.div>
  );
}

export function GrainOverlay() {
  return <div className="grain" aria-hidden="true" />;
}

function StudioClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/Los_Angeles",
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time} PST</span>;
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

function FlipLink({
  href,
  label,
  className = "",
  onClick,
}: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group block overflow-hidden ${className}`}
    >
      <span className="relative block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
        <span className="block">{label}</span>
        <span className="absolute top-full left-0 block" aria-hidden="true">
          {label}
        </span>
      </span>
    </a>
  );
}

export function SiteHeader({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  const brandName = text(customer.businessName, "LaunchLab");

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 32);
    setHidden(latest > previous && latest > 180 && !open);
  });

  useEffect(() => {
    if (open) {
      (window as any).__lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      (window as any).__lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      (window as any).__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[#f08b54]"
        style={{ scaleX: progress }}
      />
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`flex h-18 items-center justify-between border-b px-6 transition-colors duration-500 lg:h-20 lg:px-12 ${scrolled || open ? "border-white/10 bg-[#171a1c]/85 backdrop-blur-md" : "border-white/10 bg-transparent"}`}
        >
          <a
            href="#top"
            className="relative z-50 flex items-baseline font-display text-2xl tracking-[-0.02em]"
          >
            <span className="font-semibold">{brandName}</span>
            <span className="text-[#f08b54]">.</span>
          </a>
          <nav
            className="hidden items-center gap-10 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <FlipLink
                key={link.href}
                href={link.href}
                label={link.label}
                className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/80 hover:text-[#f4f0e8]"
              />
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <PillLink
              href="#contact"
              className="hidden !px-6 !py-3 lg:inline-flex"
            >
              {text(customer.CTA?.label, "Start a project")}
            </PillLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-50 flex size-11 items-center justify-center rounded-full border border-white/20 text-[#f4f0e8] transition-colors duration-300 hover:border-[#f08b54] hover:text-[#f08b54] lg:hidden"
            >
              {open ? (
                <X className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#1c2023] px-6 pt-32 pb-10 lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 44, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.07,
                    duration: 0.6,
                    ease: EASE,
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => {
                      (window as any).__lenis?.start();
                      setOpen(false);
                    }}
                    className="group flex items-baseline gap-5 border-b border-white/10 py-5 font-display text-5xl font-light"
                  >
                    <span className="font-sans text-xs tracking-[0.2em] text-[#f08b54]">
                      0{i + 1}
                    </span>
                    <span className="transition-colors duration-300 group-hover:text-[#f08b54]">
                      {link.label}
                    </span>
                  </a>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.22em] text-white/50"
            >
              <a
                href={`mailto:${customer.contact?.email}`}
                className="u-underline"
              >
                {text(customer.contact?.email, "hello@launchlab.studio")}
              </a>
              <span>
                {text(
                  customer.contact?.address?.split(",")[1]?.trim(),
                  "Portland, OR",
                )}
              </span>
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
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  const parent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
  };
  const rise: Variants = {
    hidden: { y: "112%" },
    show: { y: "0%", transition: { duration: 1.15, ease: EASE } },
  };
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  const fullTitle = text(customer.hero?.title, "Make your next move visible.");
  const words = fullTitle.split(" ");
  const firstPart =
    words.length > 2
      ? words.slice(0, -2).join(" ")
      : words.slice(0, 1).join(" ");
  const italicPart =
    words.length > 2 ? words.slice(-2).join(" ") : words.slice(1).join(" ");

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden"
    >
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0"
      >
        <Image
          src={customer.about?.image || bizTechImg(1)}
          alt="Digital Studio"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
          unoptimized
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#171a1c] via-[#171a1c]/55 to-[#171a1c]/10" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_20%,rgba(240,139,84,0.15),transparent_70%)]" />

      <motion.a
        href="#approach"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.9, ease: EASE }}
        className="group absolute top-28 right-10 hidden size-32 items-center justify-center lg:flex xl:right-16"
        aria-label="Scroll down"
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full animate-spin-slow text-[#f4f0e8]/85"
          aria-hidden="true"
        >
          <defs>
            <path
              id="hero-circle"
              d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
            />
          </defs>
          <text
            fill="currentColor"
            fontSize="7.2"
            letterSpacing="2.7"
            className="font-sans uppercase"
          >
            <textPath href="#hero-circle">
              {text(customer.businessName, "LaunchLab")} ·{" "}
              {text(
                customer.hero?.eyebrow?.split("·")[0]?.trim(),
                "Make your next move visible",
              )}{" "}
              ·{" "}
            </textPath>
          </text>
        </svg>
        <span className="flex size-12 items-center justify-center rounded-full bg-[#f08b54] text-[#171a1c] transition-transform duration-500 group-hover:translate-y-1.5">
          <ArrowDown className="size-5" />
        </span>
      </motion.a>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative w-full px-6 pt-40 pb-12 lg:px-12"
      >
        <motion.div
          variants={parent}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-[1600px]"
        >
          <motion.p
            variants={fadeUp}
            className="mb-8 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-[#f08b54]"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#f08b54] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[#f08b54]" />
            </span>
            {text(
              customer.hero?.eyebrow,
              "Ideas into momentum · Independent digital studio",
            )}
          </motion.p>
          <h1 className="font-display text-[15vw] leading-[0.9] font-light tracking-[-0.02em] sm:text-[12.5vw] lg:text-[9.5vw]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={rise} className="block">
                {firstPart}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span
                variants={rise}
                className="block italic text-[#f08b54]"
              >
                {italicPart}
              </motion.span>
            </span>
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 lg:col-span-6"
            >
              <PillLink href="#contact">
                {text(customer.hero?.primaryCta, "Start a project")}
              </PillLink>
              <PillLink href="#work" variant="outline">
                See the work
              </PillLink>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="max-w-md text-base leading-relaxed text-white/65 lg:col-span-6 lg:justify-self-end lg:text-right xl:max-w-lg xl:text-lg"
            >
              {text(
                customer.hero?.description,
                "LaunchLab partners with founders to turn sharp ideas into brands people remember — and websites that make the next conversation easier.",
              )}
            </motion.p>
          </div>
          <motion.div
            variants={fadeUp}
            className="mt-14 flex items-center justify-between border-t border-white/12 pt-5 text-[10px] font-medium uppercase tracking-[0.28em] text-white/45"
          >
            <span>Selected work · {new Date().getFullYear()}</span>
            <span className="hidden md:block">
              {text(
                customer.contact?.address?.split(",")[1]?.trim(),
                "Worldwide",
              )}
            </span>
            <span className="flex items-center gap-2">
              ( Scroll <ArrowDown className="size-3 animate-bounce" /> )
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Marquee() {
  const MARQUEE_ITEMS = [
    "Brand strategy",
    "Identity design",
    "Digital products",
    "Campaigns",
    "Motion & content",
    "Launch support",
  ];
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <section
      aria-hidden="true"
      className="overflow-hidden border-y border-[#171a1c]/10 bg-[#f08b54] py-4 text-[#171a1c]"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center text-xs font-semibold uppercase tracking-[0.32em] whitespace-nowrap"
          >
            <span className="px-8">{item}</span>
            <Sparkle className="size-3.5" strokeWidth={0} fill="currentColor" />
          </span>
        ))}
      </div>
    </section>
  );
}

export function Approach({ customer }: { customer: NewCustomer }) {
  const [open, setOpen] = useState<number | null>(0);
  const services =
    customer.services && customer.services.length > 0
      ? customer.services
      : demoLaunchLabCustomer.services!;

  const fullTitle = text(
    customer.about?.title,
    "Strategy, identity & digital products for ambitious teams.",
  );
  const words = fullTitle.split(" ");
  const highlightWord =
    words.find((w) => w.length > 5) || words[Math.floor(words.length / 2)];
  const titleFormatted = words.map((w, i) =>
    w === highlightWord ? (
      <em key={i} className="text-[#f08b54]">
        {w}{" "}
      </em>
    ) : (
      `${w} `
    ),
  );

  return (
    <section
      id="approach"
      className="scroll-mt-20 px-6 py-24 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <Eyebrow index="01" label="The studio" />
        </Reveal>
        <div className="mt-10 grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="font-display text-4xl leading-[1.02] font-light tracking-[-0.01em] sm:text-5xl lg:text-6xl">
                  {titleFormatted}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 max-w-md text-lg leading-relaxed text-white/60">
                  {text(
                    customer.about?.body,
                    "We're a small senior team on purpose. No account layers, no hand-offs — the people on your first call are the people who design, write and ship your launch.",
                  )}
                </p>
              </Reveal>
              <Reveal delay={0.16} className="mt-10">
                <figure className="group overflow-hidden rounded-2xl border border-white/10">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={bizTechImg(6)}
                      alt="Strategy sprint"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <figcaption className="flex items-center justify-between bg-[#1c2023] px-5 py-4 text-[10px] font-medium uppercase tracking-[0.24em] text-white/50">
                    <span>Identity sprint, week two</span>
                    <span className="text-[#f08b54]">Studio</span>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <div>
                {services.map((service, i) => {
                  const isOpen = open === i;
                  return (
                    <div
                      key={service.title}
                      className="group/row border-t border-white/12 last:border-b"
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-5 py-7 text-left sm:gap-8 sm:py-8"
                      >
                        <span
                          className={`text-xs font-medium tracking-[0.2em] transition-colors duration-300 ${isOpen ? "text-[#f08b54]" : "text-white/40"}`}
                        >
                          0{i + 1}
                        </span>
                        <span
                          className={`flex-1 font-display text-3xl font-light tracking-[-0.01em] transition-colors duration-500 sm:text-4xl lg:text-[2.6rem] ${isOpen ? "text-[#f08b54]" : "group-hover/row:text-[#f08b54]"}`}
                        >
                          {service.title}
                        </span>
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${isOpen ? "rotate-45 border-[#f08b54] bg-[#f08b54] text-[#171a1c]" : "border-white/20 text-white/70 group-hover/row:border-[#f08b54] group-hover/row:text-[#f08b54]"}`}
                        >
                          <Plus className="size-4" />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.55, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="pr-2 pb-9 pl-10 sm:pl-16">
                              <p className="max-w-xl leading-relaxed text-white/60">
                                {service.description}
                              </p>
                              <ul className="mt-6 flex flex-wrap gap-2.5">
                                {service.tags?.map((tag) => (
                                  <li
                                    key={tag}
                                    className="rounded-full border border-white/15 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/55"
                                  >
                                    {tag}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  sizes,
  imageClass,
}: {
  project: Project;
  index: number;
  sizes: string;
  imageClass: string;
}) {
  return (
    <article data-cursor="view" className="group flex shrink-0 flex-col">
      <div className={`relative overflow-hidden rounded-2xl ${imageClass}`}>
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171a1c]/50 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="absolute top-4 right-4 flex size-11 translate-x-2 -translate-y-2 items-center justify-center rounded-full bg-[#f08b54] text-[#171a1c] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </div>
        <span className="absolute bottom-4 left-4 translate-y-2 rounded-full bg-[#f4f0e8]/95 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#171a1c] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {project.result}
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-4 pt-5">
        <h3 className="font-display text-3xl font-light tracking-[-0.01em] text-[#f4f0e8]">
          {project.title}
        </h3>
        <span className="text-xs font-semibold tracking-[0.2em] text-[#c7673d]">
          0{index + 1}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/55">
        {project.category} · {project.year}
      </p>
    </article>
  );
}

export function Work({ customer }: { customer: NewCustomer }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);

  const projects =
    customer.projects && customer.projects.length > 0
      ? customer.projects
      : demoLaunchLabCustomer.projects!;

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setRange(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    setTimeout(measure, 100);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  });
  const x = useTransform(smooth, [0, 1], [0, -range]);

  return (
    <div id="work" className="scroll-mt-16">
      {/* Desktop Horizontal Gallery */}
      <section
        ref={sectionRef}
        className="relative hidden bg-[#f4f0e8] text-[#171a1c] lg:block"
        style={{ height: `calc(100vh + ${range}px)` }}
        aria-label="Selected work"
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="flex items-end justify-between px-12 pb-10">
            <div>
              <Eyebrow index="02" label="Selected work" tone="dark" />
              <h2 className="mt-6 font-display text-5xl leading-[1.02] font-light tracking-[-0.01em] xl:text-6xl">
                Work that moved <em className="text-[#c7673d]">the needle.</em>
              </h2>
            </div>
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#171a1c]/45">
              2019 — {new Date().getFullYear()} · Scroll to explore
            </p>
          </div>
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max items-stretch gap-12 px-12"
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
                sizes="32vw"
                imageClass="h-[44vh] w-[30vw] xl:h-[50vh]"
              />
            ))}
            <div className="flex w-[26vw] shrink-0 flex-col items-start justify-center gap-8 pl-6">
              <p className="font-display text-4xl leading-[1.1] font-light xl:text-5xl">
                Your project
                <br />
                could be <em className="text-[#c7673d]">next.</em>
              </p>
              <PillLink href="#contact">Start a project</PillLink>
            </div>
          </motion.div>
          <div className="mt-12 px-12">
            <div className="h-px w-full bg-[#171a1c]/15">
              <motion.div
                className="h-px origin-left bg-[#c7673d]"
                style={{ scaleX: smooth }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Vertical Cards */}
      <section
        className="bg-[#f4f0e8] px-6 py-24 text-[#171a1c] lg:hidden"
        aria-label="Selected work"
      >
        <Reveal>
          <Eyebrow index="02" label="Selected work" tone="dark" />
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 mb-12 font-display text-5xl leading-[1.02] font-light">
            Work that moved <em className="text-[#c7673d]">the needle.</em>
          </h2>
        </Reveal>
        <div className="flex flex-col gap-14">
          {projects.map((project, i) => (
            <Reveal key={project.title} amount={0.15}>
              <ProjectCard
                project={project}
                index={i}
                sizes="100vw"
                imageClass="aspect-[4/5] w-full"
              />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16">
          <PillLink href="#contact">Start a project</PillLink>
        </Reveal>
      </section>
    </div>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ref: viewRef, inView } = useInView({
    once: true,
    rootMargin: "-60px",
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: EASE,
      onUpdate: (value) => {
        if (ref.current) ref.current.textContent = String(Math.round(value));
      },
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={viewRef}>
      <span ref={ref}>0</span>
    </span>
  );
}

export function Stats({ customer }: { customer: NewCustomer }) {
  const stats =
    customer.stats && customer.stats.length > 0
      ? customer.stats.slice(0, 4).map((s) => {
          const numMatch = s.value.match(/([\d.]+)/);
          const num = numMatch ? parseFloat(numMatch[1]) : 0;
          const suffixMatch = s.value.replace(/[\d.]+/, "").trim();
          return { value: num, suffix: suffixMatch, label: s.label };
        })
      : demoLaunchLabCustomer.stats!.map((s) => {
          const numMatch = s.value.match(/([\d.]+)/);
          const num = numMatch ? parseFloat(numMatch[1]) : 0;
          const suffixMatch = s.value.replace(/[\d.]+/, "").trim();
          return { value: num, suffix: suffixMatch, label: s.label };
        });

  return (
    <section
      aria-label="Studio impact"
      className="px-6 py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-px border-y border-white/10 bg-white/10 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-[#171a1c] p-8 sm:p-10 lg:p-12">
            <Reveal delay={i * 0.08} amount={0.6}>
              <p className="font-display text-5xl font-light tracking-[-0.02em] sm:text-6xl xl:text-7xl">
                <Counter to={stat.value} />
                {stat.suffix && (
                  <span className="text-[#f08b54]">{stat.suffix}</span>
                )}
              </p>
              <p className="mt-4 max-w-56 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                {stat.label}
              </p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Process({ customer }: { customer: NewCustomer }) {
  const processSteps =
    customer.process && customer.process.length > 0
      ? customer.process
      : demoLaunchLabCustomer.process!;

  return (
    <section id="process" className="scroll-mt-20 px-6 py-24 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="03" label="How we work" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-8 font-display text-4xl leading-[1.02] font-light sm:text-5xl lg:text-6xl">
                From first call to{" "}
                <em className="text-[#f08b54]">launch day.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-white/60 lg:ml-auto">
              Four phases, six-ish weeks, zero mystery. You always know
              what&apos;s happening, what&apos;s next, and what we need from
              you.
            </p>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="group border-t border-white/12 pt-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2">
                <span
                  className="block h-0.5 w-10 bg-[#f08b54] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
                  aria-hidden="true"
                />
                <p className="mt-8 text-xs font-medium tracking-[0.24em] text-[#f08b54]">
                  0{i + 1}
                </p>
                <h3 className="mt-4 font-display text-3xl font-light">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/55">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ customer }: { customer: NewCustomer }) {
  const testimonials =
    customer.testimonials && customer.testimonials.length > 0
      ? customer.testimonials
      : demoLaunchLabCustomer.testimonials!;
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  const paginate = useCallback(
    (dir: number) => {
      setIndex(([prev]) => [
        (prev + dir + testimonials.length) % testimonials.length,
        dir,
      ]);
    },
    [testimonials.length],
  );

  useEffect(() => {
    const id = setInterval(() => paginate(1), 7000);
    return () => clearInterval(id);
  }, [paginate, index]);

  const current = testimonials[index];

  return (
    <section className="relative overflow-hidden px-6 py-24 lg:px-12 lg:py-36">
      <div
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(240,139,84,0.09),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow
            index="04"
            label="Words from founders"
            className="justify-center [&>span:first-child]:hidden"
          />
        </Reveal>
        <Reveal delay={0.08}>
          <span className="mx-auto mt-10 grid size-12 place-items-center text-[#f08b54]">
            <Sparkle className="size-8" />
          </span>
        </Reveal>
        <div className="mt-8 flex min-h-[19rem] items-center sm:min-h-[16rem] lg:min-h-[17rem]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 64 : -64 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -64 : 64 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="w-full"
            >
              <p className="font-display text-2xl leading-[1.3] font-light text-balance sm:text-3xl lg:text-[2.5rem]">
                “{current.quote}”
              </p>
              <footer className="mt-9 flex items-center justify-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#f08b54]/40 bg-[#f08b54]/10 font-display text-sm italic text-[#f08b54]">
                  {current.initials}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold">
                    {current.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] uppercase tracking-[0.18em] text-white/50">
                    {current.role}
                  </span>
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous"
            className="flex size-12 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 hover:border-[#f08b54] hover:text-[#f08b54]"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex items-center gap-2.5">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setIndex([i, i > index ? 1 : -1])}
                aria-label={`Show ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-[#f08b54]" : "w-1.5 bg-white/25 hover:bg-white/50"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next"
            className="flex size-12 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 hover:border-[#f08b54] hover:text-[#f08b54]"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function Contact({ customer }: { customer: NewCustomer }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
  });

  const QUICK_FACTS = [
    {
      label: "New business",
      value: text(customer.contact?.email, "hello@launchlab.studio"),
      href: `mailto:${customer.contact?.email}`,
    },
    {
      label: "Press",
      value: "press@launchlab.studio",
      href: `mailto:press@launchlab.studio`,
    },
    {
      label: "Call the studio",
      value: text(customer.contact?.phone, "+1 (503) 555-0198"),
      href: `tel:${customer.contact?.phone}`,
    },
  ];

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMessage(null);

    setTimeout(() => {
      setStatus("success");
    }, 1500);
  }

  const reset = () => {
    setForm({ name: "", email: "", company: "", budget: "", message: "" });
    setErrorMessage(null);
    setStatus("idle");
  };

  const labelClass =
    "mb-2 block text-[11px] font-medium uppercase tracking-[0.22em] text-white/50";
  const inputClass =
    "w-full border-b border-white/15 bg-transparent py-4 text-base text-[#f4f0e8] outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-[#f08b54]";

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden px-6 py-24 lg:px-12 lg:py-36"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(55%_45%_at_90%_100%,rgba(240,139,84,0.1),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow index="05" label="Start a project" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-8 font-display text-4xl leading-[1.02] font-light sm:text-5xl lg:text-6xl">
                Bring us the idea that{" "}
                <em className="text-[#f08b54]">keeps you up.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-white/60">
                Tell us where you&apos;re headed — we&apos;ll reply within two
                business days with honest next steps, even if that&apos;s
                pointing you somewhere else.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a
                href={`mailto:${customer.contact?.email}`}
                className="group mt-10 inline-flex items-center gap-2 font-display text-2xl italic text-[#f08b54] u-underline"
              >
                {text(customer.contact?.email, "hello@launchlab.studio")}
                <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
            <Reveal delay={0.26}>
              <ul className="mt-12 divide-y divide-white/10 border-y border-white/10">
                {QUICK_FACTS.map((fact) => (
                  <li key={fact.label}>
                    <a
                      href={fact.href}
                      className="group flex items-center justify-between gap-4 py-4 text-sm"
                    >
                      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">
                        {fact.label}
                      </span>
                      <span className="u-underline text-white/80 transition-colors duration-300 group-hover:text-[#f08b54]">
                        {fact.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.12}>
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="flex min-h-[28rem] flex-col items-start justify-center rounded-3xl border border-white/10 bg-[#1c2023] p-10 sm:p-14"
                  >
                    <CheckCircle2
                      className="size-12 text-[#f08b54]"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="mt-8 font-display text-4xl font-light">
                      Consider it on{" "}
                      <em className="text-[#f08b54]">our desk.</em>
                    </h3>
                    <p className="mt-5 max-w-md leading-relaxed text-white/60">
                      Thanks, {form.name.split(" ")[0] || "friend"} — we read
                      every brief personally and we&apos;ll get back to you
                      within two business days.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/25 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 hover:border-[#f08b54] hover:text-[#f08b54]"
                    >
                      Send another brief <ArrowSwap />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="grid gap-x-8 gap-y-9 sm:grid-cols-2"
                    noValidate={false}
                  >
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Your name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={120}
                        autoComplete="name"
                        placeholder="Ada Lovelace"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={200}
                        autoComplete="email"
                        placeholder="ada@company.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="company" className={labelClass}>
                        Company / project
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        maxLength={160}
                        autoComplete="organization"
                        placeholder="The thing you're building"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <fieldset className="sm:col-span-2">
                      <legend className={labelClass}>Budget (optional)</legend>
                      <div className="flex flex-wrap gap-2.5">
                        {BUDGET_OPTIONS.map((option) => {
                          const selected = form.budget === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                update("budget", selected ? "" : option.id)
                              }
                              className={`rounded-full border px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-all duration-300 ${selected ? "border-[#f08b54] bg-[#f08b54] text-[#171a1c]" : "border-white/20 text-white/60 hover:border-[#f08b54] hover:text-[#f08b54]"}`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                    <div className="sm:col-span-2">
                      <label htmlFor="message" className={labelClass}>
                        The idea, in your own words *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        minLength={10}
                        maxLength={2000}
                        rows={5}
                        placeholder="What are you making, who is it for, and when do you want to launch?"
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-xs text-xs leading-relaxed text-white/40">
                        We only use your details to reply to this brief. No
                        lists, no drip campaigns.
                      </p>
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#f08b54] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171a1c] transition-colors duration-500 hover:bg-[#f4f0e8] disabled:cursor-wait disabled:opacity-70"
                      >
                        {status === "submitting" ? (
                          <>
                            Sending{" "}
                            <Loader2
                              className="size-4 animate-spin"
                              aria-hidden="true"
                            />
                          </>
                        ) : (
                          <>
                            Send the brief <ArrowSwap />
                          </>
                        )}
                      </button>
                    </div>
                    {errorMessage && (
                      <p
                        aria-live="polite"
                        className="sm:col-span-2 text-sm text-[#f08b54]"
                      >
                        {errorMessage}
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ customer }: { customer: NewCustomer }) {
  const brandName = text(customer.businessName, "LaunchLab");

  return (
    <footer className="relative border-t border-white/10 px-6 pt-20 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-12 lg:pb-20">
          <div className="sm:col-span-2 lg:col-span-5">
            <a
              href="#top"
              className="flex items-baseline font-display text-3xl tracking-[-0.02em]"
            >
              <span className="font-semibold">{brandName}</span>
              <span className="text-[#f08b54]">.</span>
            </a>
            <p className="mt-6 max-w-sm leading-relaxed text-white/55">
              An independent digital studio making ideas visible since 2019.
              Currently booking projects for Q3—Q4 {new Date().getFullYear()}.
            </p>
            <a
              href={`mailto:${customer.contact?.email}`}
              className="group mt-8 inline-flex items-center gap-2 font-display text-2xl italic text-[#f08b54] u-underline"
            >
              {text(customer.contact?.email, "hello@launchlab.studio")}
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <nav className="lg:col-span-2" aria-label="Footer">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.26em] text-white/40">
              Sitemap
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="u-underline text-sm text-white/70 transition-colors duration-300 hover:text-[#f08b54]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-2">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.26em] text-white/40">
              Socials
            </p>
            <ul className="space-y-3">
              {["Instagram", "LinkedIn", "X / Twitter", "Dribbble"].map(
                (social) => (
                  <li key={social}>
                    <a
                      href="#top"
                      className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors duration-300 hover:text-[#f08b54]"
                    >
                      <span className="u-underline">{social}</span>
                      <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.26em] text-white/40">
              Studio
            </p>
            <address className="space-y-3 text-sm leading-relaxed text-white/70 not-italic">
              <p>
                {text(
                  customer.contact?.address,
                  "217 NW Flanders Street\nPortland, OR 97209",
                )
                  .split("\n")
                  .map((l, i) => (
                    <React.Fragment key={i}>
                      {l}
                      <br />
                    </React.Fragment>
                  ))}
              </p>
              <p>
                <a
                  href={`tel:${customer.contact?.phone}`}
                  className="u-underline transition-colors duration-300 hover:text-[#f08b54]"
                >
                  {text(customer.contact?.phone, "+1 (503) 555-0198")}
                </a>
              </p>
              <p className="text-white/45">
                Local time — <StudioClock />
              </p>
            </address>
          </div>
        </div>
        <Reveal y={70} amount={0.1}>
          <div
            aria-hidden="true"
            className="-mb-2 text-center font-display text-[clamp(3.5rem,15.5vw,19rem)] leading-[0.82] font-semibold tracking-[-0.03em] whitespace-nowrap select-none"
          >
            <span className="text-outline">{brandName}</span>
            <span className="text-[#f08b54]">.</span>
          </div>
        </Reveal>
        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brandName} Studio LLC
          </p>
          <p className="hidden md:block">Designed by Infycrest Solutions</p>
          <a
            href="#top"
            className="group inline-flex items-center gap-3 text-white/60 transition-colors duration-300 hover:text-[#f08b54]"
          >
            Back to top{" "}
            <span className="flex size-9 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 group-hover:border-[#f08b54]">
              <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumBusinessTechTemplate({
  customer = demoLaunchLabCustomer,
}: {
  customer?: NewCustomer;
}) {
  const style = {
    "--brand-accent": text(customer.theme?.accent, "#f08b54"),
  } as CSSProperties;

  return (
    <div
      style={style}
      className="relative min-h-screen overflow-x-clip bg-[#171a1c] font-sans text-[#f4f0e8] selection:bg-[#f08b54] selection:text-[#171a1c]"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee { to { transform: translateX(-50%); } }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes grain-move { 0%, 100% { transform: translate(0, 0); } 16% { transform: translate(-2%, 3%); } 33% { transform: translate(3%, -2%); } 50% { transform: translate(-3%, -3%); } 66% { transform: translate(2%, 2%); } 83% { transform: translate(-1%, 2%); } }
        .animate-marquee { animation: marquee 38s linear infinite; }
        .animate-spin-slow { animation: spin-slow 16s linear infinite; }
        .grain { position: fixed; inset: -100%; z-index: 90; pointer-events: none; opacity: 0.055; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); animation: grain-move 7s steps(6) infinite; }
        .text-outline { color: transparent; -webkit-text-stroke: 1.5px color-mix(in oklab, #f4f0e8 26%, transparent); }
        .u-underline { background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px; background-position: 0 100%; background-repeat: no-repeat; transition: background-size 0.55s cubic-bezier(0.22, 1, 0.36, 1); }
        .u-underline:hover { background-size: 100% 1px; }
        @media (pointer: fine) { .has-custom-cursor, .has-custom-cursor * { cursor: none !important; } }
      `,
        }}
      />

      <SmoothScroll>
        <SiteHeader customer={customer} />
        <main
          id="top"
          className="relative min-h-screen overflow-x-clip bg-[#171a1c] text-[#f4f0e8]"
        >
          <Hero customer={customer} />
          <Marquee />
          <Approach customer={customer} />
          <Work customer={customer} />
          <Stats customer={customer} />
          <Process customer={customer} />
          <Testimonials customer={customer} />
          <Contact customer={customer} />
          <SiteFooter customer={customer} />
        </main>
      </SmoothScroll>
      <Cursor />
      <GrainOverlay />
    </div>
  );
}
