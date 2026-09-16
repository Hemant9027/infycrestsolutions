"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Job = {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  status: "open" | "closed";
};

const emptyJob: Omit<Job, "id"> = {
  title: "",
  type: "Full-time",
  location: "Remote",
  description: "",
  status: "open",
};

export default function JobsAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [draft, setDraft] = useState<Omit<Job, "id">>(emptyJob);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadJobs() {
    const response = await fetch("/api/admin/jobs");
    if (!response.ok) return;
    const data = await response.json();
    setJobs(data);
  }

  useEffect(() => {
    void loadJobs();
  }, []);

  async function saveJob() {
    const payload = {
      ...draft,
      id: editingId ?? undefined,
    };

    const response = await fetch("/api/admin/jobs", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setMessage(
      response.ok
        ? editingId
          ? "Job updated."
          : "Job added."
        : (data.error ?? "Could not save job."),
    );

    if (response.ok) {
      setDraft(emptyJob);
      setEditingId(null);
      await loadJobs();
    }
  }

  async function removeJob(id: string) {
    if (!window.confirm("Delete this job?")) return;

    const response = await fetch(
      `/api/admin/jobs?id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );

    setMessage(response.ok ? "Job deleted." : "Could not delete job.");
    if (response.ok) await loadJobs();
  }

  function editJob(job: Job) {
    setEditingId(job.id);
    setDraft({
      title: job.title,
      type: job.type,
      location: job.location,
      description: job.description,
      status: job.status,
    });
  }

  return (
    <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
          Jobs management
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          {editingId ? "Edit job" : "Add a new job"}
        </h2>

        <div className="mt-6 space-y-3">
          <input
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Job title"
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={draft.type}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  type: event.target.value,
                }))
              }
              placeholder="Type"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
            />
            <input
              value={draft.location}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              placeholder="Location"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
            />
          </div>
          <textarea
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Job description"
            className="min-h-40 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
          />
          <select
            value={draft.status}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                status: event.target.value as "open" | "closed",
              }))
            }
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => void saveJob()}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus className="size-4" />
            {editingId ? "Update job" : "Save job"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setDraft(emptyJob);
              }}
              className="rounded-full border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700"
            >
              Cancel
            </button>
          )}
        </div>

        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
          Posted jobs
        </p>
        <div className="mt-6 space-y-3">
          {jobs.length === 0 && (
            <p className="text-sm text-neutral-500">No jobs added yet.</p>
          )}

          {jobs.map((job) => (
            <article
              key={job.id}
              className="rounded-2xl border border-neutral-200 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {job.type} · {job.location}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${
                    job.status === "open"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-neutral-600">
                {job.description}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => editJob(job)}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => void removeJob(job.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
