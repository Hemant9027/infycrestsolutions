import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { SITE } from "@/config/site";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ProductRouteScrollReset from "@/components/ProductRouteScrollReset";
import NavigationProgress from "@/components/NavigationProgress";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SiteStructuredData from "@/components/SiteStructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s — InfyCrest Solutions",
  },
  description: SITE.description,
  applicationName: SITE.name,
  icons: {
    icon: [
      { url: "/favicon-16x16.webp", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.webp", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.webp",
  },
  keywords: [
    "InfyCrest Solutions",
    "web development",
    "custom software development",
    "business automation",
    "SaaS development",
    "software development India",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/previews/launchkit-main.webp" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/previews/launchkit-main.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen overflow-x-clip bg-white font-sans text-neutral-900 antialiased">
        <NavigationProgress />
        <SiteStructuredData />
        <GoogleAnalytics />
        <ProductRouteScrollReset />
        <AnalyticsTracker />
        {children}
        <WhatsAppFloat />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
