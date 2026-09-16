"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
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
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  MailCheck,
  Menu as MenuIcon,
  Plus,
  Send,
  Users,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

const restImg = (num: number) => `/restaurant/${num}.jpg`;

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
  decimals: number;
  label: string;
};
export type CustomerService = {
  name: string;
  origin: string;
  notes: string;
  price: string;
  tag?: string;
  image: string;
};
export type CustomerGalleryItem = {
  image: string;
  title: string;
  meta: string;
  wide?: boolean;
};
export type CustomerProcessStep = {
  n: string;
  title: string;
  body: string;
  caption: string;
  image: string;
};
export type CustomerContact = {
  address?: string[];
  hours?: { days: string; time: string }[];
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
  heroImages?: string[];
  stats?: CustomerStat[];
  services?: CustomerService[];
  gallery?: CustomerGalleryItem[];
  process?: CustomerProcessStep[];
};

export const demoCafeCustomer: NewCustomer = {
  slug: "roast-and-ritual",
  businessName: "Roast & Ritual",
  theme: { accent: "#a87955" }, // Caramel
  CTA: { label: "Book a table" },
  hero: {
    eyebrow: "Take your time · Specialty coffee · Est. 2016",
    title: "Coffee worth slowing down for.",
    description:
      "A small room on Alder Street where expressive coffees, dawn-baked pastry and twenty unhurried minutes are the whole point.",
    primaryCta: "Explore the menu",
  },
  heroImages: [restImg(1)],
  about: {
    title: "A warm room for good coffee & better mornings.",
    body: "We are a small room with a long attention span. We buy coffees that taste like somewhere — a farm in Guji, a hillside in Huila — then roast them gently and pour them slowly. The rest is up to you: a window seat, a warm cup, twenty unhurried minutes.",
  },
  stats: [
    {
      value: 12,
      decimals: 0,
      label: "single origins a year, chased by harvest",
    },
    { value: 48, decimals: 0, label: "hours — roast to cup, never more" },
    { value: 18, decimals: 0, label: "hours steeping in the cold brew cellar" },
    { value: 92.5, decimals: 1, label: "degrees at the group head, precisely" },
  ],
  services: [
    {
      name: "Espresso",
      origin: "Ritual Blend · Brazil + Ethiopia",
      notes: "hazelnut, burnt sugar, black cherry",
      price: "3.5",
      tag: "House",
      image: restImg(2),
    },
    {
      name: "Cortado",
      origin: "Colombia · Huila",
      notes: "caramel, red apple, cacao nib",
      price: "4.0",
      image: restImg(3),
    },
    {
      name: "Flat white",
      origin: "Ethiopia · Guji",
      notes: "bergamot, stone fruit, spun silk",
      price: "4.5",
      tag: "Guest",
      image: restImg(4),
    },
    {
      name: "Pour over",
      origin: "Slow bar · rotating single origin",
      notes: "brewed to order at 92.5° · three unhurried minutes",
      price: "5.5",
      tag: "Slow",
      image: restImg(5),
    },
    {
      name: "Cold brew tonic",
      origin: "18-hour steep · Guatemala Antigua",
      notes: "orange peel, juniper, one long cube",
      price: "5.0",
      image: restImg(6),
    },
    {
      name: "Cardamom bun + pour",
      origin: "Baked at dawn · paired for you",
      notes: "our pastry chef's answer to Mondays",
      price: "7.5",
      tag: "Duo",
      image: restImg(7),
    },
  ],
  process: [
    {
      n: "01",
      title: "Source",
      body: "We chase harvests, not trends. Each coffee lands in our roastery within weeks of leaving origin — bought at prices that let farmers do their best work again next year.",
      caption: "Guji, Ethiopia · 2,100 masl",
      image: restImg(8),
    },
    {
      n: "02",
      title: "Roast",
      body: "Ten-kilo batches, every Tuesday and Friday. Light enough to taste the place, developed enough to feel like comfort. Never roasted more than 48 hours before your cup.",
      caption: "The P12 · batch 2,418",
      image: restImg(9),
    },
    {
      n: "03",
      title: "Brew",
      body: "Every recipe is weighed, timed and tasted before the doors open. Espresso dialed at dawn; filters blooming for a patient forty-five seconds at the slow bar.",
      caption: "Kalita 185 · 22g in, 350g out",
      image: restImg(10),
    },
    {
      n: "04",
      title: "Ritual",
      body: "The best part isn't ours — it's yours. The first sip by the window, the notebook, the quiet ten minutes before the day begins. We just make sure the coffee deserves it.",
      caption: "Table nine · Sundays, 9am",
      image: restImg(11),
    },
  ],
  gallery: [
    {
      image: restImg(12),
      title: "First pour of the day",
      meta: "06:47 · the bar",
    },
    {
      image: restImg(13),
      title: "The reading corner",
      meta: "Table four · west window",
      wide: true,
    },
    { image: restImg(14), title: "Study in milk", meta: "Slow bar · no. 3" },
    {
      image: restImg(15),
      title: "Pain au chocolat",
      meta: "Saturdays only · 9am",
    },
    {
      image: restImg(16),
      title: "House blend, unblended",
      meta: "Green room · cupping table",
      wide: true,
    },
  ],
  contact: {
    address: ["428 Alder Street", "Portland, Oregon"],
    phone: "+1 (503) 555-0128",
    email: "hello@roastandritual.coffee",
    hours: [
      { days: "Monday — Friday", time: "6:30 — 17:00" },
      { days: "Saturday", time: "7:30 — 18:00" },
      { days: "Sunday", time: "8:00 — 16:00" },
    ],
  },
};

const NAV_LINKS = [
  { label: "Coffee", href: "#coffee" },
  { label: "Story", href: "#story" },
  { label: "Process", href: "#ritual" },
  { label: "Visit", href: "#visit" },
] as const;

const HERO_TICKER = [
  "Ethiopia Guji · floral, apricot",
  "Colombia Huila · caramel, red apple",
  "Brazil Cerrado · hazelnut, cocoa",
  "18-hour cold brew",
  "Baked at dawn, gone by noon",
  "Slow bar open daily",
] as const;

export const TIME_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
] as const;

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

export const EASE = [0.16, 1, 0.3, 1] as const;

function BrandMark({ brandName }: { brandName: string }) {
  const [first, second] = brandName.split("&").map((part) => part.trim());
  return (
    <>
      {first}
      {second && (
        <>
          <em className="text-[#a87955]">&amp;</em> {second}
        </>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MOTION PRIMITIVES                             */
/* -------------------------------------------------------------------------- */

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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 14, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 160, damping: 14, mass: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = "110%",
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: string | number;
  className?: string;
  once?: boolean;
}) {
  return (
    <span className={cn("block overflow-hidden", className)}>
      <motion.span
        className="block will-change-transform"
        initial={{ y }}
        whileInView={{ y: 0 }}
        viewport={{ once, margin: "-12% 0px -12% 0px" }}
        transition={{ duration: 1.05, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className,
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTag({
  index,
  label,
  dark = false,
}: {
  index: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <FadeIn
      y={16}
      className={cn(
        "flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em]",
        dark ? "text-[#e2bd93]" : "text-[#a87955]",
      )}
    >
      <span>{index}</span>
      <span
        className={cn(
          "h-px w-16 origin-left",
          dark ? "bg-[#e2bd93]/40" : "bg-[#a87955]/40",
        )}
      />
      <span>{label}</span>
    </FadeIn>
  );
}

export function Counter({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useMotionInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className={className}>
      {(0).toFixed(decimals)}
    </span>
  );
}

export function RotatingBadge({
  text,
  className,
  centerIcon,
}: {
  text: string;
  className?: string;
  centerIcon?: ReactNode;
}) {
  return (
    <div className={cn("relative grid place-items-center", className)}>
      <svg viewBox="0 0 120 120" className="animate-spin-slow size-full">
        <defs>
          <path
            id="rr-circle"
            d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
            fill="none"
          />
        </defs>
        <text className="fill-current text-[9.5px] font-semibold uppercase tracking-[0.24em]">
          <textPath href="#rr-circle">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        {centerIcon}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INTERACTIVE FX                               */
/* -------------------------------------------------------------------------- */

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    (window as any).__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        duration: 1.5,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
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

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 38, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 420, damping: 38, mass: 0.7 });
  const dotX = useSpring(x, { stiffness: 1600, damping: 80, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1600, damping: 80, mass: 0.2 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(
        "a, button, input, select, textarea, [data-cursor]",
      ) as HTMLElement | null;
      setHovering(Boolean(el));
      const tagged = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      setLabel(tagged?.dataset.cursor?.trim() || null);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });

    return () => {
      document.body.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[110] mix-blend-difference"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70"
          animate={{
            width: label ? 76 : hovering ? 56 : 34,
            height: label ? 76 : hovering ? 56 : 34,
            opacity: 1,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-white"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[111] mix-blend-difference"
        style={{ x: dotX, y: dotY }}
      >
        <div className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </motion.div>
    </>
  );
}

export function Preloader({ brandName }: { brandName: string }) {
  const STAGES = ["Sourcing", "Roasting", "Blooming", "Pouring", "Ready"];
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    timer.current = setInterval(() => {
      setCount((c) => {
        const next = Math.min(100, c + 4 + Math.floor(Math.random() * 7));
        if (next >= 100 && timer.current) clearInterval(timer.current);
        return next;
      });
    }, 130);
    return () => {
      if (timer.current) clearInterval(timer.current);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (count >= 100) {
      const t = setTimeout(() => setDone(true), 550);
      return () => clearTimeout(t);
    }
  }, [count]);

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor(count / 21))];
  const brandParts = brandName.split("&");
  const part1 = brandParts[0]?.trim() || "Roast";
  const part2 = brandParts[1]?.trim() || "";

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#f4eee5] px-6 py-8 lg:px-12"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[#1d130d]/10">
            <motion.div
              className="h-full bg-[#a87955]"
              animate={{ scaleX: count / 100 }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1d130d]/60">
            <span>Specialty coffee · Portland</span>
            <span className="hidden sm:block">Est. 2016</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <h1 className="font-serif text-[13vw] font-light leading-[0.85] tracking-tight text-[#1d130d] sm:text-7xl lg:text-8xl">
              {(part2 ? `${part1} &` : part1).split("").map((ch, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      ease: EASE,
                      delay: 0.15 + i * 0.035,
                    }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                </span>
              ))}{" "}
              {part2 && (
                <em className="text-[#a87955]">
                  {part2.split("").map((ch, i) => (
                    <span
                      key={i}
                      className="inline-block overflow-hidden align-bottom"
                    >
                      <motion.span
                        className="inline-block"
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        transition={{
                          duration: 0.9,
                          ease: EASE,
                          delay: 0.5 + i * 0.045,
                        }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  ))}
                </em>
              )}
            </h1>
            <div className="hidden text-right sm:block">
              <motion.p
                key={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a87955]"
              >
                {stage}
              </motion.p>
              <p className="mt-2 font-serif text-7xl font-light tabular-nums leading-none text-[#1d130d] lg:text-8xl">
                {count}
                <span className="text-3xl align-top">%</span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1d130d]/60">
            <p className="sm:hidden font-serif text-5xl font-light normal-case tracking-normal text-[#1d130d]">
              {count}%
            </p>
            <span className="sm:hidden">{stage} </span>
            <span className="hidden sm:block">
              Coffee worth slowing down for
            </span>
            <span className="hidden sm:block">45.5152° 122.6784° W</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

export function Header({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 60));
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dark = !scrolled && !open;
  const brandName = text(customer.businessName, "Roast & Ritual");

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 2.7 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled
            ? "border-b border-[#1d130d]/10 bg-[#f4eee5]/85 backdrop-blur-xl"
            : "border-b border-transparent",
          open && "border-transparent bg-transparent backdrop-blur-none",
        )}
      >
        <div className="flex h-20 items-center justify-between px-6 lg:px-12">
          <a
            href="#top"
            className={cn(
              "font-serif text-xl tracking-[0.06em] transition-colors duration-500 lg:text-2xl",
              dark ? "text-[#f4eee5]" : "text-[#1d130d]",
              open && "text-[#f4eee5]",
            )}
          >
            <BrandMark brandName={brandName} />
          </a>
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500",
                  dark
                    ? "text-[#f4eee5]/80 hover:text-[#f4eee5]"
                    : "text-[#1d130d]/70 hover:text-[#1d130d]",
                )}
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-[#a87955] transition-transform duration-400 ease-out group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Magnetic className="hidden md:inline-block">
              <a
                href="#visit"
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-500",
                  dark
                    ? "bg-[#a87955] text-[#faf6ec] hover:bg-[#e2bd93] hover:text-[#1d130d]"
                    : "bg-[#1d130d] text-[#f4eee5] hover:bg-[#33251e]",
                )}
              >
                {text(customer.CTA?.label, "Book a table")}{" "}
                <ArrowUpRight className="size-3.5" />
              </a>
            </Magnetic>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "grid size-11 place-items-center rounded-full border transition-colors duration-500 md:hidden",
                dark || open
                  ? "border-[#f4eee5]/30 text-[#f4eee5]"
                  : "border-[#1d130d]/20 text-[#1d130d]",
              )}
            >
              {open ? (
                <X className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </div>
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#a87955]"
          style={{ scaleX: progress }}
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#1d130d] px-6 pb-10 pt-32 text-[#f4eee5]"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <div key={link.href} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{
                      duration: 0.7,
                      ease: EASE,
                      delay: 0.15 + i * 0.07,
                    }}
                    className="flex items-baseline gap-4 font-serif text-5xl font-light"
                  >
                    <span className="text-xs text-[#a87955]">0{i + 1}</span>{" "}
                    {link.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="space-y-6"
            >
              <a
                href="#visit"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#a87955] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#faf6ec]"
              >
                {text(customer.CTA?.label, "Book a table")}{" "}
                <ArrowUpRight className="size-4" />
              </a>
              <div className="flex items-end justify-between text-xs text-[#f4eee5]/60">
                <div>
                  {customer.contact?.address?.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                  <p className="mt-1 text-[#e2bd93]">
                    {customer.contact?.phone}
                  </p>
                </div>
                <div className="text-right">
                  {customer.contact?.hours?.map((h) => (
                    <p key={h.days}>{h.time}</p>
                  ))}
                </div>
              </div>
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
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const BASE = 2.05;

  const HeroLine = ({
    children,
    delay,
    className,
  }: {
    children: ReactNode;
    delay: number;
    className?: string;
  }) => (
    <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
      <motion.span
        className={`block will-change-transform ${className ?? ""}`}
        initial={{ y: "112%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.15, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );

  const fullTitle = text(
    customer.hero?.title,
    "Coffee worth slowing down for.",
  );
  const words = fullTitle.split(" ");
  const firstPart = words.slice(0, 2).join(" ");
  const italicPart = words.slice(2, 3).join(" ");
  const lastPart = words.slice(3).join(" ");

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-[#1d130d] text-[#f4eee5]"
    >
      <motion.div className="absolute inset-0" style={{ y: videoY }}>
        <motion.div
          className="absolute -inset-y-[12%] inset-x-0"
          initial={{ scale: 1.18, filter: "brightness(0.5)" }}
          animate={{ scale: 1, filter: "brightness(1)" }}
          transition={{ duration: 2.2, ease: EASE, delay: BASE }}
        >
          <Image
            src={customer.heroImages?.[0] || restImg(1)}
            alt="Hero backdrop"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1d130d] via-[#1d130d]/25 to-[#1d130d]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1d130d]/45 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE, delay: BASE + 1.2 }}
        className="absolute right-8 top-28 z-10 hidden lg:block xl:right-16"
      >
        <a href="#coffee" aria-label="Scroll to the menu">
          <RotatingBadge
            text={`${text(customer.businessName, "Roast & Ritual")} · Slow Coffee Club · Est. 2016 · `}
            className="size-32 text-[#f4eee5]/70 transition-colors hover:text-[#e2bd93]"
            centerIcon={<ArrowDown className="size-5 text-[#a87955]" />}
          />
        </a>
      </motion.div>

      <motion.div
        className="relative z-10 px-6 pb-14 pt-40 lg:px-12 lg:pb-20"
        style={{ y: textY, opacity: fade }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: BASE + 0.25 }}
          className="mb-8 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#e2bd93]"
        >
          <span className="h-px w-14 bg-[#e2bd93]/60" />{" "}
          {text(
            customer.hero?.eyebrow,
            "Take your time · Specialty coffee · Est. 2016",
          )}
        </motion.div>
        <h1 className="font-serif text-[clamp(3.4rem,11.5vw,10.5rem)] font-light leading-[0.94] tracking-[-0.02em]">
          <HeroLine delay={BASE + 0.35}>{firstPart}</HeroLine>
          <HeroLine delay={BASE + 0.45} className="pl-[0.08em]">
            <em className="text-[#e2bd93]">{italicPart}</em>{" "}
            {lastPart.split(" ")[0]}
          </HeroLine>
          <HeroLine delay={BASE + 0.55} className="pl-[0.12em]">
            {lastPart.split(" ").slice(1).join(" ")}
            <span className="text-[#a87955]">.</span>
          </HeroLine>
        </h1>
        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: BASE + 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#coffee"
                className="group flex items-center gap-3 rounded-full bg-[#a87955] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#faf6ec] transition-colors duration-300 hover:bg-[#e2bd93] hover:text-[#1d130d]"
              >
                {text(customer.hero?.primaryCta, "Explore the menu")}{" "}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#visit"
                className="flex items-center gap-3 rounded-full border border-[#f4eee5]/30 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4eee5] transition-colors duration-300 hover:border-[#e2bd93] hover:text-[#e2bd93]"
              >
                Book a table
              </a>
            </Magnetic>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: BASE + 0.95 }}
            className="max-w-xs text-sm leading-relaxed text-[#f4eee5]/65"
          >
            {text(
              customer.hero?.description,
              "A small room on Alder Street where expressive coffees, dawn-baked pastry and twenty unhurried minutes are the whole point.",
            )}
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: BASE + 1.1 }}
        className="relative z-10 border-t border-[#f4eee5]/15 bg-[#1d130d]/40 backdrop-blur-sm"
      >
        <Marquee
          items={HERO_TICKER}
          className="py-4"
          itemClassName="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f4eee5]/70"
        />
      </motion.div>
    </section>
  );
}

export function Marquee({
  items,
  className,
  itemClassName,
  iconClassName,
  slow = false,
}: {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
  slow?: boolean;
}) {
  const row = (key: string) => (
    <div key={key} className="flex w-max shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className={cn("whitespace-nowrap", itemClassName)}>{item}</span>
          <Asterisk
            className={cn("mx-6 size-5 shrink-0 text-[#a87955]", iconClassName)}
            strokeWidth={1.5}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("group overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max",
          slow ? "animate-marquee-slow" : "animate-marquee",
        )}
      >
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

export function Manifesto({ customer }: { customer?: NewCustomer }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yImg1 = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const yImg2 = useTransform(scrollYProgress, [0, 1], [160, -60]);

  const textBody =
    customer?.about?.body ||
    "We are a small room with a long attention span. We buy coffees that taste like somewhere — a farm in Guji, a hillside in Huila — then roast them gently and pour them slowly. The rest is up to you: a window seat, a warm cup, twenty unhurried minutes.";
  const accents = new Set(["somewhere", "slowly.", "unhurried", "gently"]);

  const words = textBody.split(" ");
  const pRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress: pProgress } = useScroll({
    target: pRef,
    offset: ["start 0.82", "end 0.42"],
  });

  const stats =
    customer?.stats && customer.stats.length > 0
      ? customer.stats
      : [
          {
            value: 12,
            decimals: 0,
            label: "single origins a year, chased by harvest",
          },
          { value: 48, decimals: 0, label: "hours — roast to cup, never more" },
          {
            value: 18,
            decimals: 0,
            label: "hours steeping in the cold brew cellar",
          },
          {
            value: 92.5,
            decimals: 1,
            label: "degrees at the group head, precisely",
          },
        ];

  return (
    <section
      ref={ref}
      id="story"
      className="relative overflow-hidden px-6 py-28 md:py-40 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <SectionTag index="00" label="The room we keep" />
          <FadeIn
            y={16}
            className="hidden text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1d130d]/40 sm:block"
          >
            Alder Street · Since 2016
          </FadeIn>
        </div>
        <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-[clamp(2.6rem,5vw,4.6rem)] font-light leading-[1.02] text-[#1d130d]">
              <Reveal>
                {text(customer?.about?.title, "A warm room for").split(" ")[0]}
              </Reveal>
              <Reveal delay={0.08}>
                {text(customer?.about?.title, "A warm room for good coffee")
                  .split(" ")
                  .slice(1, -2)
                  .join(" ")}{" "}
                <em className="text-[#a87955]">&amp;</em>
              </Reveal>
              <Reveal delay={0.16}>
                {text(
                  customer?.about?.title,
                  "A warm room for good coffee & better mornings.",
                )
                  .split(" ")
                  .slice(-2)
                  .join(" ")}
              </Reveal>
            </h2>
            <FadeIn delay={0.1} className="mt-14 md:mt-20">
              <motion.figure
                style={{ y: yImg1 }}
                className="relative w-[76%] md:w-[68%]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                  <Image
                    src={restImg(12)}
                    alt="Latte art"
                    fill
                    sizes="(max-width: 1024px) 70vw, 34vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                  />
                </div>
                <figcaption className="mt-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#1d130d]/40">
                  Fig. 01 · The daily pour
                </figcaption>
              </motion.figure>
            </FadeIn>
          </div>
          <div className="lg:col-span-7 lg:pl-8 lg:pt-24">
            <p
              ref={pRef}
              className="font-serif text-[clamp(1.7rem,3.4vw,3.1rem)] font-light leading-[1.28] text-[#33251e]"
            >
              {words.map((word, i) => {
                const range: [number, number] = [
                  i / words.length,
                  (i + 1) / words.length,
                ];
                const opacity = useTransform(pProgress, range, [0.14, 1]);
                return (
                  <motion.span
                    key={i}
                    style={{ opacity }}
                    className={
                      accents.has(word)
                        ? "mr-[0.28em] inline-block font-serif italic text-[#a87955]"
                        : "mr-[0.28em] inline-block"
                    }
                  >
                    {word}
                  </motion.span>
                );
              })}
            </p>
            <FadeIn
              delay={0.05}
              className="ml-auto mt-16 flex justify-end md:mt-24"
            >
              <motion.figure
                style={{ y: yImg2 }}
                className="relative w-[82%] md:w-[62%]"
              >
                <div className="relative aspect-[16/11] overflow-hidden rounded-[1.6rem]">
                  <Image
                    src={restImg(13)}
                    alt="Barista pouring milk"
                    fill
                    sizes="(max-width: 1024px) 80vw, 40vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                  />
                </div>
                <figcaption className="mt-3 text-right text-[11px] font-semibold uppercase tracking-[0.26em] text-[#1d130d]/40">
                  Fig. 02 · Behind the bar, 7am light
                </figcaption>
              </motion.figure>
            </FadeIn>
          </div>
        </div>
        <div className="mt-24 grid grid-cols-2 border-t border-[#1d130d]/15 md:mt-32 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn
              key={stat.label}
              delay={i * 0.08}
              className="border-b border-[#1d130d]/10 px-1 py-10 md:py-14 lg:border-b-0 lg:px-8 lg:first:pl-1"
            >
              <p className="font-serif text-5xl font-light text-[#1d130d] md:text-6xl">
                <Counter value={stat.value} decimals={stat.decimals} />
                <span className="text-2xl text-[#a87955]">
                  {stat.decimals ? " " : "+"}
                </span>
              </p>
              <p className="mt-3 max-w-[22ch] text-xs leading-relaxed text-[#1d130d]/55">
                {stat.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MenuSection({ customer }: { customer?: NewCustomer }) {
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 260, damping: 26, mass: 0.6 });

  const track = (e: React.MouseEvent) => {
    const flipX = e.clientX > window.innerWidth - 320;
    mx.set(flipX ? e.clientX - 280 : e.clientX + 32);
    my.set(Math.min(Math.max(e.clientY - 160, 90), window.innerHeight - 400));
  };

  const menu =
    customer?.services && customer.services.length > 0
      ? customer.services
      : demoCafeCustomer.services!;

  return (
    <section
      id="coffee"
      className="relative overflow-hidden bg-[#33251e] px-6 py-28 text-[#f4eee5] md:py-40 lg:px-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 size-[34rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(168,121,85,0.5), transparent)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionTag index="01" label="On the bar" dark />
            <h2 className="mt-8 font-serif text-[clamp(2.8rem,5vw,5rem)] font-light leading-[1.02]">
              <Reveal>Short menu.</Reveal>
              <Reveal delay={0.08}>
                <em className="text-[#e2bd93]">Long ritual.</em>
              </Reveal>
            </h2>
            <FadeIn
              delay={0.12}
              className="mt-6 max-w-md text-sm leading-relaxed text-[#f4eee5]/60"
            >
              Everything is weighed, timed and tasted before the doors open —
              then made slowly, on purpose, in front of you. Hover the list to
              see what's pouring.
            </FadeIn>
            <FadeIn delay={0.18} className="mt-12">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem]">
                <Image
                  src={restImg(14)}
                  alt="Coffee prep"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d130d]/70 via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#f4eee5]/85">
                    Dialed in at dawn
                    <span className="block pt-1 font-serif text-2xl normal-case tracking-normal text-[#e2bd93]">
                      92.5° · 18g in, 36g out
                    </span>
                  </p>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#f4eee5]/30">
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="size-2 rounded-full bg-[#e2bd93]"
                    />
                  </span>
                </div>
              </div>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#f4eee5]/40">
                Beans by the bag · Slow-bar classes every last Sunday
              </p>
            </FadeIn>
          </div>
        </div>
        <div
          className="lg:col-span-7 lg:pt-24"
          onMouseMove={track}
          onMouseLeave={() => setActive(null)}
        >
          {menu.map((item, i) => (
            <FadeIn key={item.name} delay={0.04 * i}>
              <a
                href="#visit"
                onMouseEnter={() => setActive(i)}
                className="group relative block border-t border-[#f4eee5]/12 py-7 last:border-b md:py-8"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-[#a87955]/15 transition-transform duration-500 ease-out group-hover:scale-y-100"
                />
                <span className="relative flex items-start gap-5 md:items-baseline md:gap-7">
                  <span className="pt-2 font-serif text-sm italic text-[#f4eee5]/35 md:pt-0">
                    0{i + 1}
                  </span>
                  <span className="relative mt-1 block size-14 shrink-0 overflow-hidden rounded-xl lg:hidden">
                    <Image
                      src={item.image || restImg(i + 2)}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                      <span className="font-serif text-3xl font-light leading-none transition-all duration-500 group-hover:translate-x-2 group-hover:text-[#e2bd93] md:text-[2.7rem]">
                        {item.name}
                      </span>
                      {item.tag && (
                        <span className="rounded-full border border-[#e2bd93]/45 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#e2bd93]">
                          {item.tag}
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-[#f4eee5]/40">
                      {item.origin}
                      <span className="mt-1 hidden normal-case tracking-normal text-[#f4eee5]/55 md:block md:text-sm">
                        {item.notes}
                      </span>
                    </span>
                  </span>
                  <span className="flex items-baseline gap-6">
                    <span className="font-serif text-2xl font-light tabular-nums text-[#f4eee5] md:text-3xl">
                      <span className="mr-0.5 text-sm text-[#e2bd93]">$</span>
                      {item.price}
                    </span>
                    <ArrowUpRight className="hidden size-5 text-[#e2bd93] opacity-0 transition-all duration-500 group-hover:opacity-100 md:block translate-y-1 -translate-x-1 group-hover:translate-x-0 group-hover:-translate-y-0" />
                  </span>
                </span>
              </a>
            </FadeIn>
          ))}
          <FadeIn
            delay={0.1}
            className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#f4eee5]/45"
          >
            <p>Oat, macadamia or whole milk — always included, never extra.</p>
            <a
              href="#visit"
              className="group/link flex items-center gap-2 font-semibold uppercase tracking-[0.2em] text-[#e2bd93]"
            >
              This week's pour
              <span className="relative overflow-hidden">
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:translate-x-4 group-hover/link:-translate-y-4" />
                <ArrowUpRight className="absolute inset-0 size-4 -translate-x-4 translate-y-4 transition-transform duration-300 group-hover/link:translate-x-0 group-hover/link:-translate-y-0" />
              </span>
            </a>
          </FadeIn>
        </div>
      </div>
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="relative h-[300px] w-[240px] overflow-hidden rounded-[1.4rem] shadow-2xl shadow-[#1d130d]/60">
              {menu.map((item, i) => (
                <motion.div
                  key={item.name}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    scale: i === active ? 1 : 1.15,
                  }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <Image
                    src={item.image || restImg(i + 2)}
                    alt={item.name}
                    fill
                    sizes="240px"
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1d130d]/80 to-transparent p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e2bd93]">
                  {menu[active].origin}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function Ritual({ customer }: { customer?: NewCustomer }) {
  const steps =
    customer?.process && customer.process.length > 0
      ? customer.process
      : demoCafeCustomer.process!;

  return (
    <section id="ritual" className="px-6 py-28 md:py-40 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTag index="02" label="From cherry to cup" />
            <h2 className="mt-8 font-serif text-[clamp(2.8rem,5vw,5rem)] font-light leading-[1.02] text-[#1d130d]">
              <Reveal>Four acts</Reveal>
              <Reveal delay={0.08}>
                of <em className="text-[#a87955]">patience.</em>
              </Reveal>
            </h2>
          </div>
          <FadeIn
            delay={0.15}
            className="max-w-sm text-sm leading-relaxed text-[#1d130d]/55 md:pb-3 md:text-right"
          >
            From the hillside to your hands — four unhurried steps stand between
            the harvest and your first sip of the day.
          </FadeIn>
        </div>
        <div className="mt-16 md:mt-24">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="sticky mb-8 last:mb-0 md:mb-10"
              style={{ top: `${88 + i * 14}px` }}
            >
              <article className="grid overflow-hidden rounded-[2rem] bg-[#33251e] text-[#f4eee5] shadow-2xl shadow-[#1d130d]/25 md:grid-cols-2">
                <div className="flex flex-col justify-between gap-10 p-8 md:p-12 lg:p-14">
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-7xl font-light italic leading-none text-[#e2bd93]/30 md:text-8xl">
                      {step.n}
                    </span>
                    <span className="rounded-full border border-[#f4eee5]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4eee5]/60">
                      {step.caption}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-4xl font-light md:text-6xl">
                      {step.title}
                      <span className="text-[#a87955]">.</span>
                    </h3>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-[#f4eee5]/60 md:text-base">
                      {step.body}
                    </p>
                  </div>
                </div>
                <div className="relative min-h-72 md:min-h-[420px]">
                  <Image
                    src={step.image || restImg(i + 8)}
                    alt={`${step.title} — ${step.caption}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#33251e]/40 to-transparent" />
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function QuoteSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);

  return (
    <div className="px-6 pb-28 md:pb-36 lg:px-12">
      <div
        ref={ref}
        className="relative mx-auto flex h-[58vh] max-w-7xl items-center justify-center overflow-hidden rounded-[2rem] md:h-[64vh]"
      >
        <motion.div className="absolute -inset-y-[16%] inset-x-0" style={{ y }}>
          <Image
            src={restImg(17)}
            alt="Warm cafe interior"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
            unoptimized
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#1d130d]/55" />
        <div className="relative z-10 px-6 text-center">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#e2bd93]">
              The only rule of the house
            </p>
          </Reveal>
          <blockquote className="mt-6 font-serif text-[clamp(2.6rem,6vw,5.6rem)] font-light italic leading-[1.05] text-[#f4eee5]">
            <Reveal delay={0.08}>Stay a little longer.</Reveal>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

export function Gallery({ customer }: { customer?: NewCustomer }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setRange(
        Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 48),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -range]);
  const x = useSpring(rawX, { stiffness: 90, damping: 26, mass: 0.8 });
  const ghostX = useTransform(scrollYProgress, [0, 1], ["4%", "-38%"]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  const galleryItems =
    customer?.gallery && customer.gallery.length > 0
      ? customer.gallery
      : demoCafeCustomer.gallery!;

  return (
    <section ref={sectionRef} className="relative h-[340vh] bg-[#1d130d]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.span
          aria-hidden
          style={{ x: ghostX }}
          className="text-hollow pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap font-serif text-[26vw] font-light italic leading-none opacity-60"
        >
          Field notes · field notes
        </motion.span>
        <div className="relative z-10 mb-10 flex items-end justify-between px-6 lg:px-12">
          <div>
            <SectionTag index="03" label="Field notes" dark />
            <h2 className="mt-5 font-serif text-4xl font-light text-[#f4eee5] md:text-6xl">
              Mornings at the bar<span className="text-[#a87955]">.</span>
            </h2>
          </div>
          <FadeIn
            y={14}
            className="hidden pb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f4eee5]/40 md:block"
          >
            Keep scrolling — the room drifts by
          </FadeIn>
        </div>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative z-10 flex w-max items-stretch gap-5 px-6 md:gap-8 lg:px-12"
          data-cursor="Drift"
        >
          {galleryItems.map((item, i) => (
            <figure
              key={item.title}
              className={`group w-[74vw] shrink-0 sm:w-[46vw] ${item.wide ? "lg:w-[44vw]" : "lg:w-[30vw]"}`}
            >
              <div
                className={`relative overflow-hidden rounded-[1.6rem] ${i % 2 === 0 ? "aspect-[4/5]" : "aspect-[16/11] mt-10 lg:mt-16"}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 74vw, (max-width: 1024px) 46vw, 40vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d130d]/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute left-4 top-4 rounded-full bg-[#1d130d]/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4eee5]/90 backdrop-blur-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between text-[#f4eee5]">
                <span className="font-serif text-xl font-light md:text-2xl">
                  {item.title}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4eee5]/40">
                  {item.meta}
                </span>
              </figcaption>
            </figure>
          ))}
          <div className="flex w-[70vw] shrink-0 items-center sm:w-[36vw] lg:w-[26vw]">
            <a
              href="#visit"
              className="group flex aspect-square w-full flex-col items-start justify-between rounded-[1.6rem] border border-[#f4eee5]/15 p-7 transition-colors duration-500 hover:border-[#e2bd93]/50 hover:bg-[#a87955]/10"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#e2bd93]">
                Your turn
              </span>
              <span className="font-serif text-3xl font-light leading-tight text-[#f4eee5] md:text-4xl">
                Come write
                <br />
                <em className="text-[#e2bd93]">your own page</em>
                <span className="text-[#a87955]">.</span>
              </span>
            </a>
          </div>
        </motion.div>
        <div className="relative z-10 mx-6 mt-12 h-px bg-[#f4eee5]/15 lg:mx-12">
          <motion.div
            className="absolute inset-0 origin-left bg-[#e2bd93]"
            style={{ scaleX: progress }}
          />
        </div>
      </div>
    </section>
  );
}

type FieldName =
  | "name"
  | "email"
  | "phone"
  | "guests"
  | "date"
  | "time"
  | "notes";
type FormState = Record<FieldName, string>;

export function Visit({ customer }: { customer?: NewCustomer }) {
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
    notes: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<any>(null);

  const today = new Date().toISOString().split("T")[0];
  const set = (name: FieldName) => (value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage(null);
    setTimeout(() => {
      setConfirmation({
        reference: `RR-${Math.floor(Math.random() * 10000)}`,
        name: values.name,
        guests: values.guests,
        date: values.date,
        time: values.time,
      });
      setStatus("success");
    }, 1500);
  }

  const inputBase =
    "w-full rounded-xl border bg-[#f4eee5]/5 px-4 py-3.5 text-sm text-[#f4eee5] placeholder:text-[#f4eee5]/30 outline-none transition-all duration-300 focus:bg-[#f4eee5]/10";

  return (
    <section id="visit" className="px-6 py-28 md:py-40 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionTag index="04" label="Your table" />
          <h2 className="mt-8 font-serif text-[clamp(2.8rem,5vw,5rem)] font-light leading-[1.02] text-[#1d130d]">
            <Reveal>Come for the coffee.</Reveal>
            <Reveal delay={0.08}>
              Stay for the <em className="text-[#a87955]">ritual.</em>
            </Reveal>
          </h2>
          <FadeIn delay={0.12} className="mt-10">
            <address className="font-serif text-2xl font-light italic leading-snug not-italic text-[#1d130d]/85 md:text-3xl">
              {customer?.contact?.address?.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              )) || (
                <>
                  <span className="block">428 Alder Street</span>
                  <span className="block">Portland, Oregon</span>
                </>
              )}
            </address>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[#1d130d]/60">
              <a
                href={`tel:${customer?.contact?.phone}`}
                className="transition-colors hover:text-[#a87955]"
              >
                {text(customer?.contact?.phone, "+1 (503) 555-0128")}
              </a>
              <a
                href={`mailto:${customer?.contact?.email}`}
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#a87955]"
              >
                {text(customer?.contact?.email, "hello@roastandritual.coffee")}{" "}
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.16} className="mt-12 max-w-md">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.26em] text-[#a87955]">
              Opening hours
            </p>
            <dl className="space-y-3.5">
              {(customer?.contact?.hours ||
                demoCafeCustomer.contact.hours)!.map((row) => (
                <div key={row.days} className="flex items-baseline text-sm">
                  <dt className="text-[#1d130d]/70">{row.days}</dt>
                  <span
                    aria-hidden
                    className="mx-3 grow border-b border-dotted border-[#1d130d]/30"
                  />
                  <dd className="font-medium tabular-nums text-[#1d130d]">
                    {row.time}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-[#1d130d]/45">
              Walk-ins always welcome — we keep the window seats unbooked for
              the early ones. Tables held for two hours; enough time for one
              more cup.
            </p>
          </FadeIn>
        </div>
        <div className="lg:col-span-6">
          <FadeIn delay={0.1}>
            <div className="dark-scheme overflow-hidden rounded-[2rem] bg-[#33251e] text-[#f4eee5] shadow-2xl shadow-[#1d130d]/30">
              <AnimatePresence mode="wait">
                {status === "success" && confirmation ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="flex min-h-[560px] flex-col justify-between p-8 md:p-12"
                  >
                    <div>
                      <span className="grid size-14 place-items-center rounded-full bg-[#a87955]/20">
                        <CheckCircle2 className="size-7 text-[#e2bd93]" />
                      </span>
                      <h3 className="mt-8 font-serif text-4xl font-light md:text-5xl">
                        You're in, {confirmation.name.split(" ")[0]}
                        <span className="text-[#a87955]">.</span>
                      </h3>
                      <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#f4eee5]/60">
                        Your table is pencilled into the book. We'll send a note
                        to confirm — and the kettle will be on.
                      </p>
                    </div>
                    <div className="mt-10 space-y-4 border-t border-[#f4eee5]/10 pt-8">
                      <p className="flex items-center gap-3 text-sm text-[#f4eee5]/80">
                        <CalendarCheck className="size-4 text-[#e2bd93]" />{" "}
                        {confirmation.date}
                      </p>
                      <p className="flex items-center gap-3 text-sm text-[#f4eee5]/80">
                        <Clock className="size-4 text-[#e2bd93]" />{" "}
                        {confirmation.time} — two hours
                      </p>
                      <p className="flex items-center gap-3 text-sm text-[#f4eee5]/80">
                        <Users className="size-4 text-[#e2bd93]" />{" "}
                        {confirmation.guests}{" "}
                        {Number(confirmation.guests) === 1 ? "guest" : "guests"}
                      </p>
                      <p className="pt-2">
                        <span className="rounded-full border border-[#e2bd93]/40 px-3.5 py-1.5 font-mono text-xs tracking-widest text-[#e2bd93]">
                          {confirmation.reference}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setValues({
                          name: "",
                          email: "",
                          phone: "",
                          guests: "2",
                          date: "",
                          time: "",
                          notes: "",
                        });
                        setConfirmation(null);
                      }}
                      className="mt-10 w-full rounded-full border border-[#f4eee5]/25 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4eee5] transition-colors hover:bg-[#e2bd93] hover:text-[#1d130d]"
                    >
                      Make another request
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 md:p-12"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h3 className="font-serif text-4xl font-light">
                          Book a table<span className="text-[#a87955]">.</span>
                        </h3>
                        <p className="mt-3 text-sm text-[#f4eee5]/55">
                          The slow bar seats six — reserve if you're coming for
                          the pour over.
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4eee5]/50">
                          Name
                        </span>
                        <input
                          value={values.name}
                          onChange={(e) => set("name")(e.target.value)}
                          placeholder="Frida K."
                          required
                          className={inputBase}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4eee5]/50">
                          Email
                        </span>
                        <input
                          type="email"
                          value={values.email}
                          onChange={(e) => set("email")(e.target.value)}
                          placeholder="you@somewhere.com"
                          required
                          className={inputBase}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4eee5]/50">
                          Phone
                        </span>
                        <input
                          type="tel"
                          value={values.phone}
                          onChange={(e) => set("phone")(e.target.value)}
                          placeholder="+1 (503)..."
                          className={inputBase}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4eee5]/50">
                          Guests
                        </span>
                        <select
                          value={values.guests}
                          onChange={(e) => set("guests")(e.target.value)}
                          className={`${inputBase} appearance-none`}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n} className="bg-[#33251e]">
                              {n} {n === 1 ? "guest" : "guests"}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4eee5]/50">
                          Date
                        </span>
                        <input
                          type="date"
                          min={today}
                          value={values.date}
                          onChange={(e) => set("date")(e.target.value)}
                          required
                          className={inputBase}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4eee5]/50">
                          Time
                        </span>
                        <select
                          value={values.time}
                          onChange={(e) => set("time")(e.target.value)}
                          required
                          className={`${inputBase} appearance-none`}
                        >
                          <option value="" className="bg-[#33251e]">
                            Pick a slot
                          </option>
                          {TIME_SLOTS.map((slot) => (
                            <option
                              key={slot}
                              value={slot}
                              className="bg-[#33251e]"
                            >
                              {slot}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4eee5]/50">
                          Anything we should know?
                        </span>
                        <textarea
                          rows={3}
                          value={values.notes}
                          onChange={(e) => set("notes")(e.target.value)}
                          placeholder="A window seat if one is free, oat milk at the table..."
                          className={`${inputBase} resize-none`}
                        />
                      </label>
                    </div>
                    <Magnetic className="mt-8 block" strength={0.15}>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="flex w-full items-center justify-center gap-3 rounded-full bg-[#a87955] py-4.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#faf6ec] transition-all duration-300 hover:bg-[#e2bd93] hover:text-[#1d130d] disabled:opacity-70"
                      >
                        {status === "sending" ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />{" "}
                            Pencilling you in
                          </>
                        ) : (
                          <>
                            Request table <ArrowUpRight className="size-4" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                    <p className="mt-4 text-center text-[11px] text-[#f4eee5]/35">
                      No card, no deposit — just your word and our kettle.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function Letter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      setMessage(
        "Welcome to the club. First letter arrives with the next roast.",
      );
    }, 1200);
  }

  return (
    <section className="px-6 pb-28 pt-4 md:pb-36 lg:px-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.4rem] bg-[#a87955] px-6 py-16 text-[#1d130d] md:px-14 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 size-[26rem] rounded-full border border-[#1d130d]/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-[26rem] rounded-full border border-[#1d130d]/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 size-[22rem] rounded-full bg-[#e2bd93]/30 blur-3xl"
        />

        <div className="relative grid items-end gap-12 lg:grid-cols-2">
          <div>
            <FadeIn
              y={14}
              className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1d130d]/60"
            >
              The monthly letter
            </FadeIn>
            <h2 className="mt-6 font-serif text-[clamp(2.6rem,5vw,4.6rem)] font-light leading-[1.02]">
              <Reveal>Rituals in</Reveal>
              <Reveal delay={0.08}>
                <em>your inbox.</em>
              </Reveal>
            </h2>
            <FadeIn
              delay={0.14}
              className="mt-6 max-w-md text-sm leading-relaxed text-[#1d130d]/70"
            >
              One letter a month — new arrivals, cupping notes, and first dibs
              on slow-bar seats. No froth, no noise, unsubscribe whenever.
            </FadeIn>
          </div>
          <div className="lg:justify-self-end lg:w-full lg:max-w-md">
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex items-center gap-5 rounded-[1.4rem] bg-[#1d130d] p-6 text-[#f4eee5] md:p-8"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#a87955]/25">
                    <MailCheck className="size-6 text-[#e2bd93]" />
                  </span>
                  <p className="text-sm leading-relaxed">
                    <span className="mb-1 block font-serif text-xl font-light">
                      Sealed and stamped.
                    </span>
                    <span className="text-[#f4eee5]/60">{message}</span>
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  exit={{ opacity: 0, y: -12 }}
                  className="w-full"
                >
                  <label
                    htmlFor="letter-email"
                    className="mb-3 block text-[10px] font-bold uppercase tracking-[0.26em] text-[#1d130d]/60"
                  >
                    Your email
                  </label>
                  <div className="flex items-center gap-3 border-b-2 border-[#1d130d]/30 pb-3 transition-colors focus-within:border-[#1d130d]">
                    <input
                      id="letter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setStatus("idle");
                        setMessage(null);
                      }}
                      placeholder="you@somewhere.com"
                      className="w-full bg-transparent font-serif text-2xl font-light italic text-[#1d130d] outline-none placeholder:text-[#1d130d]/30"
                    />
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group grid size-13 shrink-0 place-items-center rounded-full bg-[#1d130d] text-[#f4eee5] transition-transform duration-300 hover:scale-105 disabled:opacity-60"
                    >
                      {status === "sending" ? (
                        <Send className="size-5 animate-pulse" />
                      ) : (
                        <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-4 text-[11px] text-[#1d130d]/50">
                    Next letter ships with the November roast — drizzle, cedar,
                    dark chocolate.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ customer }: { customer?: NewCustomer }) {
  const brandName = text(customer?.businessName, "Roast & Ritual");

  return (
    <footer className="bg-[#1d130d] pt-8 text-[#f4eee5]">
      <div className="border-b border-[#f4eee5]/10 pb-8">
        <Marquee
          slow
          items={[brandName, "Slow coffee club", "Portland, Oregon"]}
          itemClassName="text-hollow px-2 font-serif text-[14vw] font-light italic leading-none md:text-[9vw]"
          iconClassName="size-[4vw] text-[#a87955]/60 md:size-[2.6vw]"
        />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <FadeIn>
          <p className="font-serif text-2xl">
            <BrandMark brandName={brandName} />
          </p>
          <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-[#f4eee5]/50">
            Expressive coffees, dawn-baked pastry, and a room that asks nothing
            of you but a little time.
          </p>
          <p className="mt-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e2bd93]">
            <Asterisk className="size-4" /> Est. 2016
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#f4eee5]/35">
            Explore
          </p>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-[#f4eee5]/70 transition-colors hover:text-[#e2bd93]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
        <FadeIn delay={0.12}>
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#f4eee5]/35">
            Visit
          </p>
          <div className="mt-5 space-y-1 text-sm text-[#f4eee5]/70">
            {customer?.contact?.address?.map((line) => (
              <p key={line}>{line}</p>
            )) || (
              <>
                <p>428 Alder Street</p>
                <p>Portland, Oregon</p>
              </>
            )}
          </div>
          <div className="mt-5 space-y-2 text-sm">
            {(customer?.contact?.hours || demoCafeCustomer.contact.hours)!.map(
              (h) => (
                <p
                  key={h.days}
                  className="flex justify-between gap-6 text-[#f4eee5]/55"
                >
                  <span>{h.days}</span>
                  <span className="tabular-nums text-[#f4eee5]/80">
                    {h.time}
                  </span>
                </p>
              ),
            )}
          </div>
        </FadeIn>
        <FadeIn delay={0.18}>
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#f4eee5]/35">
            Say hello
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <a
              href={`mailto:${customer?.contact?.email}`}
              className="block text-[#f4eee5]/70 transition-colors hover:text-[#e2bd93]"
            >
              {text(customer?.contact?.email, "hello@roastandritual.coffee")}
            </a>
            <a
              href={`tel:${customer?.contact?.phone}`}
              className="block text-[#f4eee5]/70 transition-colors hover:text-[#e2bd93]"
            >
              {text(customer?.contact?.phone, "+1 (503) 555-0128")}
            </a>
            <div className="flex gap-4 pt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f4eee5]/45">
              <a href="#top" className="transition-colors hover:text-[#e2bd93]">
                Instagram
              </a>
              <a href="#top" className="transition-colors hover:text-[#e2bd93]">
                Spotify
              </a>
              <a href="#top" className="transition-colors hover:text-[#e2bd93]">
                Strava
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
      <div className="border-t border-[#f4eee5]/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-[11px] text-[#f4eee5]/40 lg:px-12">
          <p>
            © {new Date().getFullYear()} {brandName}. Brewed slowly.
          </p>
          <p className="hidden md:block">Designed by Infycrest Solutions</p>
          <Magnetic>
            <a
              href="#top"
              aria-label="Back to top"
              className="grid size-11 place-items-center rounded-full border border-[#f4eee5]/20 text-[#f4eee5]/70 transition-colors hover:border-[#e2bd93] hover:text-[#e2bd93]"
            >
              <ArrowUp className="size-4" />
            </a>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumCafeTemplate({
  customer = demoCafeCustomer,
}: {
  customer?: NewCustomer;
}) {
  const style = {
    "--brand-accent": text(customer.theme?.accent, "#a87955"),
  } as CSSProperties;

  return (
    <div
      style={style}
      className="relative bg-[#f4eee5] font-sans text-[#1d130d] selection:bg-[#a87955] selection:text-[#faf6ec] min-h-screen"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee { to { transform: translateX(-50%); } }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes grain-jitter { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-2%, 3%); } 50% { transform: translate(3%, -2%); } 75% { transform: translate(-3%, -3%); } }
        .animate-marquee { animation: marquee 42s linear infinite; }
        .animate-marquee-slow { animation: marquee 90s linear infinite; }
        .animate-spin-slow { animation: spin-slow 16s linear infinite; }
        .text-hollow { color: transparent; -webkit-text-stroke: 1px color-mix(in srgb, #e2bd93 40%, transparent); }
        .grain-overlay { position: fixed; inset: -120px; z-index: 80; pointer-events: none; opacity: 0.06; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); animation: grain-jitter 1.1s steps(4) infinite; }
        @media (pointer: fine) { .custom-cursor, .custom-cursor * { cursor: none !important; } }
      `,
        }}
      />

      <SmoothScroll>
        <Preloader brandName={text(customer.businessName, "Roast & Ritual")} />
        <Cursor />
        <Header customer={customer} />

        <main id="top" className="overflow-x-clip bg-[#f4eee5] text-[#1d130d]">
          <Hero customer={customer} />
          <Manifesto customer={customer} />
          <MenuSection customer={customer} />
          <Ritual customer={customer} />
          <QuoteSection />
          <Gallery customer={customer} />
          <Visit customer={customer} />
          <Letter />
        </main>

        <Footer customer={customer} />
      </SmoothScroll>
      <div className="grain-overlay" aria-hidden="true" />
    </div>
  );
}
