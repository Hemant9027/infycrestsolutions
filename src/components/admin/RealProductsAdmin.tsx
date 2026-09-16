"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import type { Product } from "@/lib/products";

interface ProductDraft extends Omit<
  Product,
  "_id" | "createdAt" | "updatedAt" | "technologies" | "features"
> {
  id?: string;
  technologies: string;
  features: string;
}

const field =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-900";

const initialProduct: ProductDraft = {
  name: "",
  slug: "",
  category: "Business",
  shortDescription: "",
  description: "",
  liveUrl: "",
  projectType: "real-world",
  imageUrl: "",
  technologies: "Next.js, React, Tailwind CSS",
  features: "",
  visible: true,
  featured: false,
  testimonial: "",
  rating: 5,
  clientName: "",
  clientRole: "",
  displayOrder: 0,
};

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function RealProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<ProductDraft>(initialProduct);
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    try {
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!product.name || !product.slug || !product.liveUrl) {
      setMessage("Name, slug, and live URL are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const features = product.features
        ? String(product.features).split("\n").filter(Boolean)
        : [];
      const technologies = product.technologies
        ? String(product.technologies)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const payload = {
        name: text(product.name, 100),
        slug: text(product.slug, 80),
        category: text(product.category, 60),
        projectType: product.projectType,
        shortDescription: text(product.shortDescription, 240),
        description: text(product.description, 1200),
        liveUrl: text(product.liveUrl, 500),
        imageUrl: image || text(product.imageUrl, 4_000_000),
        features,
        technologies,
        displayOrder: product.displayOrder || 0,
        visible: product.visible ?? true,
        featured: product.featured ?? false,
        testimonial: text(product.testimonial, 500),
        rating: product.rating,
        clientName: text(product.clientName, 100),
        clientRole: text(product.clientRole, 100),
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(error.error || "Error saving product");
        return;
      }

      setMessage(
        editingId
          ? "Product updated successfully!"
          : "Product created successfully!",
      );
      setProduct(initialProduct);
      setImage("");
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      setMessage(
        "Error saving product: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMessage("Product deleted successfully!");
        await loadProducts();
      } else {
        setMessage("Error deleting product");
      }
    } catch (error) {
      setMessage("Error deleting product");
    }
  }

  function handleEditProduct(prod: Product) {
    setProduct({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      projectType: prod.projectType ?? "real-world",
      shortDescription: prod.shortDescription,
      description: prod.description,
      liveUrl: prod.liveUrl,
      imageUrl: prod.imageUrl,
      technologies: prod.technologies?.join(", ") || "",
      features: prod.features?.join("\n") || "",
      visible: prod.visible,
      featured: prod.featured,
      testimonial: prod.testimonial || "",
      rating: prod.rating ?? 5,
      clientName: prod.clientName || "",
      clientRole: prod.clientRole || "",
      displayOrder: prod.displayOrder,
      id: prod._id?.toString(),
    });
    setEditingId(prod._id?.toString() || null);
    setImage("");
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
          Real Products
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          {editingId ? "Edit product" : "Add real product"}
        </h2>
        {message && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm ${
              message.includes("successfully")
                ? "bg-green-50 text-green-900"
                : "bg-red-50 text-red-900"
            }`}
          >
            {message}
          </div>
        )}
        <form
          onSubmit={handleSaveProduct}
          className="mt-6 grid gap-3 sm:grid-cols-2"
        >
          <input
            required
            className={field}
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Product name"
          />
          <input
            required
            className={field}
            value={product.slug}
            onChange={(e) => setProduct({ ...product, slug: e.target.value })}
            placeholder="Slug (URL-friendly)"
          />
          <select
            className={field}
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          >
            <option>Business</option>
            <option>Healthcare</option>
            <option>Fitness</option>
            <option>Beauty</option>
            <option>Food</option>
            <option>Hospitality</option>
          </select>
          <select
            className={field}
            value={product.projectType}
            onChange={(e) =>
              setProduct({
                ...product,
                projectType: e.target.value as "ideal" | "real-world",
              })
            }
            aria-label="Project type"
          >
            <option value="ideal">Ideal project</option>
            <option value="real-world">Real-world project</option>
          </select>
          <input
            className={field}
            type="number"
            value={product.displayOrder}
            onChange={(e) =>
              setProduct({ ...product, displayOrder: Number(e.target.value) })
            }
            placeholder="Display order"
          />
          <input
            required
            className={`${field} sm:col-span-2`}
            value={product.liveUrl}
            onChange={(e) =>
              setProduct({ ...product, liveUrl: e.target.value })
            }
            placeholder="Live URL (https://example.com)"
          />
          <textarea
            required
            className={`${field} min-h-20 sm:col-span-2`}
            value={product.shortDescription}
            onChange={(e) =>
              setProduct({ ...product, shortDescription: e.target.value })
            }
            placeholder="Short description (one-liner)"
          />
          <textarea
            className={`${field} min-h-24 sm:col-span-2`}
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            placeholder="Full description"
          />
          <textarea
            className={`${field} min-h-20 sm:col-span-2`}
            value={product.features}
            onChange={(e) =>
              setProduct({ ...product, features: e.target.value })
            }
            placeholder="Features (one per line)"
          />
          <div className="sm:col-span-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Client review
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                className={field}
                value={product.clientName}
                onChange={(e) =>
                  setProduct({ ...product, clientName: e.target.value })
                }
                placeholder="Client name"
              />
              <input
                className={field}
                value={product.clientRole}
                onChange={(e) =>
                  setProduct({ ...product, clientRole: e.target.value })
                }
                placeholder="Client role (e.g. Founder)"
              />
              <select
                className={field}
                value={product.rating}
                onChange={(e) =>
                  setProduct({ ...product, rating: Number(e.target.value) })
                }
                aria-label="Client rating"
              >
                {[5, 4, 3, 2, 1].map((stars) => (
                  <option key={stars} value={stars}>
                    {stars} {stars === 1 ? "star" : "stars"}
                  </option>
                ))}
              </select>
              <textarea
                className={`${field} min-h-20 sm:col-span-2`}
                value={product.testimonial}
                onChange={(e) =>
                  setProduct({ ...product, testimonial: e.target.value })
                }
                placeholder="Client review (optional)"
              />
            </div>
          </div>
          <input
            className={`${field} sm:col-span-2`}
            value={product.technologies}
            onChange={(e) =>
              setProduct({ ...product, technologies: e.target.value })
            }
            placeholder="Technologies (comma-separated)"
          />
          <div className={`${field} sm:col-span-2 cursor-pointer`}>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setImage(event.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <span className="cursor-pointer text-neutral-500 hover:text-neutral-900">
                {image ? "✓ Image selected" : "Click to upload product image"}
              </span>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={product.visible}
              onChange={(e) =>
                setProduct({ ...product, visible: e.target.checked })
              }
            />
            Visible publicly
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={product.featured}
              onChange={(e) =>
                setProduct({ ...product, featured: e.target.checked })
              }
            />
            Featured
          </label>
          <button
            type="submit"
            disabled={loading}
            className="col-span-2 rounded-xl bg-neutral-900 px-6 py-3 font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
          >
            {loading
              ? editingId
                ? "Saving · · ·"
                : "Creating · · ·"
              : editingId
                ? "Update Product"
                : "Create Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setProduct(initialProduct);
                setImage("");
                setEditingId(null);
              }}
              className="col-span-2 rounded-xl border border-neutral-200 px-6 py-3 font-medium transition-colors hover:bg-neutral-50"
            >
              Cancel Editing
            </button>
          )}
        </form>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
          Manage
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          Products ({products.length})
        </h2>
        <div className="mt-6 max-h-96 space-y-3 overflow-y-auto">
          {products.length === 0 ? (
            <p className="text-sm text-neutral-500">No products yet</p>
          ) : (
            products.map((prod) => (
              <div
                key={prod._id?.toString()}
                className="flex items-center justify-between rounded-lg border border-neutral-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{prod.name}</p>
                  <p className="text-xs text-neutral-500">{prod.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(prod)}
                    className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100"
                    title="Edit"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteProduct(prod._id?.toString() || "")
                    }
                    className="rounded-lg p-2 text-neutral-600 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
