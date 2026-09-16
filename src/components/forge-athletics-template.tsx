"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
} from "react";
import Image from "next/image";
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
  type MotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Check,
  Clock,
  Flame,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  Quote,
  Target,
  Users,
  X,
} from "lucide-react";
import Lenis from "lenis";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

// Helper to pull directly from your 1-39 local images
const gymImg = (num: number) => `/gym/${num}.jpg`;

export type GymClass = {
  id: number;
  day: string;
  time: string;
  name: string;
  coach: string;
  intensity: string;
  duration: number;
  spots: number;
};

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const STATS = [
  { value: 1200, suffix: "+", label: "Members strong" },
  { value: 64, suffix: "", label: "Sessions a week" },
  { value: 12, suffix: "", label: "Expert coaches" },
  { value: 98, suffix: "%", label: "Show-up rate" },
];

export const PROGRAMS = [
  {
    index: "01",
    title: "Strength Floor",
    tag: "60–75 min · Platforms",
    description:
      "Barbells, platforms and progressive loading. Build raw, lasting strength under eyes that know the difference between effort and ego.",
    image: gymImg(1),
  },
  {
    index: "02",
    title: "Group Training",
    tag: "45 min · Engines",
    description:
      "Conditioning bays, sleds and ropes. You suffer together, you leave lighter — nobody finishes alone here.",
    image: gymImg(2),
  },
  {
    index: "03",
    title: "Personal Coaching",
    tag: "1:1 · Programming",
    description:
      "One-on-one programming with eyes on every rep. Nowhere to hide, everything to gain.",
    image: gymImg(3),
  },
  {
    index: "04",
    title: "Recovery",
    tag: "50 min · Mobility",
    description:
      "Mobility, breathwork and cold plunge. Train hard, recover harder — longevity is the real PR.",
    image: gymImg(4),
  },
];

export const COACHES = [
  {
    index: "01",
    name: "Mara Okafor",
    role: "Head Coach · Strength",
    quote: "Ten years under the bar. Zero tolerance for ego.",
    image: gymImg(5),
  },
  {
    index: "02",
    name: "Roman Alvarez",
    role: "Conditioning · Engines",
    quote: "Engines are built, not born.",
    image: gymImg(6),
  },
  {
    index: "03",
    name: "June Marsh",
    role: "Barbell Club · Technique",
    quote: "Technique first. Then load. Always.",
    image: gymImg(7),
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "I've paid for five gym memberships and used one. Forge is the one. Somebody is waiting for me at 6AM — and they notice when I'm not there.",
    name: "Dana K.",
    detail: "Member since 2019",
  },
  {
    quote:
      "I walked in barely able to front-rack a bar. Eighteen months later I pulled double bodyweight. The coaching in this room is surgical.",
    name: "Marcus T.",
    detail: "Barbell Club",
  },
  {
    quote:
      "No mirrors for posing, nobody filming themselves. Just work. It's the most honest room in the city.",
    name: "Priya S.",
    detail: "Member since 2021",
  },
];

export const PLANS = [
  {
    name: "Day Pass",
    price: "$25",
    period: "per visit",
    note: "Taste the floor before you commit.",
    features: [
      "Full floor access for one day",
      "Join any coached session",
      "Recovery suite included",
      "Chalk provided, always",
    ],
    highlighted: false,
  },
  {
    name: "Monthly",
    price: "$145",
    period: "per month",
    note: "The full practice. Most choose this.",
    features: [
      "Unlimited sessions, all programs",
      "Open floor 5:30–22:00 daily",
      "Recovery suite + cold plunge",
      "One guest pass a month",
      "Pause anytime, no questions",
    ],
    highlighted: true,
  },
  {
    name: "Annual",
    price: "$1,450",
    period: "per year",
    note: "For the ones who already know.",
    features: [
      "Everything in Monthly",
      "Quarterly 1:1 coaching review",
      "Forge training kit",
      "Rate locked for life",
    ],
    highlighted: false,
  },
];

export const FAQS = [
  {
    q: "Do I need experience to join?",
    a: "No. Every member starts with Foundations — a two-session on-ramp where a coach teaches you the core lifts and scales everything to where you are today. The barbell doesn't care where you start, only that you show up.",
  },
  {
    q: "What should I bring to my trial session?",
    a: "Flat shoes, a water bottle and clothes you can move in. Leave the ego at the door — we have chalk, towels and strong opinions about rest periods. Arrive ten minutes early so a coach can walk you through the floor.",
  },
  {
    q: "Can I pause my membership?",
    a: "Yes — life happens. Monthly and Annual members can pause for up to three months a year, no fees, no guilt trip. Your spot and your rate stay yours.",
  },
  {
    q: "When are you open?",
    a: "Monday to Friday 5:30–22:00, Saturday 7:00–20:00, Sunday 8:00–18:00. Coached sessions run all day; the open floor is yours whenever the lights are on.",
  },
  {
    q: "Where is the club?",
    a: "44 Ironworks Lane, Portland, OR — inside a converted machine works five minutes from the east waterfront. Bike racks out front, cold plunge out back.",
  },
];

export const NAV_LINKS = [
  { label: "Training", href: "#training" },
  { label: "Schedule", href: "#schedule" },
  { label: "Coaches", href: "#coaches" },
  { label: "Membership", href: "#membership" },
];

export const fallbackSchedule: GymClass[] = [
  {
    id: 1,
    day: "Monday",
    time: "06:00",
    name: "Iron Hour",
    coach: "Mara Okafor",
    intensity: "High",
    duration: 60,
    spots: 14,
  },
  {
    id: 2,
    day: "Monday",
    time: "12:15",
    name: "Lunch Engine",
    coach: "Roman Alvarez",
    intensity: "Medium",
    duration: 45,
    spots: 18,
  },
  {
    id: 3,
    day: "Monday",
    time: "17:30",
    name: "Barbell Club",
    coach: "June Marsh",
    intensity: "High",
    duration: 75,
    spots: 12,
  },
  {
    id: 4,
    day: "Monday",
    time: "19:00",
    name: "Reset",
    coach: "Ana Lind",
    intensity: "Low",
    duration: 50,
    spots: 16,
  },
  {
    id: 5,
    day: "Tuesday",
    time: "06:00",
    name: "Metcon",
    coach: "Roman Alvarez",
    intensity: "High",
    duration: 45,
    spots: 18,
  },
  {
    id: 6,
    day: "Tuesday",
    time: "09:00",
    name: "Foundations",
    coach: "June Marsh",
    intensity: "Medium",
    duration: 60,
    spots: 10,
  },
  {
    id: 7,
    day: "Tuesday",
    time: "17:30",
    name: "Team Series",
    coach: "Mara Okafor",
    intensity: "High",
    duration: 60,
    spots: 20,
  },
  {
    id: 8,
    day: "Tuesday",
    time: "19:00",
    name: "Mobility",
    coach: "Ana Lind",
    intensity: "Low",
    duration: 50,
    spots: 16,
  },
  {
    id: 9,
    day: "Wednesday",
    time: "06:00",
    name: "Iron Hour",
    coach: "Mara Okafor",
    intensity: "High",
    duration: 60,
    spots: 14,
  },
  {
    id: 10,
    day: "Wednesday",
    time: "12:15",
    name: "Lunch Engine",
    coach: "Roman Alvarez",
    intensity: "Medium",
    duration: 45,
    spots: 18,
  },
  {
    id: 11,
    day: "Wednesday",
    time: "17:30",
    name: "Heavy Singles",
    coach: "June Marsh",
    intensity: "High",
    duration: 75,
    spots: 10,
  },
  {
    id: 12,
    day: "Wednesday",
    time: "19:00",
    name: "Breathwork",
    coach: "Ana Lind",
    intensity: "Low",
    duration: 40,
    spots: 14,
  },
  {
    id: 13,
    day: "Thursday",
    time: "06:00",
    name: "Metcon",
    coach: "Roman Alvarez",
    intensity: "High",
    duration: 45,
    spots: 18,
  },
  {
    id: 14,
    day: "Thursday",
    time: "09:00",
    name: "Foundations",
    coach: "June Marsh",
    intensity: "Medium",
    duration: 60,
    spots: 10,
  },
  {
    id: 15,
    day: "Thursday",
    time: "17:30",
    name: "Barbell Club",
    coach: "June Marsh",
    intensity: "High",
    duration: 75,
    spots: 12,
  },
  {
    id: 16,
    day: "Thursday",
    time: "19:00",
    name: "Reset",
    coach: "Ana Lind",
    intensity: "Low",
    duration: 50,
    spots: 16,
  },
  {
    id: 17,
    day: "Friday",
    time: "06:00",
    name: "Iron Hour",
    coach: "Mara Okafor",
    intensity: "High",
    duration: 60,
    spots: 14,
  },
  {
    id: 18,
    day: "Friday",
    time: "12:15",
    name: "Lunch Engine",
    coach: "Roman Alvarez",
    intensity: "Medium",
    duration: 45,
    spots: 18,
  },
  {
    id: 19,
    day: "Friday",
    time: "17:30",
    name: "Team Series",
    coach: "Mara Okafor",
    intensity: "High",
    duration: 60,
    spots: 20,
  },
  {
    id: 20,
    day: "Friday",
    time: "18:30",
    name: "Long Recovery",
    coach: "Ana Lind",
    intensity: "Low",
    duration: 75,
    spots: 16,
  },
  {
    id: 21,
    day: "Saturday",
    time: "08:00",
    name: "Community WOD",
    coach: "All coaches",
    intensity: "Medium",
    duration: 90,
    spots: 30,
  },
  {
    id: 22,
    day: "Saturday",
    time: "10:00",
    name: "Open Floor",
    coach: "Mara Okafor",
    intensity: "Low",
    duration: 120,
    spots: 40,
  },
  {
    id: 23,
    day: "Sunday",
    time: "09:00",
    name: "Mobility",
    coach: "Ana Lind",
    intensity: "Low",
    duration: 60,
    spots: 20,
  },
  {
    id: 24,
    day: "Sunday",
    time: "10:30",
    name: "Open Floor",
    coach: "June Marsh",
    intensity: "Low",
    duration: 120,
    spots: 40,
  },
];

/* -------------------------------------------------------------------------- */
/*                               MOTION HELPERS                               */
/* -------------------------------------------------------------------------- */

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_HEAVY: [number, number, number, number] = [0.76, 0, 0.24, 1];

export function FadeUp({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function MaskLine({
  children,
  delay = 0,
  className,
  innerClassName,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <span
      className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className ?? ""}`}
    >
      <motion.span
        className={`block will-change-transform ${innerClassName ?? ""}`}
        initial={{ y: "115%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1.15, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Counter({
  value,
  suffix = "",
  className,
  duration = 1.9,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = Math.round(latest).toLocaleString("en-US");
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={wrapRef} className={className}>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export function Magnetic({
  children,
  strength = 0.32,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 14, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 160, damping: 14, mass: 0.25 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className="inline-block"
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
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

export function ParallaxImage({
  src,
  alt,
  caption,
  tag,
  height = "h-[62vh] lg:h-[82vh]",
}: {
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${height}`}>
      <motion.div style={{ y }} className="absolute inset-[-14%]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#202321]/70 via-transparent to-[#202321]/30" />
      {tag && (
        <FadeUp className="absolute right-6 top-6 lg:right-12 lg:top-10">
          <span className="border border-[#f3eee3]/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f3eee3]/80 backdrop-blur-sm">
            {tag}
          </span>
        </FadeUp>
      )}
      {caption && (
        <FadeUp
          className="absolute bottom-6 left-6 lg:bottom-10 lg:left-12"
          delay={0.1}
        >
          <span className="font-display text-2xl uppercase tracking-[0.04em] text-[#f3eee3] md:text-3xl">
            {caption}
          </span>
        </FadeUp>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INTERACTIVE FX                               */
/* -------------------------------------------------------------------------- */

export function Preloader({
  businessName = "Forge",
}: {
  businessName?: string;
}) {
  const [done, setDone] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const controls = animate(0, 100, {
      duration: 1.15,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (latest) => {
        if (countRef.current) {
          countRef.current.textContent = String(Math.floor(latest)).padStart(
            3,
            "0",
          );
        }
      },
    });
    const timer = setTimeout(() => {
      setDone(true);
      document.documentElement.style.overflow = "";
    }, 1400);

    return () => {
      controls.stop();
      clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const letters = businessName.toUpperCase().split("");

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-[#202321] px-6 py-7 lg:px-12 lg:py-10 text-[#f3eee3]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE_HEAVY }}
        >
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f3eee3]/45">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Athletics Club
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Portland · Est. 2016
            </motion.span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <h1 className="font-display text-[clamp(4rem,15vw,13rem)] leading-[0.82] tracking-[0.01em]">
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]"
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: "112%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 0.95,
                      delay: 0.12 + i * 0.06,
                      ease: EASE,
                    }}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
              <span className="text-[#d3a85e]">.</span>
            </h1>

            <div className="hidden text-right sm:block">
              <span
                ref={countRef}
                className="font-display text-6xl leading-none text-[#d3a85e] lg:text-8xl"
              >
                000
              </span>
              <span className="mt-3 block text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f3eee3]/40">
                Chalking up
              </span>
            </div>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-[#d3a85e]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 240, damping: 22, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 240, damping: 22, mass: 0.55 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      setHovering(
        Boolean(
          target?.closest(
            "a, button, [data-hover], input, textarea, select, label, summary",
          ),
        ),
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[130] size-1.5 rounded-full bg-[#d3a85e]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[129] rounded-full border border-[#f3eee3]/60 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 54 : 30,
          height: hovering ? 54 : 30,
          scale: pressed ? 0.75 : 1,
          opacity: hovering ? 1 : 0.7,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </>
  );
}

export function Grain() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-[90] opacity-40 mix-blend-overlay"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

export function Nav({ businessName = "Forge" }: { businessName?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Stay visible while scrolling — the header sits below the fixed agency bar.
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 32);
  });

  const nameUpper = businessName.toUpperCase();

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-[110] transition-colors duration-500 ${
          scrolled
            ? "border-b border-[#f3eee3]/10 bg-[#202321]/85 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 lg:h-20 lg:px-12 text-[#f3eee3]">
          <a
            href="#top"
            className="font-display text-[1.7rem] leading-none tracking-[0.05em]"
          >
            {nameUpper}
            <span className="text-[#d3a85e]">.</span>
          </a>
          <nav className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-underline text-[11px] font-semibold uppercase tracking-[0.26em] text-[#f3eee3]/65 transition-colors hover:text-[#f3eee3]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#join"
              className="group hidden items-center gap-1.5 rounded-full bg-[#d3a85e] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#202321] transition-transform duration-300 hover:scale-[1.04] sm:inline-flex"
            >
              Try a session
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="p-2 text-[#f3eee3] lg:hidden"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[140] flex flex-col bg-[#202321] text-[#f3eee3]"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE_HEAVY }}
          >
            <div className="flex h-16 items-center justify-between border-b border-[#f3eee3]/10 px-6">
              <span className="font-display text-[1.7rem] leading-none tracking-[0.05em]">
                {nameUpper}
                <span className="text-[#d3a85e]">.</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-2 text-[#f3eee3]"
              >
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
              {NAV_LINKS.map((link, i) => (
                <span key={link.href} className="block overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 py-1"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.07,
                      ease: EASE,
                    }}
                  >
                    <span className="text-[11px] font-semibold tracking-[0.3em] text-[#d3a85e]">
                      0{i + 1}
                    </span>
                    <span className="font-display text-5xl uppercase leading-none tracking-tight transition-colors group-hover:text-[#d3a85e] sm:text-6xl">
                      {link.label}
                    </span>
                  </motion.a>
                </span>
              ))}
            </nav>
            <motion.div
              className="flex items-center justify-between border-t border-[#f3eee3]/10 px-6 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f3eee3]/45">
                44 Ironworks Ln · Portland, OR
              </p>
              <a
                href="#join"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#d3a85e] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#202321]"
              >
                Try a session <ArrowUpRight className="size-3.5" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const D = 1.45;

function RevealLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
      <motion.span
        className="block will-change-transform"
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.2, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const rise = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-[#202321] text-[#f3eee3]"
    >
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <motion.div
          className="absolute inset-[-8%]"
          initial={{ scale: 1.16 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.1, delay: 1.25, ease: EASE }}
        >
          <Image
            src={gymImg(8)}
            alt="Athlete pulling a heavy deadlift on the Forge strength floor"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-65"
            unoptimized
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#202321] via-[#202321]/30 to-[#202321]/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#202321]/70 via-transparent to-transparent" />

      <motion.div
        className="absolute right-8 top-1/2 hidden -translate-y-1/2 items-center gap-4 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D + 0.9, duration: 1 }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#f3eee3]/50 [writing-mode:vertical-rl]">
          Est. 2016 · Portland, OR
        </span>
        <span className="h-24 w-px bg-[#f3eee3]/20" />
      </motion.div>

      <motion.div
        style={{ opacity: fade, y: rise }}
        className="relative px-6 pb-8 lg:px-12"
      >
        <motion.p
          className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-[#d3a85e]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D, duration: 0.9, ease: EASE }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#d3a85e] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#d3a85e]" />
          </span>
          Earn your strength · Athletics club
        </motion.p>

        <h1 className="font-display text-[clamp(4.4rem,13.2vw,13rem)] uppercase leading-[0.8] tracking-[-0.01em]">
          <RevealLine delay={D + 0.1}>
            <span className="inline-flex items-center gap-[0.18em]">
              Built
              <span className="relative mt-[0.06em] hidden h-[0.6em] w-[1.4em] overflow-hidden rounded-full sm:inline-block">
                <Image
                  src={gymImg(9)}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 14vw"
                  className="object-cover"
                  unoptimized
                />
              </span>
              for
            </span>
          </RevealLine>
          <RevealLine delay={D + 0.22}>
            <span>
              The{" "}
              <em className="font-serif font-normal normal-case italic tracking-normal text-[#d3a85e]">
                work.
              </em>
            </span>
          </RevealLine>
        </h1>

        <div className="mt-10 flex flex-col justify-between gap-8 border-t border-[#f3eee3]/15 pt-8 md:flex-row md:items-end">
          <motion.p
            className="max-w-md text-base leading-relaxed text-[#f3eee3]/60 lg:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.4, duration: 0.9, ease: EASE }}
          >
            A focused training club for people who want to get stronger, move
            better and keep showing up. No mirrors for posing. No shortcuts.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.52, duration: 0.9, ease: EASE }}
          >
            <Magnetic>
              <a
                href="#join"
                className="group inline-flex items-center gap-2 rounded-full bg-[#d3a85e] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#202321] transition-colors hover:bg-[#f3eee3]"
              >
                Try a session
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
            <a
              href="#club"
              className="group inline-flex items-center gap-2 rounded-full border border-[#f3eee3]/25 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f3eee3] transition-colors hover:border-[#d3a85e] hover:text-[#d3a85e]"
            >
              Explore the floor
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="mt-10 grid grid-cols-2 border-t border-[#f3eee3]/15 md:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: D + 0.65, duration: 1 }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-5 pr-4 md:py-6 ${i > 0 ? "border-l border-[#f3eee3]/15 pl-5 md:pl-7" : ""} ${i === 2 ? "border-l-0 md:border-l" : ""}`}
            >
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="font-display text-3xl tracking-wide text-[#f3eee3] md:text-4xl"
              />
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f3eee3]/45">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Marquee({
  items,
  variant = "solid",
  duration = 26,
  reverse = false,
}: {
  items: string[];
  variant?: "solid" | "ghost";
  duration?: number;
  reverse?: boolean;
}) {
  const row = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span
            className={
              variant === "solid"
                ? "px-6 font-display text-3xl uppercase leading-none tracking-[0.02em] text-[#202321] md:px-8 md:text-4xl"
                : "text-stroke px-6 font-display text-5xl uppercase leading-none tracking-[0.02em] md:px-8 md:text-7xl"
            }
          >
            {item}
          </span>
          <Asterisk
            className={
              variant === "solid"
                ? "size-6 shrink-0 text-[#202321]/60 md:size-7"
                : "size-8 shrink-0 text-[#d3a85e]/70 md:size-10"
            }
            strokeWidth={1.5}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`relative flex overflow-hidden ${
        variant === "solid"
          ? "border-y border-[#202321]/60 bg-[#d3a85e] py-4 md:py-5"
          : "bg-[#202321] py-6 md:py-8"
      }`}
    >
      <div
        className="marquee-track flex w-max"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

function Word({
  children,
  accent,
  progress,
  range,
}: {
  children: string;
  accent?: boolean;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={
        accent
          ? "mr-[0.28em] font-serif normal-case italic tracking-normal text-[#d3a85e]"
          : "mr-[0.28em]"
      }
    >
      {children}
    </motion.span>
  );
}

export function Manifesto({
  businessName = "Forge",
}: {
  businessName?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const STATEMENT: { t: string; accent?: boolean }[] = [
    { t: businessName },
    { t: "is" },
    { t: "not" },
    { t: "a" },
    { t: "gym." },
    { t: "It" },
    { t: "is" },
    { t: "a" },
    { t: "practice", accent: true },
    { t: "of" },
    { t: "iron," },
    { t: "intent,", accent: true },
    { t: "and" },
    { t: "a" },
    { t: "room" },
    { t: "full" },
    { t: "of" },
    { t: "people" },
    { t: "who" },
    { t: "refuse" },
    { t: "to" },
    { t: "let" },
    { t: "you" },
    { t: "quit" },
    { t: "on" },
    { t: "yourself.", accent: true },
  ];

  const PILLARS = [
    {
      icon: Target,
      title: "Training with intent",
      copy: "Every set has a purpose. Programs progress weekly, deloads are planned, and nothing on this floor is random.",
    },
    {
      icon: Users,
      title: "Community over crowds",
      copy: "You're a name here, never a scan at the door. Partners count your reps and notice your absence.",
    },
    {
      icon: Flame,
      title: "No shortcuts",
      copy: "No thirty-day miracles. Just honest work tracked over seasons, compounding into something nobody can take from you.",
    },
  ];

  return (
    <section id="club" className="relative bg-[#202321] text-[#f3eee3]">
      <div className="px-6 py-16 lg:px-12 lg:py-24">
        <FadeUp className="flex items-center gap-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d3a85e]">
            01 · The Club
          </span>
          <span className="h-px flex-1 bg-[#f3eee3]/15" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f3eee3]/40">
            Who we are
          </span>
        </FadeUp>
        <p
          ref={ref}
          className="mt-14 max-w-6xl font-display text-[clamp(2.1rem,5.4vw,4.9rem)] uppercase leading-[1.04] tracking-[0.005em]"
        >
          {STATEMENT.map((word, i) => (
            <Word
              key={i}
              accent={word.accent}
              progress={scrollYProgress}
              range={[i / STATEMENT.length, (i + 1) / STATEMENT.length]}
            >
              {word.t}
            </Word>
          ))}
        </p>
        <div className="mt-24 grid gap-10 md:grid-cols-3 lg:gap-14">
          {PILLARS.map((pillar, i) => (
            <FadeUp key={pillar.title} delay={i * 0.12}>
              <div className="group border-t border-[#f3eee3]/15 pt-8">
                <pillar.icon
                  className="size-7 text-[#d3a85e] transition-transform duration-500 group-hover:-translate-y-1"
                  strokeWidth={1.5}
                />
                <h3 className="mt-6 font-display text-2xl uppercase tracking-[0.02em]">
                  {pillar.title}
                </h3>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#f3eee3]/55">
                  {pillar.copy}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
      <ParallaxImage
        src={gymImg(10)}
        alt="Two athletes laughing and sharing a chalky high-five after training"
        caption="The Floor · 6:02 AM"
        tag="Wednesday"
      />
    </section>
  );
}

export function Programs() {
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useSpring(x, { stiffness: 170, damping: 20, mass: 0.55 });
  const py = useSpring(y, { stiffness: 170, damping: 20, mass: 0.55 });

  return (
    <section
      id="training"
      className="relative px-6 py-16 lg:px-12 lg:py-24 bg-[#202321] text-[#f3eee3]"
    >
      <FadeUp className="flex items-center gap-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d3a85e]">
          02 · The Floor
        </span>
        <span className="h-px flex-1 bg-[#f3eee3]/15" />
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f3eee3]/40 sm:block">
          Pick your poison
        </span>
      </FadeUp>
      <h2 className="mt-12 font-display text-[clamp(2.9rem,7.5vw,6.8rem)] uppercase leading-[0.88] tracking-[-0.01em]">
        <MaskLine>The work,</MaskLine>
        <MaskLine delay={0.1}>
          <span className="font-serif normal-case italic tracking-normal text-[#d3a85e]">
            four ways.
          </span>
        </MaskLine>
      </h2>

      <div
        ref={containerRef}
        className="relative mt-16 lg:mt-20"
        onMouseMove={(event) => {
          x.set(event.clientX);
          y.set(event.clientY);
        }}
        onMouseLeave={() => setActive(null)}
      >
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[80] hidden lg:block"
          style={{ x: px, y: py }}
        >
          <motion.div
            className="relative -ml-[150px] -mt-[200px] h-[350px] w-[290px] overflow-hidden"
            animate={{
              scale: active !== null ? 1 : 0.6,
              opacity: active !== null ? 1 : 0,
              rotate: active !== null ? -4 : 0,
            }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {PROGRAMS.map((program, i) => (
              <motion.div
                key={program.title}
                className="absolute inset-0"
                animate={{
                  clipPath:
                    active === i
                      ? "inset(0% 0% 0% 0%)"
                      : "inset(100% 0% 0% 0%)",
                }}
                transition={{ duration: 0.5, ease: EASE_HEAVY }}
              >
                <Image
                  src={program.image}
                  alt=""
                  fill
                  sizes="290px"
                  className="object-cover"
                  unoptimized
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <ul>
          {PROGRAMS.map((program, i) => (
            <FadeUp key={program.title} delay={i * 0.06}>
              <li
                onMouseEnter={() => setActive(i)}
                className="group relative border-t border-[#f3eee3]/15 last:border-b"
              >
                <a
                  href="#join"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("forge:program", {
                        detail: program.title,
                      }),
                    )
                  }
                  className="block py-8 transition-colors duration-500 group-hover:bg-[#f3eee3]/[0.03] lg:py-9"
                >
                  <div className="grid items-center gap-5 md:grid-cols-[64px_minmax(0,1.15fr)_minmax(0,1fr)_64px] lg:gap-8">
                    <span className="hidden text-[11px] font-bold tracking-[0.3em] text-[#f3eee3]/35 transition-colors duration-500 group-hover:text-[#d3a85e] md:block">
                      {program.index}
                    </span>
                    <h3 className="font-display text-[clamp(2rem,4.4vw,3.9rem)] uppercase leading-[0.9] tracking-[-0.01em] transition-all duration-500 group-hover:translate-x-3 group-hover:text-[#d3a85e]">
                      {program.title}
                    </h3>
                    <div className="md:pr-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#d3a85e]/80">
                        {program.tag}
                      </p>
                      <p className="mt-2.5 max-w-md text-sm leading-relaxed text-[#f3eee3]/50 transition-colors duration-500 group-hover:text-[#f3eee3]/75">
                        {program.description}
                      </p>
                    </div>
                    <span className="hidden size-12 items-center justify-center rounded-full border border-[#f3eee3]/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-[#d3a85e] group-hover:bg-[#d3a85e] group-hover:text-[#202321] md:flex">
                      <ArrowUpRight className="size-5" strokeWidth={1.75} />
                    </span>
                  </div>
                  <div className="mt-5 overflow-hidden md:hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      width={800}
                      height={520}
                      className="aspect-[16/9] w-full object-cover"
                      unoptimized
                    />
                  </div>
                </a>
              </li>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}

function IntensityPill({ level }: { level: string }) {
  const styles =
    level === "High"
      ? "border-[#d3a85e]/50 bg-[#d3a85e]/10 text-[#d3a85e]"
      : level === "Medium"
        ? "border-[#f3eee3]/30 text-[#f3eee3]/75"
        : "border-[#f3eee3]/15 text-[#f3eee3]/50";
  const dot =
    level === "High"
      ? "bg-[#d3a85e]"
      : level === "Medium"
        ? "bg-[#f3eee3]/60"
        : "bg-[#f3eee3]/30";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] ${styles}`}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {level}
    </span>
  );
}

export function Schedule({
  classes = fallbackSchedule,
}: {
  classes?: GymClass[];
}) {
  const [day, setDay] = useState<string>("Monday");
  const dayClasses = classes.filter((c) => c.day === day);
  const totalMinutes = dayClasses.reduce((sum, c) => sum + c.duration, 0);

  const reserve = (name: string) =>
    window.dispatchEvent(new CustomEvent("forge:program", { detail: name }));

  return (
    <section
      id="schedule"
      className="relative px-6 py-16 lg:px-12 lg:py-24 bg-[#202321] text-[#f3eee3]"
    >
      <FadeUp className="flex items-center gap-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d3a85e]">
          03 · The Week
        </span>
        <span className="h-px flex-1 bg-[#f3eee3]/15" />
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f3eee3]/40 sm:block">
          Live from the floor book
        </span>
      </FadeUp>

      <div className="mt-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <h2 className="font-display text-[clamp(2.9rem,7.5vw,6.8rem)] uppercase leading-[0.88] tracking-[-0.01em]">
          <MaskLine>64 sessions.</MaskLine>
          <MaskLine delay={0.1}>
            <span className="font-serif normal-case italic tracking-normal text-[#d3a85e]">
              one is yours.
            </span>
          </MaskLine>
        </h2>
        <FadeUp delay={0.2} className="max-w-xs">
          <p className="text-sm leading-relaxed text-[#f3eee3]/55">
            Capped, coached and counted. Every session pulls straight from the
            club's floor book — reserve your spot below.
          </p>
        </FadeUp>
      </div>

      <FadeUp delay={0.1} className="mt-14 flex flex-wrap gap-2.5">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`relative rounded-full border px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${
              day === d
                ? "border-[#d3a85e] text-[#202321]"
                : "border-[#f3eee3]/20 text-[#f3eee3]/60 hover:border-[#f3eee3]/50 hover:text-[#f3eee3]"
            }`}
          >
            {day === d && (
              <motion.span
                layoutId="day-pill"
                className="absolute inset-0 rounded-full bg-[#d3a85e]"
                transition={{ duration: 0.45, ease: EASE }}
              />
            )}
            <span className="relative">{d.slice(0, 3)}</span>
          </button>
        ))}
      </FadeUp>

      <div className="mt-8 border-t border-[#f3eee3]/15">
        <AnimatePresence mode="wait">
          <motion.ul
            key={day}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
          >
            {dayClasses.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                className="group border-b border-[#f3eee3]/15 transition-colors duration-500 hover:bg-[#f3eee3]/[0.03]"
              >
                <div className="grid items-center gap-4 py-6 lg:grid-cols-[110px_minmax(0,1.2fr)_minmax(0,1fr)_auto_auto_150px] lg:gap-6">
                  <span className="font-display text-3xl tracking-[0.02em] text-[#f3eee3] lg:text-4xl">
                    {c.time}
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.03em] transition-colors duration-300 group-hover:text-[#d3a85e] lg:text-2xl">
                      {c.name}
                    </h3>
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3eee3]/40">
                      <Clock className="size-3" /> {c.duration} min
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#f3eee3]/80">
                      {c.coach}
                    </p>
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3eee3]/40">
                      <Users className="size-3" /> {c.spots} spots
                    </span>
                  </div>
                  <IntensityPill level={c.intensity} />
                  <span className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f3eee3]/35 lg:block">
                    {day.slice(0, 3)}
                  </span>
                  <a
                    href="#join"
                    onClick={() => reserve(c.name)}
                    className="group/btn inline-flex items-center justify-between gap-2 rounded-full border border-[#f3eee3]/25 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] transition-all duration-300 hover:border-[#d3a85e] hover:bg-[#d3a85e] hover:text-[#202321]"
                  >
                    Reserve
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/btn:rotate-45" />
                  </a>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
        <FadeUp className="mt-6 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f3eee3]/40">
          <span>
            {dayClasses.length} sessions · {totalMinutes} minutes of work
          </span>
          <span>Walk-ins welcome when spots remain</span>
        </FadeUp>
      </div>
    </section>
  );
}

export function Coaches() {
  return (
    <section
      id="coaches"
      className="relative px-6 py-16 lg:px-12 lg:py-24 bg-[#202321] text-[#f3eee3]"
    >
      <FadeUp className="flex items-center gap-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d3a85e]">
          04 · The Coaches
        </span>
        <span className="h-px flex-1 bg-[#f3eee3]/15" />
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f3eee3]/40 sm:block">
          Programmed, spotted, scaled
        </span>
      </FadeUp>
      <h2 className="mt-12 font-display text-[clamp(2.9rem,7.5vw,6.8rem)] uppercase leading-[0.88] tracking-[-0.01em]">
        <MaskLine>Eyes that keep</MaskLine>
        <MaskLine delay={0.1}>
          <span>
            you{" "}
            <span className="font-serif normal-case italic tracking-normal text-[#d3a85e]">
              honest.
            </span>
          </span>
        </MaskLine>
      </h2>
      <div className="mt-16 grid gap-5 md:grid-cols-3 lg:gap-7">
        {COACHES.map((coach, i) => (
          <FadeUp key={coach.name} delay={i * 0.12}>
            <article className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#262927]">
                <Image
                  src={coach.image}
                  alt={`${coach.name}, ${coach.role}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover grayscale-[0.85] transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#202321]/85 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 text-[10px] font-bold tracking-[0.3em] text-[#f3eee3]/60">
                  {coach.index}
                </span>
                <p className="absolute inset-x-5 bottom-24 translate-y-3 font-serif text-lg italic leading-snug text-[#f3eee3]/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-[#f3eee3]/90">
                  "{coach.quote}"
                </p>
                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="font-display text-2xl uppercase tracking-[0.03em] transition-colors duration-300 group-hover:text-[#d3a85e]">
                    {coach.name}
                  </h3>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.26em] text-[#f3eee3]/55">
                    {coach.role}
                  </p>
                </div>
              </div>
            </article>
          </FadeUp>
        ))}
      </div>
      <FadeUp delay={0.15} className="mt-14 flex justify-center">
        <a
          href="#join"
          className="group inline-flex items-center gap-2.5 rounded-full border border-[#f3eee3]/25 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors hover:border-[#d3a85e] hover:text-[#d3a85e]"
        >
          Train with them
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
        </a>
      </FadeUp>
    </section>
  );
}

export function Testimonials({
  businessName = "Forge",
}: {
  businessName?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      6000,
    );
    return () => clearInterval(timer);
  }, [paused]);

  const items = TESTIMONIALS.map((testimonial) => ({
    ...testimonial,
    quote: testimonial.quote.replaceAll("Forge", businessName),
  }));
  const current = items[index];

  return (
    <section
      className="relative bg-[#d3a85e] text-[#202321]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[auto_1fr] lg:gap-20 lg:px-12 lg:py-24">
        <FadeUp className="flex flex-row items-start justify-between lg:flex-col">
          <Quote
            className="size-10 -scale-x-100 lg:size-14"
            strokeWidth={1.25}
          />
          <span className="font-display text-xl tracking-[0.1em] lg:mt-auto lg:[writing-mode:vertical-rl] lg:rotate-180">
            0{index + 1} — 0{items.length}
          </span>
        </FadeUp>
        <div>
          <div className="min-h-[240px] md:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.65, ease: EASE }}
              >
                <p className="font-serif text-[clamp(1.7rem,3.6vw,3rem)] italic leading-[1.18]">
                  "{current.quote}"
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  <span className="h-px w-10 bg-[#202321]/50" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.26em]">
                    {current.name} · {current.detail}
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <button
              onClick={() =>
                setIndex((i) => (i - 1 + items.length) % items.length)
              }
              aria-label="Previous testimonial"
              className="flex size-12 items-center justify-center rounded-full border border-[#202321]/40 transition-colors duration-300 hover:bg-[#202321] hover:text-[#d3a85e]"
            >
              <ArrowLeft className="size-5" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % items.length)}
              aria-label="Next testimonial"
              className="flex size-12 items-center justify-center rounded-full border border-[#202321]/40 transition-colors duration-300 hover:bg-[#202321] hover:text-[#d3a85e]"
            >
              <ArrowRight className="size-5" strokeWidth={1.75} />
            </button>
            <span className="ml-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#202321]/60">
              From the floor book
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pricing({ businessName = "Forge" }: { businessName?: string }) {
  const plans = PLANS.map((plan) => ({
    ...plan,
    features: plan.features.map((feature) =>
      feature.replaceAll("Forge", businessName),
    ),
  }));

  return (
    <section
      id="membership"
      className="relative px-6 py-16 lg:px-12 lg:py-24 bg-[#202321] text-[#f3eee3]"
    >
      <FadeUp className="flex items-center gap-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d3a85e]">
          05 · Membership
        </span>
        <span className="h-px flex-1 bg-[#f3eee3]/15" />
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f3eee3]/40 sm:block">
          Starts with a free trial
        </span>
      </FadeUp>
      <h2 className="mt-12 font-display text-[clamp(2.9rem,7.5vw,6.8rem)] uppercase leading-[0.88] tracking-[-0.01em]">
        <MaskLine>Pay for iron,</MaskLine>
        <MaskLine delay={0.1}>
          <span>
            not{" "}
            <span className="font-serif normal-case italic tracking-normal text-[#d3a85e]">
              chandeliers.
            </span>
          </span>
        </MaskLine>
      </h2>
      <div className="mt-16 grid gap-5 lg:grid-cols-3 lg:gap-0">
        {plans.map((plan, i) => (
          <FadeUp key={plan.name} delay={i * 0.1} className="h-full">
            <article
              className={`group relative flex h-full flex-col p-8 transition-transform duration-500 lg:p-10 ${
                plan.highlighted
                  ? "bg-[#d3a85e] text-[#202321] lg:-translate-y-4"
                  : "border border-[#f3eee3]/15 bg-[#262927]/50 hover:-translate-y-2 hover:border-[#f3eee3]/35"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute right-6 top-6 border border-[#202321]/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.26em]">
                  Most popular
                </span>
              )}
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.28em] ${plan.highlighted ? "text-[#202321]/70" : "text-[#f3eee3]/50"}`}
              >
                {plan.name}
              </p>
              <div className="mt-8 flex items-end gap-2">
                <span className="font-display text-6xl leading-none tracking-tight lg:text-7xl">
                  {plan.price}
                </span>
                <span
                  className={`pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${plan.highlighted ? "text-[#202321]/60" : "text-[#f3eee3]/40"}`}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={`mt-4 font-serif text-lg italic ${plan.highlighted ? "text-[#202321]/70" : "text-[#f3eee3]/55"}`}
              >
                {plan.note}
              </p>
              <ul
                className={`my-8 space-y-3.5 border-t pt-8 ${plan.highlighted ? "border-[#202321]/25" : "border-[#f3eee3]/15"}`}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`mt-0.5 size-4 shrink-0 ${plan.highlighted ? "text-[#202321]" : "text-[#d3a85e]"}`}
                      strokeWidth={2.5}
                    />
                    <span
                      className={
                        plan.highlighted
                          ? "text-[#202321]/85"
                          : "text-[#f3eee3]/65"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Magnetic strength={0.2}>
                  <a
                    href="#join"
                    className={`group/btn inline-flex items-center gap-2 rounded-full px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${
                      plan.highlighted
                        ? "bg-[#202321] text-[#f3eee3] hover:bg-[#262927]"
                        : "border border-[#f3eee3]/25 text-[#f3eee3] hover:border-[#d3a85e] hover:bg-[#d3a85e] hover:text-[#202321]"
                    }`}
                  >
                    Start with a trial
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:rotate-45" />
                  </a>
                </Magnetic>
              </div>
            </article>
          </FadeUp>
        ))}
      </div>
      <FadeUp delay={0.2}>
        <p className="mt-10 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f3eee3]/40">
          No joining fees · No contracts on Monthly · Cancel with one email
        </p>
      </FadeUp>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative px-6 py-16 lg:px-12 lg:py-24 bg-[#202321] text-[#f3eee3]">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
        <div>
          <FadeUp className="flex items-center gap-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d3a85e]">
              Answers
            </span>
            <span className="h-px w-16 bg-[#f3eee3]/15" />
          </FadeUp>
          <h2 className="mt-10 font-display text-[clamp(2.6rem,5.5vw,4.8rem)] uppercase leading-[0.9] tracking-[-0.01em]">
            <MaskLine>Before</MaskLine>
            <MaskLine delay={0.08}>you</MaskLine>
            <MaskLine delay={0.16}>
              <span className="font-serif normal-case italic tracking-normal text-[#d3a85e]">
                ask.
              </span>
            </MaskLine>
          </h2>
          <FadeUp delay={0.2}>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-[#f3eee3]/55">
              Anything else — call the front desk or just show up ten minutes
              before any session. A coach will sort you out.
            </p>
          </FadeUp>
        </div>
        <div>
          {FAQS.map((faq, i) => (
            <FadeUp key={faq.q} delay={i * 0.05}>
              <div className="border-t border-[#f3eee3]/15 last:border-b">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={`font-display text-lg uppercase tracking-[0.03em] transition-colors duration-300 md:text-xl ${open === i ? "text-[#d3a85e]" : "group-hover:text-[#d3a85e]"}`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-400 ${open === i ? "rotate-45 border-[#d3a85e] bg-[#d3a85e] text-[#202321]" : "border-[#f3eee3]/25 group-hover:border-[#d3a85e] group-hover:text-[#d3a85e]"}`}
                  >
                    <Plus className="size-4" strokeWidth={2} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-7 text-[15px] leading-relaxed text-[#f3eee3]/60">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Join() {
  const BASE_PROGRAMS = [
    "Strength Floor",
    "Group Training",
    "Personal Coaching",
    "Recovery",
    "Just the open floor",
  ];
  const DAY_OPTIONS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Whenever — surprise me",
  ];
  const CONTACT = [
    { icon: MapPin, label: "Visit", value: "44 Ironworks Ln, Portland, OR" },
    { icon: Mail, label: "Write", value: "join@forge.club" },
    { icon: Phone, label: "Call", value: "+1 (503) 555-0194" },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon–Fri 5:30–22:00 · Sat 7–20 · Sun 8–18",
    },
  ];

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [programs, setPrograms] = useState<string[]>(BASE_PROGRAMS);
  const [form, setForm] = useState({
    name: "",
    email: "",
    program: BASE_PROGRAMS[0],
    day: DAY_OPTIONS[0],
    message: "",
  });

  useEffect(() => {
    const onPick = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail) return;
      setPrograms((prev) => (prev.includes(detail) ? prev : [...prev, detail]));
      setForm((prev) => ({ ...prev, program: detail }));
    };
    window.addEventListener("forge:program", onPick);
    return () => window.removeEventListener("forge:program", onPick);
  }, []);

  const update =
    (field: keyof typeof form) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  const inputClass =
    "w-full rounded-none border-b border-[#f3eee3]/20 bg-transparent py-3.5 text-[15px] text-[#f3eee3] placeholder:text-[#f3eee3]/30 outline-none transition-colors duration-300 focus:border-[#d3a85e]";

  return (
    <section
      id="join"
      className="relative overflow-hidden bg-[#202321] text-[#f3eee3]"
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={gymImg(11)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.14]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#202321] via-[#202321]/60 to-[#202321]" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-24">
        <div>
          <FadeUp className="flex items-center gap-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d3a85e]">
              06 · Join
            </span>
            <span className="h-px w-16 bg-[#f3eee3]/15" />
          </FadeUp>
          <h2 className="mt-10 font-display text-[clamp(3.2rem,8vw,7.5rem)] uppercase leading-[0.85] tracking-[-0.01em]">
            <MaskLine>Do the work.</MaskLine>
            <MaskLine delay={0.1}>
              <span className="font-serif normal-case italic tracking-normal text-[#d3a85e]">
                find your people.
              </span>
            </MaskLine>
          </h2>
          <FadeUp delay={0.2}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-[#f3eee3]/60">
              Your first session is free and fully coached. Tell us where to
              start you — a coach replies within one training day.
            </p>
          </FadeUp>
          <div className="mt-12">
            {CONTACT.map((row, i) => (
              <FadeUp key={row.label} delay={0.25 + i * 0.07}>
                <div className="group flex items-center gap-5 border-t border-[#f3eee3]/15 py-5 last:border-b">
                  <row.icon
                    className="size-5 shrink-0 text-[#d3a85e]"
                    strokeWidth={1.5}
                  />
                  <span className="w-16 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f3eee3]/40">
                    {row.label}
                  </span>
                  <span className="text-[15px] text-[#f3eee3]/80 transition-colors group-hover:text-[#f3eee3]">
                    {row.value}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
        <FadeUp delay={0.15} className="lg:pt-24">
          <div className="border border-[#f3eee3]/15 bg-[#262927]/70 p-7 backdrop-blur-sm md:p-10">
            {status === "success" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-[#d3a85e] text-[#202321]">
                  <Check className="size-8" strokeWidth={2.5} />
                </span>
                <h3 className="mt-8 font-display text-4xl uppercase tracking-[0.02em]">
                  You're on the
                  <br />
                  floor book.
                </h3>
                <p className="mt-4 max-w-xs font-serif text-lg italic text-[#f3eee3]/60">
                  A coach will reach out within one training day. Sleep well —
                  6AM comes fast.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm({
                      name: "",
                      email: "",
                      program: BASE_PROGRAMS[0],
                      day: DAY_OPTIONS[0],
                      message: "",
                    });
                  }}
                  className="mt-8 rounded-full border border-[#f3eee3]/25 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors hover:border-[#d3a85e] hover:text-[#d3a85e]"
                >
                  Book for a friend
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#d3a85e]">
                  Free trial session
                </p>
                <div className="mt-8 space-y-7">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f3eee3]/45">
                      Name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={update("name")}
                      placeholder="First and last"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f3eee3]/45">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f3eee3]/45">
                        Start me with
                      </label>
                      <select
                        value={form.program}
                        onChange={update("program")}
                        className={`${inputClass} appearance-none [&>option]:bg-[#262927]`}
                      >
                        {programs.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f3eee3]/45">
                        Preferred day
                      </label>
                      <select
                        value={form.day}
                        onChange={update("day")}
                        className={`${inputClass} appearance-none [&>option]:bg-[#262927]`}
                      >
                        {DAY_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#f3eee3]/45">
                      Anything we should know?{" "}
                      <span className="text-[#f3eee3]/25">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="Injuries, goals, fear of burpees..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d3a85e] px-7 py-4.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#202321] transition-colors duration-300 hover:bg-[#f3eee3] disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      Booking <Loader2 className="size-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Claim my session{" "}
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                    </>
                  )}
                </button>
                <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f3eee3]/35">
                  No card. No contract. Just a session.
                </p>
              </form>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export function Footer({ businessName = "Forge" }: { businessName?: string }) {
  const nameUpper = businessName.toUpperCase();
  const EXPLORE = [...NAV_LINKS, { label: "Join", href: "#join" }];

  return (
    <footer className="relative overflow-hidden bg-[#202321] text-[#f3eee3]">
      <div className="border-y border-[#f3eee3]/10">
        <Marquee
          items={[
            "Do the work",
            "Find your people",
            "No shortcuts",
            businessName,
          ]}
          variant="ghost"
          reverse
          duration={32}
        />
      </div>
      <div className="px-6 pt-16 lg:px-12 lg:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1.2fr_1fr] lg:gap-10">
          <FadeUp>
            <span className="font-display text-3xl tracking-[0.05em]">
              {nameUpper}
              <span className="text-[#d3a85e]">.</span>
            </span>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#f3eee3]/50">
              A focused training club in Portland, OR. Strength floor, coached
              sessions, recovery suite — and a room that keeps you honest.
            </p>
            <p className="mt-5 font-serif text-lg italic text-[#d3a85e]/90">
              Built for the work.
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f3eee3]/40">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-underline text-sm text-[#f3eee3]/70 transition-colors hover:text-[#f3eee3]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f3eee3]/40">
              Visit
            </p>
            <address className="mt-5 space-y-3 text-sm not-italic leading-relaxed text-[#f3eee3]/70">
              <p>
                44 Ironworks Lane
                <br />
                Portland, OR 97209
              </p>
              <p>
                Mon–Fri 5:30–22:00
                <br />
                Sat 7:00–20:00 · Sun 8:00–18:00
              </p>
              <a
                href="mailto:join@forge.club"
                className="link-underline inline-block transition-colors hover:text-[#f3eee3]"
              >
                join@forge.club
              </a>
            </address>
          </FadeUp>
          <FadeUp delay={0.24}>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f3eee3]/40">
              Follow the work
            </p>
            <ul className="mt-5 space-y-3">
              {["Instagram", "YouTube", "Strava"].map((social) => (
                <li key={social}>
                  <a
                    href="#top"
                    className="group/social inline-flex items-center gap-1.5 text-sm text-[#f3eee3]/70 transition-colors hover:text-[#d3a85e]"
                  >
                    <span className="link-underline">{social}</span>
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/social:rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>

        <FadeUp className="mt-20 flex items-end justify-between overflow-hidden lg:mt-28">
          <div
            aria-hidden
            className="footer-word font-display text-[clamp(4.6rem,18.5vw,19rem)] leading-[0.78] tracking-[0.01em]"
          >
            {nameUpper.split("").map((letter, i) => (
              <span key={i} className="footer-letter">
                {letter}
              </span>
            ))}
            <span className="text-[#d3a85e]">.</span>
          </div>
        </FadeUp>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-[#f3eee3]/10 py-6 md:flex-row">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f3eee3]/40">
            © {new Date().getFullYear()} {businessName} Athletics Club · All
            reps reserved
          </p>
          <p className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f3eee3]/40 md:block">
            45.5152° 122.6784°
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f3eee3]/40">
            Designed by Infycrest Solutions
          </p>
          <a
            href="#top"
            aria-label="Back to top"
            className="group flex size-12 items-center justify-center rounded-full border border-[#f3eee3]/20 transition-all duration-300 hover:border-[#d3a85e] hover:bg-[#d3a85e]"
          >
            <ArrowUp className="size-5 text-[#f3eee3] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-[#202321]" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumGymTemplate({
  schedule = fallbackSchedule,
  businessName = "Forge",
}: {
  schedule?: GymClass[];
  businessName?: string;
}) {
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
      const anchor = (event.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();

      // Calculate offset dynamically and apply smooth scroll.
      // 128px clears both the fixed agency bar (64px) and this header.
      const top =
        (target as HTMLElement).getBoundingClientRect().top +
        window.scrollY -
        (hash === "#top" ? 0 : 128);
      lenis.scrollTo(top, { duration: 1.5 });
      window.history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.stop();
      lenis.destroy();
      (window as any).__lenis = undefined;
    };
  }, []);

  return (
    <div className="relative bg-[#202321] font-sans text-[#f3eee3] selection:bg-[#d3a85e] selection:text-[#202321]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee { to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee var(--marquee-duration, 26s) linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        .text-stroke { color: transparent; -webkit-text-stroke: 1.5px rgba(243, 238, 227, 0.22); }
        .link-underline { position: relative; }
        .link-underline::after { content: ""; position: absolute; left: 0; bottom: -3px; width: 100%; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1); }
        .link-underline:hover::after { transform: scaleX(1); transform-origin: left; }
        .footer-letter { color: transparent; -webkit-text-stroke: 1.5px rgba(243, 238, 227, 0.2); transition: color 0.4s ease, -webkit-text-stroke-color 0.4s ease; }
        .footer-letter:hover { color: #d3a85e; -webkit-text-stroke-color: #d3a85e; }
        .grain { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E"); background-size: 220px 220px; }
        @media (pointer: fine) { body, a, button, [role="button"], summary { cursor: none; } }
      `,
        }}
      />

      <Preloader businessName={businessName} />
      <Cursor />
      <Grain />
      <Nav businessName={businessName} />
      <main id="top" className="relative bg-[#202321] text-[#f3eee3]">
        <Hero />
        <Marquee
          items={[
            "Strength",
            "Conditioning",
            "Recovery",
            "Community",
            "Discipline",
          ]}
          variant="solid"
          duration={24}
        />
        <Manifesto businessName={businessName} />
        <Programs />
        <Schedule classes={schedule} />
        <Coaches />
        <Testimonials businessName={businessName} />
        <Pricing businessName={businessName} />
        <Faq />
        <Join />
        <Footer businessName={businessName} />
      </main>
    </div>
  );
}

export const ForgeAthleticsTemplate = PremiumGymTemplate;
