export type SiteScope = {
  hostname: string;
  demoId: string | null;
  siteType: "main" | "demo";
  displayName: string;
};

const MAIN_HOSTS = new Set(["infycrestsolutions.com", "www.infycrestsolutions.com"]);

export function normalizeHostname(value: string | null | undefined) {
  if (!value) return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/^www\./, "");
}

export function formatDemoNameFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getDemoContextFromHostname(hostname: string | null | undefined): SiteScope {
  const normalized = normalizeHostname(hostname);
  if (!normalized) {
    return { hostname: "localhost", demoId: null, siteType: "main", displayName: "InfyCrest" };
  }

  if (MAIN_HOSTS.has(normalized)) {
    return { hostname: normalized, demoId: null, siteType: "main", displayName: "InfyCrest Solutions" };
  }

  const isDemo = normalized.endsWith(".infycrestsolutions.com") && normalized !== "infycrestsolutions.com";
  if (!isDemo) {
    return { hostname: normalized, demoId: null, siteType: "main", displayName: "InfyCrest Solutions" };
  }

  const demoId = normalized.split(".")[0];
  return {
    hostname: normalized,
    demoId,
    siteType: "demo",
    displayName: formatDemoNameFromSlug(demoId),
  };
}

export function getHostnameFromRequest(
  headersOrValue?: Headers | { get: (key: string) => string | null } | string | null,
) {
  if (!headersOrValue) return "";
  if (typeof headersOrValue === "string") return normalizeHostname(headersOrValue);
  const host =
    headersOrValue.get("x-forwarded-host") ??
    headersOrValue.get("host") ??
    headersOrValue.get("x-forwarded-server") ??
    "";
  return normalizeHostname(host);
}
