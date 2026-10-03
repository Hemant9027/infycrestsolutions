"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Globe2, Monitor, RefreshCw, Smartphone, Tablet, Users } from "lucide-react";

const number = new Intl.NumberFormat("en-IN");
const periodOptions = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
];

const eventLabel: Record<string, string> = {
  book_now_click: "Book Now",
  whatsapp_click: "WhatsApp",
  email_click: "Email",
  contact_form_submit: "Contact Form",
  external_booking_click: "External Booking",
  page_view: "Page View",
};

function Empty({ children = "No data available yet" }: { children?: string }) {
  return <p className="py-10 text-center text-sm text-neutral-500">{children}</p>;
}

export default function DemoInsightsDashboard({
  hostname,
  demoId,
  displayName,
}: {
  hostname: string;
  demoId: string | null;
  displayName: string;
}) {
  const [period, setPeriod] = useState("7d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const response = await fetch(`/api/analytics/insights?period=${period}`, { cache: "no-store" });
    if (response.ok) setData(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, [period]);

  const maxSource = useMemo(() => Math.max(...((data?.sources ?? []).map((item: any) => item.visitors ?? 0) || [0]), 1), [data]);
  const maxPage = useMemo(() => Math.max(...((data?.pages ?? []).map((item: any) => item.views ?? 0) || [0]), 1), [data]);
  const maxTimeline = useMemo(() => Math.max(...((data?.timeline ?? []).map((item: any) => item.value ?? 0) || [0]), 1), [data]);

  if (loading && !data) {
    return <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-12 text-center text-sm text-neutral-500">Loading insights...</div>;
  }

  if (!data) {
    return <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-12 text-center text-sm text-neutral-500">Analytics is temporarily unavailable.</div>;
  }

  const totalConversions = (data.highIntent ?? []).reduce((sum: number, item: any) => sum + (item.total ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-8 text-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">{demoId ? demoId.toUpperCase() : "DEMO"}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{displayName}</h1>
            <p className="mt-2 text-sm text-neutral-500">{hostname} · Website Insights</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              aria-label="Date range"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-10 rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-700"
            >
              {periodOptions.map((option) => (
                <option value={option.value} key={option.value}>{option.label}</option>
              ))}
            </select>
            <button type="button" onClick={() => void refresh()} className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white">
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {[
            ["Visitors", data.kpis.visitors],
            ["New Visitors", data.kpis.newVisitors],
            ["Sessions", data.kpis.sessions],
            ["Page Views", data.kpis.pageViews],
            ["Engaged Sessions", data.kpis.engagedSessions],
            ["Conversions", totalConversions],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{number.format(Number(value ?? 0))}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <BarChart3 className="size-4 text-neutral-500" />
              <h2 className="text-lg font-semibold">Traffic overview</h2>
            </div>
            <div className="flex h-52 items-end gap-1 border-b border-l border-neutral-100 px-2">
              {(data.timeline ?? []).map((item: any) => (
                <div key={String(item._id)} className="flex h-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-neutral-900 transition-all"
                    style={{ height: `${Math.max((item.value / maxTimeline) * 100, 6)}%` }}
                    title={`${item._id}: ${item.value}`}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Users className="size-4 text-neutral-500" />
              <h2 className="text-lg font-semibold">Traffic sources</h2>
            </div>
            <div className="space-y-3">
              {(data.sources ?? []).length ? (
                (data.sources ?? []).map((item: any) => (
                  <div key={String(item._id)} className="flex items-center gap-3 text-sm">
                    <span className="w-28 truncate text-neutral-600">{item._id}</span>
                    <div className="h-2 flex-1 rounded-full bg-neutral-100">
                      <div className="h-2 rounded-full bg-neutral-900" style={{ width: `${(item.visitors / maxSource) * 100}%` }} />
                    </div>
                    <span className="w-12 text-right font-medium">{number.format(item.visitors)}</span>
                  </div>
                ))
              ) : (
                <Empty />
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Activity className="size-4 text-neutral-500" />
              <h2 className="text-lg font-semibold">Top pages</h2>
            </div>
            <div className="space-y-3">
              {(data.pages ?? []).length ? (
                (data.pages ?? []).slice(0, 8).map((item: any) => (
                  <div key={String(item._id)} className="flex items-center justify-between gap-3 border-b border-neutral-100 py-3 text-sm last:border-b-0">
                    <span className="truncate text-neutral-700">{item._id}</span>
                    <span className="shrink-0 text-neutral-500">{number.format(item.views)} views</span>
                  </div>
                ))
              ) : (
                <Empty />
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Monitor className="size-4 text-neutral-500" />
              <h2 className="text-lg font-semibold">Devices</h2>
            </div>
            <div className="space-y-3">
              {(data.devices ?? []).length ? (
                (data.devices ?? []).map((item: any) => (
                  <div key={String(item._id)} className="flex items-center justify-between border-b border-neutral-100 py-3 text-sm last:border-b-0">
                    <span className="flex items-center gap-2">
                      {item._id === "Mobile" ? <Smartphone className="size-4" /> : item._id === "Tablet" ? <Tablet className="size-4" /> : <Monitor className="size-4" />}
                      {item._id}
                    </span>
                    <b>{number.format(item.visitors)}</b>
                  </div>
                ))
              ) : (
                <Empty />
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Globe2 className="size-4 text-neutral-500" />
              <h2 className="text-lg font-semibold">High-Intent Activity</h2>
            </div>
            <div className="space-y-3">
              {(data.highIntent ?? []).length ? (
                (data.highIntent ?? []).map((item: any) => (
                  <div key={String(item._id)} className="flex items-center justify-between border-b border-neutral-100 py-3 text-sm last:border-b-0">
                    <span>{eventLabel[item._id] ?? item._id}</span>
                    <b>{number.format(item.total)}</b>
                  </div>
                ))
              ) : (
                <Empty />
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Activity className="size-4 text-neutral-500" />
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {(data.recent ?? []).length ? (
                (data.recent ?? []).slice(0, 8).map((item: any, index: number) => (
                  <div key={`${item.timestamp}-${index}`} className="flex items-center justify-between gap-3 border-b border-neutral-100 py-3 text-sm last:border-b-0">
                    <span className="text-neutral-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="text-right text-neutral-700">{eventLabel[item.eventName] ?? item.eventName} on {item.pagePath}</span>
                  </div>
                ))
              ) : (
                <Empty />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
