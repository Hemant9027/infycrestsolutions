import { mongoDb } from "@/lib/mongodb";
import type { ProductTemplate } from "@/lib/product-template-types";

const featureSets = {
  healthcare: ["Services and specialties", "Doctor profile", "Testimonials", "FAQs", "Contact section", "Mobile responsive"],
  food: ["Menu showcase", "Story and ambience", "Gallery", "Reservations or enquiries", "Location and hours", "Mobile responsive"],
  business: ["Conversion-focused sections", "Service or product pages", "Testimonials", "Lead capture", "SEO foundations", "Mobile responsive"],
  creative: ["Portfolio gallery", "Service highlights", "Testimonials", "Enquiry CTA", "Social links", "Mobile responsive"],
  hospitality: ["Property showcase", "Amenities and details", "Gallery", "Booking enquiries", "Location and contact", "Mobile responsive"],
};

function product(
  values: Omit<ProductTemplate, "features" | "gallery" | "technologies" | "tags" | "visible" | "featured" | "ctaText" | "displayOrder"> & {
    featureSet: keyof typeof featureSets;
    tags: string[];
    featured?: boolean;
    displayOrder: number;
  },
): ProductTemplate {
  const { featureSet, ...rest } = values;
  return {
    ...rest,
    features: featureSets[featureSet],
    gallery: [values.thumbnail],
    technologies: ["Next.js", "React", "Tailwind CSS"],
    tags: values.tags,
    visible: true,
    featured: values.featured ?? false,
    ctaText: "Let's Build This",
  };
}

export const INITIAL_PRODUCT_TEMPLATES: ProductTemplate[] = [
  product({ name: "SmileCare Dental", slug: "smilecare-dental", category: "Healthcare & Wellness", businessType: "Dental Clinic", shortDescription: "A clean and trustworthy website template designed for modern dental clinics and dental professionals.", description: "A reassuring dental clinic experience that makes treatments, trust and appointment enquiries easy to find.", thumbnail: "/dental-clinic/1.jpg", previewUrl: "/demo/dental-clinic", hasLivePreview: true, templateKey: "dental-clinic", featureSet: "healthcare", tags: ["dental", "clinic", "healthcare"], displayOrder: 1, featured: true }),
  product({ name: "Medora Health", slug: "medora-health", category: "Healthcare & Wellness", businessType: "Hospital", shortDescription: "A professional healthcare website template designed for hospitals, medical centers, and healthcare organizations.", description: "A structured hospital presence with clear departments, doctors, emergency information and patient-first navigation.", thumbnail: "/hospital/1.jpg", previewUrl: "/demo/hospital", hasLivePreview: true, templateKey: "hospital", featureSet: "healthcare", tags: ["hospital", "medical", "healthcare"], displayOrder: 2 }),
  product({ name: "Veloura Studio", slug: "veloura-studio", category: "Healthcare & Wellness", businessType: "Beauty Salon", shortDescription: "An elegant luxury website template designed for premium salons, beauty studios, and hair professionals.", description: "A soft, editorial salon experience that gives services, stylists and booking the attention they deserve.", thumbnail: "/salon/1.jpg", previewUrl: "/demo/salon", hasLivePreview: true, templateKey: "salon", featureSet: "creative", tags: ["salon", "beauty", "studio"], displayOrder: 3 }),
  product({ name: "Aurelia Dining", slug: "aurelia-dining", category: "Food & Beverage", businessType: "Fine Dining Restaurant", shortDescription: "A cinematic luxury restaurant website template designed for premium dining experiences.", description: "A dark, cinematic dining experience built around menus, chef notes, reservations and atmosphere.", thumbnail: "/restaurant/1.jpg", previewUrl: "/demo/restaurant", hasLivePreview: true, templateKey: "restaurant", featureSet: "food", tags: ["restaurant", "fine dining", "food"], displayOrder: 4, featured: true }),
  product({ name: "Afterglow Bar", slug: "afterglow-bar", category: "Food & Beverage", businessType: "Pub / Cocktail Bar", shortDescription: "A bold nightlife website template designed for cocktail bars, pubs, lounges, and modern nightlife venues.", description: "A high-contrast nightlife template for drinks, events, menus and a memorable first impression.", thumbnail: "/Pub-Cocktail/1.jpg", previewUrl: "/demo/afterglow-bar", hasLivePreview: true, templateKey: "pub-bar", featureSet: "food", tags: ["bar", "pub", "cocktails", "nightlife"], displayOrder: 5 }),
  product({ name: "Crumb & Hearth", slug: "crumb-hearth", category: "Food & Beverage", businessType: "Bakery", shortDescription: "A warm and inviting website template for artisan bakeries, pastry shops, and neighborhood bakeries.", description: "A warm editorial bakery site for product showcases, custom orders, daily specials and local discovery.", thumbnail: "/Bakery/1.jpg", previewUrl: "/demo/crumb-hearth", hasLivePreview: true, templateKey: "bakery", featureSet: "food", tags: ["bakery", "pastry", "food"], displayOrder: 6 }),
  product({ name: "DashBite", slug: "dashbite", category: "Food & Beverage", businessType: "Cloud Kitchen", shortDescription: "A vibrant food-delivery website template designed for cloud kitchens, food brands, and delivery-first businesses.", description: "A delivery-first food brand experience built to make menus, offers and direct orders effortless.", thumbnail: "/Cloud-Kitchen/1.jpg", previewUrl: "/demo/dashbite", hasLivePreview: true, templateKey: "cloud-kitchen", featureSet: "food", tags: ["cloud kitchen", "delivery", "food"], displayOrder: 7 }),
  product({ name: "Roast & Ritual", slug: "roast-ritual", category: "Food & Beverage", businessType: "Cafe", shortDescription: "A warm and elegant website template for specialty coffee shops, cafes, and artisanal coffee brands.", description: "A considered cafe presence with menu highlights, ambience, events, hours and location details.", thumbnail: "/restaurant/2.jpg", previewUrl: "/demo/roast-ritual", hasLivePreview: true, templateKey: "cafe", featureSet: "food", tags: ["cafe", "coffee", "food"], displayOrder: 8 }),
  product({ name: "Northline", slug: "northline", category: "Business & Tech", businessType: "Fashion E-commerce", shortDescription: "A premium minimalist e-commerce template designed for fashion brands and modern online stores.", description: "A gallery-led storefront concept for fashion brands that want the product and point of view to lead.", thumbnail: "/Business-Tech/1.jpg", previewUrl: "/demo/northline", hasLivePreview: true, templateKey: "ecommerce", featureSet: "business", tags: ["fashion", "ecommerce", "store"], displayOrder: 9 }),
  product({ name: "ScaleFlow", slug: "scaleflow", category: "Business & Tech", businessType: "SaaS", shortDescription: "A modern technology-focused website template for SaaS companies, startups, and software products.", description: "A crisp SaaS marketing system for explaining a product clearly and converting the right users.", thumbnail: "/Business-Tech/2.jpg", previewUrl: "/demo/scaleflow", hasLivePreview: true, templateKey: "saas", featureSet: "business", tags: ["saas", "software", "startup"], displayOrder: 10 }),
  product({ name: "LaunchLab", slug: "launchlab", category: "Business & Tech", businessType: "Startup / Digital Agency", shortDescription: "A bold and creative website template designed for startups, digital agencies, creative studios, and technology companies.", description: "A flexible launchpad for ambitious teams, agencies and studios that need a sharp digital presence.", thumbnail: "/Business-Tech/3.jpg", previewUrl: "/demo/launchlab", hasLivePreview: true, templateKey: "startup-agency", featureSet: "business", tags: ["startup", "agency", "creative"], displayOrder: 11, featured: true }),
  product({ name: "Forge Athletics", slug: "forge-athletics", category: "Fitness & Creative", businessType: "Gym", shortDescription: "A high-energy fitness website template designed for gyms, fitness studios, personal trainers, and athletic brands.", description: "A high-impact fitness site for memberships, schedules, trainers, facilities and join-now flows.", thumbnail: "/gym/1.jpg", previewUrl: "/demo/gym", hasLivePreview: true, templateKey: "gym", featureSet: "creative", tags: ["gym", "fitness", "training"], displayOrder: 12 }),
  product({ name: "Frame & Soul", slug: "frame-soul", category: "Fitness & Creative", businessType: "Photographer", shortDescription: "An ultra-minimal editorial portfolio template designed for professional photographers and creative visual artists.", description: "A quiet, image-first portfolio for photographers and visual artists who want their work to carry the story.", thumbnail: "/photographer/1.jpg", previewUrl: "/demo/frame-soul", hasLivePreview: true, templateKey: "photographer", featureSet: "creative", tags: ["photographer", "portfolio", "creative"], displayOrder: 13 }),
  product({ name: "Island Villa", slug: "island-villa", category: "Real Estate & Hospitality", businessType: "Luxury Villa", shortDescription: "A calm, immersive hospitality template for private villas, retreats and destination stays.", description: "A polished villa experience for showcasing rooms, surroundings, amenities, enquiries and the feeling of a stay.", thumbnail: "/villa/1.jpg", previewUrl: "/demo/island-villa", hasLivePreview: true, templateKey: "villa", featureSet: "hospitality", tags: ["villa", "hospitality", "real estate"], displayOrder: 14, featured: true }),
];

export const productTemplates = () => mongoDb.collection<ProductTemplate>("product_templates");

let seedPromise: Promise<void> | undefined;

export function ensureProductTemplateSeed() {
  seedPromise ??= seedProductTemplates();
  return seedPromise;
}

async function seedProductTemplates() {
  const collection = productTemplates();
  if (await collection.countDocuments() > 0) {
    const migrations = mongoDb.collection("site_migrations");
    const migrationKey = "product-template-preview-routes-v1";
    if (!(await migrations.findOne({ key: migrationKey }))) {
      const previewProducts = INITIAL_PRODUCT_TEMPLATES.filter(
        (item) => item.hasLivePreview && item.previewUrl,
      );
      await collection.bulkWrite(
        previewProducts.map((item) => ({
          updateOne: {
            filter: {
              slug: item.slug,
              previewUrl: "",
              hasLivePreview: false,
            },
            update: {
              $set: {
                previewUrl: item.previewUrl,
                hasLivePreview: true,
                updatedAt: new Date(),
              },
            },
          },
        })),
      );
      await migrations.insertOne({ key: migrationKey, createdAt: new Date() });
    }
    return;
  }
  const now = new Date();
  await collection.insertMany(INITIAL_PRODUCT_TEMPLATES.map((item) => ({ ...item, createdAt: now, updatedAt: now })));
}
