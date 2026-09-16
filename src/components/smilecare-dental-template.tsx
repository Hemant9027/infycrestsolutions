"use client";

import React, {
  useCallback,
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
  useSpring,
  useMotionValue,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Bone,
  CheckCircle2,
  ChevronDown,
  Clock3,
  HandHeart,
  HeartHandshake,
  Loader2,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Plus,
  Quote,
  ReceiptText,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

const dentalImg = (num: number) => `/dental-clinic/${num}.jpg`;
const docImg = (num: number) => `/dental-clinic/docter${num}.jpg`;

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
  slug: string;
  title: string;
  description: string;
  blurb?: string;
  price?: string;
  tag?: string;
  image?: string | null;
  icon?: any;
  tags?: string[];
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
export type TeamMember = {
  name: string;
  role: string;
  image: string;
  quote: string;
  tags: string[];
};
export type NewCustomer = {
  id?: number | string;
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
  team?: TeamMember[];
};

export const demoDentalCustomer: NewCustomer = {
  slug: "smilecare",
  businessName: "SmileCare",
  theme: { accent: "#4c8a7e" }, // Pine
  CTA: { label: "Book a visit" },
  hero: {
    eyebrow: "Modern dentistry · Human care",
    title: "Confidence starts with care.",
    description:
      "A clinic designed like a living room, technology that whispers, and a team that explains everything — before anything happens.",
    primaryCta: "Book an appointment",
  },
  heroImages: [dentalImg(1)],
  about: {
    title: "A calmer way to care for your smile.",
    body: "Most people don't fear dentistry — they fear not knowing what happens next. So we rebuilt every step around clarity: conversations before chairs, options before opinions, and a price before a single instrument appears.",
  },
  stats: [
    { value: "12+", label: "Years of quiet expertise" },
    { value: "9400+", label: "Smiles cared for" },
    { value: "4.9", label: "Average patient rating" },
    { value: "98%", label: "Would recommend us" },
  ],
  services: [
    {
      slug: "preventive",
      title: "Preventive care",
      blurb: "Check-ups, hygiene & early detection",
      description:
        "Gentle exams, spa-grade hygiene sessions and honest guidance that keeps small things small.",
      image: dentalImg(4),
      icon: ShieldCheck,
      tags: ["Exams", "Hygiene", "X-rays"],
    },
    {
      slug: "cosmetic",
      title: "Cosmetic dentistry",
      blurb: "Veneers, whitening & subtle refinement",
      description:
        "Natural-looking veneers, gentle whitening and micro-adjustments designed around your face.",
      image: dentalImg(5),
      icon: Sparkles,
      tags: ["Veneers", "Whitening", "Bonding"],
    },
    {
      slug: "family",
      title: "Family appointments",
      blurb: "Care for every age, side by side",
      description:
        "Book the whole household together. Kid-approved visits with zero scary words.",
      image: dentalImg(6),
      icon: HeartHandshake,
      tags: ["Kids", "Teens", "Adults"],
    },
    {
      slug: "emergency",
      title: "Emergency support",
      blurb: "Same-day relief when it can't wait",
      description:
        "Cracked, knocked or throbbing — call before noon and we'll see you the same day.",
      image: dentalImg(7),
      icon: Zap,
      tags: ["Same-day", "Pain relief", "Repairs"],
    },
    {
      slug: "aligners",
      title: "Clear aligners",
      blurb: "Straighter teeth, invisibly",
      description:
        "3D-scanned, dentist-supervised aligner plans with progress you can preview.",
      image: dentalImg(8),
      icon: Smile,
      tags: ["3D scan", "Preview", "Retention"],
    },
    {
      slug: "implants",
      title: "Implants & restoration",
      blurb: "Rebuild, restore, bite with confidence",
      description:
        "Crowns, bridges and guided implants that look, feel and work like the real thing.",
      image: dentalImg(9),
      icon: Bone,
      tags: ["Crowns", "Implants", "Bridges"],
    },
  ],
  team: [
    {
      name: "Dr. Amara Chen",
      role: "Lead dentist · Founder",
      image: docImg(1),
      quote: "Every treatment begins with listening.",
      tags: ["Implants", "Sedation", "15 yrs"],
    },
    {
      name: "Dr. Elias Moreau",
      role: "Cosmetic & restorative",
      image: docImg(2),
      quote: "The best smile is the one that still looks like you.",
      tags: ["Veneers", "Whitening", "Design"],
    },
    {
      name: "Nina Okafor",
      role: "Hygiene & prevention lead",
      image: docImg(3),
      quote: "Prevention is the quiet superpower of dentistry.",
      tags: ["Kids", "Gum health", "Gentle care"],
    },
  ],
  contact: {
    address: "214 Linden Avenue, San Rafael, CA",
    hours: "Monday — Friday · 9:00 — 17:30",
    phone: "+1 (415) 555-0132",
    email: "hello@smilecare.dental",
  },
};

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
] as const;

export const FAQS = [
  {
    q: "I'm nervous about the dentist. Can you help?",
    a: "You're in the majority — most of our patients arrive anxious. We agree on a stop-signal before we start, take breaks whenever you want, offer noise-cancelling headphones, and gentle sedation options. You set the pace, always.",
  },
  {
    q: "How much will my treatment cost?",
    a: "Before anything touches your teeth, you get a written plan with every option and every cost. No surprises mid-treatment, no pressure to decide on the spot.",
  },
  {
    q: "Do you take dental emergencies?",
    a: "Yes — we hold same-day slots every morning. Call before noon and you'll be seen that day. After hours, our line forwards to the on-call dentist.",
  },
  {
    q: "How often should I actually come in?",
    a: "For most people, a check-up and hygiene visit every six months keeps things effortless. Some smiles need three months, some can stretch to nine — we'll tell you honestly.",
  },
];

export const FIRST_VISIT_STEPS = [
  {
    title: "Say hello",
    text: "Book online in under a minute. We'll send a short form you can fill from the couch — no clipboard marathons.",
  },
  {
    title: "The conversation",
    text: "Twenty minutes just talking: your history, your worries, what you'd love to change. Chair time comes second.",
  },
  {
    title: "See your smile in 3D",
    text: "A quick radiation-free scan builds a living model of your mouth. You'll see what we see — finally, clarity.",
  },
  {
    title: "Your plan, your pace",
    text: "Leave with a written plan, honest pricing and zero obligation. Decide whenever you're ready.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

/* -------------------------------------------------------------------------- */
/*                                EVENT BUS                                   */
/* -------------------------------------------------------------------------- */

export const SERVICE_EVENT = "smilecare:select-service";
export function emitServiceSelection(slug: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<string>(SERVICE_EVENT, { detail: slug }),
  );
}
export function onServiceSelection(callback: (slug: string) => void) {
  const handler = (event: Event) =>
    callback((event as CustomEvent<string>).detail);
  window.addEventListener(SERVICE_EVENT, handler);
  return () => window.removeEventListener(SERVICE_EVENT, handler);
}

/* -------------------------------------------------------------------------- */
/*                              MOTION PRIMITIVES                             */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 30,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const { ref, inView } = useInView({ once, rootMargin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y, filter: "blur(8px)" }
      }
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Lines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  as = "scroll",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "hero" | "scroll";
}) {
  const { ref, inView } = useInView({ once: true, rootMargin: "-40px" });
  const isVisible = as === "hero" ? true : inView;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const line: Variants = {
    hidden: { y: "115%", rotate: 2.5 },
    show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: EASE } },
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isVisible ? "show" : "hidden"}
    >
      {lines.map((content, i) => (
        <span
          key={i}
          className="block overflow-hidden pb-[0.08em] -mb-[0.08em]"
        >
          <motion.span
            className={`block origin-left will-change-transform ${lineClassName ?? ""}`}
            variants={line}
          >
            {content}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function Eyebrow({
  index,
  label,
  tone = "light",
  className,
}: {
  index: string;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const color = tone === "dark" ? "text-[#b6e0d5]" : "text-[#4c8a7e]";
  const rule = tone === "dark" ? "bg-[#b6e0d5]/50" : "bg-[#4c8a7e]/50";
  return (
    <Reveal className={className} y={16}>
      <p
        className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] ${color}`}
      >
        <span className={`h-px w-10 ${rule}`} aria-hidden />
        <span className="font-serif italic tracking-[0.2em] normal-case text-sm">
          {index}
        </span>
        {label}
      </p>
    </Reveal>
  );
}

export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.3 });

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
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

/* -------------------------------------------------------------------------- */
/*                                SMOOTH SCROLL                               */
/* -------------------------------------------------------------------------- */

function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.16,
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8,
    });
    (window as any).__lenis = lenis;

    // Route anchor clicks through Lenis so they glide instead of jump.
    const onAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -96 });
    };
    document.addEventListener("click", onAnchorClick);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchorClick);
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

const NAV_LINKS = [
  { label: "Care", href: "#care" },
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "Stories", href: "#stories" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > lastY && !open);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const brandName = text(customer.businessName, "SmileCare");

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "border-b border-[#203330]/10 bg-[#edf5f1]/85 backdrop-blur-xl"
            : "border-b border-white/10 bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1600px] items-center justify-between px-5 transition-all duration-500 sm:px-8 lg:px-12 ${scrolled ? "h-16" : "h-20"}`}
        >
          <a href="#top" className="group flex items-center gap-1.5">
            <span className="grid size-8 place-items-center rounded-full bg-[#6aa99f] text-white transition-transform duration-500 group-hover:rotate-90">
              <Asterisk className="size-4" />
            </span>
            <span
              className={`font-serif text-[22px] tracking-[0.06em] transition-colors duration-500 ${scrolled ? "text-[#203330]" : "text-white"}`}
            >
              {brandName}
            </span>
          </a>
          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`group relative text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors ${scrolled ? "text-[#203330]/70 hover:text-[#203330]" : "text-white/75 hover:text-white"}`}
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-400 ease-out group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Magnetic strength={0.25}>
              <a
                href="#contact"
                className="group hidden items-center gap-2 rounded-full bg-[#6aa99f] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#548b81] sm:inline-flex"
              >
                {text(customer.CTA?.label, "Book a visit")}
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`grid size-11 place-items-center rounded-full border transition-colors lg:hidden ${scrolled ? "border-[#203330]/15 text-[#203330] hover:bg-[#203330] hover:text-[#edf5f1]" : "border-white/25 text-white hover:bg-white hover:text-[#203330]"}`}
            >
              <MenuIcon className="size-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[90] flex flex-col bg-[#203330] text-[#edf5f1]"
          >
            <div className="flex h-20 items-center justify-between px-5 sm:px-8">
              <span className="flex items-center gap-1.5">
                <span className="grid size-8 place-items-center rounded-full bg-[#6aa99f] text-white">
                  <Asterisk className="size-4" />
                </span>
                <span className="font-serif text-[22px] tracking-[0.06em]">
                  {brandName}
                </span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full border border-white/25 transition-colors hover:bg-white hover:text-[#203330]"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-6 sm:px-10">
              {[...NAV_LINKS, { label: "Book a visit", href: "#contact" }].map(
                (link, i) => (
                  <div key={link.href} className="overflow-hidden">
                    <motion.a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{
                        duration: 0.7,
                        delay: 0.06 * i,
                        ease: EASE,
                      }}
                      className="group flex items-baseline gap-4 py-2"
                    >
                      <span className="font-serif text-sm italic text-[#b6e0d5]/60">
                        0{i + 1}
                      </span>
                      <span className="font-serif text-5xl font-light transition-colors group-hover:text-[#b6e0d5] sm:text-6xl">
                        {link.label}
                      </span>
                    </motion.a>
                  </div>
                ),
              )}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-6 text-xs text-white/60 sm:px-10"
            >
              <span>{text(customer.contact?.address, "San Rafael, CA")}</span>
              <a
                href={`tel:${customer.contact?.phone}`}
                className="hover:text-[#b6e0d5]"
              >
                {text(customer.contact?.phone, "+1 (415) 555-0132")}
              </a>
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
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const rise = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const fullTitle = text(customer.hero?.title, "Confidence starts with care.");
  const words = fullTitle.split(" ");
  const firstPart = words.slice(0, 1).join(" ");
  const lastPart = words.slice(1).join(" ");

  return (
    <section ref={ref} id="top" className="relative min-h-svh overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
        >
          <Image
            src={customer.heroImages?.[0] || dentalImg(1)}
            alt="Inside the clinic"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#203330] via-[#203330]/35 to-[#203330]/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#203330]/45 via-transparent to-transparent" />

      <motion.div
        style={{ opacity: fade, y: rise }}
        className="relative flex min-h-svh flex-col justify-end px-6 pb-36 pt-32 sm:px-8 md:pb-32 lg:px-12"
      >
        <div className="max-w-5xl text-white">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: EASE }}
            className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#b6e0d5]"
          >
            <span className="h-px w-12 bg-[#b6e0d5]/60" aria-hidden />
            {text(customer.hero?.eyebrow, "Modern dentistry · Human care")}
          </motion.p>
          <h1 className="font-serif text-[17vw] font-light leading-[0.9] tracking-[-0.02em] sm:text-[13vw] lg:text-[9.5vw]">
            <Lines
              as="hero"
              delay={0.45}
              lines={[
                <>{firstPart}</>,
                <>
                  starts{" "}
                  <em className="font-light italic text-[#b6e0d5]">
                    {lastPart.replace("starts ", "")}
                  </em>
                </>,
              ]}
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: EASE }}
            className="mt-8 max-w-md text-base leading-relaxed text-white/75"
          >
            {text(
              customer.hero?.description,
              "A clinic designed like a living room, technology that whispers, and a team that explains everything — before anything happens.",
            )}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.9, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#6aa99f] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_20px_50px_-16px_rgba(106,169,159,0.8)] transition-colors hover:bg-[#548b81]"
              >
                {text(customer.hero?.primaryCta, "Book an appointment")}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#services"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/30 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-[#203330]"
              >
                Explore services
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.9, ease: EASE }}
        className="absolute inset-x-0 bottom-0 border-t border-white/15 text-white"
      >
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-5 text-xs sm:px-8 lg:px-12">
          <span className="flex items-center gap-2">
            <span className="flex text-[#b6e0d5]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </span>
            <span className="font-semibold">4.9</span>
            <span className="text-white/60">from 480+ patient reviews</span>
          </span>
          <span className="hidden items-center gap-2 md:flex">
            <span className="size-1.5 rounded-full bg-[#b6e0d5] animate-pulse-dot" />
            <span className="text-white/60">Open today</span>
            <span className="font-semibold">9:00 — 17:30</span>
          </span>
          <span className="hidden text-white/60 sm:block">
            {text(customer.contact?.address, "214 Linden Avenue, San Rafael")}
          </span>
        </div>
      </motion.div>

      <div className="absolute bottom-24 right-8 hidden lg:block xl:right-16">
        <div className="relative grid size-36 place-items-center">
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 size-full animate-rotate-slow"
          >
            <defs>
              <path
                id="badge-circle"
                d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"
                fill="none"
              />
            </defs>
            <text className="fill-white/90 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <textPath href="#badge-circle">
                Modern dentistry · human care · est. 2013 ·{" "}
              </textPath>
            </text>
          </svg>
          <span className="grid size-14 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
            <Asterisk className="size-6 text-[#b6e0d5]" />
          </span>
        </div>
      </div>

      <motion.a
        href="#care"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="group absolute bottom-8 left-6 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70 md:flex lg:left-12"
      >
        <span className="relative h-10 w-px overflow-hidden bg-white/25">
          <motion.span
            className="absolute left-0 top-0 h-4 w-px bg-[#b6e0d5]"
            animate={{ y: [-16, 44] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <span className="flex items-center gap-1.5 transition-colors group-hover:text-white">
          Scroll <ArrowDown className="size-3" />
        </span>
      </motion.a>
    </section>
  );
}

export function Marquee() {
  const ITEMS = [
    "Fear-free by design",
    "Prices before drills",
    "Same-day emergencies",
    "Family-friendly",
    "3D-smile previews",
    "Gentle hygiene",
  ];
  const row = [...ITEMS, ...ITEMS];
  return (
    <section aria-hidden className="relative z-10 bg-[#203330] py-9">
      <div className="marquee-root -rotate-[1.2deg] scale-x-105 border-y border-white/10 bg-[#14211e] py-5 text-[#edf5f1] shadow-[0_36px_70px_-32px_rgba(0,0,0,0.65)]">
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-8 pr-8 hover:[animation-play-state:paused]">
            {row.map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-8 whitespace-nowrap"
              >
                <span
                  className={
                    i % 2 === 0
                      ? "font-serif text-2xl font-light italic text-[#b6e0d5] sm:text-3xl"
                      : "text-xs font-bold uppercase tracking-[0.3em] text-[#edf5f1]/80"
                  }
                >
                  {item}
                </span>
                <Asterisk className="size-5 shrink-0 text-[#6aa99f]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Care({ customer }: { customer: NewCustomer }) {
  const VALUES = [
    {
      icon: HandHeart,
      title: "Fear-free by design",
      text: "Agreed stop-signals, noise-cancelling headphones, weighted blankets and sedation when you need it. Nervous patients are our specialty.",
    },
    {
      icon: Clock3,
      title: "Unhurried appointments",
      text: "We book fewer patients per day than most clinics. Your questions get the time they deserve — never the time that's left over.",
    },
    {
      icon: ReceiptText,
      title: "Prices before drills",
      text: "A written plan with real numbers before any treatment begins. If nothing needs doing, we'll happily tell you that too.",
    },
  ];

  const ParallaxFigure = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
    const ySmall = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
    return (
      <div ref={ref} className="relative">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/6]">
          <motion.div
            style={{ y }}
            className="absolute -inset-y-[10%] inset-x-0"
          >
            <Image
              src={dentalImg(2)}
              alt="Dentist gently consulting patient"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              unoptimized
            />
          </motion.div>
        </Reveal>
        <motion.div
          style={{ y: ySmall }}
          className="absolute -bottom-10 -left-4 hidden w-44 md:block lg:-left-12 lg:w-56"
        >
          <Reveal
            delay={0.15}
            className="overflow-hidden rounded-3xl border-8 border-[#edf5f1] shadow-[0_30px_60px_-24px_rgba(32,51,48,0.45)]"
          >
            <div className="relative aspect-square">
              <Image
                src={dentalImg(3)}
                alt="Pristine dental instruments"
                fill
                sizes="224px"
                className="object-cover"
                unoptimized
              />
            </div>
          </Reveal>
        </motion.div>
        <Reveal delay={0.25} className="absolute -right-3 top-8 lg:-right-8">
          <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-5 py-4 shadow-[0_24px_50px_-24px_rgba(32,51,48,0.4)] backdrop-blur-xl">
            <span className="grid size-10 place-items-center rounded-full bg-[#6aa99f]/15 text-[#4c8a7e]">
              <HeartHandshake className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#203330]">
                Zero-judgement zone
              </p>
              <p className="text-xs text-[#203330]/60">
                However long it's been — welcome.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    );
  };

  return (
    <section
      id="care"
      className="relative scroll-mt-24 overflow-hidden px-6 pb-16 pt-28 sm:px-8 lg:px-12 lg:pt-36"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 right-0 select-none font-serif text-[22vw] font-light italic leading-none text-[#4c8a7e]/[0.06]"
      >
        calm
      </span>
      <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow
            index="01"
            label={`The ${text(customer.businessName, "SmileCare")} way`}
          />
          <h2 className="mt-7 max-w-xl font-serif text-5xl font-light leading-[1.02] tracking-[-0.01em] sm:text-6xl lg:text-7xl">
            <Lines
              lines={[
                <>A calmer way to</>,
                <>
                  care for{" "}
                  <em className="italic text-[#4c8a7e]">your smile.</em>
                </>,
              ]}
            />
          </h2>
          <Reveal
            delay={0.15}
            className="mt-8 max-w-lg text-lg leading-relaxed text-[#203330]/65"
          >
            <p>
              {text(
                customer.about?.body,
                "Most people don't fear dentistry — they fear not knowing what happens next. So we rebuilt every step around clarity: conversations before chairs, options before opinions, and a price before a single instrument appears.",
              )}
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10">
            <a
              href="#services"
              className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#4c8a7e]"
            >
              <span className="border-b border-[#4c8a7e]/40 pb-1 transition-colors group-hover:border-[#4c8a7e]">
                See what we do
              </span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </Reveal>
        </div>
        <ParallaxFigure />
      </div>
      <div className="mx-auto mt-28 grid max-w-[1600px] gap-5 md:grid-cols-3">
        {VALUES.map((value, i) => (
          <Reveal key={value.title} delay={i * 0.1}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-[#203330]/10 bg-white/60 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#4c8a7e]/30 hover:shadow-[0_30px_60px_-28px_rgba(32,51,48,0.35)]">
              <span
                aria-hidden
                className="absolute -right-2 -top-6 font-serif text-8xl font-light italic text-[#4c8a7e]/10 transition-colors duration-500 group-hover:text-[#4c8a7e]/20"
              >
                0{i + 1}
              </span>
              <span className="relative grid size-12 place-items-center rounded-2xl bg-[#4c8a7e]/10 text-[#4c8a7e] transition-colors duration-500 group-hover:bg-[#4c8a7e] group-hover:text-[#edf5f1]">
                <value.icon className="size-5" />
              </span>
              <h3 className="relative mt-6 font-serif text-2xl font-light">
                {value.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-[#203330]/60">
                {value.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Services({ customer }: { customer: NewCustomer }) {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 18, mass: 0.45 });
  const sy = useSpring(my, { stiffness: 150, damping: 18, mass: 0.45 });

  const choose = (slug: string) => {
    emitServiceSelection(slug);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const services =
    customer.services && customer.services.length > 0
      ? customer.services
      : demoDentalCustomer.services!;

  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden bg-[#203330] px-6 py-28 text-[#edf5f1] sm:px-8 lg:px-12 lg:py-36"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-0 select-none font-serif text-[20vw] font-light italic leading-none text-[#b6e0d5]/[0.04]"
      >
        care
      </span>
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow index="02" label="Services" tone="dark" />
            <h2 className="mt-7 max-w-3xl font-serif text-5xl font-light leading-[1.02] sm:text-6xl lg:text-7xl">
              <Lines
                lines={[
                  <>Everything your smile</>,
                  <>
                    could <em className="italic text-[#b6e0d5]">ever need.</em>
                  </>,
                ]}
              />
            </h2>
          </div>
          <Reveal delay={0.2} className="max-w-xs">
            <p className="text-sm leading-relaxed text-[#edf5f1]/55">
              Six specialties, one roof — every treatment led by a dedicated
              clinician.{" "}
              <span className="text-[#b6e0d5]">
                Tap any treatment to start booking it.
              </span>
            </p>
          </Reveal>
        </div>

        <div
          ref={listRef}
          className="relative mt-16"
          onMouseMove={(e) => {
            const rect = listRef.current?.getBoundingClientRect();
            if (!rect) return;
            mx.set(e.clientX - rect.left);
            my.set(e.clientY - rect.top);
          }}
          onMouseLeave={() => setActive(null)}
        >
          <motion.div
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
          >
            <AnimatePresence>
              {active !== null && (
                <motion.div
                  key={services[active].slug}
                  initial={{ opacity: 0, scale: 0.82, rotate: -7 }}
                  animate={{ opacity: 1, scale: 1, rotate: -3.5 }}
                  exit={{ opacity: 0, scale: 0.88, rotate: 2 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="relative h-52 w-80 -translate-x-1/2 -translate-y-[120%] overflow-hidden rounded-3xl shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)]"
                >
                  <Image
                    src={services[active].image || dentalImg(4)}
                    alt=""
                    fill
                    sizes="320px"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-[#203330]/70 px-4 py-2.5 backdrop-blur-md">
                    <span className="text-xs font-semibold text-[#edf5f1]">
                      {services[active].title}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#b6e0d5]">
                      Book it
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05} y={20}>
              <button
                type="button"
                onClick={() => choose(service.slug)}
                onMouseEnter={() => setActive(i)}
                className="group relative block w-full overflow-hidden border-t border-white/12 text-left last:border-b"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-[#edf5f1] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                />
                <span className="relative grid items-center gap-x-6 gap-y-2 py-7 transition-colors duration-500 group-hover:text-[#203330] md:grid-cols-[88px_1fr_auto] md:py-9 lg:pr-8">
                  <span className="flex items-center gap-4 md:gap-6">
                    <span className="font-serif text-sm italic text-[#b6e0d5]/70 transition-colors duration-500 group-hover:text-[#4c8a7e]">
                      /0{i + 1}
                    </span>
                    <span className="grid size-11 place-items-center rounded-full border border-white/15 text-[#b6e0d5] transition-all duration-500 group-hover:border-[#4c8a7e]/30 group-hover:bg-[#4c8a7e]/10 group-hover:text-[#4c8a7e]">
                      {service.icon && <service.icon className="size-4.5" />}
                    </span>
                  </span>
                  <span>
                    <span className="block font-serif text-2xl font-light transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:text-3xl lg:text-4xl">
                      {service.title}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm text-[#edf5f1]/50 transition-colors duration-500 group-hover:text-[#203330]/60">
                      {service.description}
                    </span>
                    {service.tags && (
                      <span className="mt-3 hidden gap-2 md:flex">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#edf5f1]/50 transition-colors duration-500 group-hover:border-[#4c8a7e]/25 group-hover:text-[#203330]/55"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                  <span className="absolute right-1 top-7 md:static md:top-auto">
                    <span className="grid size-12 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-[#203330] group-hover:bg-[#203330] group-hover:text-[#edf5f1] md:size-14">
                      <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
                    </span>
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ref: viewRef, inView } = useInView({
    once: true,
    rootMargin: "-40px",
  });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) =>
        setDisplay(
          v.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }),
        ),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={viewRef}>
      <span ref={ref}>{display}</span>
      {suffix}
    </span>
  );
}

export function StatsBand({ customer }: { customer: NewCustomer }) {
  const stats =
    customer.stats && customer.stats.length > 0
      ? customer.stats.slice(0, 4).map((s) => {
          const numMatch = s.value.match(/([\d.]+)/);
          const num = numMatch ? parseFloat(numMatch[1]) : 0;
          const suffixMatch = s.value.replace(/[\d.]+/, "").trim();
          return {
            value: num,
            decimals: num % 1 !== 0 ? 1 : 0,
            suffix: suffixMatch,
            label: s.label,
          };
        })
      : demoDentalCustomer.stats!.map((s) => {
          const numMatch = s.value.match(/([\d.]+)/);
          const num = numMatch ? parseFloat(numMatch[1]) : 0;
          const suffixMatch = s.value.replace(/[\d.]+/, "").trim();
          return {
            value: num,
            decimals: num % 1 !== 0 ? 1 : 0,
            suffix: suffixMatch,
            label: s.label,
          };
        });

  return (
    <section className="bg-[#b6e0d5] px-6 py-20 text-[#203330] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-y-12 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div
              className={`flex flex-col items-center gap-2 px-4 text-center ${i > 0 ? "lg:border-l lg:border-[#203330]/15" : ""}`}
            >
              <span className="font-serif text-6xl font-light tracking-tight sm:text-7xl">
                <Counter
                  value={stat.value}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#203330]/55">
                {stat.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:px-8 lg:px-12 lg:py-36 bg-[#edf5f1]">
      <div className="mx-auto max-w-[1600px]">
        <div className="max-w-3xl">
          <Eyebrow index="03" label="Your first visit" />
          <h2 className="mt-7 font-serif text-5xl font-light leading-[1.02] sm:text-6xl lg:text-7xl">
            <Lines
              lines={[
                <>No surprises.</>,
                <>
                  Here's <em className="italic text-[#4c8a7e]">exactly</em> what
                </>,
                <>happens next.</>,
              ]}
            />
          </h2>
        </div>
        <div className="mt-20 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
          {FIRST_VISIT_STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <article className="group relative">
                <div className="flex items-center gap-4">
                  <span className="font-serif text-6xl font-light italic text-[#4c8a7e]/35 transition-colors duration-500 group-hover:text-[#4c8a7e]">
                    0{i + 1}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 border-t border-dashed border-[#203330]/20"
                  />
                </div>
                <h3 className="mt-6 font-serif text-2xl font-light">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#203330]/60">
                  {step.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-16">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#4c8a7e]"
          >
            <span className="grid size-10 place-items-center rounded-full border border-[#4c8a7e]/40 transition-all duration-500 group-hover:bg-[#4c8a7e] group-hover:text-[#edf5f1]">
              <ArrowUpRight className="size-4" />
            </span>
            Start with step one — it takes a minute
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Team({ customer }: { customer: NewCustomer }) {
  const team =
    customer.team && customer.team.length > 0
      ? customer.team
      : demoDentalCustomer.team!;

  return (
    <section
      id="team"
      className="scroll-mt-24 bg-[#f6f3ec] px-6 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow index="04" label="The people behind the mirrors" />
            <h2 className="mt-7 max-w-2xl font-serif text-5xl font-light leading-[1.02] sm:text-6xl lg:text-7xl">
              <Lines
                lines={[
                  <>Small team,</>,
                  <>
                    big <em className="italic text-[#4c8a7e]">soft spot.</em>
                  </>,
                ]}
              />
            </h2>
          </div>
          <Reveal delay={0.2} className="max-w-xs">
            <p className="text-sm leading-relaxed text-[#203330]/55">
              Three clinicians, one shared obsession: dentistry that never
              rushes and never lectures.
            </p>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.12}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
                  <Image
                    src={member.image}
                    alt={`Portrait of ${member.name}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover saturate-[0.85] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-hover:saturate-100"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#203330]/60 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="rounded-2xl bg-white/12 px-4 py-3 font-serif text-lg italic leading-snug text-white backdrop-blur-md">
                      "{member.quote}"
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-light">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4c8a7e]">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#203330]/12 bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#203330]/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const TESTIMONIALS = [
    {
      quote:
        "I've cancelled more dentists than I can count. This is the first clinic where I've never once watched the clock.",
      name: "Maya R.",
      treatment: "Clear aligner patient",
    },
    {
      quote:
        "They explained every option with real prices before touching a single tooth. Zero pressure, total clarity.",
      name: "Daniel K.",
      treatment: "Veneers & whitening",
    },
    {
      quote:
        "My daughter asks when she gets to go back. To the dentist. I still can't quite believe it either.",
      name: "Priya S.",
      treatment: "Family care",
    },
    {
      quote:
        "Cracked a crown at 8am, smiling again by lunch. The emergency line actually picks up — and actually cares.",
      name: "Jonas M.",
      treatment: "Emergency repair",
    },
  ];

  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: number) => {
    setIndex(([current]) => [
      (current + dir + TESTIMONIALS.length) % TESTIMONIALS.length,
      dir,
    ]);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => go(1), 6500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, go, index]);

  const t = TESTIMONIALS[index];

  return (
    <section
      id="stories"
      className="relative scroll-mt-24 overflow-hidden px-6 py-28 sm:px-8 lg:px-12 lg:py-36 bg-[#edf5f1]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 select-none font-serif text-[26vw] font-light italic leading-none text-[#4c8a7e]/[0.05]"
      >
        love
      </span>
      <div className="relative mx-auto max-w-4xl text-center">
        <Eyebrow
          index="05"
          label="Kind words"
          className="justify-center [&>p]:justify-center"
        />
        <div className="mt-10 flex justify-center">
          <span className="grid size-14 place-items-center rounded-full bg-[#4c8a7e]/10 text-[#4c8a7e]">
            <Quote className="size-6 fill-current" />
          </span>
        </div>
        <div className="relative mt-8 min-h-[240px] sm:min-h-[220px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.figure
              key={index}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction >= 0 ? 90 : -90,
                filter: "blur(6px)",
              }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                x: direction >= 0 ? -90 : 90,
                filter: "blur(6px)",
              }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <blockquote className="font-serif text-3xl font-light leading-[1.15] tracking-[-0.01em] text-[#203330] sm:text-4xl lg:text-[2.9rem]">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-4">
                <span className="grid size-12 place-items-center rounded-full bg-[#6aa99f]/20 font-serif text-lg italic text-[#4c8a7e]">
                  {t.name.charAt(0)}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold">{t.name}</span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-[#203330]/50">
                    {t.treatment}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex([i, i > index ? 1 : -1])}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-10 bg-[#4c8a7e]" : "w-4 bg-[#203330]/15 hover:bg-[#203330]/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="scroll-mt-24 px-6 pb-28 sm:px-8 lg:px-12 lg:pb-36 bg-[#edf5f1]"
    >
      <div className="mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow index="06" label="Good questions" />
          <h2 className="mt-7 max-w-md font-serif text-5xl font-light leading-[1.02] sm:text-6xl">
            <Lines
              lines={[
                <>Asked often,</>,
                <>
                  answered <em className="italic text-[#4c8a7e]">honestly.</em>
                </>,
              ]}
            />
          </h2>
          <Reveal delay={0.2} className="mt-10">
            <div className="max-w-sm rounded-3xl border border-[#203330]/10 bg-white/60 p-7">
              <p className="font-serif text-xl font-light">
                Still curious about something?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#203330]/55">
                Call us — a human picks up during opening hours, not a phone
                tree.
              </p>
              <a
                href="tel:+14155550132"
                className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-[#203330] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#edf5f1] transition-colors hover:bg-[#4c8a7e]"
              >
                <Phone className="size-3.5" />
                +1 (415) 555-0132
              </a>
            </div>
          </Reveal>
        </div>
        <div>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.06} y={18}>
                <div className="border-t border-[#203330]/12 last:border-b">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-serif text-sm italic text-[#4c8a7e]/60">
                        0{i + 1}
                      </span>
                      <span
                        className={`font-serif text-xl font-light transition-colors duration-300 sm:text-2xl ${isOpen ? "text-[#4c8a7e]" : "group-hover:text-[#4c8a7e]"}`}
                      >
                        {item.q}
                      </span>
                    </span>
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${isOpen ? "rotate-45 border-[#4c8a7e] bg-[#4c8a7e] text-[#edf5f1]" : "border-[#203330]/15 group-hover:border-[#4c8a7e] group-hover:text-[#4c8a7e]"}`}
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
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-7 pl-9 text-[15px] leading-relaxed text-[#203330]/60">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type Status = "idle" | "submitting" | "success";
type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

export function BookingForm({ customer }: { customer: NewCustomer }) {
  const INITIAL: FormState = {
    name: "",
    email: "",
    phone: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  };
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      setForm((f) => ({ ...f, service: (e as CustomEvent<string>).detail }));
      setStatus((s) => (s === "success" ? "idle" : s));
    };
    window.addEventListener(SERVICE_EVENT, handler);
    return () => window.removeEventListener(SERVICE_EVENT, handler);
  }, []);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setSubmitted(form);
      setStatus("success");
      setForm(INITIAL);
    }, 1200);
  }

  const inputBase =
    "w-full rounded-2xl border bg-white/80 px-4 py-3.5 text-sm text-[#203330] placeholder:text-[#203330]/35 outline-none transition-all duration-300 focus:border-[#4c8a7e] focus:ring-4 focus:ring-[#4c8a7e]/15 border-[#203330]/12";
  const services =
    customer.services && customer.services.length > 0
      ? customer.services
      : demoDentalCustomer.services!;

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-[#203330] px-6 py-28 text-[#edf5f1] sm:px-8 lg:px-12 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-[#6aa99f]/25 blur-[140px]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-12 left-0 select-none font-serif text-[18vw] font-light italic leading-none text-[#b6e0d5]/[0.05]"
      >
        hello
      </span>
      <div className="relative mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Eyebrow index="07" label="Your next visit" tone="dark" />
          <h2 className="mt-7 max-w-xl font-serif text-5xl font-light leading-[1.02] sm:text-6xl lg:text-7xl">
            <Lines
              lines={[
                <>Let's make your next</>,
                <>
                  appointment feel{" "}
                  <em className="italic text-[#b6e0d5]">different.</em>
                </>,
              ]}
            />
          </h2>
          <Reveal delay={0.15} className="mt-7 max-w-md text-[#edf5f1]/60">
            <p className="leading-relaxed">
              Sixty seconds, one form. We confirm every request personally — by
              a human — within two working hours.
            </p>
          </Reveal>
          <div className="mt-12 space-y-5">
            {[
              {
                icon: Phone,
                label: "Call or text",
                value: text(customer.contact?.phone, "+1 (415) 555-0132"),
                href: `tel:${customer.contact?.phone}`,
              },
              {
                icon: Mail,
                label: "Email",
                value: text(customer.contact?.email, "hello@smilecare.dental"),
                href: `mailto:${customer.contact?.email}`,
              },
              {
                icon: MapPin,
                label: "Find us",
                value: text(
                  customer.contact?.address,
                  "214 Linden Avenue, San Rafael, CA",
                ),
                href: "#top",
              },
            ].map((row, i) => (
              <Reveal key={row.label} delay={0.1 + i * 0.08}>
                <a href={row.href} className="group flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-full border border-[#b6e0d5]/20 text-[#b6e0d5] transition-all duration-300 group-hover:bg-[#b6e0d5] group-hover:text-[#203330]">
                    <row.icon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#edf5f1]/45">
                      {row.label}
                    </span>
                    <span className="text-sm font-semibold transition-colors group-hover:text-[#b6e0d5]">
                      {row.value}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.15}>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#f6f3ec] p-7 text-[#203330] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.6)] sm:p-10">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="py-8 text-center"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                    className="mx-auto grid size-20 place-items-center rounded-full bg-[#4c8a7e]/10 text-[#4c8a7e]"
                  >
                    <CheckCircle2 className="size-9" />
                  </motion.span>
                  <h3 className="mt-7 font-serif text-4xl font-light">
                    Request received, {submitted?.name.split(" ")[0]}.
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#203330]/60">
                    We'll confirm by{" "}
                    <span className="font-semibold text-[#203330]">
                      {submitted?.email}
                    </span>{" "}
                    within two working hours.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("idle");
                        setSubmitted(null);
                      }}
                      className="rounded-full bg-[#203330] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#edf5f1] transition-colors hover:bg-[#4c8a7e]"
                    >
                      Book another visit
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-3xl font-light">
                        Request a visit
                      </h3>
                      <p className="mt-1 text-xs text-[#203330]/50">
                        Confirmed personally within 2 working hours.
                      </p>
                    </div>
                    <span className="hidden rounded-full bg-[#4c8a7e]/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4c8a7e] sm:block">
                      No payment needed
                    </span>
                  </div>
                  <form
                    onSubmit={onSubmit}
                    className="mt-7 space-y-5"
                    noValidate
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => set("name")(e.target.value)}
                        className={inputBase}
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => set("phone")(e.target.value)}
                        className={inputBase}
                      />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) => set("email")(e.target.value)}
                      className={inputBase}
                    />
                    <div className="relative">
                      <select
                        required
                        value={form.service}
                        onChange={(e) => set("service")(e.target.value)}
                        className={`${inputBase} appearance-none pr-10 ${form.service ? "" : "text-[#203330]/40"}`}
                      >
                        <option value="" disabled>
                          What can we help with?
                        </option>
                        {services.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {s.title}
                          </option>
                        ))}
                        <option value="undecided">
                          Not sure yet — help me decide
                        </option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#203330]/40" />
                    </div>
                    <input
                      type="date"
                      required
                      value={form.preferredDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => set("preferredDate")(e.target.value)}
                      className={inputBase}
                    />
                    <div>
                      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#203330]/50">
                        Pick a time
                      </p>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => set("preferredTime")(slot)}
                            className={`rounded-full border py-2 text-xs font-semibold transition-all duration-300 ${form.preferredTime === slot ? "border-[#4c8a7e] bg-[#4c8a7e] text-white shadow-[0_10px_25px_-10px_rgba(76,138,126,0.8)]" : "border-[#203330]/12 bg-white/60 text-[#203330]/60 hover:border-[#4c8a7e]/50 hover:text-[#4c8a7e]"}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Anything we should know? Worries, goals, previous experiences..."
                      value={form.notes}
                      onChange={(e) => set("notes")(e.target.value)}
                      className={`${inputBase} resize-none`}
                    />
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-[#203330] py-4.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#edf5f1] transition-all duration-300 hover:bg-[#4c8a7e] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Sending
                        </>
                      ) : (
                        <>
                          Request my visit{" "}
                          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter({ customer }: { customer: NewCustomer }) {
  const brandName = text(customer.businessName, "SmileCare");
  const services =
    customer.services && customer.services.length > 0
      ? customer.services
      : demoDentalCustomer.services!;

  return (
    <footer className="relative overflow-hidden bg-[#14211e] text-[#edf5f1]">
      <div className="mx-auto max-w-[1600px] px-6 pt-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-b border-white/10 pb-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-1.5">
              <span className="grid size-8 place-items-center rounded-full bg-[#6aa99f] text-white">
                <Asterisk className="size-4" />
              </span>
              <span className="font-serif text-[22px] tracking-[0.06em]">
                {brandName}
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#edf5f1]/50">
              Modern dentistry with a human heartbeat. Calm rooms, honest
              pricing, and clinicians who listen first.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#b6e0d5]/60">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#edf5f1]/60 transition-colors hover:text-[#b6e0d5]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#b6e0d5]/60">
              Treatments
            </p>
            <ul className="mt-5 space-y-3">
              {services.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <a
                    href="#services"
                    className="text-sm text-[#edf5f1]/60 transition-colors hover:text-[#b6e0d5]"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#b6e0d5]/60">
              Visit
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[#edf5f1]/60">
              <li>
                {text(
                  customer.contact?.address,
                  "214 Linden Avenue, San Rafael",
                )}
              </li>
              <li>
                <a
                  href={`tel:${customer.contact?.phone}`}
                  className="transition-colors hover:text-[#b6e0d5]"
                >
                  {text(customer.contact?.phone, "+1 (415) 555-0132")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${customer.contact?.email}`}
                  className="transition-colors hover:text-[#b6e0d5]"
                >
                  {text(customer.contact?.email, "hello@smilecare.dental")}
                </a>
              </li>
            </ul>
            <Magnetic strength={0.3} className="mt-8">
              <a
                href="#top"
                aria-label="Back to top"
                className="grid size-12 place-items-center rounded-full border border-white/15 transition-all duration-300 hover:border-[#b6e0d5] hover:bg-[#b6e0d5] hover:text-[#203330]"
              >
                <ArrowUp className="size-4" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
      <div className="select-none px-4" aria-hidden>
        <p className="bg-gradient-to-b from-[#b6e0d5]/25 via-[#b6e0d5]/10 to-transparent bg-clip-text text-center font-serif text-[16vw] font-light leading-[0.85] tracking-tight text-transparent">
          {brandName}
        </p>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-6 py-6 text-[11px] text-[#edf5f1]/40 sm:px-8 lg:px-12">
          <span>
            © {new Date().getFullYear()} {brandName} Dental Studio
          </span>
          <span className="font-serif italic text-[#b6e0d5]/50">
            Modern dentistry · Human care
          </span>
          <span>Designed by Infycrest Solutions</span>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumDentalTemplate({
  customer = demoDentalCustomer,
}: {
  customer?: NewCustomer;
}) {
  const style = {
    "--brand-accent": text(customer.theme?.accent, "#4c8a7e"),
  } as CSSProperties;

  return (
    <div
      style={style}
      className="relative bg-[#edf5f1] font-sans text-[#203330] selection:bg-[#4c8a7e] selection:text-[#edf5f1]"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.7); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .animate-rotate-slow { animation: rotate-slow 18s linear infinite; }
        .animate-pulse-dot { animation: pulse-dot 2.4s ease-in-out infinite; }
        .mask-fade-x { -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
        .marquee-root:hover .marquee-track { animation-play-state: paused; }
      `,
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-[200] opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <SmoothScroll>
        <SiteHeader customer={customer} />
        <main className="relative overflow-x-clip">
          <Hero customer={customer} />
          <Marquee />
          <Care customer={customer} />
          <Services customer={customer} />
          <StatsBand customer={customer} />
          <Experience />
          <Team customer={customer} />
          <Testimonials />
          <Faq />
          <BookingForm customer={customer} />
        </main>
        <SiteFooter customer={customer} />
      </SmoothScroll>
    </div>
  );
}
