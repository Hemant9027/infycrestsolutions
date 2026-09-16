"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Lenis from "lenis";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Baby,
  Bone,
  Brain,
  CalendarCheck,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Plus,
  Quote,
  Ribbon,
  Scan,
  ShieldCheck,
  Star,
  Stethoscope,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

const hospImg = (num: number) => `/hospital/${num}.jpg`;
const docImg = (num: number) => `/hospital/docter${num}.jpg`;

export type Department = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  icon: string;
  location: string;
  teamSize: number;
};

export type Doctor = {
  id: number;
  name: string;
  credentials: string;
  specialty: string;
  departmentId: number;
  departmentName: string;
  image: string;
  bio: string;
  availability: string;
};

export type CustomerTheme = {
  accent?: string;
};

export type CustomerCTA = {
  label?: string;
};

export type NewCustomer = {
  id?: number | string;
  slug?: string;
  businessName: string;
  hero: {
    eyebrow?: string;
    title?: string;
    description?: string;
    primaryCta?: string;
  };
  about: { title?: string; body?: string; image?: string };
  CTA?: CustomerCTA;
  theme?: CustomerTheme;
  heroImages?: string[];
  stats?: { value: string; label: string }[];
  departments?: Department[];
  team?: Doctor[];
  testimonials?: { quote: string; name: string; context: string }[];
  contact: { address?: string; hours?: string; phone?: string; email?: string };
};

export const demoMedoraCustomer: NewCustomer = {
  slug: "medora-health",
  businessName: "Medora Health",
  hero: {
    eyebrow: "Care, connected · Health system",
    title: "Better health. Better together.",
    description:
      "240+ physicians, 32 specialties and one connected record — so every person who cares for you knows the whole story.",
    primaryCta: "Find your care",
  },
  about: {
    title: "Specialist care with a human centre.",
    body: "Medora brings physicians, technology and compassionate support together around the people who need it most — so nothing about your care has to be coordinated by you.",
  },
  stats: [
    { value: "240+", label: "Physicians & surgeons" },
    { value: "32", label: "Medical specialties" },
    { value: "120k", label: "Patients each year" },
    { value: "4.9", label: "Average patient rating" },
  ],
  departments: [
    {
      id: 1,
      slug: "cardiology",
      name: "Cardiology",
      tagline: "Heart & vascular care",
      description:
        "From prevention to complex intervention, our cardiologists treat the full spectrum of heart conditions inside world-leading imaging and surgical suites.",
      image: hospImg(5),
      icon: "Heart",
      location: "Level 2 · East Wing",
      teamSize: 24,
    },
    {
      id: 2,
      slug: "neurology",
      name: "Neurology",
      tagline: "Brain, spine & nerve",
      description:
        "Advanced diagnostics and deeply personal treatment plans for conditions of the brain, spine and nervous system.",
      image: hospImg(6),
      icon: "Brain",
      location: "Level 3 · East Wing",
      teamSize: 18,
    },
    {
      id: 3,
      slug: "orthopedics",
      name: "Orthopedics",
      tagline: "Bones, joints & movement",
      description:
        "Surgical and rehabilitative care that gets you moving again — from sports injuries to joint replacement.",
      image: hospImg(7),
      icon: "Bone",
      location: "Level 1 · West Wing",
      teamSize: 21,
    },
    {
      id: 4,
      slug: "pediatrics",
      name: "Pediatrics",
      tagline: "Care that grows with them",
      description:
        "Family-centred medicine for every stage of childhood, delivered by specialists who speak kid.",
      image: hospImg(8),
      icon: "Baby",
      location: "Level 2 · West Wing",
      teamSize: 16,
    },
    {
      id: 5,
      slug: "oncology",
      name: "Oncology",
      tagline: "Cancer care & research",
      description:
        "Multidisciplinary cancer care pairs cutting-edge treatment with nurse navigators who walk beside you.",
      image: hospImg(9),
      icon: "Ribbon",
      location: "Level 4 · East Wing",
      teamSize: 19,
    },
    {
      id: 6,
      slug: "radiology",
      name: "Radiology & Imaging",
      tagline: "Diagnostics & imaging",
      description:
        "Low-dose CT, 3T MRI and same-day results — the clearest possible picture of what comes next.",
      image: hospImg(10),
      icon: "Scan",
      location: "Level 1 · East Wing",
      teamSize: 14,
    },
  ],
  team: [
    {
      id: 1,
      name: "Dr. Elena Marsh",
      credentials: "MD, FACC",
      specialty: "Interventional Cardiology",
      departmentId: 1,
      departmentName: "Cardiology",
      image: docImg(1),
      bio: "Fourteen years treating complex heart disease — and a firm belief that clarity is a form of care.",
      availability: "Mon — Thu",
    },
    {
      id: 2,
      name: "Dr. David Okafor",
      credentials: "MD, PhD",
      specialty: "Neurology",
      departmentId: 2,
      departmentName: "Neurology",
      image: docImg(2),
      bio: "Specialises in movement disorders and epilepsy, leading Medora's neurodiagnostics research programme.",
      availability: "Tue — Sat",
    },
    {
      id: 3,
      name: "Dr. Sofia Lindqvist",
      credentials: "MD, FAAP",
      specialty: "Pediatrics",
      departmentId: 4,
      departmentName: "Pediatrics",
      image: docImg(3),
      bio: "Developmental care with a family-first lens — known for turning nervous first visits into easy ones.",
      availability: "Mon — Fri",
    },
  ],
  testimonials: [
    {
      quote:
        "From the first phone call to my final check-up, everything about Medora felt considered. My cardiologist knew my history before I even sat down.",
      name: "Amelia Rhodes",
      context: "Cardiology patient",
    },
    {
      quote:
        "After my operation, a care coordinator called me at home every single week. It never felt like a transaction — it felt like family.",
      name: "Marcus Bennett",
      context: "Orthopedics patient",
    },
    {
      quote:
        "The pediatric team turned the hospital my daughter feared into what she now calls 'the kind doctor place'. We wouldn't go anywhere else.",
      name: "Priya Sharma",
      context: "Parent, Pediatrics",
    },
  ],
  contact: {
    address: "1200 Harborview Avenue, San Francisco, CA 94107",
    hours: "Mon – Fri: 7:00 AM – 7:00 PM",
    phone: "+1 (415) 555-0132",
    email: "care@medora.health",
  },
};

const FAQS = [
  {
    q: "Do I need a referral to see a Medora specialist?",
    a: "No. You can book directly with any of our departments. If your insurance plan requires a referral for reimbursement, our coordination team will help you obtain one from your primary physician.",
  },
  {
    q: "Which insurance plans do you accept?",
    a: "We work with most major national and regional insurers, and we verify your coverage before every visit so there are no surprises. Self-pay estimates are available within one business day.",
  },
  {
    q: "How do I access my records and test results?",
    a: "Every result, note and imaging study appears in the Medora Patient Portal — usually within 24 hours. Your care team also reviews results with you before you ever have to ask.",
  },
  {
    q: "Can I have a video consultation?",
    a: "Yes. Most follow-ups and many first consultations can happen over secure video. If your clinician decides an in-person exam would serve you better, we'll convert the visit at no charge.",
  },
];

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
] as const;

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

const ICONS: Record<string, any> = {
  Heart,
  Brain,
  Bone,
  Baby,
  Ribbon,
  Scan,
  Stethoscope,
};

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit & { once?: boolean } = {
    threshold: 0.1,
    rootMargin: "-70px",
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
/*                              MOTION PRIMITIVES                             */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, inView } = useInView({ once: true, rootMargin: "-70px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y, filter: "blur(6px)" }
      }
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em]">
      <span className="text-[#6b8eb5]">{index}</span>
      <span className="h-px w-12 bg-[#6b8eb5]/40" aria-hidden="true" />
      <span className="text-[#1f3042]/55">{title}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INTERACTIVE FX                               */
/* -------------------------------------------------------------------------- */

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -72 } });
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
      if (!hash || hash === "#") return;

      const el = document.querySelector(hash);
      if (!el) return;
      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72, duration: 1.4 });
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

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Care", href: "#care" },
  { label: "Departments", href: "#departments" },
  { label: "Team", href: "#team" },
  { label: "Stories", href: "#stories" },
  { label: "Contact", href: "#contact" },
];

export function Header({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 32);
      setHidden(y > 300 && y > lastY && !open);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (open) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open]);

  const brandName = text(customer.businessName, "Medora Health");

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-[#6b8eb5]"
        aria-hidden="true"
      />
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-[#1f3042]/10 bg-[#eef3f8]/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-12">
          <a
            href="#top"
            className={`group flex items-center gap-2.5 transition-colors duration-500 ${scrolled ? "text-[#1f3042]" : "text-white"}`}
          >
            <span className="grid size-9 place-items-center rounded-lg bg-[#6b8eb5] text-white transition-transform duration-500 group-hover:rotate-90">
              <Plus className="size-4" strokeWidth={2.5} />
            </span>
            <span className="font-serif text-2xl tracking-[0.1em]">
              {brandName.split(" ")[0]}
            </span>
          </a>
          <nav
            className={`hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 md:flex ${scrolled ? "text-[#1f3042]/70" : "text-white/80"}`}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-2 transition-colors hover:text-[#6b8eb5] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#6b8eb5] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#booking"
              className="group hidden items-center gap-2 rounded-full bg-[#6b8eb5] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#1f3042] hover:shadow-lg hover:shadow-[#1f3042]/20 sm:inline-flex"
            >
              {text(customer.CTA?.label, "Find your care")}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={`grid size-11 place-items-center rounded-full border transition-colors duration-500 md:hidden ${scrolled ? "border-[#1f3042]/15 text-[#1f3042]" : "border-white/30 text-white"}`}
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
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#1f3042] text-[#eef3f8]"
          >
            <div className="flex h-20 items-center justify-between px-6">
              <span className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-lg bg-[#6b8eb5] text-white">
                  <Plus className="size-4" strokeWidth={2.5} />
                </span>
                <span className="font-serif text-2xl tracking-[0.1em]">
                  {brandName.split(" ")[0]}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-full border border-white/25"
              >
                <X className="size-5" />
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
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}
                  className="group flex items-baseline gap-4 border-b border-white/10 py-4"
                >
                  <span className="text-xs tracking-[0.3em] text-[#bcd5ee]/70">
                    0{i + 1}
                  </span>
                  <span className="font-serif text-4xl font-light transition-colors group-hover:text-[#bcd5ee]">
                    {link.label}
                  </span>
                </motion.a>
              ))}
              <motion.a
                href="#booking"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5 }}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#6b8eb5] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Find your care <ArrowUpRight className="size-4" />
              </motion.a>
            </nav>
            <div className="px-8 pb-10 text-xs uppercase tracking-[0.2em] text-white/40">
              24/7 line — {text(customer.contact?.phone, "+1 (415) 555-0132")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeadlineLine({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  return (
    <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.15, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ customer }: { customer: NewCustomer }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const META = [
    { icon: Clock3, label: "24/7 emergency care" },
    { icon: CalendarCheck, label: "Same-week appointments" },
    { icon: ShieldCheck, label: "Most insurance accepted" },
  ];

  const fullTitle = text(
    customer.hero?.title,
    "Better health. Better together.",
  );
  const titleParts = fullTitle.split(". ");

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#1f3042] text-white"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={customer.heroImages?.[0] || hospImg(1)}
            alt="Light-filled hospital atrium"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f3042] via-[#1f3042]/45 to-[#1f3042]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f3042]/55 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
        className="absolute inset-x-0 top-24 hidden justify-between px-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55 md:flex lg:px-12"
      >
        <span>Est. 1989 · Harborview, San Francisco</span>
        <span className="flex items-center gap-2">
          <Star className="size-3 fill-[#bcd5ee] text-[#bcd5ee]" /> 4.9 patient
          rating · 12k reviews
        </span>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35, duration: 0.9, ease: EASE }}
        className="absolute right-6 bottom-44 z-10 hidden lg:right-12 xl:block"
      >
        <div className="w-64 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bcd5ee]">
            <span className="animate-pulse-dot inline-block size-1.5 rounded-full bg-[#bcd5ee]" />{" "}
            Next availability
          </p>
          <p className="mt-3 font-serif text-3xl font-light">Today · 2:30 PM</p>
          <p className="mt-1 text-xs text-white/60">
            Cardiology · Dr. E. Marsh
          </p>
          <a
            href="#booking"
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 underline decoration-[#bcd5ee]/70 decoration-2 underline-offset-4 transition-colors hover:text-[#bcd5ee]"
          >
            Claim this slot <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </motion.aside>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pt-40 pb-10 lg:px-12"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
          className="mb-7 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#bcd5ee]"
        >
          <span className="h-px w-12 bg-[#bcd5ee]/60" aria-hidden="true" />
          {text(customer.hero?.eyebrow, "Care, connected · Health system")}
        </motion.p>
        <h1 className="max-w-6xl font-serif text-[clamp(3.4rem,10.5vw,10rem)] leading-[0.92] font-light tracking-[-0.01em]">
          <HeadlineLine delay={0.5}>
            {titleParts[0]}
            {titleParts.length > 1 ? "." : ""}
          </HeadlineLine>
          {titleParts.length > 1 && (
            <HeadlineLine delay={0.64}>
              <em className="text-[#bcd5ee]">
                {titleParts.slice(1).join(". ")}
              </em>
            </HeadlineLine>
          )}
        </h1>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease: EASE }}
            className="max-w-md text-base leading-relaxed text-white/65"
          >
            {text(
              customer.hero?.description,
              "240+ physicians, 32 specialties and one connected record — so every person who cares for you knows the whole story.",
            )}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8, ease: EASE }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#booking"
              className="group inline-flex items-center gap-2 rounded-full bg-[#6b8eb5] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#bcd5ee] hover:text-[#1f3042]"
            >
              {text(customer.hero?.primaryCta, "Find your care")}{" "}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#departments"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Explore departments
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-14 grid gap-6 border-t border-white/15 pt-7 sm:grid-cols-3"
        >
          {META.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60"
            >
              <item.icon
                className="size-4 shrink-0 text-[#bcd5ee]"
                strokeWidth={1.75}
              />
              {item.label}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute right-8 bottom-10 z-10 hidden flex-col items-center gap-3 lg:flex"
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4 text-[#bcd5ee]" />
        </motion.span>
      </motion.div>
    </section>
  );
}

const MARQUEE_ITEMS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Oncology",
  "Radiology & Imaging",
  "Emergency 24/7",
  "Same-week appointments",
] as const;

function MarqueeRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-10 pr-10"
      aria-hidden={hidden || undefined}
    >
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-10">
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.3em] text-[#1f3042]/55">
            {item}
          </span>
          <Plus
            className="size-3.5 shrink-0 text-[#6b8eb5]"
            strokeWidth={2.5}
          />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div
      className="marquee-track overflow-hidden border-b border-[#1f3042]/10 bg-[#eef3f8] py-5"
      aria-label="Medora specialties"
    >
      <div className="animate-marquee flex w-max">
        <MarqueeRow />
        <MarqueeRow hidden />
      </div>
    </div>
  );
}

export function CareSection({ customer }: { customer: NewCustomer }) {
  const PROMISES = [
    "Same-week specialist appointments",
    "One record, shared by every department",
    "A dedicated coordinator for complex care",
  ];

  return (
    <section
      id="care"
      className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-36"
    >
      <Reveal>
        <SectionLabel index="01" title="Our promise" />
      </Reveal>
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal delay={0.08}>
            <h2 className="font-serif text-[clamp(2.6rem,5.5vw,5rem)] leading-[1.02] font-light">
              Specialist care with a{" "}
              <em className="text-[#6b8eb5]">human centre.</em>
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:pt-6">
          <Reveal delay={0.16}>
            <p className="max-w-xl text-lg leading-relaxed text-[#1f3042]/65">
              {text(
                customer.about?.body,
                "Medora brings physicians, technology and compassionate support together around the people who need it most — so nothing about your care has to be coordinated by you.",
              )}
            </p>
            <ul className="mt-8 space-y-4">
              {PROMISES.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-[#1f3042]/75"
                >
                  <ShieldCheck
                    className="size-4.5 shrink-0 text-[#6b8eb5]"
                    strokeWidth={1.75}
                  />{" "}
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#departments"
              className="group mt-9 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3042]"
            >
              <span className="border-b-2 border-[#6b8eb5]/50 pb-1 transition-colors group-hover:border-[#6b8eb5]">
                See how we work
              </span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
      </div>
      <div className="mt-20 grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" delay={0.1}>
          <div className="group relative h-[320px] overflow-hidden rounded-3xl sm:h-[440px] lg:h-[540px]">
            <Image
              src={hospImg(2)}
              alt="Physician and patient"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f3042]/35 to-transparent opacity-60" />
            <p className="absolute bottom-6 left-6 max-w-xs text-sm leading-relaxed text-white/90">
              Every appointment starts with listening. The medicine follows.
            </p>
          </div>
        </Reveal>
        <div className="flex flex-col gap-6 lg:col-span-5 lg:pl-4">
          <Reveal delay={0.2}>
            <div className="group relative h-[260px] overflow-hidden rounded-3xl sm:h-[300px] lg:h-[320px]">
              <Image
                src={hospImg(3)}
                alt="Curved corridor"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                unoptimized
              />
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="rounded-3xl bg-[#1f3042] p-8 text-[#eef3f8] lg:p-10">
              <p className="font-serif text-5xl font-light lg:text-6xl">
                120<span className="text-[#6b8eb5]">k+</span>
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#eef3f8]/60">
                patients cared for every year across our campuses — and a care
                coordinator assigned to every complex case.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ref: viewRef, inView } = useInView({
    once: true,
    rootMargin: "-40px",
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const controls = animate(0, to, {
      duration: 2.2,
      ease: EASE,
      onUpdate(value) {
        el.textContent = decimals
          ? value.toFixed(decimals)
          : Math.round(value).toLocaleString("en-US");
      },
    });
    return () => controls.stop();
  }, [inView, to, decimals]);

  return (
    <span ref={viewRef}>
      <span ref={ref}>0</span>
    </span>
  );
}

export function StatsSection({ customer }: { customer: NewCustomer }) {
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
      : demoMedoraCustomer.stats!.map((s) => {
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
    <section className="border-y border-[#1f3042]/10 bg-[#eef3f8]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 0.08}
            className={`px-6 py-12 lg:px-12 lg:py-16 ${i > 0 ? "border-l border-[#1f3042]/10" : ""} ${i >= 2 ? "max-lg:border-t max-lg:border-[#1f3042]/10" : ""} ${i === 2 ? "max-lg:border-l-0" : ""}`}
          >
            <p className="font-serif text-5xl font-light tracking-tight lg:text-7xl">
              <Counter to={stat.value} decimals={stat.decimals ?? 0} />
              <span className="text-[#6b8eb5]">{stat.suffix}</span>
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1f3042]/50">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function DepartmentsSection({
  departments,
}: {
  departments?: Department[];
}) {
  const depts =
    departments && departments.length > 0
      ? departments
      : demoMedoraCustomer.departments!;
  const [active, setActive] = useState<Department | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 150, damping: 20, mass: 0.5 });

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const x = Math.min(e.clientX + 32, window.innerWidth - 380);
    mx.set(Math.max(16, x));
    my.set(Math.max(16, e.clientY - 116));
  };

  const select = (department: Department) => {
    window.dispatchEvent(
      new CustomEvent("medora:select-department", { detail: department.id }),
    );
  };

  return (
    <section
      id="departments"
      className="bg-[#1f3042] px-6 py-24 text-[#eef3f8] lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="02" title="Departments" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-8 max-w-2xl font-serif text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1.02] font-light">
                Every specialty,{" "}
                <em className="text-[#bcd5ee]">under one roof.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <p className="max-w-sm text-sm leading-relaxed text-white/50 md:text-right">
              Hover to look inside each department — or select one to start a
              booking with the right team.
            </p>
          </Reveal>
        </div>
        <div
          className="relative mt-16"
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
        >
          <motion.div
            style={{ x: sx, y: sy }}
            animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.88 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed top-0 left-0 z-40 hidden lg:block"
            aria-hidden="true"
          >
            <div className="relative h-[232px] w-[348px] overflow-hidden rounded-2xl border border-white/25 shadow-2xl shadow-black/50">
              <AnimatePresence mode="popLayout">
                {active && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={active.image}
                      alt=""
                      fill
                      sizes="348px"
                      className="object-cover"
                      unoptimized
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#1f3042]/80 to-transparent px-5 pt-10 pb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  {active?.name ?? ""}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#bcd5ee]">
                  {active?.location ?? ""}
                </span>
              </div>
            </div>
          </motion.div>

          <Reveal delay={0.1}>
            <div>
              {depts.map((department, i) => {
                const Icon = ICONS[department.icon] ?? Stethoscope;
                return (
                  <a
                    key={department.id}
                    href="#booking"
                    onClick={() => select(department)}
                    onMouseEnter={() => setActive(department)}
                    onFocus={() => setActive(department)}
                    className="group relative block overflow-hidden border-t border-white/12 py-6 transition-colors last:border-b md:py-8"
                  >
                    <span
                      className="absolute inset-0 origin-bottom scale-y-0 bg-white/5 transition-transform duration-500 ease-out group-hover:scale-y-100"
                      aria-hidden="true"
                    />
                    <span className="relative flex items-center gap-4 md:gap-10">
                      <span className="hidden w-8 shrink-0 text-xs font-semibold tracking-[0.2em] text-[#eef3f8]/30 md:block">
                        0{i + 1}
                      </span>
                      <span className="relative block h-20 w-28 shrink-0 overflow-hidden rounded-xl lg:hidden">
                        <Image
                          src={department.image}
                          alt=""
                          fill
                          sizes="112px"
                          className="object-cover"
                          unoptimized
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-3 md:gap-5">
                          <Icon
                            className="hidden size-6 shrink-0 text-[#6b8eb5] transition-colors duration-300 group-hover:text-[#bcd5ee] sm:block md:size-7"
                            strokeWidth={1.5}
                          />
                          <span className="truncate font-serif text-[clamp(1.6rem,3.6vw,3.4rem)] leading-tight font-light transition-all duration-500 group-hover:translate-x-3 group-hover:text-white">
                            {department.name}
                          </span>
                        </span>
                        <span className="mt-2 block text-xs text-white/40 transition-colors duration-300 group-hover:text-white/60 md:text-sm">
                          {department.tagline} · {department.location} ·{" "}
                          {department.teamSize} specialists
                        </span>
                      </span>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 transition-all duration-500 group-hover:border-[#6b8eb5] group-hover:bg-[#6b8eb5] md:size-14">
                        <ArrowUpRight className="size-4 text-[#eef3f8]/70 transition-all duration-500 group-hover:rotate-45 group-hover:text-white md:size-5" />
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <p className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/35">
            <span className="animate-pulse-dot inline-block size-1.5 rounded-full bg-[#bcd5ee]" />
            Emergency & urgent care never closes · Level 1, Harborview campus
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function TeamBooking({
  customer,
  departments = demoMedoraCustomer.departments!,
}: {
  customer?: NewCustomer;
  departments?: Department[];
}) {
  const doctors =
    customer?.team && customer?.team.length > 0
      ? customer.team
      : demoMedoraCustomer.team!;

  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [doctorId, setDoctorId] = useState<number | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<(typeof TIME_SLOTS)[number]>(TIME_SLOTS[0]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const handler = (event: Event) => {
      const id = (event as CustomEvent<number>).detail;
      setDepartmentId(id);
      setDoctorId((current) => {
        const doctor = doctors.find((d) => d.id === current);
        return doctor && doctor.departmentId === id ? current : "";
      });
    };
    window.addEventListener("medora:select-department", handler);
    return () =>
      window.removeEventListener("medora:select-department", handler);
  }, [doctors]);

  const filteredDoctors = departmentId
    ? doctors.filter((d) => d.departmentId === departmentId)
    : doctors;

  const bookWith = (doctor: Doctor) => {
    setDoctorId(doctor.id);
    setDepartmentId(doctor.departmentId);
    setStatus("idle");
    setError("");
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo("#booking", { offset: -64, duration: 1.4 });
    } else {
      document
        .getElementById("booking")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const reset = () => {
    setStatus("idle");
    setReference("");
    setError("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDate("");
    setTime(TIME_SLOTS[0]);
    setNotes("");
    setDoctorId("");
    setDepartmentId("");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setError("");
    if (!departmentId) {
      setError("Please choose a department for your visit.");
      return;
    }
    setStatus("submitting");

    setTimeout(() => {
      setReference(`MDR-${Math.floor(Math.random() * 1000000)}`);
      setStatus("success");
    }, 1500);
  };

  const selectedDepartment = departments.find((d) => d.id === departmentId);
  const selectedDoctor = doctors.find((d) => d.id === doctorId);
  const minDate = new Date().toISOString().split("T")[0];

  const INPUT =
    "w-full rounded-xl border border-[#1f3042]/15 bg-white px-4 py-3.5 text-sm text-[#1f3042] placeholder:text-[#1f3042]/35 outline-none transition duration-300 focus:border-[#6b8eb5] focus:ring-4 focus:ring-[#6b8eb5]/15";

  return (
    <>
      <section
        id="team"
        className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-36"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="03" title="Your care team" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-8 max-w-2xl font-serif text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1.02] font-light">
                The people behind <em className="text-[#6b8eb5]">your care.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <p className="max-w-sm text-sm leading-relaxed text-[#1f3042]/55 md:text-right">
              Fellowship-trained, research-active, and chosen as much for how
              they listen as for how they practise.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor, i) => (
            <Reveal key={doctor.id} delay={i * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#1f3042]/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#1f3042]/10">
                <div className="relative aspect-[3/3.2] overflow-hidden">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    unoptimized
                  />
                  <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-[#eef3f8]/85 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1f3042]/75 backdrop-blur">
                    <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" />{" "}
                    {doctor.availability}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-2xl font-light">
                      {doctor.name}
                    </h3>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b8eb5]">
                      {doctor.credentials}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3042]/45">
                    {doctor.specialty} · {doctor.departmentName}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[#1f3042]/60">
                    {doctor.bio}
                  </p>
                  <button
                    type="button"
                    onClick={() => bookWith(doctor)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1f3042]/15 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f3042] transition-all duration-300 hover:border-[#1f3042] hover:bg-[#1f3042] hover:text-[#eef3f8]"
                  >
                    Book with {doctor.name.split(" ").slice(0, 1)}{" "}
                    {doctor.name.split(" ").pop()}
                    <ArrowUpRight className="size-3.5" />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="booking"
        className="bg-[#1f3042] px-6 py-24 text-[#eef3f8] lg:px-12 lg:py-36"
      >
        <div className="mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="04" title="Appointments" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-8 max-w-xl font-serif text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1.02] font-light">
                Let&apos;s find the right{" "}
                <em className="text-[#bcd5ee]">next step.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55">
                Tell us what you need and our coordination team will match you
                with the right specialist — usually within one business day.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap">
                {[
                  { icon: Clock3, label: "Average wait · 4 days" },
                  { icon: ShieldCheck, label: "No referral needed" },
                  { icon: CheckCircle2, label: "Free rescheduling" },
                ].map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65"
                  >
                    <chip.icon
                      className="size-3.5 text-[#bcd5ee]"
                      strokeWidth={1.75}
                    />{" "}
                    {chip.label}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="group relative mt-10 h-64 overflow-hidden rounded-3xl lg:h-80">
                <Image
                  src={hospImg(4)}
                  alt="Corridor"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f3042]/70 via-transparent to-transparent" />
                <a
                  href={`tel:${customer?.contact?.phone}`}
                  className="absolute bottom-5 left-5 inline-flex items-center gap-3 rounded-full border border-white/25 bg-[#1f3042]/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-colors hover:bg-[#6b8eb5]"
                >
                  <Phone className="size-4" /> Prefer to talk?{" "}
                  {text(customer?.contact?.phone, "+1 (415) 555-0132")}
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="rounded-[2rem] bg-[#eef3f8] p-6 text-[#1f3042] shadow-2xl shadow-black/30 sm:p-10">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex min-h-[420px] flex-col items-start justify-center"
                  >
                    <span className="grid size-16 place-items-center rounded-full bg-[#6b8eb5]/15 text-[#6b8eb5]">
                      <CheckCircle2 className="size-8" strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-7 font-serif text-4xl font-light">
                      Request received.
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-[#1f3042]/60">
                      Thank you, {firstName}. Our coordination team will confirm
                      your appointment by email within one business day.
                    </p>
                    <div className="mt-8 w-full rounded-2xl border border-[#1f3042]/10 bg-white p-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#1f3042]/45">
                        Booking reference
                      </p>
                      <p className="mt-1.5 font-serif text-3xl tracking-[0.08em] text-[#6b8eb5]">
                        {reference}
                      </p>
                      <dl className="mt-5 grid gap-2.5 border-t border-[#1f3042]/10 pt-5 text-sm text-[#1f3042]/70">
                        <div className="flex justify-between gap-4">
                          <dt className="text-[#1f3042]/45">Department</dt>
                          <dd className="font-medium">
                            {selectedDepartment?.name ?? "—"}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-[#1f3042]/45">Specialist</dt>
                          <dd className="font-medium">
                            {selectedDoctor
                              ? selectedDoctor.name
                              : "Assigned by our team"}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-[#1f3042]/45">Requested</dt>
                          <dd className="font-medium">
                            {date} · {time}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#1f3042]/20 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f3042] transition-all duration-300 hover:bg-[#1f3042] hover:text-[#eef3f8]"
                    >
                      Book another visit
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                    onSubmit={submit}
                  >
                    <h3 className="font-serif text-3xl font-light lg:text-4xl">
                      Request an appointment
                    </h3>
                    <p className="mt-2 text-sm text-[#1f3042]/55">
                      Takes about a minute. We confirm every request within one
                      business day.
                    </p>
                    <div className="mt-8 grid gap-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f3042]/50">
                            First name
                          </span>
                          <input
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Jordan"
                            className={INPUT}
                          />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f3042]/50">
                            Last name
                          </span>
                          <input
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Lee"
                            className={INPUT}
                          />
                        </label>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f3042]/50">
                            Email
                          </span>
                          <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className={INPUT}
                          />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f3042]/50">
                            Phone (optional)
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (415) 000-0000"
                            className={INPUT}
                          />
                        </label>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f3042]/50">
                            Department
                          </span>
                          <select
                            required
                            value={departmentId}
                            onChange={(e) => {
                              const id = e.target.value
                                ? Number(e.target.value)
                                : "";
                              setDepartmentId(id);
                              setDoctorId((current) => {
                                const doctor = doctors.find(
                                  (d) => d.id === current,
                                );
                                return doctor && doctor.departmentId === id
                                  ? current
                                  : "";
                              });
                            }}
                            className={INPUT}
                          >
                            <option value="">Select a department</option>
                            {departments.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f3042]/50">
                            Preferred specialist (optional)
                          </span>
                          <select
                            value={doctorId}
                            onChange={(e) => {
                              const id = e.target.value
                                ? Number(e.target.value)
                                : "";
                              setDoctorId(id);
                              if (id !== "") {
                                const doctor = doctors.find((d) => d.id === id);
                                if (doctor)
                                  setDepartmentId(doctor.departmentId);
                              }
                            }}
                            className={INPUT}
                          >
                            <option value="">No preference</option>
                            {filteredDoctors.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name} · {d.specialty}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f3042]/50">
                            Preferred date
                          </span>
                          <input
                            required
                            type="date"
                            min={minDate}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={INPUT}
                          />
                        </label>
                      </div>
                      <div>
                        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f3042]/50">
                          Preferred time
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ${time === slot ? "border-[#1f3042] bg-[#1f3042] text-[#eef3f8]" : "border-[#1f3042]/15 bg-white text-[#1f3042]/65 hover:border-[#1f3042]/40"}`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f3042]/50">
                          Anything we should know? (optional)
                        </span>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Symptoms, questions, accessibility needs..."
                          className={`${INPUT} resize-none`}
                        />
                      </label>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2.5 rounded-xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-900"
                        >
                          <CircleAlert className="size-4.5 shrink-0" />
                          {error}
                        </motion.p>
                      )}
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="group mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1f3042] py-4.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#eef3f8] transition-all duration-300 hover:bg-[#6b8eb5] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {status === "submitting" ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Sending
                            your request
                          </>
                        ) : (
                          <>
                            Request appointment{" "}
                            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </>
                        )}
                      </button>
                      <p className="text-center text-[11px] leading-relaxed text-[#1f3042]/40">
                        By submitting you agree to our patient privacy policy.
                        We never share your information.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function TestimonialsSection({ customer }: { customer?: NewCustomer }) {
  const [index, setIndex] = useState(0);
  const testimonials =
    customer?.testimonials && customer.testimonials.length > 0
      ? customer.testimonials
      : demoMedoraCustomer.testimonials!;

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      7000,
    );
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  const current = testimonials[index];

  return (
    <section
      id="stories"
      className="bg-[#dce7f1]/60 px-6 py-24 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <div className="flex justify-center">
            <SectionLabel index="05" title="Patient stories" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="mx-auto mt-12 grid size-14 place-items-center rounded-full bg-[#6b8eb5]/15 text-[#6b8eb5]">
            <Quote className="size-6" strokeWidth={1.5} />
          </span>
        </Reveal>
        <div className="relative mt-10 min-h-[220px] sm:min-h-[190px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="font-serif text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.25] font-light text-[#1f3042]">
                {current.quote}
              </p>
              <footer className="mt-8">
                <p className="text-sm font-semibold tracking-[0.08em] text-[#1f3042]">
                  {current.name}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#6b8eb5]">
                  {current.context}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <Reveal delay={0.15}>
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid size-12 place-items-center rounded-full border border-[#1f3042]/15 text-[#1f3042]/70 transition-all duration-300 hover:border-[#1f3042] hover:bg-[#1f3042] hover:text-[#eef3f8]"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex items-center gap-2.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-[#1f3042]" : "w-1.5 bg-[#1f3042]/25 hover:bg-[#1f3042]/50"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid size-12 place-items-center rounded-full border border-[#1f3042]/15 text-[#1f3042]/70 transition-all duration-300 hover:border-[#1f3042] hover:bg-[#1f3042] hover:text-[#eef3f8]"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel index="06" title="Questions" />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-8 font-serif text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1.02] font-light">
              Answers, <em className="text-[#6b8eb5]">before you ask.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#1f3042]/55">
              Can&apos;t find what you&apos;re looking for? Our 24/7 nurse line
              answers in under two minutes —{" "}
              <a
                href="tel:+14155550132"
                className="font-semibold text-[#1f3042] underline decoration-[#6b8eb5]/60 decoration-2 underline-offset-4 hover:text-[#6b8eb5]"
              >
                +1 (415) 555-0132
              </a>
              .
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="lg:col-span-7">
          <div>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className="border-t border-[#1f3042]/10 last:border-b"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={`font-serif text-xl font-light transition-colors duration-300 md:text-2xl ${isOpen ? "text-[#6b8eb5]" : "text-[#1f3042] group-hover:text-[#6b8eb5]"}`}
                    >
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${isOpen ? "border-[#6b8eb5] bg-[#6b8eb5] text-white" : "border-[#1f3042]/15 text-[#1f3042]/60 group-hover:border-[#1f3042]/40"}`}
                    >
                      <Plus className="size-4" strokeWidth={2} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 text-sm leading-relaxed text-[#1f3042]/60 md:text-base">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactSection({ customer }: { customer?: NewCustomer }) {
  const CARDS = [
    {
      icon: Phone,
      title: "Call us",
      lines: [
        text(customer?.contact?.phone, "+1 (415) 555-0132"),
        "24/7 nurse line",
      ],
      href: `tel:${customer?.contact?.phone}`,
      action: "Call now",
    },
    {
      icon: Mail,
      title: "Write to us",
      lines: [
        text(customer?.contact?.email, "care@medora.health"),
        "Replies within a day",
      ],
      href: `mailto:${customer?.contact?.email}`,
      action: "Send email",
    },
    {
      icon: MapPin,
      title: "Visit us",
      lines: [
        text(
          customer?.contact?.address,
          "1200 Harborview Avenue, San Francisco, CA 94107",
        ).split(",")[0],
        text(
          customer?.contact?.address,
          "1200 Harborview Avenue, San Francisco, CA 94107",
        )
          .split(",")
          .slice(1)
          .join(",")
          .trim(),
      ],
      href: "#booking",
      action: "Plan a visit",
    },
  ];

  return (
    <section
      id="contact"
      className="border-t border-[#1f3042]/10 bg-[#eef3f8] px-6 py-24 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="07" title="Contact" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-8 max-w-2xl font-serif text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1.02] font-light">
                Let&apos;s find the right{" "}
                <em className="text-[#6b8eb5]">next step.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <a
              href={`mailto:${customer?.contact?.email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-[#1f3042] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#eef3f8] transition-all duration-300 hover:bg-[#6b8eb5] hover:text-white"
            >
              Speak with us{" "}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.1}>
              <a
                href={card.href}
                className="group flex h-full flex-col rounded-3xl border border-[#1f3042]/10 bg-white p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#6b8eb5]/40 hover:shadow-2xl hover:shadow-[#1f3042]/10"
              >
                <span className="grid size-12 place-items-center rounded-full bg-[#6b8eb5]/12 text-[#6b8eb5] transition-colors duration-300 group-hover:bg-[#6b8eb5] group-hover:text-white">
                  <card.icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 font-serif text-2xl font-light">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-[#1f3042]/80">
                  {card.lines[0]}
                </p>
                <p className="text-sm text-[#1f3042]/45">{card.lines[1]}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b8eb5]">
                  {card.action}
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl border border-[#1f3042]/10 bg-[#dce7f1]/50 px-8 py-7 sm:flex-row sm:items-center">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#6b8eb5]/12 text-[#6b8eb5]">
              <Clock3 className="size-5" strokeWidth={1.75} />
            </span>
            <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
              <p className="text-[#1f3042]/75">
                <span className="font-semibold text-[#1f3042]">Mon — Fri</span>{" "}
                7:00 AM — 7:00 PM
              </p>
              <p className="text-[#1f3042]/75">
                <span className="font-semibold text-[#1f3042]">Saturday</span>{" "}
                8:00 AM — 2:00 PM
              </p>
              <p className="text-[#1f3042]/75">
                <span className="font-semibold text-[#1f3042]">Emergency</span>{" "}
                Always open
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({
  departments,
  customer,
}: {
  departments?: Department[];
  customer?: NewCustomer;
}) {
  const depts =
    departments && departments.length > 0
      ? departments
      : demoMedoraCustomer.departments!;
  const brandName = text(customer?.businessName, "Medora Health");

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState("sending");
    setTimeout(() => setState("done"), 1200);
  };

  return (
    <footer className="bg-[#0f1b26] text-[#eef3f8]">
      <div className="border-b border-white/10 bg-[#0c1720]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-5 text-center lg:px-12">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-red-400" />
          </span>
          <p className="text-xs leading-relaxed tracking-[0.06em] text-[#eef3f8]/70 md:text-sm">
            In a medical emergency, call{" "}
            <a href="tel:911" className="font-semibold text-[#bcd5ee]">
              911
            </a>{" "}
            or reach our 24/7 emergency line at{" "}
            <a
              href={`tel:${customer?.contact?.phone}`}
              className="font-semibold text-[#bcd5ee]"
            >
              {text(customer?.contact?.phone, "+1 (415) 555-0911")}
            </a>
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-[1600px] px-6 pt-20 lg:px-12">
        <Reveal>
          <div className="grid gap-8 border-b border-white/10 pb-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="font-serif text-4xl leading-tight font-light lg:text-5xl">
                Stay well, <em className="text-[#bcd5ee]">stay informed.</em>
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#eef3f8]/50">
                A monthly note from our physicians — seasonal guidance, new
                treatments, and nothing you don&apos;t need.
              </p>
            </div>
            <div className="lg:justify-self-end">
              {state === "done" ? (
                <p className="flex items-center gap-2.5 rounded-full border border-[#bcd5ee]/30 bg-[#bcd5ee]/10 px-5 py-4 text-sm text-[#bcd5ee]">
                  <CheckCircle2 className="size-4.5 shrink-0" /> You&apos;re on
                  the list — stay well.
                </p>
              ) : (
                <form onSubmit={submit} className="w-full max-w-md">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 backdrop-blur transition-colors focus-within:border-[#bcd5ee]/60">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === "error") setState("idle");
                      }}
                      placeholder="Your email address"
                      className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-[#eef3f8] outline-none placeholder:text-[#eef3f8]/35"
                    />
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#6b8eb5] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#bcd5ee] hover:text-[#1f3042] disabled:opacity-60"
                    >
                      {state === "sending" ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <>
                          Subscribe <ArrowRight className="size-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Reveal>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-[#6b8eb5] text-white">
                <Plus className="size-4" strokeWidth={2.5} />
              </span>
              <span className="font-serif text-2xl tracking-[0.1em]">
                {brandName.split(" ")[0]}
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#eef3f8]/45">
              A health system built around one idea — that medicine works best
              when every part of it works together.
            </p>
          </div>
          <nav>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eef3f8]/35">
              Navigate
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-[#eef3f8]/65 transition-colors hover:text-[#bcd5ee]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eef3f8]/35">
              Departments
            </p>
            <ul className="mt-5 space-y-3">
              {depts.slice(0, 6).map((department) => (
                <li key={department.id}>
                  <a
                    href="#departments"
                    className="text-sm text-[#eef3f8]/65 transition-colors hover:text-[#bcd5ee]"
                  >
                    {department.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#eef3f8]/35">
              Reach us
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[#eef3f8]/65">
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-[#6b8eb5]" />{" "}
                {text(customer?.contact?.phone, "+1 (415) 555-0132")}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-[#6b8eb5]" />{" "}
                {text(customer?.contact?.email, "care@medora.health")}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#6b8eb5]" />{" "}
                {text(
                  customer?.contact?.address,
                  "1200 Harborview Avenue\nSan Francisco, CA 94107",
                )
                  .split("\n")
                  .map((l, i) => (
                    <React.Fragment key={i}>
                      {l}
                      <br />
                    </React.Fragment>
                  ))}
              </li>
            </ul>
          </div>
        </div>
        <div
          className="overflow-hidden border-t border-white/10"
          aria-hidden="true"
        >
          <Reveal y={40}>
            <p
              className="-mb-[0.16em] pt-4 text-center font-serif text-[clamp(4rem,16.5vw,15rem)] leading-none font-light tracking-[0.06em] text-transparent select-none"
              style={{ WebkitTextStroke: "1px rgba(238,243,248,0.16)" }}
            >
              {brandName.split(" ")[0]}
            </p>
          </Reveal>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-[11px] tracking-[0.14em] text-[#eef3f8]/35 uppercase md:flex-row">
          <p>
            © {new Date().getFullYear()} {brandName} · Care, connected
          </p>
          <p>Designed by Infycrest Solutions</p>
          <nav className="flex gap-7">
            <a href="#top" className="transition-colors hover:text-[#bcd5ee]">
              Privacy
            </a>
            <a href="#top" className="transition-colors hover:text-[#bcd5ee]">
              Terms
            </a>
            <a href="#top" className="transition-colors hover:text-[#bcd5ee]">
              Accessibility
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumHospitalTemplate({
  customer = demoMedoraCustomer,
}: {
  customer?: NewCustomer;
}) {
  const style = {
    "--brand-accent": text(customer.theme?.accent, "#6b8eb5"),
  } as CSSProperties;

  return (
    <div
      style={style}
      className="relative overflow-x-clip bg-[#eef3f8] font-sans text-[#1f3042] selection:bg-[#6b8eb5] selection:text-white"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.82); } }
        .animate-marquee { animation: marquee 46s linear infinite; }
        .animate-pulse-dot { animation: pulse-dot 2.4s ease-in-out infinite; }
        .marquee-track:hover .animate-marquee, .marquee-track:hover .marquee-copy { animation-play-state: paused; }
        .grain { position: fixed; inset: 0; z-index: 90; pointer-events: none; opacity: 0.045; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E"); }
      `,
        }}
      />

      <SmoothScroll>
        <Header customer={customer} />
        <main id="top">
          <Hero customer={customer} />
          <Marquee />
          <CareSection customer={customer} />
          <StatsSection customer={customer} />
          <DepartmentsSection departments={customer.departments} />
          <TeamBooking customer={customer} departments={customer.departments} />
          <TestimonialsSection customer={customer} />
          <FaqSection />
          <ContactSection customer={customer} />
        </main>
        <Footer customer={customer} departments={customer.departments} />
      </SmoothScroll>
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
