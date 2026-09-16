"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Phone,
} from "lucide-react";
import type { Demo } from "@/data/demos";
import {
  CUSTOMIZATION_OPTIONS,
  SITE,
  whatsappUrl,
  type CustomizationId,
} from "@/config/site";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/components/AnalyticsTracker";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

const BUSINESS_TYPES = [
  "Healthcare",
  "Fitness & Sports",
  "Beauty & Wellness",
  "Food & Beverage",
  "Hospitality",
  "Retail & Commerce",
  "Professional Services",
  "Other",
];

interface ProjectRequestModalProps {
  demo: Demo;
  open: boolean;
  templateMode?: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900";

export default function ProjectRequestModal({
  demo,
  open,
  templateMode = false,
  onClose,
}: ProjectRequestModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [requirements, setRequirements] = useState("");
  const [customization, setCustomization] = useState<CustomizationId>("as-is");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState("");
  const [finalMessage, setFinalMessage] = useState("");

  // Fresh form every time the flow opens
  useEffect(() => {
    if (open) {
      setName("");
      setContact("");
      setBusinessType("");
      setRequirements(
        templateMode
          ? `I would like to customize the ${demo.name} template for my business. I would like to discuss customization, pricing and the features I need.`
          : "",
      );
      setCustomization("as-is");
      setStatus("idle");
      setError("");
      setFinalMessage("");
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !contact.trim()) {
      setError("Please add your name and an email or WhatsApp number.");
      return;
    }

    const option = CUSTOMIZATION_OPTIONS.find((o) => o.id === customization);
    const lines = [
      `Hi InfyCrest Solutions, I'm interested in the ${demo.name} website. I would like ${option?.message ?? "customization"}.`,
      ``,
      `Name: ${name.trim()}`,
      `Contact: ${contact.trim()}`,
    ];
    if (businessType) lines.push(`Business type: ${businessType}`);
    if (requirements.trim()) lines.push(`Requirements: ${requirements.trim()}`);
    const message = lines.join("\n");

    setStatus("submitting");

    // Persist the request; WhatsApp handoff happens regardless.
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          businessType,
          requirements: requirements.trim(),
          demoSlug: demo.slug,
          demoName: demo.name,
          customization: option?.label ?? customization,
          leadSource: templateMode ? "template" : "website",
          templateName: templateMode ? demo.name : "",
          templateSlug: templateMode ? demo.slug : "",
          templateCategory: templateMode ? demo.category : "",
        }),
      });
      if (response.ok) {
        trackEvent(
          templateMode
            ? ANALYTICS_EVENTS.TEMPLATE_INQUIRY_SUBMIT
            : ANALYTICS_EVENTS.CONTACT_FORM_SUBMIT,
          {
            demoSlug: demo.slug,
            ...(templateMode
              ? { templateName: demo.name, category: demo.category }
              : {}),
          },
        );
      }
    } catch {
      // Non-blocking — the WhatsApp message is the primary channel.
    }

    setFinalMessage(message);
    setStatus("done");
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="request-title"
      maxWidth="max-w-xl"
    >
      {status === "done" ? (
        <div className="px-6 py-14 text-center sm:px-12">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-neutral-900 text-white">
            <CheckCircle2 className="size-6" strokeWidth={2.2} />
          </span>
          <h3
            id="request-title"
            className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900"
          >
            You&apos;re one step away.
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
            We&apos;ve opened WhatsApp with your {demo.name} request pre-filled.
            Just press send and we&apos;ll take it from there.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl(finalMessage || undefined)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Open WhatsApp
              <ArrowUpRight className="size-4" strokeWidth={2.4} />
            </a>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-900"
            >
              <Phone className="size-4" strokeWidth={2.2} />
              {SITE.phoneDisplay}
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-900"
          >
            Back to browsing
          </button>
        </div>
      ) : (
        <div className="px-5 py-7 sm:px-8 sm:py-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            Start your build
          </p>
          <h3
            id="request-title"
            className="mt-2 pr-10 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-[1.7rem]"
          >
            {templateMode
              ? "Let's Customize This Template"
              : "Request this website"}
          </h3>

          {/* Selected website */}
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3.5">
            <div className="relative h-14 w-[4.6rem] shrink-0 overflow-hidden rounded-xl border border-neutral-200">
              {demo.thumbnail ? (
                <Image
                  src={demo.thumbnail}
                  alt=""
                  fill
                  sizes="74px"
                  className="object-cover object-top"
                />
              ) : (
                <div
                  className="h-full w-full bg-neutral-200"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                {templateMode
                  ? "Template you are interested in"
                  : "Selected website"}
              </p>
              <p className="mt-0.5 truncate text-[15px] font-semibold tracking-tight text-neutral-900">
                {demo.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-neutral-500">
                {demo.category}
              </p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold text-white">
              {demo.priceLabel}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Customization
              </legend>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
                {CUSTOMIZATION_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-3 text-[13px] font-medium transition-all",
                      customization === option.id
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-400",
                    )}
                  >
                    <input
                      type="radio"
                      name="customization"
                      value={option.id}
                      checked={customization === option.id}
                      onChange={() => setCustomization(option.id)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="request-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
                >
                  Name *
                </label>
                <input
                  id="request-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="request-contact"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
                >
                  Email / WhatsApp *
                </label>
                <input
                  id="request-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="you@email.com or +91…"
                  autoComplete="email"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="request-business"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
              >
                Business type
              </label>
              <select
                id="request-business"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className={cn(inputClass, !businessType && "text-neutral-400")}
              >
                <option value="">Select your business type</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="request-requirements"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
              >
                Requirements
              </label>
              <textarea
                id="request-requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Pages, features, content you already have, timelines — anything that helps."
                rows={3}
                className={cn(inputClass, "resize-none")}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-4 text-[15px] font-medium text-white transition-all hover:bg-black disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="size-4 animate-spin" strokeWidth={2.4} />
                  Preparing your request…
                </>
              ) : (
                <>
                  Request This Website
                  <ArrowRight className="size-4" strokeWidth={2.4} />
                </>
              )}
            </button>
            <p className="text-center text-xs text-neutral-400">
              We&apos;ll continue the conversation on WhatsApp — no spam, ever.
            </p>
          </form>
        </div>
      )}
    </Modal>
  );
}
