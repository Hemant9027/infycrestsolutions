import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NewTemplate } from "@/components/new-template";
import { getPublishedCustomer, type NewCustomer } from "@/lib/new-customers";
import RestaurantTemplate from "@/components/restaurant-template";
import SmilecareDentalTemplate, {
  demoDentalCustomer,
} from "@/components/smilecare-dental-template";
import MedoraHealthTemplate, {
  demoMedoraCustomer,
} from "@/components/medora-health-template";
import VelouraStudioTemplate from "@/components/veloura-studio-template";
import {
  demoAureliaCustomer,
  RestaurantTemplate as AureliaRestaurantTemplate,
} from "@/components/aurelia-dining-template";
import {
  PremiumBarTemplate,
  demoNewCustomer as demoBarCustomer,
} from "@/components/afterglow-bar-template";
import CrumbHearthTemplate, {
  demoBakeryCustomer,
} from "@/components/crumb-hearth-template";
import DashbiteTemplate, {
  demoDashBiteCustomer,
} from "@/components/dashbite-template";
import RoastRitualTemplate, {
  demoCafeCustomer,
} from "@/components/roast-ritual-template";
import NorthlineTemplate, {
  demoLaunchLabCustomer as demoNorthlineCustomer,
} from "@/components/northline-template";
import ScaleflowTemplate, {
  demoLaunchLabCustomer as demoScaleflowCustomer,
} from "@/components/scaleflow-template";
import LaunchlabTemplate, {
  demoLaunchLabCustomer,
} from "@/components/launchlab-template";
import { ForgeAthleticsTemplate } from "@/components/forge-athletics-template";
import FrameSoulTemplate, {
  demoFrameSoulCustomer,
} from "@/components/frame-soul-template";
import IslandVillaTemplate, {
  demoIslandCustomer,
} from "@/components/island-villa-template";
import DemoAgencyShell from "@/components/DemoAgencyShell";
import type { PublishTemplateKey } from "@/lib/product-template-types";

function applyCustomerData<T extends Record<string, any>>(
  template: T,
  customer: NewCustomer,
): T {
  const merged = {
    ...template,
    id: customer.id,
    slug: customer.slug,
    businessName: customer.businessName,
    contact: {
      ...(template.contact ?? {}),
      ...(customer.contact?.email ? { email: customer.contact.email } : {}),
      ...(customer.contact?.phone ? { phone: customer.contact.phone } : {}),
      ...(customer.contact?.address
        ? { address: customer.contact.address }
        : {}),
      ...(customer.contact?.hours ? { hours: customer.contact.hours } : {}),
    },
    hero: {
      ...(template.hero ?? {}),
      ...(customer.hero?.image ? { image: customer.hero.image } : {}),
    },
    heroImages: customer.hero?.image
      ? Array.from(
          { length: Math.max(template.heroImages?.length ?? 1, 1) },
          () => customer.hero.image,
        )
      : template.heroImages,
    about: {
      ...(template.about ?? {}),
      ...(customer.about?.image ? { image: customer.about.image } : {}),
    },
    gallery:
      customer.gallery && customer.gallery.length > 0
        ? customer.gallery
        : template.gallery,
  };
  return merged as T;
}

const publishedTemplates: Record<
  PublishTemplateKey,
  (customer: NewCustomer) => ReactNode
> = {
  "smilecare-dental": (customer) => (
    <SmilecareDentalTemplate
      customer={applyCustomerData(demoDentalCustomer, customer)}
    />
  ),
  "medora-health": (customer) => (
    <MedoraHealthTemplate
      customer={applyCustomerData(demoMedoraCustomer, customer)}
    />
  ),
  "veloura-studio": (customer) => (
    <VelouraStudioTemplate businessName={customer.businessName} />
  ),
  "aurelia-dining": (customer) => (
    <AureliaRestaurantTemplate
      customer={applyCustomerData(demoAureliaCustomer, customer)}
    />
  ),
  "afterglow-bar": (customer) => (
    <PremiumBarTemplate
      customer={applyCustomerData(demoBarCustomer, customer)}
    />
  ),
  "crumb-hearth": (customer) => (
    <CrumbHearthTemplate
      customer={applyCustomerData(demoBakeryCustomer, customer)}
    />
  ),
  dashbite: (customer) => (
    <DashbiteTemplate
      customer={applyCustomerData(
        {
          ...demoDashBiteCustomer,
          hero: {
            ...(demoDashBiteCustomer.hero ?? {}),
            title:
              demoDashBiteCustomer.hero?.title?.replaceAll(
                "DashBite",
                customer.businessName,
              ) ?? customer.businessName,
          },
        },
        customer,
      )}
    />
  ),
  "roast-ritual": (customer) => (
    <RoastRitualTemplate
      customer={applyCustomerData(demoCafeCustomer, customer)}
    />
  ),
  northline: (customer) => (
    <NorthlineTemplate
      customer={applyCustomerData(demoNorthlineCustomer, customer)}
    />
  ),
  scaleflow: (customer) => (
    <ScaleflowTemplate
      customer={applyCustomerData(demoScaleflowCustomer, customer)}
    />
  ),
  launchlab: (customer) => (
    <LaunchlabTemplate
      customer={applyCustomerData(demoLaunchLabCustomer, customer)}
    />
  ),
  "forge-athletics": (customer) => (
    <ForgeAthleticsTemplate businessName={customer.businessName} />
  ),
  "frame-soul": (customer) => (
    <FrameSoulTemplate
      customer={applyCustomerData(demoFrameSoulCustomer, customer)}
    />
  ),
  "island-villa": (customer) => (
    <IslandVillaTemplate
      customer={applyCustomerData(demoIslandCustomer, customer)}
    />
  ),
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const customer = await getPublishedCustomer(slug);
  if (!customer) return {};
  return {
    title: customer.SEO.title || customer.businessName,
    description: customer.SEO.description,
    keywords: customer.SEO.keywords,
    openGraph: {
      title: customer.SEO.title || customer.businessName,
      description: customer.SEO.description,
    },
  };
}

export default async function NewCustomerPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const customer = await getPublishedCustomer(slug);
  if (!customer) notFound();
  const PublishedTemplate =
    publishedTemplates[customer.templateKey as PublishTemplateKey];
  return (
    <DemoAgencyShell>
      {PublishedTemplate ? (
        PublishedTemplate(customer)
      ) : customer.templateKey === "restaurant" ? (
        <RestaurantTemplate />
      ) : (
        <NewTemplate customer={customer} />
      )}
    </DemoAgencyShell>
  );
}
