"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function isInternalNavigation(anchor: HTMLAnchorElement) {
  if (anchor.target === "_blank" || anchor.hasAttribute("download"))
    return false;
  const href = anchor.getAttribute("href");
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  )
    return false;
  try {
    const url = new URL(href, window.location.href);
    return (
      url.origin === window.location.origin &&
      url.pathname !== window.location.pathname
    );
  } catch {
    return false;
  }
}

export default function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const start = () => {
      if (finishTimer.current) clearTimeout(finishTimer.current);
      setActive(true);
    };
    const finish = () => {
      finishTimer.current = setTimeout(() => setActive(false), 140);
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const target =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (target instanceof HTMLAnchorElement && isInternalNavigation(target))
        start();
    };
    const onPopState = start;

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setActive(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      className={`navigation-progress ${active ? "navigation-progress--active" : ""}`}
      role="progressbar"
      aria-label="Loading next page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={active ? "Loading next page" : "Page loaded"}
    />
  );
}
