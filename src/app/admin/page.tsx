"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Download,
  LogOut,
  Pencil,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import {
  PUBLISH_TEMPLATE_OPTIONS,
  type PublishTemplateKey,
} from "@/lib/product-template-types";
import { RealProductsAdmin } from "@/components/admin/RealProductsAdmin";
import InsightsPanel from "@/components/admin/InsightsPanel";
import BlogAdmin from "@/components/admin/BlogAdmin";
import JobsAdmin from "@/components/admin/JobsAdmin";

type Project = {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  thumbnail: string;
  previewUrl: string;
  priceLabel: string;
  technologies: string[];
  includes: string[];
};
type ProductTemplate = {
  id: string;
  name: string;
  slug: string;
  category: string;
  businessType: string;
  shortDescription: string;
  description: string;
  features: string[];
  thumbnail: string;
  tags: string[];
  technologies: string[];
  price?: string;
  visible: boolean;
  featured: boolean;
  hasLivePreview: boolean;
  previewUrl: string;
  templateKey: string;
  displayOrder: number;
  ctaText: string;
};
type Customer = {
  id: string;
  businessName: string;
  slug: string;
  category: string;
  templateKey: PublishTemplateKey | "villa" | "restaurant";
  status: string;
  createdAt: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
  };
  hero?: { image?: string };
  about?: { image?: string };
  gallery?: Array<{ image: string; alt: string }>;
};
type Request = {
  id: string;
  name: string;
  contact: string;
  businessType?: string;
  requirements?: string;
  demoName: string;
  status: string;
  notes?: string;
  leadSource?: string;
  templateName?: string;
  templateSlug?: string;
  templateCategory?: string;
  createdAt: string;
};
type Plan = {
  name: string;
  price: string;
  description: string;
  cta: string;
  inverted?: boolean;
};
type Tab =
  | "overview"
  | "insights"
  | "blog"
  | "requests"
  | "projects"
  | "products"
  | "customers"
  | "jobs"
  | "pricing"
  | "settings"
  | "profile";
const field =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-900";
const initialProject = {
  name: "",
  slug: "",
  category: "Business",
  tagline: "",
  description: "",
  previewUrl: "",
  priceLabel: "Custom quote",
  technologies: "Next.js, React, Tailwind CSS",
  includes: "Responsive design\nContact flow",
};
type CustomerDraft = {
  businessName: string;
  slug: string;
  category: string;
  templateKey: PublishTemplateKey;
  status: "draft" | "published";
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactHours: string;
  heroImage: string;
  aboutImage: string;
  galleryImages: string[];
};
const initialCustomer: CustomerDraft = {
  businessName: "",
  slug: "",
  category: "Hotel & Homestays",
  templateKey: "island-villa",
  status: "published",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  contactHours: "",
  heroImage: "",
  aboutImage: "",
  galleryImages: [],
};
const initialProduct = {
  name: "",
  slug: "",
  category: "Healthcare & Wellness",
  businessType: "",
  shortDescription: "",
  description: "",
  features: "",
  thumbnail: "",
  tags: "",
  technologies: "Next.js, React, Tailwind CSS",
  price: "",
  visible: true,
  featured: false,
  hasLivePreview: false,
  previewUrl: "",
  templateKey: "",
  displayOrder: 99,
  ctaText: "Let's Build This",
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [login, setLogin] = useState({ username: "admin", password: "" });
  const [tab, setTab] = useState<Tab>("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<ProductTemplate[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [counts, setCounts] = useState({
    projects: 0,
    requests: 0,
    unread: 0,
    subscribers: 0,
  });
  const [project, setProject] = useState(initialProject);
  const [image, setImage] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [customer, setCustomer] = useState(initialCustomer);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null,
  );
  const [product, setProduct] = useState(initialProduct);
  const [productImage, setProductImage] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  async function load() {
    const auth = await fetch("/api/admin/me");
    if (!auth.ok) {
      setLoggedIn(false);
      return;
    }
    setLoggedIn(true);
    const results = await Promise.all(
      [
        "overview",
        "projects",
        "product-templates",
        "requests",
        "pricing",
        "settings",
        "new-customers",
      ].map((name) =>
        fetch(`/api/admin/${name}`).then((response) => response.json()),
      ),
    );
    setCounts(results[0].counts);
    setProjects(results[1]);
    setProducts(results[2]);
    setRequests(results[3]);
    setPlans(results[4]);
    setSettings(results[5]);
    setCustomers(results[6]);
  }
  useEffect(() => {
    void load();
  }, []);
  async function signIn(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });
    if (!response.ok) {
      setMessage("Invalid username or password.");
      return;
    }
    setMessage("");
    await load();
  }
  function readImage(file?: File) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setMessage("Image must be smaller than 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }
  function readCustomerImage(
    file: File | undefined,
    fieldName: "heroImage" | "aboutImage" | "galleryImages",
  ) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setMessage("Customer images must be smaller than 3 MB each.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result);
      setCustomer((current) =>
        fieldName === "galleryImages"
          ? {
              ...current,
              galleryImages: [...current.galleryImages, value].slice(0, 8),
            }
          : { ...current, [fieldName]: value },
      );
    };
    reader.readAsDataURL(file);
  }
  async function saveProject(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...project,
        image,
        technologies: project.technologies.split(","),
        includes: project.includes.split("\n"),
      }),
    });
    const data = await response.json();
    setMessage(
      response.ok
        ? "Project published."
        : (data.error ?? "Could not save project."),
    );
    if (response.ok) {
      setProject(initialProject);
      setImage("");
      await load();
    }
  }
  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(
      editingProductId
        ? `/api/admin/product-templates/${editingProductId}`
        : "/api/admin/product-templates",
      {
        method: editingProductId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          thumbnail: productImage || product.thumbnail,
          features: product.features.split("\n"),
          tags: product.tags.split(","),
          technologies: product.technologies.split(","),
          gallery: [productImage || product.thumbnail],
        }),
      },
    );
    const data = await response.json();
    setMessage(
      response.ok
        ? "Product template saved."
        : (data.error ?? "Could not save product template."),
    );
    if (response.ok) {
      setProduct(initialProduct);
      setProductImage("");
      setEditingProductId(null);
      const refreshed = await fetch("/api/admin/product-templates");
      if (refreshed.ok) setProducts(await refreshed.json());
    }
  }
  async function saveCustomer(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(
      editingCustomerId
        ? `/api/admin/new-customers/${editingCustomerId}`
        : "/api/admin/new-customers",
      {
        method: editingCustomerId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      },
    );
    const data = await response.json();
    setMessage(
      response.ok
        ? editingCustomerId
          ? "Customer website updated."
          : `Published /preview/${customer.slug}.`
        : data.error || "Could not publish customer.",
    );
    if (response.ok) {
      setCustomer(initialCustomer);
      setEditingCustomerId(null);
      const refreshed = await fetch("/api/admin/new-customers");
      if (refreshed.ok) setCustomers(await refreshed.json());
    }
  }
  async function deleteCustomer(id: string) {
    if (!window.confirm("Delete this customer website?")) return;
    const response = await fetch(`/api/admin/new-customers/${id}`, {
      method: "DELETE",
    });
    setMessage(
      response.ok
        ? "Customer website deleted."
        : "Could not delete customer website.",
    );
    if (response.ok) {
      const refreshed = await fetch("/api/admin/new-customers");
      if (refreshed.ok) setCustomers(await refreshed.json());
    }
  }
  async function deleteProject(id: string) {
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    await load();
  }
  async function deleteProduct(id: string) {
    await fetch(`/api/admin/product-templates/${id}`, { method: "DELETE" });
    const refreshed = await fetch("/api/admin/product-templates");
    if (refreshed.ok) setProducts(await refreshed.json());
  }
  async function toggleProduct(id: string, values: Partial<ProductTemplate>) {
    await fetch(`/api/admin/product-templates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const refreshed = await fetch("/api/admin/product-templates");
    if (refreshed.ok) setProducts(await refreshed.json());
  }
  async function updateRequest(item: Request) {
    await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    await load();
  }
  async function savePlans() {
    const response = await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plans),
    });
    setMessage(response.ok ? "Pricing saved." : "Could not save pricing.");
  }
  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setMessage("Site settings saved.");
  }
  async function updatePassword(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await response.json();
    setMessage(
      response.ok
        ? "Password updated."
        : (data.error ?? "Could not update password."),
    );
    if (response.ok) setLoggedIn(false);
  }
  function exportRequests() {
    const csv = [
      "Name,Contact,Business,Project,Status,Created",
      ...requests.map((item) =>
        [
          item.name,
          item.contact,
          item.businessType ?? "",
          item.demoName,
          item.status,
          item.createdAt,
        ]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "infycrest-enquiries.csv";
    link.click();
  }

  if (loggedIn === null)
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-50">
        Loading...
      </main>
    );
  if (!loggedIn)
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-50 px-5">
        <form
          onSubmit={signIn}
          className="w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-8"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            InfyCrest / Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Sign in
          </h1>
          <div className="mt-7 space-y-3">
            <input
              className={field}
              value={login.username}
              onChange={(event) =>
                setLogin({ ...login, username: event.target.value })
              }
              placeholder="Username"
            />
            <input
              className={field}
              type="password"
              value={login.password}
              onChange={(event) =>
                setLogin({ ...login, password: event.target.value })
              }
              placeholder="Password"
            />
          </div>
          <button className="mt-5 h-12 w-full rounded-full bg-neutral-900 text-sm font-semibold text-white">
            Sign in
          </button>
          {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
        </form>
      </main>
    );

  const nav: [Tab, string][] = [
    ["overview", "Overview"],
    ["insights", "Insights"],
    ["blog", "Blog"],
    ["requests", "Enquiries"],
    ["products", "Products"],
    ["customers", "Customers"],
    ["jobs", "Jobs"],
    ["settings", "Site settings"],
    ["profile", "Admin profile"],
  ];
  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-6 text-neutral-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between border-b border-neutral-200 pb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              InfyCrest / Admin workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Manage your website
            </h1>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              setLoggedIn(false);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 text-sm font-semibold"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </header>
        <nav className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {nav.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${tab === key ? "bg-neutral-900 text-white" : "border border-neutral-200 bg-white text-neutral-600"}`}
            >
              {label}
            </button>
          ))}
        </nav>
        {message && (
          <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </p>
        )}
        {tab === "insights" && <InsightsPanel />}
        {tab === "blog" && <BlogAdmin />}
        {tab === "jobs" && <JobsAdmin />}
        {tab === "overview" && (
          <section className="mt-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Projects", counts.projects],
                ["Total enquiries", counts.requests],
                ["New / unread", counts.unread],
                ["Subscribers", counts.subscribers],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-3xl border border-neutral-200 bg-white p-6"
                >
                  <p className="text-sm text-neutral-500">{label}</p>
                  <p className="mt-3 text-4xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Recent enquiries</h2>
              <div className="mt-4 divide-y divide-neutral-100">
                {requests.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between py-4">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-neutral-500">
                        {item.demoName} · {item.contact}
                      </p>
                    </div>
                    <span className="h-fit rounded-full bg-neutral-100 px-3 py-1 text-xs">
                      {item.status}
                    </span>
                  </div>
                ))}
                {!requests.length && (
                  <p className="py-4 text-sm text-neutral-500">
                    No enquiries mirrored yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
        {tab === "requests" && (
          <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                  Lead management
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  Contact and project requests
                </h2>
              </div>
              <button
                onClick={exportRequests}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 px-4 text-sm font-semibold"
              >
                <Download className="size-4" />
                Export CSV
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {requests.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-neutral-200 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        {item.contact} ·{" "}
                        {item.businessType || "Business type not supplied"}
                      </p>
                      <p className="mt-2 text-sm">
                        {item.requirements || "No requirements provided."}
                      </p>
                      <p className="mt-2 text-xs text-neutral-400">
                        {item.demoName}
                      </p>
                      {item.leadSource === "template" && item.templateName && (
                        <p className="mt-2 text-xs font-semibold text-neutral-700">
                          Template page · {item.templateName}
                          {item.templateCategory
                            ? ` · ${item.templateCategory}`
                            : ""}
                        </p>
                      )}
                    </div>
                    <select
                      value={item.status}
                      onChange={(event) =>
                        updateRequest({ ...item, status: event.target.value })
                      }
                      className="h-10 rounded-xl border border-neutral-200 px-3 text-sm"
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>In Progress</option>
                      <option>Converted</option>
                      <option>Closed</option>
                    </select>
                  </div>
                  <textarea
                    defaultValue={item.notes}
                    onBlur={(event) =>
                      updateRequest({ ...item, notes: event.target.value })
                    }
                    placeholder="Internal notes"
                    className={`${field} mt-4 min-h-16`}
                  />
                </article>
              ))}
              {!requests.length && (
                <p className="text-sm text-neutral-500">
                  No enquiries available yet.
                </p>
              )}
            </div>
          </section>
        )}
        {tab === "projects" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                Collection
              </p>
              <h2 className="mt-2 text-xl font-semibold">Upload project</h2>
              <form
                onSubmit={saveProject}
                className="mt-6 grid gap-3 sm:grid-cols-2"
              >
                {(
                  [
                    ["name", "Project name"],
                    ["slug", "Slug"],
                    ["category", "Category"],
                    ["priceLabel", "Price label"],
                    ["tagline", "Short tagline"],
                    ["previewUrl", "Preview URL"],
                  ] as const
                ).map(([key, placeholder]) => (
                  <input
                    key={key}
                    required={key !== "previewUrl"}
                    className={`${field} ${key === "tagline" || key === "previewUrl" ? "sm:col-span-2" : ""}`}
                    value={project[key]}
                    onChange={(event) =>
                      setProject({ ...project, [key]: event.target.value })
                    }
                    placeholder={placeholder}
                  />
                ))}
                <textarea
                  required
                  className={`${field} min-h-24 sm:col-span-2`}
                  value={project.description}
                  onChange={(event) =>
                    setProject({ ...project, description: event.target.value })
                  }
                  placeholder="Description"
                />
                <input
                  className={`${field} sm:col-span-2`}
                  value={project.technologies}
                  onChange={(event) =>
                    setProject({ ...project, technologies: event.target.value })
                  }
                  placeholder="Technologies, comma separated"
                />
                <textarea
                  className={`${field} min-h-20 sm:col-span-2`}
                  value={project.includes}
                  onChange={(event) =>
                    setProject({ ...project, includes: event.target.value })
                  }
                  placeholder="Features, one per line"
                />
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-500 sm:col-span-2">
                  <Upload className="size-4" />
                  {image ? "Image selected" : "Upload preview image (max 3 MB)"}
                  <input
                    required
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(event) => readImage(event.target.files?.[0])}
                    className="sr-only"
                  />
                </label>
                <button className="h-12 rounded-full bg-neutral-900 text-sm font-semibold text-white sm:col-span-2">
                  Publish project
                </button>
              </form>
            </section>
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                Published projects
              </p>
              <div className="mt-5 space-y-3">
                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3"
                  >
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="size-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {item.category}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteProject(item.id)}
                      aria-label={`Delete ${item.name}`}
                      className="grid size-9 place-items-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        {tab === "products" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                Website templates
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                Add product template
              </h2>
              <form
                onSubmit={saveProduct}
                className="mt-6 grid gap-3 sm:grid-cols-2"
              >
                {(
                  [
                    "name",
                    "slug",
                    "businessType",
                    "templateKey",
                    "price",
                    "previewUrl",
                    "ctaText",
                    "displayOrder",
                  ] as const
                ).map((key) => (
                  <input
                    key={key}
                    required={
                      key === "name" || key === "slug" || key === "businessType"
                    }
                    className={`${field} ${key === "previewUrl" ? "sm:col-span-2" : ""}`}
                    value={String(product[key])}
                    onChange={(event) =>
                      setProduct({
                        ...product,
                        [key]:
                          key === "displayOrder"
                            ? Number(event.target.value)
                            : event.target.value,
                      })
                    }
                    placeholder={
                      key === "displayOrder"
                        ? "Display order"
                        : key.replace(/([A-Z])/g, " $1")
                    }
                  />
                ))}
                <select
                  className={field}
                  value={product.category}
                  onChange={(event) =>
                    setProduct({ ...product, category: event.target.value })
                  }
                >
                  <option>Healthcare &amp; Wellness</option>
                  <option>Food &amp; Beverage</option>
                  <option>Business &amp; Tech</option>
                  <option>Fitness &amp; Creative</option>
                  <option>Real Estate &amp; Hospitality</option>
                </select>
                <input
                  className={field}
                  value={product.tags}
                  onChange={(event) =>
                    setProduct({ ...product, tags: event.target.value })
                  }
                  placeholder="Tags, comma separated"
                />
                <textarea
                  required
                  className={`${field} min-h-20 sm:col-span-2`}
                  value={product.shortDescription}
                  onChange={(event) =>
                    setProduct({
                      ...product,
                      shortDescription: event.target.value,
                    })
                  }
                  placeholder="Short description"
                />
                <textarea
                  className={`${field} min-h-24 sm:col-span-2`}
                  value={product.description}
                  onChange={(event) =>
                    setProduct({ ...product, description: event.target.value })
                  }
                  placeholder="Full description"
                />
                <textarea
                  className={`${field} min-h-20 sm:col-span-2`}
                  value={product.features}
                  onChange={(event) =>
                    setProduct({ ...product, features: event.target.value })
                  }
                  placeholder="Features, one per line"
                />
                <input
                  className={`${field} sm:col-span-2`}
                  value={product.technologies}
                  onChange={(event) =>
                    setProduct({ ...product, technologies: event.target.value })
                  }
                  placeholder="Technologies, comma separated"
                />
                <input
                  required
                  className={`${field} sm:col-span-2`}
                  value={productImage}
                  onChange={(event) => setProductImage(event.target.value)}
                  placeholder="Thumbnail URL, e.g. /dental-clinic/1.jpg"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={product.visible}
                    onChange={(event) =>
                      setProduct({ ...product, visible: event.target.checked })
                    }
                  />{" "}
                  Visible publicly
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={product.featured}
                    onChange={(event) =>
                      setProduct({ ...product, featured: event.target.checked })
                    }
                  />{" "}
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={product.hasLivePreview}
                    onChange={(event) =>
                      setProduct({
                        ...product,
                        hasLivePreview: event.target.checked,
                      })
                    }
                  />{" "}
                  Live preview available
                </label>
                <button className="h-12 rounded-full bg-neutral-900 text-sm font-semibold text-white sm:col-span-2">
                  Save product template
                </button>
              </form>
            </section>
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                Independent catalog
              </p>
              <div className="mt-5 space-y-3">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3"
                  >
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="size-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {item.category} · {item.visible ? "Visible" : "Hidden"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        toggleProduct(item.id, { visible: !item.visible })
                      }
                      className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold"
                    >
                      {item.visible ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProductId(item.id);
                        setProduct({
                          name: item.name,
                          slug: item.slug,
                          category: item.category,
                          businessType: item.businessType,
                          shortDescription: item.shortDescription,
                          description: item.description,
                          features: item.features.join("\n"),
                          thumbnail: item.thumbnail,
                          tags: item.tags.join(", "),
                          technologies: item.technologies.join(", "),
                          price: item.price ?? "",
                          visible: item.visible,
                          featured: item.featured,
                          hasLivePreview: item.hasLivePreview,
                          previewUrl: item.previewUrl,
                          templateKey: item.templateKey,
                          displayOrder: item.displayOrder,
                          ctaText: item.ctaText,
                        });
                        setProductImage(item.thumbnail);
                      }}
                      className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(item.id)}
                      aria-label={`Delete ${item.name}`}
                      className="grid size-9 place-items-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        {tab === "products" && <RealProductsAdmin />}
        {tab === "customers" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                Customer preview
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {editingCustomerId
                  ? "Edit customer website"
                  : "Publish a customer website"}
              </h2>
              <form onSubmit={saveCustomer} className="mt-6 space-y-3">
                <input
                  required
                  className={field}
                  value={customer.businessName}
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      businessName: event.target.value,
                    })
                  }
                  placeholder="Business name"
                />
                <input
                  required
                  className={field}
                  value={customer.slug}
                  onChange={(event) =>
                    setCustomer({ ...customer, slug: event.target.value })
                  }
                  placeholder="Slug, e.g. nova-dental"
                />
                <select
                  className={field}
                  value={customer.category}
                  onChange={(event) => {
                    const category = event.target.value;
                    const firstTemplate = PUBLISH_TEMPLATE_OPTIONS.find(
                      (item) => item.category === category,
                    );
                    setCustomer({
                      ...customer,
                      category,
                      templateKey: firstTemplate?.key ?? customer.templateKey,
                    });
                  }}
                >
                  <option>Hotel &amp; Homestays</option>
                  <option>Food &amp; Beverage</option>
                  <option>Healthcare &amp; Wellness</option>
                  <option>Business &amp; Tech</option>
                  <option>Fitness &amp; Creative</option>
                  <option>Real Estate &amp; Hospitality</option>
                </select>
                <select
                  className={field}
                  value={customer.templateKey}
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      templateKey: event.target.value as PublishTemplateKey,
                      category:
                        PUBLISH_TEMPLATE_OPTIONS.find(
                          (item) => item.key === event.target.value,
                        )?.category ?? customer.category,
                    })
                  }
                >
                  {PUBLISH_TEMPLATE_OPTIONS.filter(
                    (item) => item.category === customer.category,
                  ).map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label} · {item.businessType}
                    </option>
                  ))}
                </select>
                <select
                  className={field}
                  value={customer.status}
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      status: event.target.value as "draft" | "published",
                    })
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft / hidden</option>
                </select>
                <div className="mt-6 border-t border-neutral-100 pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                    Contact details
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input
                      className={field}
                      value={customer.contactEmail}
                      onChange={(event) =>
                        setCustomer({
                          ...customer,
                          contactEmail: event.target.value,
                        })
                      }
                      placeholder="Email"
                      type="email"
                    />
                    <input
                      className={field}
                      value={customer.contactPhone}
                      onChange={(event) =>
                        setCustomer({
                          ...customer,
                          contactPhone: event.target.value,
                        })
                      }
                      placeholder="Phone / WhatsApp"
                    />
                    <input
                      className={field}
                      value={customer.contactAddress}
                      onChange={(event) =>
                        setCustomer({
                          ...customer,
                          contactAddress: event.target.value,
                        })
                      }
                      placeholder="Address"
                    />
                    <input
                      className={field}
                      value={customer.contactHours}
                      onChange={(event) =>
                        setCustomer({
                          ...customer,
                          contactHours: event.target.value,
                        })
                      }
                      placeholder="Opening hours"
                    />
                  </div>
                </div>
                <div className="border-t border-neutral-100 pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                    Customer images
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <label className="cursor-pointer rounded-xl border border-dashed border-neutral-300 p-3 text-center text-xs text-neutral-500 hover:border-neutral-900">
                      Hero image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(event) =>
                          readCustomerImage(
                            event.target.files?.[0],
                            "heroImage",
                          )
                        }
                      />
                    </label>
                    <label className="cursor-pointer rounded-xl border border-dashed border-neutral-300 p-3 text-center text-xs text-neutral-500 hover:border-neutral-900">
                      About image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(event) =>
                          readCustomerImage(
                            event.target.files?.[0],
                            "aboutImage",
                          )
                        }
                      />
                    </label>
                    <label className="cursor-pointer rounded-xl border border-dashed border-neutral-300 p-3 text-center text-xs text-neutral-500 hover:border-neutral-900">
                      Gallery image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(event) =>
                          readCustomerImage(
                            event.target.files?.[0],
                            "galleryImages",
                          )
                        }
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-neutral-400">
                    Up to 3 MB each. Gallery uploads can be added one at a time.
                  </p>
                  {(customer.heroImage ||
                    customer.aboutImage ||
                    customer.galleryImages.length > 0) && (
                    <p className="mt-2 text-xs text-emerald-600">
                      Images ready:{" "}
                      {Number(Boolean(customer.heroImage)) +
                        Number(Boolean(customer.aboutImage)) +
                        customer.galleryImages.length}
                    </p>
                  )}
                </div>
                <button className="h-12 w-full rounded-full bg-neutral-900 text-sm font-semibold text-white">
                  {editingCustomerId ? "Save changes" : "Publish customer"}
                </button>
                {editingCustomerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomer(initialCustomer);
                      setEditingCustomerId(null);
                    }}
                    className="h-10 w-full text-sm text-neutral-500"
                  >
                    Cancel editing
                  </button>
                )}
              </form>
            </section>
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                    Customer websites
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Published customers
                  </h2>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                  {customers.length} total
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {customers.map((item) => {
                  const template = PUBLISH_TEMPLATE_OPTIONS.find(
                    (option) => option.key === item.templateKey,
                  );
                  const isPublished = item.status !== "draft";
                  return (
                    <div
                      key={item.id}
                      className="grid gap-4 rounded-2xl border border-neutral-200 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50/70 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-neutral-900">
                            {item.businessName}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                          >
                            {isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-neutral-500">
                          /preview/{item.slug}
                        </p>
                        <p className="mt-2 text-xs text-neutral-400">
                          {template?.label ?? item.templateKey} ·{" "}
                          {item.category}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        {isPublished && (
                          <a
                            href={`/preview/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                          >
                            Preview <ArrowUpRight className="size-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCustomerId(item.id);
                            setCustomer({
                              businessName: item.businessName,
                              slug: item.slug,
                              category: item.category,
                              templateKey:
                                item.templateKey as PublishTemplateKey,
                              status:
                                item.status === "draft" ? "draft" : "published",
                              contactEmail: item.contact?.email ?? "",
                              contactPhone: item.contact?.phone ?? "",
                              contactAddress: item.contact?.address ?? "",
                              contactHours: item.contact?.hours ?? "",
                              heroImage: item.hero?.image ?? "",
                              aboutImage: item.about?.image ?? "",
                              galleryImages:
                                item.gallery?.map((image) => image.image) ?? [],
                            });
                          }}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                        >
                          <Pencil className="size-3.5" /> Edit
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCustomer(item.id)}
                        aria-label={`Delete ${item.businessName}`}
                        className="grid size-9 place-self-start rounded-full text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 sm:place-self-center"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  );
                })}
                {!customers.length && (
                  <p className="text-sm text-neutral-500">
                    No new customers published yet.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
        {tab === "pricing" && (
          <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pricing plans</h2>
              <button
                onClick={savePlans}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-900 px-4 text-sm font-semibold text-white"
              >
                <Save className="size-4" />
                Save
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200 p-4"
                >
                  <input
                    className={field}
                    value={plan.name}
                    onChange={(event) =>
                      setPlans(
                        plans.map((item, i) =>
                          i === index
                            ? { ...item, name: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Plan name"
                  />
                  <input
                    className={`${field} mt-3`}
                    value={plan.price}
                    onChange={(event) =>
                      setPlans(
                        plans.map((item, i) =>
                          i === index
                            ? { ...item, price: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Price"
                  />
                  <textarea
                    className={`${field} mt-3 min-h-20`}
                    value={plan.description}
                    onChange={(event) =>
                      setPlans(
                        plans.map((item, i) =>
                          i === index
                            ? { ...item, description: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Description"
                  />
                  <input
                    className={`${field} mt-3`}
                    value={plan.cta}
                    onChange={(event) =>
                      setPlans(
                        plans.map((item, i) =>
                          i === index
                            ? { ...item, cta: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="CTA label"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
        {tab === "settings" && (
          <form
            onSubmit={saveSettings}
            className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold">Site settings</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(settings).map(([key, value]) => (
                <label
                  key={key}
                  className="text-sm font-semibold text-neutral-700"
                >
                  {key}
                  <input
                    className={`${field} mt-1.5 font-normal`}
                    value={value}
                    onChange={(event) =>
                      setSettings({ ...settings, [key]: event.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <button className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white">
              <Save className="size-4" />
              Save settings
            </button>
          </form>
        )}
        {tab === "profile" && (
          <form
            onSubmit={updatePassword}
            className="mt-8 max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold">Admin profile</h2>
            <p className="mt-3 text-sm text-neutral-500">
              Passwords are hashed before storage.
            </p>
            <div className="mt-6 space-y-3">
              <input
                required
                type="password"
                className={field}
                value={profile.currentPassword}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    currentPassword: event.target.value,
                  })
                }
                placeholder="Current password"
              />
              <input
                required
                minLength={8}
                type="password"
                className={field}
                value={profile.newPassword}
                onChange={(event) =>
                  setProfile({ ...profile, newPassword: event.target.value })
                }
                placeholder="New password, 8+ characters"
              />
            </div>
            <button className="mt-5 h-11 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white">
              Update password
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
