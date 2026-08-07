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
  metadataBase: new URL('https://www.abadidewana.com'),
  title: {
    default: "CV. Abadi Dewana | General Trading & Industrial Equipment",
    template: "%s | CV. ADIE",
  },
  description: "Mitra Terpercaya Pengadaan Komponen & Peralatan Industri Skala Besar. Menjamin downtime pabrik teratasi secara efisien melalui jaringan global sourcing.",
  keywords: [
    // Merek utama yang dijual
    "FESTO Indonesia", "SMC Pneumatic", "CKD Valve", "RBCA Inverter", "DeWALT Indonesia",
    // Kategori produk
    "Distributor Solenoid Valve Indonesia", "Suku Cadang Pabrik", "Industrial Equipment",
    "Pneumatik Indonesia", "Kompresor Industri", "Otomasi PLC", "Inverter Industri",
    "Suku Cadang Tekstil", "Komponen Mesin Pabrik", "General Trading Industri",
    // Intent
    "beli spare part industri", "harga solenoid valve", "distributor pneumatik Bandung",
    "pengadaan komponen industri B2B", "part number industri Indonesia",
  ],
  openGraph: {
    title: "CV. Abadi Dewana | General Trading & Industrial Equipment",
    description: "Mitra Terpercaya Pengadaan Komponen & Peralatan Industri Skala Besar.",
    url: "https://www.abadidewana.com",
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
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "CV. Abadi Dewana Industrial Equipment",
      "alternateName": "CV. ADIE",
      "url": "https://www.abadidewana.com",
      "logo": "https://www.abadidewana.com/logo.jpeg",
      "image": "https://www.abadidewana.com/logo.jpeg",
      "description": "Distributor dan general trading company spesialis komponen industri, pneumatik, otomasi, dan suku cadang pabrik di Indonesia. Melayani B2B dengan garansi riil dan harga kompetitif.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rancaekek",
        "addressLocality": "Kabupaten Bandung",
        "addressRegion": "Jawa Barat",
        "addressCountry": "ID"
      },
      "telephone": "+6281214614097",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+6281214614097",
        "contactType": "customer service",
        "areaServed": "ID",
        "availableLanguage": "Indonesian"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Indonesia"
      },
      "knowsAbout": [
        "Industrial Valves", "Solenoid Valve FESTO", "SMC Pneumatic", "CKD Valve",
        "Pneumatic Cylinders", "PLC Automation", "Industrial Inverter RBCA",
        "Industrial Sensors", "Textile Machinery Parts", "Global Sourcing",
        "Spare Part Mesin Pabrik", "Komponen Otomasi Industri"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Katalog Suku Cadang Industri",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Solenoid Valve & Pneumatik" } },
          { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Inverter & PLC Otomasi" } },
          { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Suku Cadang Tekstil" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Perbaikan Elektrikal (PLC, PCB, Servo)" } }
        ]
      },
      "sameAs": [
        "https://www.linkedin.com/company/cv-abadi-dewana",
        "https://www.facebook.com/cv.abadidewana"
      ]
    }
  ];

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
