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
  title: "INDIAN AGRICULTURE | Premium Organic Solutions & Farm Produce",
  description:
    "Nourish your crops & health from inside and out with Premium Organic Solutions from INDIAN AGRICULTURE. Regeneratively farmed and ethically crafted in India. Fast delivery across India.",
  keywords: [
    "INDIAN AGRICULTURE",
    "INDIANAGRICULTURE.online",
    "Premium Organic Moringa",
    "Organic Farm Produce",
    "Regenerative Agriculture India",
    "Natural Organic Fertilizer",
  ],
  authors: [{ name: "INDIAN AGRICULTURE" }],
  creator: "INDIAN AGRICULTURE",
  publisher: "INDIAN AGRICULTURE",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "INDIAN AGRICULTURE — Premium Organic Produce & Moringa Solutions",
    description:
      "Nourish your crops and health from inside & out with our Premium Organic Produce regeneratively farmed and ethically crafted in India.",
    url: "https://INDIANAGRICULTURE.online",
    siteName: "INDIAN AGRICULTURE",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "INDIAN AGRICULTURE Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "INDIAN AGRICULTURE",
    description: "Premium organic produce & moringa solutions regeneratively farmed in India.",
    images: ["/logo.jpg"],
  },
  metadataBase: new URL("https://INDIANAGRICULTURE.online"),
  alternates: {
    canonical: "https://INDIANAGRICULTURE.online",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "INDIAN AGRICULTURE",
              "image": "https://INDIANAGRICULTURE.online/logo.jpg",
              "@id": "https://INDIANAGRICULTURE.online",
              "url": "https://INDIANAGRICULTURE.online",
              "priceRange": "₹₹",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans antialiased flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}

