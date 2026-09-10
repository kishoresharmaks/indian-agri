import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "INDIAN AGRICULTURE | Premier B2B Organic Supplier & Wholesale Bulk Produce",
  description:
    "Direct farm-to-business supplier of premium Organic Moringa Oleifera, bulk agricultural raw materials, and natural farm produce in India. Custom OEM, white-labeling, lab certified COA, and global export shipping.",
  keywords: [
    "INDIAN AGRICULTURE B2B",
    "B2B Organic Moringa Supplier",
    "Wholesale Moringa Powder Bulk",
    "Bulk Organic Farm Produce India",
    "Moringa OEM White Labeling",
    "Contract Farming Organic India",
    "Raw Moringa Bulk Exporter",
    "Commercial Organic Agriculture Supplier",
  ],
  authors: [{ name: "INDIAN AGRICULTURE B2B" }],
  creator: "INDIAN AGRICULTURE",
  publisher: "INDIAN AGRICULTURE B2B Wholesale",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "INDIAN AGRICULTURE — Premier B2B Organic & Wholesale Moringa Supplier",
    description:
      "Direct farm-to-business bulk supply of premium organic moringa, agricultural raw materials, and enterprise white-label solutions. Pan-India & Global Export.",
    url: "https://INDIANAGRICULTURE.online",
    siteName: "INDIAN AGRICULTURE B2B",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "INDIAN AGRICULTURE B2B Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "INDIAN AGRICULTURE B2B Wholesale",
    description: "Premier B2B organic raw materials & moringa bulk supplier direct from Indian farms.",
    images: ["/logo.jpg"],
  },
  metadataBase: new URL("https://indianagriculture.online"),
  alternates: {
    canonical: "https://indianagriculture.online",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "INDIAN AGRICULTURE",
      "legalName": "Indian Agriculture Pvt. Ltd.",
      "url": "https://indianagriculture.online",
      "logo": "https://indianagriculture.online/logo.jpg",
      "sameAs": [
        "https://www.instagram.com/indian_agriculture_pvt?stkn=bTlsY3pxdDNnampt",
        "https://youtube.com/@indianagriculturepvtltd?si=k4SxOPJr1EiebDRS",
        "https://pin.it/1J93BoPq8",
        "https://www.facebook.com/share/18GynvVubk/",
        "https://share.google/Gjio1PWvVXsbz2iNL"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9597250344",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Tamil", "Hindi"]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "INDIAN AGRICULTURE",
      "url": "https://indianagriculture.online",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://indianagriculture.online/products?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "INDIAN AGRICULTURE",
      "image": "https://indianagriculture.online/logo.jpg",
      "@id": "https://indianagriculture.online",
      "url": "https://indianagriculture.online",
      "priceRange": "₹₹",
      "telephone": "+91-9597250344",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      }
    }
  ];

  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans antialiased flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}

