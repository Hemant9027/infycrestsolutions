import { mongoDb } from "@/lib/mongodb";
import type { Filter, ObjectId } from "mongodb";
import { unstable_cache } from "next/cache";

export type ProductProjectType = "ideal" | "real-world";

export interface Product {
  _id?: ObjectId;
  id?: string;
  name: string;
  slug: string;
  category: string;
  projectType?: ProductProjectType;
  description: string;
  shortDescription: string;
  imageUrl: string;
  liveUrl: string;
  technologies: string[];
  features: string[];
  visible: boolean;
  featured: boolean;
  testimonial?: string;
  rating?: number;
  clientName?: string;
  clientRole?: string;
  clientLabel?: string;
  clientImage?: string;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const products = () => mongoDb.collection<Product>("products");

const getCachedProducts = unstable_cache(
  async (projectType?: ProductProjectType) => {
  const collection = products();
  const filter: Filter<Product> = projectType
    ? projectType === "real-world"
      ? { visible: true, $or: [{ projectType: "real-world" }, { projectType: { $exists: false } }] }
      : { visible: true, projectType }
    : { visible: true };
    return collection
    .find(filter, {
      projection: {
        name: 1,
        slug: 1,
        category: 1,
        projectType: 1,
        description: 1,
        shortDescription: 1,
        liveUrl: 1,
        technologies: 1,
        features: 1,
        visible: 1,
        featured: 1,
        testimonial: 1,
        rating: 1,
        clientName: 1,
        clientRole: 1,
        clientLabel: 1,
        displayOrder: 1,
      },
    })
    .sort({ displayOrder: 1 })
      .toArray();
  },
  ["products-listing"],
  { revalidate: 300, tags: ["products"] },
);

export function getAllProducts(projectType?: ProductProjectType) {
  return getCachedProducts(projectType);
}

export async function getProductBySlug(slug: string) {
  const collection = products();
  return collection.findOne({ slug, visible: true });
}

export async function createProduct(data: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  const collection = products();
  const result = await collection.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const collection = products();
  const result = await collection.updateOne(
    { _id: id as any },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
  );
  return result;
}

export async function deleteProduct(id: string) {
  const collection = products();
  return collection.deleteOne({ _id: id as any });
}

export async function getAllProductsAdmin() {
  const collection = products();
  return collection.find({}).sort({ displayOrder: 1 }).toArray();
}
