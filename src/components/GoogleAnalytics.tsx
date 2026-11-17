"use client";

import { useEffect } from "react";

const CONSENT_KEY = "infycrest_cookie_consent";
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function hasAnalyticsConsent() {
  try {
    return (
      JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null")?.analytics ===
      true
    );
  } catch {
    return false;
  }
}

function loadGoogleAnalytics() {
  if (!measurementId || !hasAnalyticsConsent() || document.querySelector(`script[src*="${measurementId}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
}

export default function GoogleAnalytics() {
  useEffect(() => {
    loadGoogleAnalytics();
    window.addEventListener("infycrest:consent-updated", loadGoogleAnalytics);
    return () =>
      window.removeEventListener(
        "infycrest:consent-updated",
        loadGoogleAnalytics,
      );
  }, []);

  return null;
}

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}
