"use client";

import { useEffect, useState } from "react";
import { Check, Cookie, Settings2 } from "lucide-react";
import Modal from "@/components/Modal";

const CONSENT_KEY = "infycrest_cookie_consent";
const CONSENT_VERSION = 1;

type Preferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = Preferences & { version: number; savedAt: string };

const DEFAULT_PREFERENCES: Preferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

function readConsent(): StoredConsent | null {
  try {
    const value = JSON.parse(
      localStorage.getItem(CONSENT_KEY) ?? "null",
    ) as Partial<StoredConsent> | null;
    return value?.version === CONSENT_VERSION && value.necessary === true
      ? {
          version: CONSENT_VERSION,
          necessary: true,
          functional: value.functional === true,
          analytics: value.analytics === true,
          marketing: value.marketing === true,
          savedAt:
            typeof value.savedAt === "string"
              ? value.savedAt
              : new Date().toISOString(),
        }
      : null;
  } catch {
    localStorage.removeItem(CONSENT_KEY);
    return null;
  }
}

function saveConsent(preferences: Preferences) {
  const consent: StoredConsent = {
    ...preferences,
    version: CONSENT_VERSION,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

function Toggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${label} cookies ${enabled ? "on" : "off"}`}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${enabled ? "border-neutral-900 bg-neutral-900" : "border-neutral-300 bg-neutral-100"}`}
    >
      <span
        className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}

export default function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const openSettings = () => setModalOpen(true);
    window.addEventListener("infycrest:open-cookie-settings", openSettings);
    const stored = readConsent();
    if (stored) setPreferences(stored);
    else setBannerVisible(true);
    setReady(true);
    return () =>
      window.removeEventListener(
        "infycrest:open-cookie-settings",
        openSettings,
      );
  }, []);

  function commit(next: Preferences) {
    saveConsent(next);
    window.dispatchEvent(new CustomEvent("infycrest:consent-updated"));
    setPreferences(next);
    setBannerVisible(false);
    setModalOpen(false);
  }

  if (!ready) return null;

  return (
    <>
      {bannerVisible && (
        <aside
          className="fixed inset-x-3 bottom-3 z-[100] animate-fade-up sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-[520px]"
          aria-label="Cookie consent"
        >
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-neutral-900 text-white">
                <Cookie className="size-4" />
              </span>
              <div>
                <h2 className="text-[15px] font-semibold text-neutral-900">
                  We value your privacy
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
                  We use cookies to improve your browsing experience, understand
                  how our website is used, and provide a better experience. You
                  can manage your cookie preferences at any time.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() =>
                  commit({
                    necessary: true,
                    functional: true,
                    analytics: true,
                    marketing: true,
                  })
                }
                className="h-10 rounded-full bg-neutral-900 px-3 text-[12px] font-semibold text-white transition-colors hover:bg-black"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => commit(DEFAULT_PREFERENCES)}
                className="h-10 rounded-full border border-neutral-200 px-3 text-[12px] font-semibold text-neutral-700 transition-colors hover:border-neutral-900"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="h-10 rounded-full border border-neutral-200 px-3 text-[12px] font-semibold text-neutral-700 transition-colors hover:border-neutral-900"
              >
                <Settings2 className="mr-1 inline size-3.5" />
                Manage Preferences
              </button>
            </div>
          </div>
        </aside>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        labelledBy="cookie-preferences-title"
        maxWidth="max-w-2xl"
      >
        <div className="p-6 sm:p-8">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-neutral-400">
            Privacy controls
          </p>
          <h2
            id="cookie-preferences-title"
            className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900"
          >
            Cookie Preferences
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            You can choose which types of cookies you allow. Necessary cookies
            are required for the website to function properly and cannot be
            disabled.
          </p>
          <div className="mt-7 divide-y divide-neutral-100 border-y border-neutral-100">
            <div className="flex items-start justify-between gap-5 py-5">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">
                  Necessary Cookies
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
                  Required for essential website functionality, security,
                  sessions, and basic preferences.
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <Check className="size-3.5" />
                Always Active
              </span>
            </div>
            {(
              [
                [
                  "functional",
                  "Functional Cookies",
                  "Used to remember preferences and improve functionality.",
                ],
                [
                  "analytics",
                  "Analytics Cookies",
                  "Used to understand how visitors interact with the website and improve website performance.",
                ],
                [
                  "marketing",
                  "Marketing Cookies",
                  "Used for advertising, marketing, or tracking purposes.",
                ],
              ] as const
            ).map(([key, title, description]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-5 py-5"
              >
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {title}
                  </h3>
                  <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-neutral-500">
                    {description}
                  </p>
                </div>
                <Toggle
                  label={title}
                  enabled={preferences[key]}
                  onChange={() =>
                    setPreferences((current) => ({
                      ...current,
                      [key]: !current[key],
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="/cookie-policy"
              className="text-xs font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
            >
              Learn more about our Cookie Policy
            </a>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  commit({
                    necessary: true,
                    functional: true,
                    analytics: true,
                    marketing: true,
                  })
                }
                className="h-11 rounded-full border border-neutral-200 px-5 text-sm font-semibold text-neutral-700 hover:border-neutral-900"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => commit(preferences)}
                className="h-11 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-black"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
