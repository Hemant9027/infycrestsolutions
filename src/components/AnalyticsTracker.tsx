"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ANALYTICS_EVENTS,
  type AnalyticsEventName,
} from "@/lib/analytics-events";

const CONSENT_KEY = "infycrest_cookie_consent";
const SESSION_KEY = "infycrest_analytics_session";

function allowed() {
  try {
    return (
      JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null")?.analytics ===
      true
    );
  } catch {
    return false;
  }
}

function sessionId() {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const value = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, value);
  return value;
}

function browserDetails() {
  const agent = navigator.userAgent;
  const device = /tablet|ipad/i.test(agent)
    ? "Tablet"
    : /mobile|android/i.test(agent)
      ? "Mobile"
      : "Desktop";
  const browser = /edg/i.test(agent)
    ? "Edge"
    : /firefox/i.test(agent)
      ? "Firefox"
      : /chrome|crios/i.test(agent)
        ? "Chrome"
        : /safari/i.test(agent)
          ? "Safari"
          : "Other";
  const os = /windows/i.test(agent)
    ? "Windows"
    : /android/i.test(agent)
      ? "Android"
      : /iphone|ipad|ios/i.test(agent)
        ? "iOS"
        : /mac os/i.test(agent)
          ? "macOS"
          : /linux/i.test(agent)
            ? "Linux"
            : "Other";
  return { device, browser, os };
}

export function trackEvent(
  eventName: AnalyticsEventName,
  metadata: Record<string, string> = {},
) {
  if (typeof window === "undefined" || !allowed()) return;
  const url = new URL(window.location.href);
  const payload = JSON.stringify({
    anonymousSessionId: sessionId(),
    eventName,
    pagePath: window.location.pathname,
    referrer: document.referrer,
    utmSource: url.searchParams.get("utm_source") ?? "",
    utmMedium: url.searchParams.get("utm_medium") ?? "",
    utmCampaign: url.searchParams.get("utm_campaign") ?? "",
    utmTerm: url.searchParams.get("utm_term") ?? "",
    utmContent: url.searchParams.get("utm_content") ?? "",
    ...browserDetails(),
    metadata,
  });
  if (navigator.sendBeacon)
    navigator.sendBeacon(
      "/api/analytics/event",
      new Blob([payload], { type: "application/json" }),
    );
  else
    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const pageView = () => {
      if (allowed()) trackEvent(ANALYTICS_EVENTS.PAGE_VIEW);
    };
    pageView();
    if (pathname.startsWith("/blog")) trackEvent(ANALYTICS_EVENTS.BLOG_VIEW);
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me") || href.includes("whatsapp"))
        trackEvent(ANALYTICS_EVENTS.WHATSAPP_CLICK);
      else if (href.startsWith("mailto:"))
        trackEvent(ANALYTICS_EVENTS.EMAIL_CLICK);
      else if (href.startsWith("tel:"))
        trackEvent(ANALYTICS_EVENTS.PHONE_CLICK);
      else if (href.startsWith("http"))
        trackEvent(ANALYTICS_EVENTS.EXTERNAL_LINK_CLICK, {
          host: new URL(href).hostname,
        });
      else if (/start.?a.?project/i.test(link.textContent ?? ""))
        trackEvent(ANALYTICS_EVENTS.START_PROJECT_CLICK);
    };
    document.addEventListener("click", onClick);
    window.addEventListener("infycrest:consent-updated", pageView);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("infycrest:consent-updated", pageView);
    };
  }, [pathname]);

  return null;
}
