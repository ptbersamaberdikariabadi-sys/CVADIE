import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cv-adie.com'),
  title: {
    default: "CV. Abadi Dewana | General Trading & Industrial Equipment",
    template: "%s | CV. ADIE",
  },
  description: "Mitra Terpercaya Pengadaan Komponen & Peralatan Industri Skala Besar. Menjamin downtime pabrik teratasi secara efisien melalui jaringan global sourcing.",
  keywords: ["Distributor Valve Indonesia", "Suku Cadang Pabrik", "Industrial Equipment", "General Trading", "Pneumatik", "Kompresor", "Otomasi Industri"],
  openGraph: {
    title: "CV. Abadi Dewana | General Trading & Industrial Equipment",
    description: "Mitra Terpercaya Pengadaan Komponen & Peralatan Industri Skala Besar.",
    url: "https://www.cv-adie.com",
    siteName: "CV. ADIE",
    images: [
      {
        url: "https://www.cv-adie.com/logo.jpeg",
        width: 800,
        height: 600,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV. Abadi Dewana",
    description: "Mitra Terpercaya Pengadaan Komponen Industri Skala Besar.",
    images: ["https://www.cv-adie.com/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CV. Abadi Dewana Industrial Equipment",
    "alternateName": "CV. ADIE",
    "url": "https://www.cv-adie.com",
    "logo": "https://www.cv-adie.com/logo.jpeg",
    "description": "Distributor and general trading company specializing in industrial equipment, pneumatics, automation, and mechanical components in Indonesia.",
    "knowsAbout": ["Industrial Valves", "Pneumatic Cylinders", "PLC Automation", "Industrial Sensors", "Textile Machinery Parts", "Global Sourcing"],
    "areaServed": {
      "@type": "Country",
      "name": "Indonesia"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-821-2777-2205",
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": "Indonesian"
    },
    "sameAs": [
      "https://www.linkedin.com/company/cv-abadi-dewana",
      "https://www.facebook.com/cv.abadidewana"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "B2B Industrial Equipment Supplier"
        }
      }
    ]
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
