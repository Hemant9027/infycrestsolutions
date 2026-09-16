"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  type FormEvent,
  type CSSProperties,
} from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useInView as useMotionInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bike,
  Check,
  ChevronDown,
  Clock,
  Flame,
  Leaf,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Minus,
  Package,
  Phone,
  Plus,
  ReceiptText,
  ShoppingBag,
  Star,
  Trash2,
  TriangleAlert,
  Truck,
  X,
  Zap,
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

export const ckImg = (num: number) => `/Cloud-Kitchen/${num}.jpg`;

export const demoDashBiteCustomer: NewCustomer = {
  slug: "dashbite-kitchen",
  businessName: "DashBite",
  theme: { accent: "#fa4b00" },
  CTA: { label: "Order Now" },
  hero: {
    eyebrow: "Live · Now delivering",
    title: "CRAVE IT. CLICK IT. DEVOUR IT.",
    description:
      "Chef-crafted meals fired in our state-of-the-art cloud kitchen and delivered lightning-fast to your door — no tables, no waiting, no compromise.",
    primaryCta: "Start Your Order",
  },
  heroImages: [ckImg(1), ckImg(4), ckImg(8)],
  about: {
    title: "No tables. Just incredible food.",
    body: "We stripped away the dining room to focus on what matters most: the food. DashBite is a delivery-first kitchen engineered for flavor and speed. From the wok to your door in minutes — every bite lands as hot and fresh as if you were sitting at the chef's counter.",
    image: ckImg(12),
  },
  stats: [
    { value: "30m", label: "Avg Delivery" },
    { value: "4.9", label: "Customer Rating" },
    { value: "120+", label: "Orders Per Hour" },
    { value: "100%", label: "Fresh Ingredients" },
  ],
  services: [
    {
      title: "Spicy Honey Butter Chicken",
      description:
        "Crispy fried chicken tossed in our signature chili honey butter, finished with sesame and house pickles.",
      price: "14",
      tag: "Bestseller",
      image: ckImg(3),
    },
    {
      title: "Truffle Smashburger",
      description:
        "Double wagyu patties, truffle aioli, caramelized onions and melted provolone on a toasted brioche bun.",
      price: "16",
      tag: "Chef's Pick",
      image: ckImg(5),
    },
    {
      title: "Fire-Roasted Veggie Bowl",
      description:
        "Quinoa, charred broccoli, roasted sweet potato and avocado under a silky tahini drizzle.",
      price: "12",
      tag: "Vegan",
      image: ckImg(9),
    },
    {
      title: "Loaded Kimchi Fries",
      description:
        "Crispy crinkle cuts loaded with spicy kimchi, bulgogi beef, scallions and a spicy mayo drizzle.",
      price: "10",
      tag: "Side",
      image: ckImg(15),
    },
    {
      title: "Ember Tonkotsu Ramen",
      description:
        "18-hour pork broth, chashu, ajitama egg and black garlic oil. Steaming until it hits your door.",
      price: "13",
      tag: "Spicy",
      image: ckImg(18),
    },
    {
      title: "Seoul Fire Wings",
      description:
        "Double-fried wings lacquered in gochujang glaze, crushed peanuts and scallion snow.",
      price: "11",
      tag: "New",
      image: ckImg(21),
    },
  ],
  gallery: [
    { image: ckImg(18), caption: "Tonkotsu at 2AM" },
    { image: ckImg(21), caption: "Seoul fire wings" },
    { image: ckImg(24), caption: "Bulgogi tacos" },
    { image: ckImg(25), caption: "The truffle smash" },
    { image: ckImg(27), caption: "Honey butter bird" },
    { image: ckImg(28), caption: "Kimchi fries, loaded" },
  ],
  contact: {
    address: "Ghost Kitchen Hub, Sector 4, Tech District",
    hours: "Everyday, 11:00 AM — 2:00 AM",
    phone: "+1 (555) 999-FAST",
    email: "hungry@dashbite.example",
  },
};

export const FALLBACK_MENU: CustomerService[] =
  demoDashBiteCustomer.services ?? [];

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

export const money = (n: number) =>
  `$${Number.isInteger(n) ? n.toString() : n.toFixed(2)}`;

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

/* -------------------------------------------------------------------------- */
/*                                SHARED ATOMS                                */
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
  direction?: "up" | "left" | "right" | "scale";
}) {
  const [ref, inView] = useInView();

  let transform = "translate-y-8";
  if (direction === "left") transform = "-translate-x-8";
  if (direction === "right") transform = "translate-x-8";
  if (direction === "scale") transform = "scale-95";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cx(
        "transition-all duration-700 ease-out will-change-transform",
        inView ? "opacity-100 transform-none" : `opacity-0 ${transform}`,
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
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.3 });

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cx("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  className,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useMotionInView(ref, {
    once: true,
    margin: "0px 0px -40px 0px",
  });
  const match = value.match(/^([\d.]+)(.*)$/);

  useEffect(() => {
    if (!inView || !match || !ref.current) return;
    const target = parseFloat(match[1]);
    const decimals = match[1].includes(".")
      ? (match[1].split(".")[1]?.length ?? 0)
      : 0;

    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v: number) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals);
      },
    });

    return () => controls.stop();
  }, [inView, match, duration]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span className={className}>
      <span ref={ref}>0</span>
      {match[2]}
    </span>
  );
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      setHovering(
        Boolean(
          target?.closest?.("a,button,input,textarea,label,[data-hover]"),
        ),
      );
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x, y, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[300] hidden md:block"
      >
        <div className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-accent,#fa4b00)]" />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[299] hidden mix-blend-difference md:block"
      >
        <motion.div
          animate={{
            scale: hovering ? 1.8 : 1,
            opacity: hovering ? 0.9 : 0.45,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
        />
      </motion.div>
    </>
  );
}

export function Noise() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[120] opacity-[0.055] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

export function Eyebrow({
  index,
  label,
  dark = true,
  className,
}: {
  index: string;
  label: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "font-mono text-[11px] font-medium uppercase tracking-[0.3em]",
        dark ? "text-ink/50" : "text-white/50",
        className,
      )}
    >
      <span className="text-[var(--brand-accent)]">{index}</span> — {label}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*                                CART SYSTEM                                 */
/* -------------------------------------------------------------------------- */

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  qty: number;
};

type Toast = { id: number; message: string };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  notify: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export const FREE_DELIVERY_OVER = 25;
export const DELIVERY_FEE = 2.99;

export function cartTotals(subtotal: number) {
  const fee =
    subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  return { fee, total: subtotal + fee };
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const toCartItem = (
  title: string,
  price: string | number | undefined,
  image?: string | null,
): Omit<CartItem, "qty"> => ({
  id: slugify(title),
  title,
  price: Number.parseFloat(String(price ?? "0")) || 0,
  image: image ?? null,
});

const STORAGE_KEY = "dashbite-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const notify = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, message }]);
    window.setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      2200,
    );
  }, []);

  const add = useCallback(
    (item: Omit<CartItem, "qty">) => {
      setItems((prev) => {
        const found = prev.find((p) => p.id === item.id);
        if (found) {
          return prev.map((p) =>
            p.id === item.id ? { ...p, qty: Math.min(p.qty + 1, 20) } : p,
          );
        }
        return [...prev, { ...item, qty: 1 }];
      });
      notify(`${item.title} added to your bag`);
    },
    [notify],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => p.id !== id)
        : prev.map((p) => (p.id === id ? { ...p, qty: Math.min(qty, 20) } : p)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    return {
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.price * i.qty, 0),
    };
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      add,
      setQty,
      remove,
      clear,
      open,
      setOpen,
      notify,
    }),
    [items, count, subtotal, add, setQty, remove, clear, open, notify],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <FloatingCartButton />

      {/* Toasts */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[210] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0b0b0c] px-5 py-3 shadow-2xl shadow-black/40 text-white"
            >
              <span className="grid size-5 place-items-center rounded-full bg-[var(--brand-accent)]">
                <Check className="size-3 text-white" strokeWidth={3} />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/90">
                {toast.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </CartContext.Provider>
  );
}

function QtyStepper({
  qty,
  onChange,
  small = false,
}: {
  qty: number;
  onChange: (qty: number) => void;
  small?: boolean;
}) {
  return (
    <div
      className={cx(
        "flex items-center rounded-full border border-white/15 bg-white/5",
        small ? "gap-1 px-1 py-1" : "gap-1.5 px-1.5 py-1.5",
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(qty - 1)}
        className={cx(
          "grid place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[var(--brand-accent)]",
          small ? "size-6" : "size-7",
        )}
      >
        <Minus className={small ? "size-3" : "size-3.5"} />
      </button>
      <span
        className={cx(
          "min-w-6 text-center font-mono font-medium tabular-nums text-white",
          small ? "text-xs" : "text-sm",
        )}
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        className={cx(
          "grid place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[var(--brand-accent)]",
          small ? "size-6" : "size-7",
        )}
      >
        <Plus className={small ? "size-3" : "size-3.5"} />
      </button>
    </div>
  );
}

function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear, subtotal, count } =
    useCart();
  const { fee, total } = cartTotals(subtotal);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-[160] flex h-dvh w-full max-w-md flex-col border-l border-white/10 bg-[#131315] text-white"
            role="dialog"
            aria-label="Your bag"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-[var(--brand-accent)]/15 text-[var(--brand-accent)]">
                  <ShoppingBag className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-black uppercase tracking-tight text-white [font-stretch:110%]">
                    Your Bag
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {count} item{count === 1 ? "" : "s"} — ready when you are
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close bag"
                className="grid size-10 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Items */}
            <div
              className="flex-1 overflow-y-auto px-6 py-6"
              data-lenis-prevent
            >
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="mb-6 grid size-20 place-items-center rounded-full border border-dashed border-white/15 text-white/30">
                    <ShoppingBag className="size-8" />
                  </span>
                  <p className="font-display text-2xl font-black uppercase tracking-tight text-white [font-stretch:110%]">
                    Bag&apos;s empty
                  </p>
                  <p className="mt-2 max-w-56 text-sm text-white/50">
                    The woks are hot and waiting. Add something delicious.
                  </p>
                  <a
                    href="#menu"
                    onClick={() => setOpen(false)}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-transform hover:scale-105 active:scale-95"
                  >
                    Browse the menu <ArrowRight className="size-4" />
                  </a>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <span className="grid h-full w-full place-items-center text-white/20">
                              <ShoppingBag className="size-6" />
                            </span>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-bold text-white">
                              {item.title}
                            </p>
                            <button
                              type="button"
                              aria-label={`Remove ${item.title}`}
                              onClick={() => remove(item.id)}
                              className="shrink-0 text-white/30 transition-colors hover:text-[var(--brand-accent)]"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <QtyStepper
                              small
                              qty={item.qty}
                              onChange={(q) => setQty(item.id, q)}
                            />
                            <span className="font-mono text-sm font-medium tabular-nums text-white">
                              {money(item.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 px-6 py-5">
                {subtotal < FREE_DELIVERY_OVER && (
                  <p className="mb-4 flex items-center gap-2 rounded-xl border border-[var(--brand-accent)]/25 bg-[var(--brand-accent)]/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--brand-accent)]">
                    <Truck className="size-4 shrink-0" />
                    Add {money(FREE_DELIVERY_OVER - subtotal)} more for free
                    delivery
                  </p>
                )}
                <dl className="space-y-2 font-mono text-xs uppercase tracking-[0.15em] text-white/50">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums text-white">
                      {money(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Delivery</dt>
                    <dd
                      className={cx(
                        "tabular-nums",
                        fee === 0 ? "text-emerald-400" : "text-white",
                      )}
                    >
                      {fee === 0 ? "Free" : money(fee)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 text-sm text-white">
                    <dt>Total</dt>
                    <dd className="tabular-nums font-medium text-[var(--brand-accent)]">
                      {money(total)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={clear}
                    className="rounded-full border border-white/15 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/40 hover:text-white"
                  >
                    Clear
                  </button>
                  <a
                    href="#order"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--brand-accent)] px-5 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white shadow-lg shadow-[var(--brand-accent)]/25 transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    Checkout <ArrowRight className="size-4" />
                  </a>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function FloatingCartButton() {
  const { count, subtotal, open, setOpen } = useCart();
  return (
    <AnimatePresence>
      {count > 0 && !open && (
        <motion.button
          key="floating-cart"
          type="button"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="group fixed bottom-5 right-5 z-[140] flex items-center gap-3 rounded-full border border-white/10 bg-[#0b0b0c] py-3 pl-4 pr-5 text-white shadow-2xl shadow-black/50 md:bottom-8 md:right-8"
          aria-label={`Open bag with ${count} items`}
        >
          <span className="relative grid size-9 place-items-center rounded-full bg-[var(--brand-accent)]">
            <ShoppingBag className="size-4 text-white" />
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full border-2 border-[#0b0b0c] bg-white font-mono text-[10px] font-bold text-[#0b0b0c]">
              {count}
            </span>
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-[0.18em] sm:block">
            Bag — <span className="text-white/60">{money(subtotal)}</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: "#how-it-works", label: "How It Works", index: "01" },
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
  const { count, setOpen: setCartOpen } = useCart();
  const brandName = text(customer.businessName, "DashBite");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-[var(--brand-accent)]"
      />
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-[80] transition-all duration-500",
          scrolled
            ? "border-b border-white/[0.06] bg-[#0b0b0c]/80 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            : "bg-transparent py-5",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <a
            href="#top"
            className="group flex items-center gap-2.5 text-white"
            aria-label={`${brandName} home`}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand-accent)] shadow-lg shadow-[var(--brand-accent)]/30 transition-transform duration-300 group-hover:rotate-12">
              <Zap className="size-5 fill-white text-white" />
            </span>
            <span className="font-display text-2xl font-black uppercase tracking-tighter [font-stretch:115%]">
              {brandName}
            </span>
          </a>
          <nav className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-white"
              >
                <span className="mr-1.5 text-[var(--brand-accent)]/70">
                  {link.index}
                </span>
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[var(--brand-accent)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open bag, ${count} items`}
              className="relative grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
            >
              <ShoppingBag className="size-[18px]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[var(--brand-accent)] font-mono text-[10px] font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <a
              href="#order"
              className="hidden items-center gap-2 rounded-full bg-[var(--brand-accent)] px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white shadow-lg shadow-[var(--brand-accent)]/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 md:inline-flex"
            >
              {text(customer.CTA?.label, "Order Now")}
            </a>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-colors hover:border-[var(--brand-accent)] md:hidden"
            >
              {open ? (
                <X className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex flex-col bg-[#0b0b0c] md:hidden"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                background:
                  "radial-gradient(60% 40% at 50% 0%, rgba(250,75,0,0.18), transparent 70%)",
              }}
            />
            <nav className="relative flex flex-1 flex-col justify-center gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    delay: 0.08 + i * 0.07,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex items-baseline gap-4 border-b border-white/[0.07] py-5"
                >
                  <span className="font-mono text-xs text-[var(--brand-accent)]">
                    {link.index}
                  </span>
                  <span className="font-display text-4xl font-black uppercase tracking-tighter text-white [font-stretch:115%] transition-colors group-hover:text-[var(--brand-accent)]">
                    {link.label}
                  </span>
                </motion.a>
              ))}
              <motion.a
                href="#order"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  delay: 0.34,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex items-baseline gap-4 py-5"
              >
                <span className="font-mono text-xs text-[var(--brand-accent)]">
                  04
                </span>
                <span className="font-display text-4xl font-black uppercase tracking-tighter text-[var(--brand-accent)] [font-stretch:115%]">
                  {text(customer.CTA?.label, "Order Now")}
                </span>
              </motion.a>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="relative space-y-2 px-8 pb-12 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40"
            >
              <p className="flex items-center gap-2">
                <Clock className="size-3.5 text-[var(--brand-accent)]" />
                {text(customer.contact?.hours, "Everyday, 11 AM — 2 AM")}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-3.5 text-[var(--brand-accent)]" />
                {text(customer.contact?.phone, "+1 (555) 999-FAST")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

function TitleWords({ title }: { title: string }) {
  const words = title.split(" ").filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.09em] -mb-[0.09em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "112%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 + i * 0.08, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export function Hero({ customer }: { customer: NewCustomer }) {
  const images =
    customer.heroImages && customer.heroImages.length > 0
      ? customer.heroImages
      : [ckImg(1), ckImg(4), ckImg(8)];
  const stats = customer.stats ?? [];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#0b0b0c] pb-14 pt-36 lg:pb-20 lg:pt-48"
    >
      <div className="absolute inset-0">
        <Image
          src={images[0]}
          alt="Cloud kitchen spread"
          fill
          className="object-cover opacity-45"
          priority
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0c] via-[#0b0b0c]/85 to-[#0b0b0c]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-transparent to-[#0b0b0c]/60" />

      <div className="pointer-events-none absolute -right-32 top-1/4 size-[34rem] rounded-full bg-[var(--brand-accent)]/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--brand-accent)]/40 bg-[var(--brand-accent)]/10 py-2 pl-3 pr-5 backdrop-blur-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--brand-accent)] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--brand-accent)]" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--brand-accent)]">
              {text(customer.hero?.eyebrow, "Live · Now delivering")}
            </span>
          </motion.div>

          <h1 className="font-display text-[15vw] font-black uppercase leading-[0.86] tracking-tighter text-white [font-stretch:118%] sm:text-7xl lg:text-[6.2rem]">
            <TitleWords
              title={text(
                customer.hero?.title,
                "CRAVE IT. CLICK IT. DEVOUR IT.",
              )}
            />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            className="mt-7 max-w-lg"
          >
            <p className="font-serif text-lg italic text-white/80">
              fired to order, never under a heat lamp.
            </p>
            <p className="mt-3 text-base leading-relaxed text-white/60 sm:text-lg">
              {text(
                customer.hero?.description,
                "Chef-crafted meals prepared in our state-of-the-art cloud kitchen and delivered lightning-fast to your door.",
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <Magnetic strength={0.25}>
              <a
                href="#menu"
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--brand-accent)] px-8 py-5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white shadow-[0_0_50px_rgba(250,75,0,0.35)] transition-all duration-300 hover:brightness-110 active:scale-95"
              >
                {text(customer.hero?.primaryCta, "Start Your Order")}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:text-white"
              >
                <Flame className="size-4 text-[var(--brand-accent)]" />
                See the kitchen
              </a>
            </Magnetic>
          </motion.div>

          {stats.length > 0 && (
            <motion.dl
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
              className="mt-14 grid max-w-xl grid-cols-2 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-4"
            >
              {stats.slice(0, 4).map((stat, i) => (
                <div
                  key={stat.label}
                  className={
                    i > 0 ? "sm:border-l sm:border-white/10 sm:pl-5" : ""
                  }
                >
                  <dt className="order-2 mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
                    {stat.label}
                  </dt>
                  <dd className="flex items-center gap-1.5 font-display text-2xl font-black tracking-tight text-white [font-stretch:112%]">
                    <CountUp value={stat.value} />
                    {/rating/i.test(stat.label) && (
                      <Star className="size-4 fill-[var(--brand-accent)] text-[var(--brand-accent)]" />
                    )}
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>
      </div>

      {images[1] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
          className="absolute right-[4%] top-1/2 z-20 hidden aspect-square w-[clamp(300px,34vw,520px)] -translate-y-1/2 lg:block"
        >
          <div className="relative h-full w-full animate-float">
            <svg
              viewBox="0 0 200 200"
              className="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] animate-spin-slower"
            >
              <defs>
                <path
                  id="dish-ring"
                  d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0"
                />
              </defs>
              <text className="fill-white/60 font-mono text-[9.5px] uppercase [letter-spacing:0.32em]">
                <textPath href="#dish-ring">
                  DashBite · Cloud Kitchen · Fired Fresh · 30 Min Delivery
                  ·{" "}
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 overflow-hidden rounded-full border-[6px] border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.6),0_0_80px_rgba(250,75,0,0.25)]">
              <Image
                src={images[1]}
                alt="Signature dish"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 34vw, 0px"
                priority
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
              className="absolute -left-6 top-10 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0b0b0c]/80 px-4 py-3 shadow-xl backdrop-blur-xl"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand-accent)]/15 text-[var(--brand-accent)]">
                <Bike className="size-5" />
              </span>
              <span>
                <span className="block font-display text-sm font-black text-white">
                  30 min
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                  avg delivery
                </span>
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.35, duration: 0.6, ease: EASE }}
              className="absolute -right-4 bottom-12 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0b0b0c]/80 px-4 py-3 shadow-xl backdrop-blur-xl"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand-accent)]/15 text-[var(--brand-accent)]">
                <Star className="size-5 fill-current" />
              </span>
              <span>
                <span className="block font-display text-sm font-black text-white">
                  4.9 / 5
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                  12k reviews
                </span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/35">
          Scroll to feast
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-4 text-[var(--brand-accent)]" />
        </motion.span>
      </motion.div>
    </section>
  );
}

export function Marquee() {
  const WORDS = [
    "Lightning Fast Delivery",
    "100% Fresh",
    "Chef Crafted",
    "Cloud Kitchen Concept",
    "Cravings Satisfied",
  ];
  return (
    <div className="relative z-30 -my-1 overflow-hidden">
      <div className="absolute inset-0 translate-y-1.5 rotate-[0.6deg] bg-[#131315]" />
      <div className="relative -rotate-[0.6deg] scale-[1.01] border-y-2 border-[#0b0b0c] bg-[var(--brand-accent)] py-4 text-white shadow-[0_20px_60px_rgba(250,75,0,0.25)]">
        <div className="flex w-max animate-marquee-fast whitespace-nowrap">
          {[0, 1].map((half) => (
            <div
              key={half}
              className="flex items-center"
              aria-hidden={half === 1}
            >
              {WORDS.map((word) => (
                <React.Fragment key={`${half}-${word}`}>
                  <span className="px-7 font-display text-sm font-black uppercase tracking-[0.25em] [font-stretch:112%]">
                    {word}
                  </span>
                  <Flame className="size-4 fill-[#0b0b0c]/25 text-[#0b0b0c]/25" />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HowItWorks({ customer }: { customer: NewCustomer }) {
  const STEPS = [
    {
      icon: Flame,
      title: "Cooked Fresh",
      desc: "Fired to order the second you tap checkout. Never batched, never reheated.",
    },
    {
      icon: Package,
      title: "Packed Tight",
      desc: "Sealed in thermal packaging engineered to lock in heat and crunch.",
    },
    {
      icon: Bike,
      title: "Delivered Fast",
      desc: "A dedicated rider fleet gets it to your door while it's still crackling.",
    },
  ];

  const VALUES = [
    { icon: Leaf, label: "Locally sourced" },
    { icon: Star, label: "Chef-led recipes" },
    { icon: Clock, label: "Open til 2AM" },
  ];

  const imgWrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgWrapRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#f7f4ee] px-6 py-24 text-[#0b0b0c] lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(11,11,12,0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div ref={imgWrapRef} className="relative">
          <Reveal direction="scale">
            <div className="relative h-[420px] overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_rgba(11,11,12,0.25)] lg:h-[620px]">
              <motion.div
                style={{ y: imgY }}
                className="absolute -inset-y-[10%] inset-x-0"
              >
                <Image
                  src={text(customer.about?.image, ckImg(12))}
                  alt="Inside the cloud kitchen"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c]/40 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-[#0b0b0c]/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white backdrop-blur-md">
                Inside the hub
              </div>
            </div>
          </Reveal>
          <Reveal direction="left" delay={250}>
            <div className="absolute -bottom-8 left-6 flex items-center gap-4 rounded-3xl border border-[#0b0b0c]/5 bg-white p-5 shadow-2xl shadow-[#0b0b0c]/15 lg:-left-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-[var(--brand-accent)] text-white shadow-lg shadow-[var(--brand-accent)]/30">
                <Clock className="size-6" />
              </span>
              <div>
                <p className="font-display text-xl font-black tracking-tight [font-stretch:112%]">
                  Wok — door in 30m
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0b0b0c]/45">
                  average, tracked live
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="pt-8 lg:pt-0">
          <Reveal direction="up">
            <Eyebrow index="01" label="The Playbook" />
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h2 className="mt-5 font-display text-4xl font-black uppercase leading-[0.9] tracking-tighter [font-stretch:118%] sm:text-5xl lg:text-6xl">
              {text(customer.about?.title, "No tables. Just incredible food.")}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={140}>
            <p className="mt-3 font-serif text-xl italic text-[var(--brand-accent)]">
              a kitchen built for delivery, not dining rooms.
            </p>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#0b0b0c]/65 lg:text-lg">
              {text(
                customer.about?.body,
                "We stripped away the dining room to focus on what matters most: the food.",
              )}
            </p>
          </Reveal>

          <ol className="mt-10 space-y-4">
            {STEPS.map((step, idx) => (
              <Reveal key={step.title} direction="left" delay={idx * 120 + 220}>
                <li className="group flex items-start gap-5 rounded-3xl border border-[#0b0b0c]/[0.06] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-accent)]/40 hover:shadow-xl hover:shadow-[var(--brand-accent)]/10 sm:p-6">
                  <div className="relative shrink-0">
                    <span className="grid size-14 place-items-center rounded-2xl bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] transition-all duration-300 group-hover:bg-[var(--brand-accent)] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[var(--brand-accent)]/30">
                      <step.icon className="size-6" />
                    </span>
                    <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[#0b0b0c] font-mono text-[9px] font-bold text-white">
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-black uppercase tracking-tight [font-stretch:112%]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#0b0b0c]/55">
                      {step.desc}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal direction="up" delay={480}>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {VALUES.map((v) => (
                <span
                  key={v.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0b0b0c]/10 bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0b0b0c]/60"
                >
                  <v.icon className="size-3.5 text-[var(--brand-accent)]" />
                  {v.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MenuCard({ item }: { item: CustomerService }) {
  const { items, add, setQty } = useCart();
  const cartItem = toCartItem(item.title, item.price, item.image);
  const inCart = items.find((i) => i.id === cartItem.id);
  const qty = inCart?.qty ?? 0;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#0b0b0c]/[0.06] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(11,11,12,0.14)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#efe9df]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            sizes="(min-width: 768px) 33vw, 90vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#0b0b0c]/15">
            <ShoppingBag className="size-10" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        {item.tag && (
          <div className="absolute left-4 top-4 rounded-full bg-[#0b0b0c]/80 px-3.5 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-md">
            {item.tag}
          </div>
        )}
      </div>
      <div className="flex flex-grow flex-col p-6">
        <h3 className="font-display text-xl font-black leading-tight tracking-tight text-[#0b0b0c] [font-stretch:112%]">
          {item.title}
        </h3>
        <p className="mb-6 mt-2 flex-grow text-sm leading-relaxed text-[#0b0b0c]/55">
          {item.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-display text-2xl font-black tracking-tight text-[var(--brand-accent)] [font-stretch:112%]">
            {money(Number.parseFloat(item.price ?? "12") || 12)}
          </span>
          {qty === 0 ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => add(cartItem)}
              aria-label={`Add ${item.title} to bag`}
              className="grid size-11 place-items-center rounded-full bg-[#0b0b0c] text-white shadow-lg shadow-[#0b0b0c]/20 transition-colors duration-300 hover:bg-[var(--brand-accent)]"
            >
              <Plus className="size-5" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 rounded-full bg-[#0b0b0c] p-1"
            >
              <button
                type="button"
                onClick={() => setQty(cartItem.id, qty - 1)}
                className="grid size-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="min-w-5 text-center font-mono text-sm font-medium text-white">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(cartItem.id, qty + 1)}
                className="grid size-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-[var(--brand-accent)]"
              >
                <Plus className="size-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppMenu({ customer }: { customer: NewCustomer }) {
  const items =
    customer.services && customer.services.length > 0
      ? customer.services
      : FALLBACK_MENU;
  const tags = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(items.map((i) => i.tag).filter((t): t is string => Boolean(t))),
      ),
    ],
    [items],
  );
  const [active, setActive] = useState("All");
  const visible =
    active === "All" ? items : items.filter((i) => i.tag === active);

  return (
    <section
      id="menu"
      className="relative bg-white px-6 py-24 text-[#0b0b0c] lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal direction="up">
              <Eyebrow index="02" label="Digital Menu" />
            </Reveal>
            <Reveal direction="up" delay={90}>
              <h2 className="mt-5 font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter [font-stretch:118%] sm:text-6xl lg:text-7xl">
                Popular{" "}
                <span className="text-[var(--brand-accent)]"> Bites</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={150}>
              <p className="mt-3 font-serif text-xl italic text-[#0b0b0c]/45">
                tap to add, we'll handle the fire.
              </p>
            </Reveal>
          </div>
          <Reveal direction="up" delay={180}>
            <a
              href="#order"
              className="group inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-[#0b0b0c]/70 transition-colors hover:text-[var(--brand-accent)]"
            >
              Skip to checkout{" "}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal direction="up" delay={120}>
          <div className="mb-10 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActive(tag)}
                className={cx(
                  "relative rounded-full border px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-300",
                  active === tag
                    ? "border-[#0b0b0c] bg-[#0b0b0c] text-white shadow-lg shadow-[#0b0b0c]/20"
                    : "border-[#0b0b0c]/10 bg-[#f7f4ee] text-[#0b0b0c]/60 hover:border-[#0b0b0c]/30 hover:text-[#0b0b0c]",
                )}
              >
                {tag}
                {active === tag && (
                  <motion.span
                    layoutId="menu-chip-dot"
                    className="absolute -right-1 -top-1 size-2.5 rounded-full bg-[var(--brand-accent)]"
                  />
                )}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((item, index) => (
              <motion.div
                layout
                key={`${item.title}-${item.tag ?? "x"}`}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <MenuCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export function ImageFeed({ customer }: { customer: NewCustomer }) {
  const gallery =
    customer.gallery && customer.gallery.length >= 4
      ? customer.gallery
      : [
          { image: ckImg(18), caption: "Tonkotsu at 2AM" },
          { image: ckImg(21), caption: "Seoul fire wings" },
          { image: ckImg(24), caption: "Bulgogi tacos" },
          { image: ckImg(25), caption: "The truffle smash" },
          { image: ckImg(28), caption: "Kimchi fries, loaded" },
        ];
  const firstHalf = gallery.filter((_, i) => i % 2 === 0);
  const secondHalf = gallery.filter((_, i) => i % 2 === 1);
  const rowA = firstHalf.length > 0 ? firstHalf : gallery;
  const rowB = secondHalf.length > 0 ? secondHalf : gallery;

  const Card = ({ item }: { item: { image: string; caption?: string } }) => (
    <figure
      data-hover
      className="group relative h-[300px] w-[240px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/[0.07] md:h-[360px] md:w-[290px]"
    >
      <Image
        src={item.image}
        alt={item.caption ?? "DashBite dish"}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
        sizes="(min-width: 768px) 33vw, 90vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c]/85 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {item.caption && (
        <figcaption className="absolute inset-x-0 bottom-0 translate-y-4 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="font-serif text-lg italic text-white">{item.caption}</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">
            fresh off the line
          </p>
        </figcaption>
      )}
    </figure>
  );

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#0b0b0c] py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-[var(--brand-accent)]/10 blur-[120px]"
      />
      <div className="relative mx-auto mb-14 max-w-7xl px-6 text-center lg:px-8">
        <Reveal direction="up">
          <Eyebrow
            index="03"
            label="The Feed"
            dark={false}
            className="inline-block"
          />
        </Reveal>
        <Reveal direction="up" delay={90}>
          <h2 className="mt-5 font-display text-4xl font-black uppercase tracking-tighter text-white [font-stretch:118%] sm:text-5xl lg:text-6xl">
            Fresh off{" "}
            <span className="font-serif font-normal italic tracking-normal text-[var(--brand-accent)]">
              the line
            </span>
          </h2>
        </Reveal>
        <Reveal direction="up" delay={160}>
          <p className="mx-auto mt-4 max-w-md font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            real plates from tonight's service — no filters, just fire
          </p>
        </Reveal>
      </div>
      <Reveal direction="scale" delay={120}>
        <div className="group/feed space-y-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee-reverse gap-5 group-hover/feed:[animation-play-state:paused]">
            {[...rowA, ...rowA, ...rowA].map((item, i) => (
              <Card key={`a-${i}`} item={item} />
            ))}
          </div>
          <div className="flex w-max animate-marquee gap-5 group-hover/feed:[animation-play-state:paused]">
            {[...rowB, ...rowB, ...rowB].map((item, i) => (
              <Card key={`b-${i}`} item={item} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function DeliveryForm({ customer }: { customer: NewCustomer }) {
  const { items, subtotal, clear } = useCart();
  const { fee, total } = cartTotals(subtotal);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [orderId, setOrderId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const orderSummary = useMemo(
    () => items.map((i) => `${i.qty}x ${i.title}`).join(", "),
    [items],
  );
  const ZONES = ["Downtown", "Midtown", "Tech District", "Riverside", "Campus"];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    // Simulate order placement
    setTimeout(() => {
      setOrderId(Math.floor(Math.random() * 10000));
      setStatus("sent");
      clear();
      event.currentTarget.reset();
    }, 1500);
  }

  const inputClass =
    "w-full rounded-2xl border border-[#0b0b0c]/10 bg-[#f7f4ee] px-5 py-4 text-sm font-medium text-[#0b0b0c] outline-none transition-all placeholder:text-[#0b0b0c]/30 focus:border-[var(--brand-accent)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-accent)]/10";
  const labelClass =
    "mb-2 ml-1 block font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[#0b0b0c]/45";
  const baseEta = 22 + Math.min(items.length * 2, 12);

  return (
    <section
      id="order"
      className="relative overflow-hidden bg-[#f7f4ee] px-6 py-24 text-[#0b0b0c] lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(11,11,12,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <Reveal direction="up">
            <Eyebrow index="04" label="Dispatch" />
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h2 className="mt-5 font-display text-5xl font-black uppercase leading-[0.88] tracking-tighter [font-stretch:118%] sm:text-6xl lg:text-7xl">
              Where
              <br />
              <span className="text-[var(--brand-accent)]">to?</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={150}>
            <p className="mt-4 font-serif text-xl italic text-[#0b0b0c]/45">
              drop a pin, we do the rest.
            </p>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <p className="mt-5 max-w-md leading-relaxed text-[#0b0b0c]/60">
              Fill in your details and our dispatch team fires your order
              instantly. Average door-to-door is under 30 minutes across all
              zones.
            </p>
          </Reveal>

          <Reveal direction="up" delay={260}>
            <div className="mt-8">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#0b0b0c]/40">
                Delivering now in
              </p>
              <div className="flex flex-wrap gap-2">
                {ZONES.map((zone) => (
                  <span
                    key={zone}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#0b0b0c]/10 bg-white px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#0b0b0c]/60"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal direction="up" delay={320}>
            <div className="mt-9 space-y-5 rounded-3xl border border-white/10 bg-[#0b0b0c] p-7 text-white shadow-2xl shadow-[#0b0b0c]/25">
              {[
                {
                  icon: MapPin,
                  label: "Kitchen Hub",
                  value: text(
                    customer.contact?.address,
                    "Sector 4, Tech District",
                  ),
                },
                {
                  icon: Clock,
                  label: "Delivery Hours",
                  value: text(
                    customer.contact?.hours,
                    "Everyday, 11 AM — 2 AM",
                  ),
                },
                {
                  icon: Phone,
                  label: "Support Line",
                  value: text(customer.contact?.phone, "+1 (555) 999-FAST"),
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--brand-accent)]/15 text-[var(--brand-accent)]">
                    <row.icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                      {row.label}
                    </p>
                    <p className="mt-0.5 text-sm font-bold">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal direction="left" delay={200}>
          <div className="relative rounded-[2.5rem] border border-[#0b0b0c]/[0.06] bg-white p-7 shadow-[0_40px_90px_rgba(11,11,12,0.12)] sm:p-10">
            <div className="absolute -top-3 left-10 rounded-full bg-[var(--brand-accent)] px-4 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.25em] text-white shadow-lg shadow-[var(--brand-accent)]/30">
              Live order
            </div>
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center py-14 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 16,
                    delay: 0.15,
                  }}
                  className="mb-6 grid size-20 place-items-center rounded-full bg-[var(--brand-accent)] text-white shadow-xl shadow-[var(--brand-accent)]/30"
                >
                  <Check className="size-10" strokeWidth={3} />
                </motion.div>
                <h3 className="font-display text-3xl font-black uppercase tracking-tighter [font-stretch:115%]">
                  Order received
                </h3>
                {orderId !== null && (
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-[#0b0b0c]/45">
                    Ticket{" "}
                    <span className="text-[var(--brand-accent)]">
                      #{String(orderId).padStart(4, "0")}
                    </span>
                  </p>
                )}
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#0b0b0c]/10 bg-[#f7f4ee] px-5 py-2.5">
                  <Bike className="size-4 text-[var(--brand-accent)]" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#0b0b0c]/70">
                    A rider is being assigned
                  </span>
                </div>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#0b0b0c]/55">
                  Keep your phone close — we'll text live updates as your food
                  moves from wok to door.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="group mt-8 inline-flex items-center gap-2 border-b-2 border-[var(--brand-accent)] pb-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--brand-accent)]"
                >
                  Place another order
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
                {items.length > 0 && (
                  <div className="rounded-2xl border border-[var(--brand-accent)]/25 bg-[var(--brand-accent)]/[0.06] p-5 sm:col-span-2">
                    <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--brand-accent)]">
                      <ReceiptText className="size-4" /> Attached to this order
                    </p>
                    <ul className="space-y-1.5">
                      {items.map((i) => (
                        <li
                          key={i.id}
                          className="flex justify-between text-sm text-[#0b0b0c]/75"
                        >
                          <span>
                            <span className="font-bold text-[#0b0b0c]">
                              {i.qty}{" "}
                            </span>{" "}
                            {i.title}
                          </span>
                          <span className="font-mono tabular-nums">
                            {money(i.price * i.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex justify-between border-t border-[var(--brand-accent)]/20 pt-3 font-mono text-xs uppercase tracking-[0.15em] text-[#0b0b0c]/60">
                      <span>
                        Total
                        {fee === 0 ? " — free delivery" : " incl. delivery"}
                      </span>
                      <span className="font-bold text-[var(--brand-accent)]">
                        {money(total)}
                      </span>
                    </div>
                  </div>
                )}
                {items.length === 0 && (
                  <a
                    href="#menu"
                    className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-[#0b0b0c]/20 bg-[#f7f4ee] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0b0b0c]/50 transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] sm:col-span-2"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="size-4" />
                      Bag is empty — build it from the menu
                    </span>
                    <ArrowRight className="size-4" />
                  </a>
                )}
                <div className="sm:col-span-2">
                  <label className={labelClass}>Delivery Address *</label>
                  <input
                    required
                    name="address"
                    placeholder="123 Main St, Apt 4B"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Name *</label>
                  <input
                    required
                    name="name"
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Order Details {items.length === 0 && "*"}
                  </label>
                  <textarea
                    key={orderSummary}
                    required={items.length === 0}
                    name="order"
                    rows={3}
                    defaultValue={orderSummary}
                    placeholder="e.g. 2x Truffle Smashburger, 1x Kimchi Fries"
                    className={cx(inputClass, "resize-none")}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Delivery Instructions</label>
                  <input
                    name="instructions"
                    placeholder="Leave at door, ring bell, extra napkins..."
                    className={inputClass}
                  />
                </div>
                {status === "error" && (
                  <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:col-span-2">
                    <TriangleAlert className="size-4 shrink-0" />
                    {errorMsg}
                  </p>
                )}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={status === "sending"}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--brand-accent)] px-6 py-5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-white shadow-lg shadow-[var(--brand-accent)]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:col-span-2"
                >
                  {status === "sending" ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Firing your order
                    </>
                  ) : (
                    <>
                      Request delivery
                      {items.length > 0 && (
                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 tabular-nums">
                          {money(total)}
                        </span>
                      )}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
                <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#0b0b0c]/35 sm:col-span-2">
                  ETA estimate {baseEta} - {baseEta + 12} min — pay by card or
                  cash on delivery
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ customer }: { customer: NewCustomer }) {
  const brandName = text(customer.businessName, "DashBite");
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-[#0b0b0c] pt-20 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-14 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand-accent)] shadow-lg shadow-[var(--brand-accent)]/30">
                <Zap className="size-5 fill-white text-white" />
              </span>
              <span className="font-display text-3xl font-black uppercase tracking-tighter [font-stretch:115%]">
                {brandName}
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              Premium cloud kitchen delivering chef-crafted meals straight to
              your door.{" "}
              <span className="font-serif italic text-white/70">
                No tables. No small talk. Just fire.
              </span>
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
                Kitchen open now
              </span>
            </div>
          </div>
          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              Navigate
            </p>
            <nav className="space-y-3">
              {[
                { href: "#how-it-works", label: "How It Works" },
                { href: "#menu", label: "Menu" },
                { href: "#gallery", label: "Gallery" },
                { href: "#order", label: "Order Now" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="group flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-white/60 transition-colors hover:text-[var(--brand-accent)]"
                >
                  <span className="h-px w-4 bg-white/20 transition-all duration-300 group-hover:w-7 group-hover:bg-[var(--brand-accent)]" />
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              Find us
            </p>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" />
                {text(customer.contact?.address, "Sector 4, Tech District")}
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" />
                {text(customer.contact?.hours, "Everyday, 11 AM — 2 AM")}
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" />
                <a
                  href={`tel:${text(customer.contact?.phone, "+1555999")}`}
                  className="transition-colors hover:text-white"
                >
                  {text(customer.contact?.phone, "+1 (555) 999-FAST")}
                </a>
              </li>
              {customer.contact?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" />
                  <a
                    href={`mailto:${customer.contact.email}`}
                    className="transition-colors hover:text-white"
                  >
                    {customer.contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 sm:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
            © {year} {brandName} — All rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
            Designed by{" "}
            <span className="text-white/60">Infycrest Solutions</span>
          </p>
          <Magnetic strength={0.35}>
            <a
              href="#top"
              aria-label="Back to top"
              className="grid size-11 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
            >
              <ArrowUp className="size-5" />
            </a>
          </Magnetic>
        </div>
      </div>
      <Reveal direction="up">
        <div
          aria-hidden
          className="pointer-events-none relative select-none overflow-hidden"
        >
          <p className="text-stroke-faint -mb-[0.23em] whitespace-nowrap text-center font-display text-[19vw] font-black uppercase leading-none tracking-tighter [font-stretch:120%]">
            {brandName}
          </p>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b0b0c] to-transparent" />
        </div>
      </Reveal>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export function PremiumCloudKitchenTemplate({
  customer = demoDashBiteCustomer,
}: {
  customer?: NewCustomer;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.length <= 1) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      const top =
        (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
      window.history.replaceState(null, "", href);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  const style = {
    "--brand-accent": text(customer.theme?.accent, "#fa4b00"),
  } as CSSProperties;

  return (
    <CartProvider>
      <main
        style={style}
        className="relative bg-[#0b0b0c] font-sans text-[#0b0b0c] selection:bg-[var(--brand-accent)] selection:text-white"
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes marquee { to { transform: translateX(-50%); } }
          @keyframes marquee-reverse { from { transform: translateX(-50%); } to { transform: translateX(0); } }
          @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-16px) rotate(1.5deg); } }
          @keyframes spin-slower { to { transform: rotate(360deg); } }
          .animate-marquee { animation: marquee 24s linear infinite; }
          .animate-marquee-fast { animation: marquee 15s linear infinite; }
          .animate-marquee-reverse { animation: marquee-reverse 38s linear infinite; }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-spin-slower { animation: spin-slower 22s linear infinite; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .text-stroke-faint { -webkit-text-stroke: 1px rgb(255 255 255 / 0.13); color: transparent; }
        `,
          }}
        />

        <Noise />
        <Cursor />

        <Navbar customer={customer} scrolled={scrolled} />
        <Hero customer={customer} />
        <Marquee />
        <HowItWorks customer={customer} />
        <AppMenu customer={customer} />
        <ImageFeed customer={customer} />
        <DeliveryForm customer={customer} />
        <Footer customer={customer} />
      </main>
    </CartProvider>
  );
}

export default PremiumCloudKitchenTemplate;
