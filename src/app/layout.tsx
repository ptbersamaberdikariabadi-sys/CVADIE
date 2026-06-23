import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "CV. Abadi Dewana | General Trading & Industrial Equipment",
  description: "Mitra Terpercaya Pengadaan Komponen & Peralatan Industri Skala Besar.",
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
      </body>
    </html>
  );
}
