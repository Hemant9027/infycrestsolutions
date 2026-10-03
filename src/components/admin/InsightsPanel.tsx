"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Globe2,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
  Users,
} from "lucide-react";

type Insights = {
  hasData: boolean;
  lastUpdated: string;
  kpis: {
    visitors: number;
    newVisitors: number;
    sessions: number;
    pageViews: number;
    engagedSessions: number;
    leads: number;
    conversionRate: number;
  };
  sources: Array<{ _id: string; visitors: number; sessions: number }>;
  pages: Array<{ _id: string; views: number; visitors: number }>;
  devices: Array<{ _id: string; visitors: number }>;
  countries: Array<{ _id: string; visitors: number }>;
  campaigns: Array<{
    _id: { campaign: string; source: string; medium: string };
    visitors: number;
  }>;
  timeline: Array<{ _id: string; value: number }>;
  live: Array<{
    anonymousId: string;
    country: string;
    device: string;
    source: string;
    currentPage: string;
    lastActiveAt: string;
    pageCount: number;
  }>;
  recent: Array<{
    eventName: string;
    pagePath: string;
    timestamp: string;
    source: string;
  }>;
  searchConsole: { connected: boolean; message: string };
};

const number = new Intl.NumberFormat("en-IN");
const eventLabel: Record<string, string> = {
  page_view: "viewed",
  whatsapp_click: "clicked WhatsApp",
  email_click: "clicked email",
  phone_click: "clicked phone",
  contact_form_submit: "submitted a contact form",
  start_project_click: "started a project enquiry",
  session_start: "started a session",
};

function Empty({ children = "No data available yet" }: { children?: string }) {
  return (
    <p className="py-10 text-center text-sm text-neutral-500">{children}</p>
  );
}

function Panel({
  title,
  source,
  children,
}: {
  title: string;
  source?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {source && (
            <p className="mt-1 text-xs text-neutral-400">Source: {source}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function InsightsPanel() {
  const [period, setPeriod] = useState("today");
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  async function refresh() {
    setLoading(true);
    const response = await fetch(`/api/admin/analytics?period=${period}`, {
      cache: "no-store",
    });
    if (response.ok) setData(await response.json());
    setLoading(false);
  }
  useEffect(() => {
    let active = true;
    fetch(`/api/admin/analytics?period=${period}`, { cache: "no-store" })
      .then(async (response) => {
        if (active && response.ok) setData(await response.json());
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [period]);

  if (loading && !data)
    return (
      <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-12 text-center text-sm text-neutral-500">
        Loading insights...
      </div>
    );
  if (!data)
    return (
      <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-12 text-center text-sm text-neutral-500">
        Analytics provider is temporarily unavailable.
      </div>
    );
  const maxTimeline = Math.max(...data.timeline.map((item) => item.value), 1);
  const maxSource = Math.max(...data.sources.map((item) => item.visitors), 1);
  const topSource = data.sources[0]?._id;
  const topPage = data.pages[0]?._id;
  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
            Website Insights
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            What should I know today?
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Real website events and anonymous sessions only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Date range"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="h-10 rounded-full border border-neutral-200 bg-white px-4 text-sm"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button
            type="button"
            title="Refresh insights"
            onClick={() => void refresh()}
            className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {[
          ["Visitors", data.kpis.visitors],
          ["New visitors", data.kpis.newVisitors],
          ["Sessions", data.kpis.sessions],
          ["Page views", data.kpis.pageViews],
          ["Engaged sessions", data.kpis.engagedSessions],
          ["Leads", data.kpis.leads],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-neutral-200 bg-white p-4"
          >
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">
              {number.format(value as number)}
            </p>
            <p className="mt-1 text-[11px] text-neutral-400">
              Website Analytics
            </p>
          </div>
        ))}
      </div>
      {!data.hasData ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <Activity className="mx-auto size-8 text-neutral-300" />
          <h3 className="mt-4 text-lg font-semibold">
            Your analytics journey starts here.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
            Once visitors accept analytics cookies and interact with your
            website, traffic, acquisition, engagement and conversion insights
            will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <Panel title="Visitors over time" source="Website Analytics">
              <div className="mt-6 flex h-48 items-end gap-1 border-b border-l border-neutral-100 px-2">
                {data.timeline.map((item) => (
                  <div
                    key={item._id}
                    title={`${item._id}: ${item.value}`}
                    className="group flex h-full flex-1 items-end"
                  >
                    <div
                      className="w-full rounded-t bg-neutral-900 transition-all group-hover:bg-emerald-500"
                      style={{
                        height: `${Math.max((item.value / maxTimeline) * 100, 3)}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-neutral-400">
                <span>{data.timeline[0]?._id}</span>
                <span>{data.timeline.at(-1)?._id}</span>
              </div>
            </Panel>
            <Panel
              title="Today's insights"
              source="Calculated from collected events"
            >
              <div className="mt-5 space-y-4 text-sm text-neutral-600">
                {topSource && (
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Acquisition:
                    </span>{" "}
                    {topSource} is the leading source with{" "}
                    {number.format(data.sources[0].visitors)} visitor
                    {data.sources[0].visitors === 1 ? "" : "s"}.
                  </p>
                )}
                {topPage && (
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Content:
                    </span>{" "}
                    {topPage} is the most visited page.
                  </p>
                )}
                {data.kpis.leads > 0 && (
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Conversion:
                    </span>{" "}
                    {number.format(data.kpis.leads)} conversion event
                    {data.kpis.leads === 1 ? "" : "s"} recorded at{" "}
                    {data.kpis.conversionRate}% of sessions.
                  </p>
                )}
                {!topSource && !topPage && (
                  <p>
                    Not enough traffic data to generate meaningful insights yet.
                  </p>
                )}
              </div>
            </Panel>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel
              title="Where are visitors coming from?"
              source="Website Analytics"
            >
              {data.sources.length ? (
                <div className="mt-5 space-y-3">
                  {data.sources.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="w-28 truncate text-neutral-600">
                        {item._id}
                      </span>
                      <div className="h-2 flex-1 rounded-full bg-neutral-100">
                        <div
                          className="h-2 rounded-full bg-neutral-900"
                          style={{
                            width: `${(item.visitors / maxSource) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-12 text-right font-medium">
                        {number.format(item.visitors)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty />
              )}
            </Panel>
            <Panel title="Popular pages" source="Website Analytics">
              {data.pages.length ? (
                <div className="mt-4 divide-y divide-neutral-100">
                  {data.pages.slice(0, 8).map((item) => (
                    <a
                      key={item._id}
                      href={item._id}
                      className="flex items-center justify-between py-3 text-sm hover:text-emerald-600"
                    >
                      <span className="truncate">{item._id}</span>
                      <span className="ml-3 shrink-0 text-neutral-500">
                        {number.format(item.views)} views
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <Empty />
              )}
            </Panel>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Devices" source="Website Analytics">
              {data.devices.length ? (
                data.devices.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b border-neutral-100 py-3 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {item._id === "Mobile" ? (
                        <Smartphone className="size-4" />
                      ) : item._id === "Tablet" ? (
                        <Tablet className="size-4" />
                      ) : (
                        <Monitor className="size-4" />
                      )}
                      {item._id}
                    </span>
                    <b>{number.format(item.visitors)}</b>
                  </div>
                ))
              ) : (
                <Empty />
              )}
            </Panel>
            <Panel
              title="Visitors by location"
              source="Approximate provider data"
            >
              {data.countries.length ? (
                data.countries.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b border-neutral-100 py-3 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Globe2 className="size-4 text-neutral-400" />
                      {item._id}
                    </span>
                    <b>{number.format(item.visitors)}</b>
                  </div>
                ))
              ) : (
                <Empty />
              )}
            </Panel>
            <Panel title="Conversions" source="InfyCrest Events">
              <div className="mt-4 text-center">
                <p className="text-4xl font-semibold">
                  {number.format(data.kpis.leads)}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  conversion events
                </p>
                <p className="mt-5 text-sm text-neutral-600">
                  Conversion rate{" "}
                  <b className="text-neutral-900">
                    {data.kpis.conversionRate}%
                  </b>
                </p>
              </div>
            </Panel>
          </div>
          <Panel title="Campaign performance" source="UTM attribution">
            <div className="overflow-x-auto">
              {data.campaigns.length ? (
                <table className="mt-4 w-full min-w-[520px] text-left text-sm">
                  <thead className="text-xs text-neutral-400">
                    <tr>
                      <th className="pb-3 font-medium">Campaign</th>
                      <th className="pb-3 font-medium">Source</th>
                      <th className="pb-3 font-medium">Medium</th>
                      <th className="pb-3 text-right font-medium">Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.campaigns.map((item) => (
                      <tr
                        key={`${item._id.campaign}-${item._id.source}`}
                        className="border-t border-neutral-100"
                      >
                        <td className="py-3">{item._id.campaign}</td>
                        <td>{item._id.source}</td>
                        <td>{item._id.medium || "Unknown"}</td>
                        <td className="text-right font-medium">
                          {number.format(item.visitors)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Empty />
              )}
            </div>
          </Panel>
        </>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Live visitors" source="Active within the last 5 minutes">
          {data.live.length ? (
            data.live.map((item) => (
              <div
                key={item.anonymousId}
                className="flex items-center justify-between border-b border-neutral-100 py-3 text-sm"
              >
                <span>
                  <span className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />
                  {item.anonymousId}{" "}
                  <span className="text-neutral-400">
                    on {item.currentPage}
                  </span>
                </span>
                <span className="text-xs text-neutral-500">
                  {item.device} · {item.country}
                </span>
              </div>
            ))
          ) : (
            <Empty>No active visitors right now</Empty>
          )}
        </Panel>
        <Panel title="Recent activity" source="InfyCrest Events">
          {data.recent.length ? (
            data.recent.slice(0, 8).map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="flex items-center gap-3 border-b border-neutral-100 py-3 text-sm"
              >
                <span className="text-xs text-neutral-400">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>
                  Visitor {eventLabel[item.eventName] ?? item.eventName}{" "}
                  <span className="text-neutral-400">{item.pagePath}</span>
                </span>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </Panel>
      </div>
      <Panel title="Search performance" source="Google Search Console">
        <div className="flex items-center gap-3 py-4 text-sm text-neutral-500">
          <Users className="size-5 text-neutral-400" />
          {data.searchConsole.message} Search queries are never inferred from
          browser referrers.
        </div>
      </Panel>
      <p className="text-right text-xs text-neutral-400">
        Last updated {new Date(data.lastUpdated).toLocaleTimeString()}
      </p>
    </div>
  );
}
