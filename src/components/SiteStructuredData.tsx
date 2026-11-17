import { SITE } from "@/config/site";

export default function SiteStructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    logo: `${SITE.url}/logo.webp`,
    description: SITE.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
