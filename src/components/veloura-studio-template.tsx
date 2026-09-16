"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type FormEvent,
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
  useVelocity,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Flower2,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

// Helper to pull directly from your 1-31 local salon images
const salonImg = (num: number) => `/salon/${num}.jpg`;

export type ServiceId =
  | "hair-design"
  | "skin-ritual"
  | "bridal-studio"
  | "private-appointment";

export const SERVICES = [
  {
    id: "hair-design" as ServiceId,
    index: "01",
    name: "Hair design",
    tagline: "Precision cuts, dimensional colour, sculptural styling.",
    duration: "90 min",
    price: "from $95",
    image: salonImg(4),
  },
  {
    id: "skin-ritual" as ServiceId,
    index: "02",
    name: "Skin rituals",
    tagline: "Facial ceremonies of gua sha, light and slow massage.",
    duration: "75 min",
    price: "from $120",
    image: salonImg(5),
  },
  {
    id: "bridal-studio" as ServiceId,
    index: "03",
    name: "Bridal studio",
    tagline: "Trials, morning-of artistry and quiet champagne calm.",
    duration: "Half day",
    price: "from $350",
    image: salonImg(6),
  },
  {
    id: "private-appointment" as ServiceId,
    index: "04",
    name: "Private appointments",
    tagline: "The suite is yours — one artist, no interruptions.",
    duration: "2 hrs",
    price: "from $220",
    image: salonImg(7),
  },
];

export const STILLS = [
  { src: salonImg(8), alt: "Terracotta beauty portrait" },
  { src: salonImg(9), alt: "Skin ritual with gua sha" },
  { src: salonImg(10), alt: "Salon objects still life" },
  { src: salonImg(11), alt: "Bridal portrait" },
  { src: salonImg(12), alt: "Stylist at work in golden light" },
  { src: salonImg(13), alt: "Sculptural hair design" },
  { src: salonImg(14), alt: "Private salon suite" },
  { src: salonImg(15), alt: "Detail shot of products" },
];

export const QUOTES = [
  {
    text: "I arrived frayed from a long season and left two hours later feeling like the best version of myself. No one has ever listened to my hair the way Veloura does.",
    author: "Camille R.",
    service: "Skin ritual guest",
  },
  {
    text: "The bridal trial felt like a meditation. On the morning itself I was the calmest person in the room — and the photographs still make me cry.",
    author: "Sofia L.",
    service: "Bridal studio guest",
  },
  {
    text: "They remembered how I take my tea and why I grew my hair out. It is the only appointment I protect like a holiday.",
    author: "Amira K.",
    service: "Hair design guest",
  },
  {
    text: "A private appointment here is two hours of the world going politely silent. Worth every minute, every time.",
    author: "Jonas M.",
    service: "Private appointment guest",
  },
];

const TIME_SLOTS = [
  { id: "morning", label: "Morning — 09:00 - 11:30" },
  { id: "midday", label: "Midday — 12:00 - 14:30" },
  { id: "afternoon", label: "Afternoon — 15:00 - 17:30" },
  { id: "evening", label: "Evening — 18:00 - 19:00" },
];

const NAV_LINKS = [
  { label: "Studio", href: "#story", n: "01" },
  { label: "Services", href: "#services", n: "02" },
  { label: "Stills", href: "#gallery", n: "03" },
  { label: "Voices", href: "#voices", n: "04" },
];

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const StudioBrandContext = createContext("Veloura");
const useStudioBrand = () => useContext(StudioBrandContext);

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit & { once?: boolean } = {
    threshold: 0.1,
    rootMargin: "-10% 0px",
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

export function useCountedInView() {
  const { ref, inView } = useInView({ once: true, rootMargin: "-10% 0px" });
  return { ref, inView };
}

export const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

/* -------------------------------------------------------------------------- */
/*                              MOTION PRIMITIVES                             */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 44,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName ?? ""}`}
            initial={{ y: "115%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{
              duration: 1.1,
              ease: EASE,
              delay: delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Eyebrow({
  index,
  label,
  tone = "light",
}: {
  index: string;
  label: string;
  tone?: "light" | "dark" | "rose";
}) {
  const color =
    tone === "rose"
      ? "text-[#b67f79]"
      : tone === "dark"
        ? "text-[#f2c7c0]"
        : "text-[#b67f79]";
  return (
    <Reveal y={20}>
      <p
        className={`flex items-center gap-4 text-[11px] font-semibold tracking-[0.32em] uppercase ${color}`}
      >
        <span>{index}</span>
        <span
          className={`h-px w-10 ${tone === "dark" ? "bg-[#f2c7c0]/50" : "bg-[#b67f79]/50"}`}
        />
        <span
          className={
            tone === "dark" ? "text-[#f7efec]/70" : "text-[#3a292a]/60"
          }
        >
          {label}
        </span>
      </p>
    </Reveal>
  );
}

function ScrubWord({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

export function ScrubParagraph({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.30"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <ScrubWord
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, Math.min(1, (i + 4) / words.length)]}
        >
          {word}
        </ScrubWord>
      ))}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INTERACTIVE FX                               */
/* -------------------------------------------------------------------------- */

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    (window as any).__lenis = lenis;

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
      lenis.scrollTo(target as HTMLElement, { offset: -32, duration: 1.5 });
      window.history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.stop();
      lenis.destroy();
      (window as any).__lenis = undefined;
      document.removeEventListener("click", onClick);
    };
  }, []);
  return <>{children}</>;
}

export function Preloader() {
  const brandName = useStudioBrand();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    const duration = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 320);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = "";
      }}
    >
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#3a292a] text-[#f7efec]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
              className="text-center font-serif text-4xl tracking-[0.30em] uppercase sm:text-5xl"
            >
              {brandName}
            </motion.p>
          </div>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.24 }}
              className="mt-3 font-serif text-sm italic tracking-wide text-[#f2c7c0]/90"
            >
              the art of feeling like yourself
            </motion.p>
          </div>
          <div className="absolute right-6 bottom-6 flex items-end gap-1 font-serif text-6xl font-light tabular-nums text-[#f7efec]/90 sm:right-12 sm:bottom-10 sm:text-7xl">
            {count}
            <span className="mb-1 text-lg text-[#b67f79]">%</span>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-[#b67f79]"
            style={{ width: `${count}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    const enableTimer = window.setTimeout(() => setEnabled(true), 0);
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, [data-cursor], input, select, textarea, label",
      );
      setHovering(Boolean(target));
      const labelled = (e.target as HTMLElement).closest("[data-cursor-label]");
      setLabel(labelled ? labelled.getAttribute("data-cursor-label") : null);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });

    return () => {
      window.clearTimeout(enableTimer);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[95] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b67f79] mix-blend-difference"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[95] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#f7efec]/70 mix-blend-difference"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: label ? 92 : hovering ? 56 : 36,
          height: label ? 92 : hovering ? 56 : 36,
          backgroundColor: label
            ? "rgba(182,127,121,0.9)"
            : "rgba(182,127,121,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label && (
          <span className="px-2 text-center text-[10px] font-semibold tracking-[0.18em] text-[#f7efec] uppercase mix-blend-normal">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}

export function Grain() {
  return (
    <div
      aria-hidden
      className="grain-overlay pointer-events-none fixed inset-0 z-[80] opacity-[0.055] mix-blend-multiply"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

export function Navbar() {
  const brandName = useStudioBrand();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 48);
    setHidden(latest > prev && latest > 320 && !open);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-500 ${
          scrolled && !open
            ? "border-b border-[#3a292a]/10 bg-[#f7efec]/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6 lg:px-12">
          <a
            href="#top"
            className={`font-serif text-2xl tracking-[0.14em] uppercase transition-colors duration-500 ${
              scrolled && !open ? "text-[#3a292a]" : "text-[#f7efec]"
            }`}
          >
            {brandName}
          </a>
          <nav className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`group relative text-[11px] font-semibold tracking-[0.24em] uppercase transition-colors duration-500 ${
                  scrolled && !open ? "text-[#3a292a]/80" : "text-[#f7efec]/85"
                } hover:text-[#b67f79]`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-[#b67f79] transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#book"
              className={`group hidden items-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-500 sm:inline-flex ${
                scrolled && !open
                  ? "bg-[#3a292a] text-[#f7efec] hover:bg-[#b67f79]"
                  : "bg-[#b67f79] text-white hover:bg-[#96625d]"
              }`}
            >
              Book your ritual
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className={`flex size-11 items-center justify-center rounded-full border transition-colors duration-500 md:hidden ${
                open
                  ? "border-[#f7efec]/30 text-[#f7efec]"
                  : scrolled
                    ? "border-[#3a292a]/20 text-[#3a292a]"
                    : "border-[#f7efec]/40 text-[#f7efec]"
              }`}
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
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-[#3a292a] px-6 pt-32 pb-10 text-[#f7efec] lg:px-12"
          >
            <nav className="flex flex-col">
              {[
                ...NAV_LINKS,
                { label: "Book a ritual", href: "#book", n: "05" },
              ].map((link, i) => (
                <span
                  key={link.href}
                  className="overflow-hidden border-b border-[#f7efec]/10 py-4"
                >
                  <motion.a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{
                      duration: 0.7,
                      ease: EASE,
                      delay: 0.15 + i * 0.06,
                    }}
                    className="group flex items-baseline gap-5"
                  >
                    <span className="text-[11px] tracking-[0.3em] text-[#b67f79]">
                      {link.n}
                    </span>
                    <span className="font-serif text-5xl font-light transition-colors duration-300 group-hover:text-[#f2c7c0] sm:text-6xl">
                      {link.label}
                    </span>
                    <ArrowUpRight className="ml-auto size-6 -translate-x-2 text-[#b67f79] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </motion.a>
                </span>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-end justify-between gap-6 text-[11px] tracking-[0.24em] text-[#f7efec]/50 uppercase"
            >
              <p>
                Jasminvej 14, Copenhagen
                <br />
                Tue — Sat · 09:00 — 19:00
              </p>
              <p className="text-right">
                hello@veloura.studio
                <br />
                +45 33 12 08 90
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Hero() {
  const brandName = useStudioBrand();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const DELAY = 2.0;

  return (
    <section ref={ref} id="top" className="relative min-h-svh overflow-hidden">
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0"
      >
        <Image
          src={salonImg(1)}
          alt={`${brandName} beauty studio`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#3a292a]/85 via-[#3a292a]/25 to-[#3a292a]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#3a292a]/35 to-transparent" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: DELAY + 0.9, duration: 1 }}
        className="absolute top-1/2 right-6 hidden -translate-y-1/2 lg:block"
      >
        <p className="text-[10px] tracking-[0.5em] text-[#f7efec]/60 uppercase [writing-mode:vertical-rl]">
          {brandName} · Studio of Rituals · Est. 2014
        </p>
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative flex min-h-svh flex-col justify-end px-6 pb-14 lg:px-12 lg:pb-20"
      >
        <div className="max-w-6xl text-[#f7efec]">
          <div className="mb-8 overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: DELAY + 0.15 }}
              className="flex items-center gap-4 text-[11px] font-semibold tracking-[0.34em] text-[#f2c7c0] uppercase"
            >
              <span className="h-px w-12 bg-[#f2c7c0]/60" />
              The art of feeling like yourself
            </motion.p>
          </div>
          <h1 className="font-serif font-light tracking-tight">
            {[
              <span
                key="l1"
                className="block text-[13.5vw] leading-[0.92] sm:text-[11vw] lg:text-[8.5rem]"
              >
                Your most
              </span>,
              <span
                key="l2"
                className="block text-[13.5vw] leading-[0.92] sm:text-[11vw] lg:text-[8.5rem]"
              >
                <em className="text-[#f2c7c0]">beautiful</em> ritual
                <span className="text-[#b67f79]">.</span>
              </span>,
            ].map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block will-change-transform"
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: EASE,
                    delay: DELAY + 0.25 + i * 0.13,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: DELAY + 0.65 }}
            >
              <a
                href="#book"
                className="group inline-flex items-center gap-3 rounded-full bg-[#b67f79] px-7 py-4 text-[11px] font-semibold tracking-[0.2em] text-white uppercase transition-colors duration-500 hover:bg-[#f2c7c0] hover:text-[#3a292a]"
              >
                Book your ritual
                <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
              </a>
            </motion.div>
            <motion.a
              href="#story"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: DELAY + 0.75 }}
              className="group inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-[#f7efec]/80 uppercase transition-colors hover:text-[#f2c7c0]"
            >
              Enter the studio
              <ArrowDown className="size-4 transition-transform duration-500 group-hover:translate-y-1" />
            </motion.a>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: DELAY + 1.05 }}
            className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-[#f7efec]/15 pt-6 text-[10px] tracking-[0.28em] text-[#f7efec]/55 uppercase"
          >
            <span>Copenhagen · Paris</span>
            <span>Tue — Sat · 09:00 — 19:00</span>
            <span>By appointment only</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: DELAY + 1.4, duration: 1 }}
        className="absolute bottom-0 left-1/2 hidden h-20 w-px -translate-x-1/2 overflow-hidden bg-[#f7efec]/20 lg:block"
      >
        <motion.span
          className="block h-full w-full bg-[#f2c7c0]"
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

export function Marquee({
  items,
  variant = "rose",
  slow = false,
}: {
  items: string[];
  variant?: "rose" | "ink" | "cream";
  slow?: boolean;
}) {
  const styles =
    variant === "rose"
      ? "bg-[#b67f79] text-[#f7efec]"
      : variant === "ink"
        ? "bg-[#3a292a] text-[#f2c7c0]"
        : "bg-[#f7efec] text-[#3a292a] border-y border-[#3a292a]/10";

  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {items.map((item, i) => (
        <React.Fragment key={`${item}-${i}`}>
          <span className="font-serif text-3xl font-light whitespace-nowrap italic sm:text-4xl">
            {item}
          </span>
          <Flower2 className="size-5 shrink-0 opacity-60" />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className={`relative overflow-hidden py-6 ${styles}`}>
      <div
        className={`flex w-max ${slow ? "animate-marquee-slow" : "animate-marquee"}`}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { ref, inView } = useCountedInView();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div className="border-t border-[#3a292a]/15 pt-6">
      <p className="font-serif text-5xl font-light tabular-nums sm:text-6xl">
        <span ref={ref}>{display.toLocaleString("en-US")}</span>
        <span className="text-[#b67f79]">{suffix}</span>
      </p>
      <p className="mt-3 text-[11px] tracking-[0.22em] text-[#3a292a]/55 uppercase">
        {label}
      </p>
    </div>
  );
}

export function Story() {
  const imgWrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgWrap,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-6%", "8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-12%"]);

  const STATS = [
    { value: 12, suffix: "", label: "Years of quiet craft" },
    { value: 3400, suffix: "+", label: "Rituals performed" },
    { value: 9, suffix: "", label: "Resident artists" },
    { value: 98, suffix: "%", label: "Guests who return" },
  ];

  return (
    <section
      id="story"
      className="relative overflow-hidden bg-[#f7efec] px-6 py-28 lg:px-12 lg:py-40"
    >
      <span
        aria-hidden
        className="text-outline pointer-events-none absolute -top-4 left-0 font-serif text-[22vw] leading-none whitespace-nowrap opacity-60 select-none lg:text-[16rem]"
      >
        est. 2014
      </span>
      <div className="relative mx-auto max-w-7xl">
        <Eyebrow index="01" label="The studio" />
        <div className="mt-10 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-serif text-5xl leading-[1.02] font-light sm:text-6xl lg:text-[4.2rem]">
                <MaskedLines
                  lines={[
                    <>A considered</>,
                    <>
                      studio for <em className="text-[#b67f79]">hair,</em>
                    </>,
                    <>
                      <em className="text-[#b67f79]">skin</em> and self-
                    </>,
                    <>expression.</>,
                  ]}
                />
              </h2>
              <Reveal delay={0.35} className="mt-10">
                <a
                  href="#services"
                  className="group inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#3a292a] uppercase"
                >
                  <span className="flex size-11 items-center justify-center rounded-full border border-[#3a292a]/25 transition-all duration-500 group-hover:border-[#b67f79] group-hover:bg-[#b67f79] group-hover:text-[#f7efec]">
                    <ArrowDownRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                  Discover our rituals
                </a>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ScrubParagraph
              text="Slow down, settle in, and leave feeling entirely yourself. Veloura is a small studio built on unhurried appointments, honest counsel and hands that listen. Every service is shaped around your features, your rhythm and your day — never a template."
              className="font-serif text-3xl leading-[1.35] font-light text-[#3a292a] sm:text-4xl"
            />
            <div
              ref={imgWrap}
              className="relative mt-16 grid grid-cols-12 gap-6"
            >
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1.2, ease: EASE }}
                className="relative col-span-8 aspect-[3/4] overflow-hidden rounded-[2px]"
                data-cursor-label="The studio"
              >
                <motion.div
                  style={{ y: y1 }}
                  className="absolute -inset-y-[10%] inset-x-0"
                >
                  <Image
                    src={salonImg(2)}
                    alt="Warm minimalist interior of the Veloura studio"
                    fill
                    sizes="(max-width: 1024px) 66vw, 40vw"
                    className="scale-105 object-cover"
                    unoptimized
                  />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
                className="relative col-span-4 mt-24 aspect-[3/4] overflow-hidden rounded-[2px]"
                data-cursor-label="The craft"
              >
                <motion.div
                  style={{ y: y2 }}
                  className="absolute -inset-y-[12%] inset-x-0"
                >
                  <Image
                    src={salonImg(3)}
                    alt="A stylist braiding hair in soft light"
                    fill
                    sizes="(max-width: 1024px) 33vw, 22vw"
                    className="scale-105 object-cover"
                    unoptimized
                  />
                </motion.div>
              </motion.div>
              <span className="absolute -bottom-8 left-0 hidden font-serif text-sm text-[#3a292a]/50 italic lg:block">
                Fig. 01 — morning light in the atelier
              </span>
            </div>
          </div>
        </div>
        <div className="mt-32 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
        <div className="mt-32 flex flex-col items-center text-center">
          <Reveal>
            <Quote className="size-8 rotate-180 text-[#b67f79]" />
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="mt-8 max-w-3xl font-serif text-3xl leading-snug font-light italic sm:text-4xl">
              &quot;Beauty is not a transformation. It is the moment you
              recognise yourself again, rested and unhurried.&quot;
            </blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-[11px] tracking-[0.3em] text-[#3a292a]/50 uppercase">
              Margaux Vera — Founder & Creative Director
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function selectService(id: ServiceId) {
  window.dispatchEvent(
    new CustomEvent("veloura:select-service", { detail: id }),
  );
}

export function ServicesList() {
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 220, damping: 26, mass: 0.6 });
  const rotate = useTransform(useVelocity(sx), [-900, 900], [-7, 7], {
    clamp: true,
  });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#3a292a] px-6 py-28 text-[#f7efec] lg:px-12 lg:py-40"
    >
      <span
        aria-hidden
        className="text-outline-cream pointer-events-none absolute -right-8 bottom-10 font-serif text-[20vw] leading-none opacity-40 select-none"
      >
        rituals
      </span>
      <div className="relative mx-auto max-w-7xl">
        <Eyebrow index="02" label="Services" tone="dark" />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <h2 className="max-w-2xl font-serif text-5xl leading-[1.02] font-light sm:text-6xl lg:text-7xl">
            <MaskedLines
              lines={[
                <>Rituals, quietly</>,
                <>
                  <em className="text-[#f2c7c0]">considered.</em>
                </>,
              ]}
            />
          </h2>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-sm leading-relaxed text-[#f7efec]/55">
              Every appointment begins with tea and a conversation. Nothing is
              rushed, nothing is assumed — the service follows you, not the
              other way around.
            </p>
          </Reveal>
        </div>
        <div className="mt-20" onMouseMove={onMove}>
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} y={30} delay={i * 0.06} once>
              <div
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group relative border-t border-[#f7efec]/15 py-9 transition-colors duration-500 last:border-b hover:border-[#b67f79]/60 lg:py-11"
              >
                <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
                  <span className="font-serif text-sm text-[#b67f79] italic">
                    ({service.index})
                  </span>
                  <h3 className="font-serif text-4xl font-light transition-all duration-500 group-hover:translate-x-3 group-hover:text-[#f2c7c0] sm:text-5xl lg:text-6xl">
                    {service.name}
                  </h3>
                  <span className="hidden text-[11px] tracking-[0.22em] text-[#f7efec]/45 uppercase transition-colors duration-500 group-hover:text-[#f7efec]/70 sm:inline">
                    {service.duration} · {service.price}
                  </span>
                  <a
                    href="#book"
                    onClick={() => selectService(service.id)}
                    aria-label={`Book ${service.name}`}
                    className="ml-auto flex size-12 shrink-0 items-center justify-center rounded-full border border-[#f7efec]/25 transition-all duration-500 group-hover:border-[#b67f79] group-hover:bg-[#b67f79] group-hover:text-white"
                  >
                    <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
                  </a>
                </div>
                <p className="mt-3 max-w-xl pl-10 text-sm text-[#f7efec]/50 sm:pl-12">
                  {service.tagline}
                </p>
                <p className="mt-2 pl-10 text-[10px] tracking-[0.22em] text-[#f7efec]/40 uppercase sm:hidden">
                  {service.duration} · {service.price}
                </p>
                <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[2px] sm:aspect-[21/9] lg:hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14">
          <p className="text-center text-[11px] tracking-[0.26em] text-[#f7efec]/45 uppercase">
            Not sure where to begin?{" "}
            <a
              href="#book"
              className="text-[#f2c7c0] underline-offset-4 hover:underline"
            >
              Ask for a consultation
            </a>{" "}
            — it is always complimentary.
          </p>
        </Reveal>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            key={SERVICES[active].id}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.86 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed top-0 left-0 z-[65] hidden lg:block"
            style={{ x: sx, y: sy, rotate }}
          >
            <div className="relative aspect-[3/4] w-[300px] -translate-x-1/2 -translate-y-[112%] overflow-hidden rounded-[3px] shadow-2xl shadow-[#3a292a]/60">
              <Image
                src={SERVICES[active].image}
                alt=""
                fill
                sizes="300px"
                className="object-cover"
                unoptimized
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-[#f7efec]/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-[#3a292a] uppercase">
                {SERVICES[active].price}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function GalleryCard({
  still,
  i,
}: {
  still: { src: string; alt: string };
  i: number;
}) {
  return (
    <figure
      className={`relative aspect-[3/4] w-[240px] shrink-0 overflow-hidden rounded-[2px] sm:w-[300px] ${
        i % 2 === 0 ? "-rotate-1" : "rotate-1"
      }`}
      data-cursor-label="Veloura"
    >
      <Image
        src={still.src}
        alt={still.alt}
        fill
        sizes="(max-width: 640px) 240px, 300px"
        className="object-cover transition-transform duration-700 ease-out hover:scale-[1.06]"
        unoptimized
      />
    </figure>
  );
}

export function Gallery() {
  return (
    <section
      id="gallery"
      className="overflow-hidden bg-[#f7efec] py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow index="03" label="Selected stills" tone="rose" />
            <Reveal delay={0.1}>
              <h2 className="mt-8 font-serif text-5xl leading-[1.02] font-light sm:text-6xl">
                From the studio,
                <br />
                <em className="text-[#b67f79]">and beyond.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-xs text-sm leading-relaxed text-[#3a292a]/55">
              Fragments of ordinary, beautiful days — light, texture and the
              quiet work of hands.
            </p>
          </Reveal>
        </div>
      </div>
      <div className="mt-16 space-y-6">
        <div className="relative overflow-hidden">
          <div className="animate-marquee-slow flex w-max gap-6 pr-6">
            {STILLS.map((still, i) => (
              <GalleryCard key={`a-${still.src}`} still={still} i={i} />
            ))}
            {STILLS.map((still, i) => (
              <GalleryCard key={`b-${still.src}`} still={still} i={i} />
            ))}
          </div>
        </div>
      </div>
      <Reveal className="mt-14 text-center">
        <p className="text-[11px] tracking-[0.26em] text-[#3a292a]/45 uppercase">
          Follow the everyday —{" "}
          <span className="text-[#b67f79]">@veloura.studio</span>
        </p>
      </Reveal>
    </section>
  );
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + QUOTES.length) % QUOTES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(() => go(1), 7000);
    return () => clearInterval(id);
  }, [go]);

  const quote = QUOTES[index];

  return (
    <section id="voices" className="bg-[#f3e7e2] px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between">
          <Eyebrow index="04" label="Kind words" tone="rose" />
          <div className="flex gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex size-12 items-center justify-center rounded-full border border-[#3a292a]/20 transition-all duration-500 hover:border-[#b67f79] hover:bg-[#b67f79] hover:text-[#f7efec]"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex size-12 items-center justify-center rounded-full border border-[#3a292a]/20 transition-all duration-500 hover:border-[#b67f79] hover:bg-[#b67f79] hover:text-[#f7efec]"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="relative mt-14 min-h-[300px] sm:min-h-[260px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: 60 * direction, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -60 * direction, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className="font-serif text-3xl leading-snug font-light italic sm:text-[2.6rem] sm:leading-[1.25]">
                &quot;{quote.text}&quot;
              </p>
              <footer className="mt-10 flex items-center gap-4">
                <span className="h-px w-10 bg-[#b67f79]" />
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-[#3a292a]">
                    {quote.author}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.18em] text-[#3a292a]/50 uppercase">
                    {quote.service}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-12 flex items-center gap-4">
          <span className="font-serif text-sm text-[#b67f79] italic tabular-nums">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(QUOTES.length).padStart(2, "0")}
          </span>
          <div className="relative h-px flex-1 bg-[#3a292a]/15">
            <motion.span
              key={index}
              className="absolute inset-y-0 left-0 bg-[#b67f79]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 7, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold tracking-[0.24em] text-[#3a292a]/55 uppercase">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-[#96625d]">{error}</span>
      )}
    </label>
  );
}

export function Booking() {
  const [service, setService] = useState<ServiceId>("hair-design");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const minDate = new Date().toISOString().split("T")[0];
  const [confirmed, setConfirmed] = useState<{
    service: string;
    date: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<ServiceId>).detail;
      if (SERVICES.some((s) => s.id === id)) {
        setService(id);
        setStatus("idle");
      }
    };
    window.addEventListener("veloura:select-service", handler);
    return () => window.removeEventListener("veloura:select-service", handler);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const nextErrors: Record<string, string> = {};

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const preferredDate = String(fd.get("preferredDate") ?? "");
    const preferredTime = String(fd.get("preferredTime") ?? "");

    if (name.length < 2) nextErrors.name = "Please share your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Please share a valid email";
    if (!preferredDate) nextErrors.preferredDate = "Please choose a date";
    if (!preferredTime) nextErrors.preferredTime = "Please choose a time";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    setServerError(null);

    // Simulate API booking network request
    setTimeout(() => {
      const s = SERVICES.find((x) => x.id === service);
      setConfirmed({
        service: s?.name ?? service,
        date: preferredDate,
        time:
          TIME_SLOTS.find((t) => t.id === preferredTime)?.label.split(
            " — ",
          )[0] ?? preferredTime,
      });
      setStatus("success");
      form.reset();
    }, 1500);
  }

  const inputCls =
    "w-full border-b border-[#3a292a]/20 bg-transparent py-3 text-[15px] text-[#3a292a] placeholder:text-[#3a292a]/35 focus:border-[#b67f79] focus:outline-none transition-colors duration-300";

  return (
    <section id="book" className="bg-[#f7efec] px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow index="05" label="Your appointment" tone="rose" />
          <h2 className="mt-10 font-serif text-5xl leading-[1.02] font-light sm:text-6xl lg:text-[4.4rem] text-[#3a292a]">
            <MaskedLines
              lines={[
                <>Make space for</>,
                <>
                  feeling <em className="text-[#b67f79]">good.</em>
                </>,
              ]}
            />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-[#3a292a]/60">
              Choose your ritual and a gentle hour. We will confirm your
              appointment personally within one working day — always with a
              little room for ceremony.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12 space-y-6 text-sm">
              <p className="flex items-start gap-4 text-[#3a292a]">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#b67f79]" />
                <span className="text-[#3a292a]/70">
                  Jasminvej 14, 1610 Copenhagen
                  <br />
                  <span className="text-[#3a292a]/45">
                    Atelier door, second courtyard
                  </span>
                </span>
              </p>
              <p className="flex items-start gap-4 text-[#3a292a]">
                <Clock className="mt-0.5 size-4 shrink-0 text-[#b67f79]" />
                <span className="text-[#3a292a]/70">
                  Tuesday — Saturday · 09:00 — 19:00
                  <br />
                  <span className="text-[#3a292a]/45">
                    Sundays reserved for bridal parties
                  </span>
                </span>
              </p>
              <p className="flex items-start gap-4 text-[#3a292a]">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#b67f79]" />
                <span className="text-[#3a292a]/70">
                  +45 33 12 08 90
                  <br />
                  <a
                    href="mailto:hello@veloura.studio"
                    className="text-[#3a292a]/45 underline-offset-4 hover:text-[#b67f79] hover:underline"
                  >
                    hello@veloura.studio
                  </a>
                </span>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7">
          <div className="relative rounded-[3px] border border-[#3a292a]/12 bg-white/40 p-8 shadow-[0_24px_60px_-30px_rgba(58,41,42,0.25)] sm:p-12">
            <AnimatePresence mode="wait">
              {status === "success" && confirmed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="flex min-h-[460px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: 0.15,
                    }}
                    className="flex size-16 items-center justify-center rounded-full bg-[#b67f79] text-white"
                  >
                    <Check className="size-7" />
                  </motion.span>
                  <h3 className="mt-8 font-serif text-4xl font-light text-[#3a292a]">
                    Consider it <em className="text-[#b67f79]">noted.</em>
                  </h3>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#3a292a]/60">
                    Your request for{" "}
                    <strong className="text-[#3a292a]">
                      {confirmed.service}
                    </strong>{" "}
                    on{" "}
                    <strong className="text-[#3a292a]">{confirmed.date}</strong>{" "}
                    ({confirmed.time}) is with our front-of-house. Expect a
                    personal confirmation within one working day.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="group mt-10 inline-flex items-center gap-2 rounded-full border border-[#3a292a]/20 px-6 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#3a292a] transition-all duration-500 hover:border-[#b67f79] hover:bg-[#b67f79] hover:text-[#f7efec]"
                  >
                    Plan another ritual{" "}
                    <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="grid gap-8 sm:grid-cols-2"
                >
                  <Field label="Full name" error={errors.name}>
                    <input
                      name="name"
                      type="text"
                      placeholder="Astrid Holm"
                      className={inputCls}
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input
                      name="email"
                      type="email"
                      placeholder="astrid@example.com"
                      className={inputCls}
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Phone (optional)">
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+45 ..."
                      className={inputCls}
                      autoComplete="tel"
                    />
                  </Field>
                  <Field label="Ritual">
                    <div className="relative">
                      <select
                        value={service}
                        onChange={(e) =>
                          setService(e.target.value as ServiceId)
                        }
                        className={`${inputCls} appearance-none pr-8`}
                      >
                        {SERVICES.map((s) => (
                          <option
                            key={s.id}
                            value={s.id}
                            className="bg-[#f7efec]"
                          >
                            {s.name} — {s.price}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-1 size-4 -translate-y-1/2 text-[#3a292a]/50" />
                    </div>
                  </Field>
                  <Field label="Preferred date" error={errors.preferredDate}>
                    <div className="relative">
                      <input
                        name="preferredDate"
                        type="date"
                        min={minDate}
                        className={`${inputCls} appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50`}
                      />
                      <CalendarDays className="pointer-events-none absolute top-1/2 right-1 size-4 -translate-y-1/2 text-[#3a292a]/40" />
                    </div>
                  </Field>
                  <Field label="Preferred time" error={errors.preferredTime}>
                    <div className="relative">
                      <select
                        name="preferredTime"
                        defaultValue=""
                        className={`${inputCls} appearance-none pr-8`}
                      >
                        <option value="" disabled className="bg-[#f7efec]">
                          Choose a gentle hour
                        </option>
                        {TIME_SLOTS.map((t) => (
                          <option
                            key={t.id}
                            value={t.id}
                            className="bg-[#f7efec]"
                          >
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-1 size-4 -translate-y-1/2 text-[#3a292a]/50" />
                    </div>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Anything we should know? (optional)">
                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="Allergies, inspirations, a wedding date, a story..."
                        className={`${inputCls} resize-none`}
                      />
                    </Field>
                  </div>
                  {status === "error" && serverError && (
                    <p className="rounded-[3px] border border-[#b67f79]/40 bg-[#f2c7c0]/40 px-4 py-3 text-sm text-[#96625d] sm:col-span-2">
                      {serverError}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group inline-flex items-center gap-3 rounded-full bg-[#3a292a] px-8 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#f7efec] uppercase transition-all duration-500 hover:bg-[#b67f79] disabled:opacity-60"
                    >
                      {status === "submitting" ? (
                        <>
                          Reserving <Loader2 className="size-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Request appointment{" "}
                          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-[#3a292a]/45">
                      No payment today — we simply hold the hour for you.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const brandName = useStudioBrand();
  const toTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-[#3a292a] text-[#f7efec]">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-10 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-serif text-3xl leading-snug font-light">
                Until we meet —<br />
                <em className="text-[#f2c7c0]">be gentle with yourself.</em>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex gap-3">
                {[
                  { icon: Camera, label: "Instagram" },
                  { icon: AtSign, label: "Social" },
                  { icon: Mail, label: "Email" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="mailto:hello@veloura.studio"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full border border-[#f7efec]/20 transition-all duration-500 hover:border-[#b67f79] hover:bg-[#b67f79] hover:text-[#f7efec]"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {[
              {
                title: "Navigate",
                items: [
                  { label: "The studio", href: "#story" },
                  { label: "Services", href: "#services" },
                  { label: "Stills", href: "#gallery" },
                  { label: "Book", href: "#book" },
                ],
              },
              {
                title: "Visit",
                items: [
                  { label: "Jasminvej 14", href: "#" },
                  { label: "1610 Copenhagen", href: "#" },
                  { label: "Tue — Sat", href: "#" },
                  { label: "09:00 — 19:00", href: "#" },
                ],
              },
              {
                title: "Contact",
                items: [
                  {
                    label: "hello@veloura.studio",
                    href: "mailto:hello@veloura.studio",
                  },
                  { label: "+45 33 12 08 90", href: "tel:+4533120890" },
                  { label: "@veloura.studio", href: "#" },
                  { label: "Press enquiries", href: "#" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[10px] font-semibold tracking-[0.3em] text-[#b67f79] uppercase">
                  {col.title}
                </p>
                <ul className="mt-6 space-y-3.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-sm text-[#f7efec]/60 transition-colors duration-300 hover:text-[#f2c7c0]"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 overflow-hidden border-t border-[#f7efec]/10 pt-10">
          <Reveal y={60}>
            <p
              aria-hidden
              className="text-center font-serif text-[16.5vw] leading-[0.85] tracking-[0.02em] text-[#f7efec]/95 uppercase select-none"
            >
              {brandName}
            </p>
          </Reveal>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-[#f7efec]/10 pt-8 text-[10px] tracking-[0.22em] text-[#f7efec]/40 uppercase">
          <p>
            © {new Date().getFullYear()} {brandName} Studio · All rituals
            reserved
          </p>
          <p>Designed by Infycrest Solutions</p>
          <button
            onClick={toTop}
            className="group inline-flex items-center gap-2 rounded-full border border-[#f7efec]/20 px-5 py-3 transition-all duration-500 hover:border-[#b67f79] hover:bg-[#b67f79] hover:text-[#f7efec]"
          >
            Back to the light{" "}
            <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumSalonTemplate({
  businessName = "Veloura",
}: {
  businessName?: string;
}) {
  return (
    <StudioBrandContext.Provider value={businessName || "Veloura"}>
      <SmoothScroll>
        <div className="relative bg-[#f7efec] font-sans text-[#3a292a] selection:bg-[#b67f79] selection:text-[#f7efec]">
          <style
            dangerouslySetInnerHTML={{
              __html: `
          @keyframes marquee { to { transform: translateX(-50%); } }
          @keyframes marquee-slow { to { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 38s linear infinite; }
          .animate-marquee-slow { animation: marquee-slow 64s linear infinite; }
          .text-outline { -webkit-text-stroke: 1px rgba(58, 41, 42, 0.28); color: transparent; }
          .text-outline-cream { -webkit-text-stroke: 1px rgba(247, 239, 236, 0.35); color: transparent; }
          .grain-overlay { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E"); }
          @media (pointer: fine) { .custom-cursor-active, .custom-cursor-active a, .custom-cursor-active button, .custom-cursor-active label, .custom-cursor-active input, .custom-cursor-active select, .custom-cursor-active textarea { cursor: none; } }
        `,
            }}
          />

          <Preloader />
          <Cursor />
          <Grain />
          <Navbar />

          <main>
            <Hero />
            <Marquee
              items={[
                "Hair design",
                "Skin rituals",
                "Bridal studio",
                "Private appointments",
                "Unhurried hours",
              ]}
            />
            <Story />
            <ServicesList />
            <Gallery />
            <Testimonials />
            <Booking />
            <Marquee
              variant="ink"
              slow
              items={[
                "Make space for feeling good",
                "The art of feeling like yourself",
                "Quietly luxurious",
              ]}
            />
          </main>

          <Footer />
        </div>
      </SmoothScroll>
    </StudioBrandContext.Provider>
  );
}
