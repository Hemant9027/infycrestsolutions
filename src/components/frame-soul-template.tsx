"use client";

import React, {
  useEffect,
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
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Check,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  User,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

// Deterministic image selector for 1 to 38 local photographer images
const photoImg = (num: number) => `/photographer/${((num * 13) % 38) + 1}.jpg`;

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
  value: number;
  suffix?: string;
  label: string;
};
export type CustomerService = {
  index: string;
  title: string;
  note: string;
  price: string;
  src: string;
};
export type CustomerProject = {
  index: string;
  title: string;
  category: string;
  client: string;
  year: string;
  src: string;
  alt: string;
  span: string;
  offset: string;
  aspect: string;
};
export type CustomerTestimonial = {
  text: string;
  name: string;
  role: string;
};
export type CustomerContact = {
  address?: string;
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
  id?: number;
  slug?: string;
  businessName: string;
  hero: CustomerHero;
  about: CustomerAbout;
  CTA: CustomerCTA;
  theme: CustomerTheme;
  contact: CustomerContact;
  stats?: CustomerStat[];
  services?: CustomerService[];
  projects?: CustomerProject[];
  testimonials?: CustomerTestimonial[];
};

export const demoFrameSoulCustomer: NewCustomer = {
  slug: "frame-and-soul",
  businessName: "Frame & Soul",
  theme: { accent: "#e2b9a7" }, // Blush
  CTA: { label: "Enquire" },
  hero: {
    eyebrow: "LIGHT, HELD STILL — PHOTOGRAPHY STUDIO",
    title: "Stories in the quiet details.",
    description: "An editorial eye for people, places and in-between moments.",
    primaryCta: "View the work",
  },
  about: {
    title: "An editorial eye for people, places and in-between moments.",
    body: "Frame & Soul creates images with atmosphere and honesty for brands, couples and artists with something real to say. We work slowly, shoot on film when it matters, and chase the seconds most people miss.",
    image: photoImg(1),
  },
  stats: [
    { value: 12, suffix: "", label: "Years behind the lens" },
    { value: 240, suffix: "+", label: "Stories told worldwide" },
    { value: 18, suffix: "", label: "Press & print features" },
    { value: 6, suffix: "", label: "International awards" },
  ],
  services: [
    {
      index: "01",
      title: "Portraits",
      note: "Character, lit honestly",
      price: "from $600",
      src: photoImg(2),
    },
    {
      index: "02",
      title: "Weddings",
      note: "Unposed, unforgettable",
      price: "from $2.4k",
      src: photoImg(3),
    },
    {
      index: "03",
      title: "Editorial",
      note: "Pages with a pulse",
      price: "on assignment",
      src: photoImg(4),
    },
    {
      index: "04",
      title: "Brand Stories",
      note: "Objects that speak",
      price: "from $1.8k",
      src: photoImg(5),
    },
  ],
  projects: [
    {
      index: "01",
      title: "A Vow, Unposed",
      category: "Wedding",
      client: "Lake Como, IT",
      year: "2025",
      src: photoImg(6),
      alt: "Wedding veil in wind",
      span: "md:col-span-7",
      offset: "",
      aspect: "aspect-[4/3]",
    },
    {
      index: "02",
      title: "Terra Firma",
      category: "Editorial",
      client: "Costume Journal",
      year: "2026",
      src: photoImg(7),
      alt: "Fashion model editorial",
      span: "md:col-span-5",
      offset: "md:mt-28",
      aspect: "aspect-[3/4]",
    },
    {
      index: "03",
      title: "Stone & Linen",
      category: "Brand Story",
      client: "Atelier Nord",
      year: "2025",
      src: photoImg(8),
      alt: "Artisan ceramics",
      span: "md:col-span-5",
      offset: "md:-mt-28",
      aspect: "aspect-[3/4]",
    },
    {
      index: "04",
      title: "Mara in Motion",
      category: "Portrait",
      client: "Personal series",
      year: "2024",
      src: photoImg(9),
      alt: "Chiaroscuro portrait",
      span: "md:col-span-7",
      offset: "",
      aspect: "aspect-[4/3]",
    },
  ],
  testimonials: [
    {
      text: "Mara saw the day the way it felt, not the way it looked. Half the frames are moments we didn't know had happened — and those are the ones framed in our hallway.",
      name: "Nora & Elias Birk",
      role: "Wedding — Lake Como, 2025",
    },
    {
      text: "Frame & Soul gave our winter issue a pulse. The shadows alone were worth the commission; everything else was a gift.",
      name: "Helga Brandt",
      role: "Fashion Director, Costume Journal",
    },
    {
      text: "They photographed clay and linen like it had a biography. Our site traffic doubled on the strength of those images.",
      name: "Jonas Lindqvist",
      role: "Founder, Atelier Nord",
    },
  ],
  contact: {
    address: "Ryesgade 24, 2nd, 2200 Copenhagen N",
    phone: "+45 33 12 08 90",
    email: "hello@frameandsoul.studio",
  },
};

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
] as const;

const PROJECT_TYPES = ["Wedding", "Portrait", "Editorial", "Brand", "Other"];
const BUDGETS = ["< $5k", "$5k–$10k", "$10k+", "Not sure yet"];

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");
export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;
export const EASE = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------- */
/*                              MOTION PRIMITIVES                             */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 44,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Line({
  children,
  delay = 0,
  className,
  started = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  started?: boolean;
}) {
  return (
    <span className={cn("block overflow-hidden", className)}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "112%" }}
        animate={started ? { y: "0%" } : { y: "112%" }}
        transition={{ duration: 1.15, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SectionTag({
  index,
  label,
  dark = false,
  className,
}: {
  index: string;
  label: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={className} y={20}>
      <div className="flex items-center gap-5">
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.3em]",
            dark ? "text-[#e2b9a7]" : "text-[#b0553f]",
          )}
        >
          {index}
        </span>
        <span
          className={cn(
            "h-px w-14",
            dark ? "bg-[#e2b9a7]/50" : "bg-[#2e2926]/30",
          )}
        />
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.3em]",
            dark ? "text-[#f3eee3]/70" : "text-[#2e2926]/60",
          )}
        >
          {label}
        </span>
      </div>
    </Reveal>
  );
}

export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  speed = 8,
  sizes = "100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  speed?: number;
  sizes?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed}%`, `${speed}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -inset-y-[14%] will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
          unoptimized
        />
      </motion.div>
    </div>
  );
}

export function Counter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 160, damping: 14, mass: 0.15 });
  const y = useSpring(rawY, { stiffness: 160, damping: 14, mass: 0.15 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        rawX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        rawY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
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
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!(target instanceof HTMLElement)) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.7 });
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

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const DURATION = 1900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!done.current) {
        done.current = true;
        setTimeout(onDone, 380);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#211c19] px-6 py-8 text-[#f3eee3] lg:px-12"
      initial={false}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 1, ease: EASE }}
    >
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.35em] text-[#f3eee3]/50">
        <span>Photography studio</span>
        <span>CPH · DK</span>
      </div>
      <div className="flex items-center justify-center">
        <div className="overflow-hidden">
          <motion.p
            initial={{ y: "108%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="font-serif text-4xl font-light tracking-[0.12em] sm:text-6xl"
          >
            Frame <span className="italic text-[#e2b9a7]">&amp;</span> Soul
          </motion.p>
        </div>
      </div>
      <div className="relative px-6 pb-8 lg:px-12">
        <div className="flex items-end justify-between">
          <span className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#f3eee3]/50">
            Loading the light
          </span>
          <span className="font-serif text-7xl font-light leading-none tabular-nums text-[#e2b9a7] sm:text-8xl">
            {count}
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-[#f3eee3]/15">
          <div
            className="h-px bg-[#e2b9a7] transition-[width] duration-100 ease-linear"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<"default" | "link" | "view">(
    "default",
  );

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 350, damping: 35, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 35, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const enableTimer = window.setTimeout(() => setEnabled(true), 0);

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const tagged = target.closest("[data-cursor]");
      if (tagged) {
        setVariant(
          tagged.getAttribute("data-cursor") === "view" ? "view" : "link",
        );
        return;
      }
      if (
        target.closest(
          "a, button, input, textarea, select, label, [role='button']",
        )
      ) {
        setVariant("link");
        return;
      }
      setVariant("default");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.clearTimeout(enableTimer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className={cn(
            "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
            variant === "view"
              ? "bg-[#e2b9a7] text-[#2e2926]"
              : variant === "link"
                ? "border border-[#2e2926]/40 mix-blend-difference invert"
                : "border border-[#2e2926]/30",
          )}
          animate={{
            width: variant === "view" ? 96 : variant === "link" ? 48 : 32,
            height: variant === "view" ? 96 : variant === "link" ? 48 : 32,
            backgroundColor:
              variant === "view"
                ? "rgba(226,185,167,0.9)"
                : "rgba(226,185,167,0)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          {variant === "view" && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2e2926]">
              View
            </span>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[96]"
        style={{ x, y }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e2b9a7]"
          animate={{
            width: variant === "view" ? 0 : 8,
            height: variant === "view" ? 0 : 8,
            opacity: visible && variant !== "view" ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </>
  );
}

export function GrainOverlay() {
  return <div className="grain" aria-hidden="true" />;
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

export function Header({
  ready,
  businessName = "Frame & Soul",
}: {
  ready: boolean;
  businessName?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 48));

  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  const dark = scrolled && !open;

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-colors duration-500",
          dark
            ? "border-b border-[#2e2926]/10 bg-[#f3eee3]/85 text-[#2e2926] backdrop-blur-xl"
            : "border-b border-white/0 text-[#f3eee3]",
        )}
      >
        <div className="flex h-[72px] items-center justify-between px-6 lg:px-12">
          <a
            href="#top"
            className="font-serif text-[22px] font-light tracking-[0.14em]"
          >
            {businessName}
          </a>
          <nav className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500",
                  dark
                    ? "text-[#2e2926]/80 hover:text-[#2e2926]"
                    : "text-[#f3eee3]/85 hover:text-[#e2b9a7]",
                )}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Magnetic strength={0.3} className="hidden sm:block">
              <a
                href="#contact"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500",
                  dark
                    ? "bg-[#2e2926] text-[#f3eee3] hover:bg-[#211c19]"
                    : "bg-[#e2b9a7] text-[#2e2926] hover:bg-[#f3eee3]",
                )}
              >
                Enquire <ArrowUpRight className="size-3.5" />
              </a>
            </Magnetic>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "grid size-10 place-items-center rounded-full border transition-colors md:hidden",
                dark || open
                  ? "border-[#2e2926]/20 text-[#2e2926]"
                  : "border-[#f3eee3]/30 text-[#f3eee3]",
                open && "border-[#f3eee3]/30 text-[#f3eee3]",
              )}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: EASE }}
            className="fixed inset-0 z-[75] flex flex-col justify-between bg-[#211c19] px-6 pb-10 pt-32 text-[#f3eee3]"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((item, i) => (
                <div key={item.href} className="overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.07,
                      ease: EASE,
                    }}
                    className="block font-serif text-6xl font-light leading-[1.08]"
                  >
                    {item.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between border-t border-[#f3eee3]/15 pt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f3eee3]/50"
            >
              <span>Copenhagen — Worldwide</span>
              <span>Est. 2014</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Hero({
  started,
  customer,
}: {
  started: boolean;
  customer: NewCustomer;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const LABEL = text(
    customer.hero?.eyebrow,
    "LIGHT, HELD STILL — PHOTOGRAPHY STUDIO",
  );
  const fullTitle = text(customer.hero?.title, "Stories in the quiet details.");
  const words = fullTitle.split(" ");
  const firstPart = words.slice(0, 3).join(" ");
  const italicPart = words.slice(3).join(" ");

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden bg-[#211c19] text-[#f3eee3]"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.22 }}
          animate={started ? { scale: 1.02 } : { scale: 1.22 }}
          transition={{ duration: 2.4, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={customer.about?.image || photoImg(1)}
            alt="Hero backdrop"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/25" />

      <motion.div
        style={{ opacity: fade, y: textY }}
        className="relative z-10 px-6 pb-10 lg:px-12"
      >
        <p className="mb-7 flex flex-wrap gap-x-[0.45em] overflow-hidden text-[10px] font-semibold uppercase tracking-[0.38em] text-[#e2b9a7] sm:text-xs">
          {LABEL.split(" ").map((word, i) => (
            <span key={i} className="overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: "120%" }}
                animate={started ? { y: "0%" } : { y: "120%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.5 + i * 0.055,
                  ease: EASE,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>
        <h1 className="font-serif text-[clamp(3.4rem,11.5vw,10.5rem)] font-light leading-[0.9] tracking-[-0.015em]">
          <Line started={started} delay={0.65}>
            {firstPart}
          </Line>
          <Line started={started} delay={0.78}>
            <em className="italic text-[#e2b9a7]">{italicPart}</em>
          </Line>
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={{ duration: 1, delay: 1.05, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic strength={0.28}>
            <a
              href="#work"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#e2b9a7] px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2e2926] transition-colors duration-300 hover:bg-[#f3eee3]"
            >
              {text(customer.hero?.primaryCta, "View the work")}{" "}
              <ArrowUpRight className="size-4" />
            </a>
          </Magnetic>
          <Magnetic strength={0.28}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-[#f3eee3]/35 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3eee3] transition-colors duration-300 hover:border-[#f3eee3] hover:bg-[#f3eee3]/10"
            >
              Start a project
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="relative z-10 flex items-center justify-between border-t border-[#f3eee3]/15 px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f3eee3]/60 lg:px-12"
      >
        <span className="hidden sm:block">Copenhagen, DK</span>
        <span className="hidden md:block">Available worldwide</span>
        <span className="flex items-center gap-2">
          Scroll{" "}
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-3.5" />
          </motion.span>
        </span>
      </motion.div>
    </section>
  );
}

const MARQUEE_ITEMS = [
  "Portraits",
  "Weddings",
  "Editorial",
  "Brand Stories",
  "In-Between Moments",
  "Still Life",
] as const;

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center">
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="whitespace-nowrap px-7 font-serif text-3xl font-light italic sm:text-4xl">
            {item}
          </span>
          <Asterisk className="size-6 shrink-0 text-[#2e2926]/70" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-[#2e2926]/10 bg-[#e2b9a7] py-6 text-[#2e2926]">
      <div className="flex w-max animate-marquee">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </div>
  );
}

export function About({ customer }: { customer: NewCustomer }) {
  const stats =
    customer.stats && customer.stats.length > 0
      ? customer.stats
      : [
          { value: 12, suffix: "", label: "Years behind the lens" },
          { value: 240, suffix: "+", label: "Stories told worldwide" },
          { value: 18, suffix: "", label: "Press & print features" },
          { value: 6, suffix: "", label: "International awards" },
        ];

  return (
    <section id="about" className="px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionTag index="01" label="The studio" />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <h2 className="font-serif text-[clamp(2.4rem,5.2vw,4.6rem)] font-light leading-[1.02] tracking-[-0.01em] lg:col-span-8">
            <Line>
              {
                text(
                  customer.about?.title,
                  "An editorial eye for people, places and in-between moments.",
                ).split("editorial")[0]
              }
              editorial
            </Line>
            <Line>
              people, places and{" "}
              <em className="italic text-[#b0553f]">in-between</em> moments.
            </Line>
          </h2>
          <div className="lg:col-span-4 lg:pt-8">
            <Reveal delay={0.25}>
              <p className="max-w-md text-lg leading-relaxed text-[#2e2926]/65">
                {text(
                  customer.about?.body,
                  "Frame & Soul creates images with atmosphere and honesty for brands, couples and artists with something real to say. We work slowly, shoot on film when it matters, and chase the seconds most people miss.",
                )}
              </p>
              <a
                href="#contact"
                className="group mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2e2926]"
              >
                <span className="border-b border-[#2e2926]/30 pb-1 transition-colors group-hover:border-[#2e2926]">
                  More about the studio
                </span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
        <div className="mt-24 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <ParallaxImage
                src={customer.about?.image || photoImg(10)}
                alt="Studio founder"
                className="aspect-[3/4] w-full"
                imageClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                sizes="(min-width: 1024px) 40vw, 100vw"
                speed={6}
              />
              <div className="mt-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.26em] text-[#2e2926]/50">
                <span>Mara Voss · Founder</span>
                <span>Principal photographer</span>
              </div>
            </Reveal>
          </div>
          <div className="flex flex-col justify-between lg:col-span-7 lg:pl-10">
            <Reveal delay={0.15}>
              <p className="max-w-xl font-serif text-2xl font-light leading-snug text-[#2e2926]/85 sm:text-3xl">
                &ldquo;A photograph should feel like the minute before the one
                everyone remembers — quiet, a little uneven,{" "}
                <em className="italic text-[#b0553f]">completely true.</em>
                &rdquo;
              </p>
            </Reveal>
            <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={0.1 + i * 0.08}>
                  <div className="border-t border-[#2e2926]/15 pt-5">
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      className="font-serif text-6xl font-light leading-none text-[#2e2926] sm:text-7xl"
                    />
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2e2926]/50">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Work({ customer }: { customer: NewCustomer }) {
  const projects =
    customer.projects && customer.projects.length > 0
      ? customer.projects
      : demoFrameSoulCustomer.projects!;

  const ProjectCard = ({ project }: { project: CustomerProject }) => (
    <Reveal className={cn(project.span, project.offset)} y={70}>
      <article className="group" data-cursor="view">
        <div
          className={cn(
            "relative overflow-hidden bg-[#211c19]",
            project.aspect,
          )}
        >
          <Image
            src={project.src}
            alt={project.alt}
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <span className="absolute left-5 top-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f3eee3]/90">
            {project.index}
          </span>
          <span className="absolute bottom-5 right-5 inline-flex translate-y-2 items-center gap-2 rounded-full bg-[#e2b9a7] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2e2926] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            View case <ArrowUpRight className="size-3.5" />
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-6 border-t border-[#f3eee3]/20 pt-4">
          <h3 className="font-serif text-3xl font-light leading-tight text-[#f3eee3] sm:text-4xl">
            {project.title}
          </h3>
          <div className="shrink-0 text-right text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f3eee3]/50">
            <p className="text-[#e2b9a7]">{project.category}</p>
            <p className="mt-1.5">{project.client}</p>
            <p className="mt-1.5">{project.year}</p>
          </div>
        </div>
      </article>
    </Reveal>
  );

  return (
    <>
      <section
        id="work"
        className="bg-[#2e2926] px-6 py-28 text-[#f3eee3] lg:px-12 lg:py-40"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionTag index="02" label="Selected work" dark />
              <Reveal delay={0.1}>
                <h2 className="mt-10 font-serif text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-none">
                  The <em className="italic text-[#e2b9a7]">portfolio.</em>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="max-w-xs text-sm leading-relaxed text-[#f3eee3]/50">
                Four stories from the last two years — chosen for texture,
                weather and what was left unsaid.
              </p>
            </Reveal>
          </div>
          <div className="mt-20 grid gap-x-6 gap-y-20 md:grid-cols-12">
            {projects.map((project) => (
              <ProjectCard key={project.index} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex h-[62vh] min-h-[420px] items-center justify-center overflow-hidden">
        <ParallaxImage
          src={photoImg(15)}
          alt="Champagne silk fabric"
          className="absolute inset-0"
          speed={10}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <Reveal className="relative z-10 max-w-4xl px-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#e2b9a7]">
            Field notes
          </p>
          <p className="mt-6 font-serif text-3xl font-light leading-snug text-[#f3eee3] sm:text-5xl">
            &ldquo;The in-between is where{" "}
            <em className="italic text-[#e2b9a7]">the truth</em> lives.&rdquo;
          </p>
        </Reveal>
      </section>
    </>
  );
}

export function Services({ customer }: { customer: NewCustomer }) {
  const services =
    customer.services && customer.services.length > 0
      ? customer.services
      : demoFrameSoulCustomer.services!;
  const [active, setActive] = useState<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    const pointerTimer = window.setTimeout(
      () => setFinePointer(window.matchMedia("(pointer: fine)").matches),
      0,
    );
    const onMove = (event: MouseEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.clearTimeout(pointerTimer);
      window.removeEventListener("mousemove", onMove);
    };
  }, [rawX, rawY]);

  return (
    <section id="services" className="px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionTag index="03" label="Capabilities" />
            <Reveal delay={0.1}>
              <h2 className="mt-10 font-serif text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-none">
                What we <em className="italic text-[#b0553f]">do.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-xs text-sm leading-relaxed text-[#2e2926]/55">
              Four disciplines, one way of seeing. Every commission includes
              direction, the shoot itself and hand-graded post-production.
            </p>
          </Reveal>
        </div>
        <div ref={listRef} className="relative mt-20" data-cursor="link">
          {services.map((service, i) => (
            <Reveal key={service.index} y={30}>
              <a
                href="#contact"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  "group grid grid-cols-12 items-center gap-4 border-t border-[#2e2926]/15 py-9 transition-colors duration-500 sm:py-11",
                  i === services.length - 1 && "border-b",
                )}
              >
                <span className="col-span-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2e2926]/40 sm:col-span-1">
                  {service.index}
                </span>
                <h3 className="col-span-10 font-serif text-4xl font-light leading-none text-[#2e2926] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:italic sm:col-span-6 sm:text-6xl">
                  {service.title}
                </h3>
                <div className="col-span-9 col-start-3 sm:col-span-3 sm:col-start-8">
                  <p className="text-sm text-[#2e2926]/50">{service.note}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b0553f]">
                    {service.price}
                  </p>
                </div>
                <span className="col-span-3 col-start-10 flex justify-end sm:col-span-2 sm:col-start-11">
                  <span className="grid size-11 place-items-center rounded-full border border-[#2e2926]/20 transition-all duration-500 group-hover:border-[#2e2926] group-hover:bg-[#2e2926] group-hover:text-[#f3eee3]">
                    <ArrowUpRight className="size-4" />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
          {finePointer && (
            <motion.div
              style={{ x, y }}
              className="pointer-events-none fixed left-0 top-0 z-[60]"
            >
              <div className="relative -translate-x-1/2 -translate-y-[112%]">
                <AnimatePresence>
                  {active !== null && (
                    <motion.div
                      key={active}
                      initial={{ clipPath: "inset(100% 0 0 0)", scale: 0.94 }}
                      animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
                      exit={{ clipPath: "inset(0 0 100% 0)", scale: 0.96 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="h-[300px] w-[230px] overflow-hidden"
                    >
                      <Image
                        src={services[active].src}
                        alt=""
                        width={460}
                        height={600}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ customer }: { customer: NewCustomer }) {
  const testimonials =
    customer.testimonials && customer.testimonials.length > 0
      ? customer.testimonials
      : demoFrameSoulCustomer.testimonials!;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((v) => (v + 1) % testimonials.length),
      6500,
    );
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  const step = (dir: 1 | -1) =>
    setIndex((v) => (v + dir + testimonials.length) % testimonials.length);
  const quote = testimonials[index];

  return (
    <section
      className="bg-[#211c19] px-6 py-28 text-[#f3eee3] lg:px-12 lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionTag index="04" label="Kind words" dark />
          <Reveal className="mt-12">
            <Quote className="size-9 text-[#e2b9a7]" fill="currentColor" />
          </Reveal>
          <div className="mt-8 min-h-[240px] sm:min-h-[210px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.65, ease: EASE }}
              >
                <p className="max-w-3xl font-serif text-2xl font-light leading-snug text-[#f3eee3]/90 sm:text-4xl">
                  &quot;{quote.text}&quot;
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  <span className="h-px w-10 bg-[#e2b9a7]" />
                  <div>
                    <p className="text-sm font-semibold tracking-wide text-[#f3eee3]">
                      {quote.name}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f3eee3]/45">
                      {quote.role}
                    </p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div className="mt-12 flex items-center gap-6">
            <div className="flex gap-3">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  aria-label={dir === -1 ? "Previous" : "Next"}
                  onClick={() => step(dir)}
                  className="grid size-12 place-items-center rounded-full border border-[#f3eee3]/25 text-[#f3eee3] transition-colors duration-300 hover:bg-[#e2b9a7] hover:text-[#2e2926]"
                >
                  {dir === -1 ? (
                    <ArrowLeft className="size-4" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f3eee3]/45">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(testimonials.length).padStart(2, "0")}
            </span>
            <div className="hidden h-px flex-1 bg-[#f3eee3]/10 sm:block">
              <motion.div
                className="h-px bg-[#e2b9a7]"
                animate={{
                  width: `${((index + 1) / testimonials.length) * 100}%`,
                }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
          </div>
        </div>
        <div className="hidden lg:col-span-4 lg:block">
          <Reveal delay={0.2}>
            <ParallaxImage
              src={photoImg(16)}
              alt="Cafe moment"
              className="aspect-[4/5] w-full"
              speed={7}
              sizes="33vw"
            />
            <div className="mt-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f3eee3]/40">
              <span>Café Dyrehaven, CPH</span>
              <span className="text-[#e2b9a7]">35mm film</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Contact({ customer }: { customer: NewCustomer }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (message.trim().length < 10) {
      setError("Tell us a little more about the project (10+ characters).");
      return;
    }
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  const inputClass =
    "w-full border-b border-[#2e2926]/20 bg-transparent py-3.5 text-base text-[#2e2926] placeholder:text-[#2e2926]/30 transition-colors duration-300 focus:border-[#2e2926] focus:outline-none";

  return (
    <section id="contact" className="px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTag index="05" label="Enquiries" />
          <h2 className="mt-12 font-serif text-[clamp(2.6rem,5.5vw,5rem)] font-light leading-[1.0]">
            <Line>Let&apos;s make</Line>
            <Line>something</Line>
            <Line>
              <em className="italic text-[#b0553f]">worth remembering.</em>
            </Line>
          </h2>
          <Reveal delay={0.2} className="mt-12 space-y-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2926]/45">
                Write to us
              </p>
              <a
                href={`mailto:${customer.contact?.email}`}
                className="mt-2 inline-block border-b border-[#2e2926]/25 pb-1 font-serif text-2xl font-light transition-colors hover:border-[#2e2926]"
              >
                {text(customer.contact?.email, "hello@frameandsoul.studio")}
              </a>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm leading-relaxed text-[#2e2926]/60">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2926]/45">
                  Studio
                </p>
                <p className="mt-2">
                  {text(
                    customer.contact?.address,
                    "Ryesgade 24, 2nd · 2200 Copenhagen N",
                  )}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2926]/45">
                  Elsewhere
                </p>
                <p className="mt-2">
                  Instagram · @frameandsoul
                  <br />
                  Vimeo · /frameandsoul
                </p>
              </div>
            </div>
            <p className="max-w-sm font-serif text-lg font-light italic leading-relaxed text-[#2e2926]/60">
              We take on a limited number of commissions each season — autumn
              2026 is now open.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:pl-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="flex h-full min-h-[420px] flex-col items-start justify-center border border-[#2e2926]/15 bg-[#e9e1d7]/60 px-8 py-14 sm:px-14"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 14,
                    delay: 0.2,
                  }}
                  className="grid size-16 place-items-center rounded-full bg-[#2e2926] text-[#f3eee3]"
                >
                  <Check className="size-7" />
                </motion.span>
                <h3 className="mt-8 font-serif text-4xl font-light leading-tight sm:text-5xl">
                  Thank you, {name.split(" ")[0] || "friend"}.
                </h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-[#2e2926]/60">
                  Your enquiry is safely in our inbox. We reply within 48 hours
                  — usually with too many references and one honest question
                  back.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setName("");
                    setEmail("");
                    setProjectType("");
                    setBudget("");
                    setMessage("");
                  }}
                  className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2e2926] underline underline-offset-8 decoration-[#2e2926]/30 transition-colors hover:decoration-[#2e2926]"
                >
                  Send another enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="space-y-10"
              >
                <Reveal>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2926]/45">
                    What are we making?
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {PROJECT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setProjectType(type)}
                        className={cn(
                          "rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300",
                          projectType === type
                            ? "border-[#2e2926] bg-[#2e2926] text-[#f3eee3]"
                            : "border-[#2e2926]/25 text-[#2e2926]/70 hover:border-[#2e2926]/60",
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2926]/45">
                        Your name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Asta Holm"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2926]/45">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="asta@studio.dk"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.14}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2926]/45">
                    Budget — optional
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(budget === b ? "" : b)}
                        className={cn(
                          "rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300",
                          budget === b
                            ? "border-[#b0553f] bg-[#b0553f] text-[#f3eee3]"
                            : "border-[#2e2926]/25 text-[#2e2926]/70 hover:border-[#2e2926]/60",
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2926]/45">
                    The story so far
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="Where, when, who — and what it should feel like."
                    className={cn(inputClass, "resize-none")}
                  />
                </Reveal>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium text-[#b0553f]"
                  >
                    {error}
                  </motion.p>
                )}
                <Reveal delay={0.24}>
                  <div className="flex flex-wrap items-center gap-6">
                    <Magnetic strength={0.25}>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="inline-flex items-center gap-3 rounded-full bg-[#2e2926] px-9 py-4.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3eee3] transition-colors duration-300 hover:bg-black disabled:opacity-60"
                      >
                        {status === "sending" ? (
                          <>
                            Sending <Loader2 className="size-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            Send enquiry <ArrowUpRight className="size-4" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                    <p className="text-xs leading-relaxed text-[#2e2926]/45">
                      No newsletters, no noise.
                      <br />
                      Just one thoughtful reply.
                    </p>
                  </div>
                </Reveal>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function Footer({
  businessName = "Frame & Soul",
}: {
  businessName?: string;
}) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/Copenhagen",
      }).format(new Date());
    const initialTimer = window.setTimeout(() => setTime(format()), 0);
    const id = setInterval(() => setTime(format()), 1000);
    return () => {
      window.clearTimeout(initialTimer);
      clearInterval(id);
    };
  }, []);

  const SOCIALS = ["Instagram", "Vimeo", "Behance"];
  const SITEMAP = [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="bg-[#211c19] px-6 pb-10 pt-24 text-[#f3eee3] lg:px-12 lg:pt-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <a
            href="mailto:hello@frameandsoul.studio"
            className="group block border-b border-[#f3eee3]/10 pb-14"
            data-cursor="link"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#e2b9a7]">
              One honest frame at a time
            </p>
            <p className="mt-6 font-serif text-[clamp(3.2rem,12vw,11rem)] font-light leading-[0.85] tracking-[-0.02em]">
              {businessName}
              <ArrowUpRight className="ml-3 inline size-[0.35em] text-[#e2b9a7] transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2" />
            </p>
          </a>
        </Reveal>
        <div className="grid gap-12 py-14 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f3eee3]/40">
              Sitemap
            </p>
            <ul className="mt-5 space-y-2.5">
              {SITEMAP.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-[#f3eee3]/70 transition-colors hover:text-[#e2b9a7]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f3eee3]/40">
              Socials
            </p>
            <ul className="mt-5 space-y-2.5">
              {SOCIALS.map((item) => (
                <li key={item}>
                  <a
                    href="#top"
                    className="group inline-flex items-center gap-1.5 text-sm text-[#f3eee3]/70 transition-colors hover:text-[#e2b9a7]"
                  >
                    {item}{" "}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f3eee3]/40">
              Studio time
            </p>
            <p className="mt-5 font-serif text-3xl font-light tabular-nums text-[#f3eee3]">
              {time || "--:--:--"}
            </p>
            <p className="mt-1.5 text-sm text-[#f3eee3]/50">
              Copenhagen · Ørrebro
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[#f3eee3]/10 pt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f3eee3]/40">
          <span>
            © {new Date().getFullYear()} {businessName} Studio
          </span>
          <span className="hidden md:block">
            All photographs shot by the studio
          </span>
          <span>Designed by Infycrest Solutions</span>
          <Magnetic strength={0.4}>
            <button
              type="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="grid size-12 place-items-center rounded-full border border-[#f3eee3]/25 text-[#f3eee3] transition-colors duration-300 hover:bg-[#e2b9a7] hover:text-[#2e2926]"
            >
              <ArrowUp className="size-4" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumPhotographerTemplate({
  customer = demoFrameSoulCustomer,
}: {
  customer?: NewCustomer;
}) {
  const [loaded, setLoaded] = useState(false);

  const style = {
    "--brand-accent": text(customer.theme?.accent, "#e2b9a7"),
  } as CSSProperties;

  return (
    <div
      style={style}
      className="relative bg-[#f3eee3] font-sans text-[#2e2926] selection:bg-[#e2b9a7] selection:text-[#2e2926] min-h-screen"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee { to { transform: translate3d(-50%, 0, 0); } }
        .animate-marquee { animation: marquee 44s linear infinite; }
        .grain { position: fixed; inset: 0; z-index: 70; pointer-events: none; mix-blend-mode: overlay; opacity: 0.55; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.16'/%3E%3C/svg%3E"); background-size: 180px 180px; }
        @media (pointer: fine) { body, a, button, [role="button"], input, textarea, select, label { cursor: none; } }
      `,
        }}
      />

      <SmoothScroll>
        <AnimatePresence>
          {!loaded && <Preloader onDone={() => setLoaded(true)} />}
        </AnimatePresence>

        <Cursor />
        <GrainOverlay />
        <Header ready={loaded} businessName={customer.businessName} />

        <main id="top" className="bg-[#f3eee3] text-[#2e2926]">
          <Hero started={loaded} customer={customer} />
          <Marquee />
          <About customer={customer} />
          <Work customer={customer} />
          <Services customer={customer} />
          <Testimonials customer={customer} />
          <Contact customer={customer} />
        </main>

        <Footer businessName={customer.businessName} />
      </SmoothScroll>
    </div>
  );
}
