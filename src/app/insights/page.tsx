import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin/auth";
import { getDemoContextFromHostname, getHostnameFromRequest } from "@/lib/analytics-host";
import DemoInsightsDashboard from "@/components/DemoInsightsDashboard";

export default async function DemoInsightsPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin");

  const headerList = await headers();
  const site = getDemoContextFromHostname(getHostnameFromRequest(headerList));
  if (site.siteType !== "demo") redirect("/admin");

  return <DemoInsightsDashboard hostname={site.hostname} displayName={site.displayName} demoId={site.demoId} />;
}
