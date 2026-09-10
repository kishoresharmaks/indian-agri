import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Bulk Organic Products & Raw Supplies | INDIAN AGRICULTURE',
  description:
    'Browse our certified organic farm produce, premium Moringa Oleifera powder, leaf tea bags, soup mixes, and OEM private labeling. Direct farm pricing & GST invoices across India.',
  keywords: [
    'Organic Moringa Oleifera Powder',
    'Wholesale Moringa Tea Bags',
    'Bulk Agricultural Raw Materials',
    'B2B Organic Farm Produce India',
    'OEM White Label Moringa',
    'Buy Moringa Leaves Wholesale',
  ],
  openGraph: {
    title: 'Bulk Organic Products & Wholesale Produce | INDIAN AGRICULTURE',
    description:
      'Browse our certified organic farm produce, premium Moringa Oleifera powder, leaf tea bags, soup mixes, and OEM private labeling.',
    url: 'https://indianagriculture.online/products',
    siteName: 'INDIAN AGRICULTURE',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 800,
        alt: 'Indian Agriculture Products Catalog',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Organic Products & Wholesale Produce | INDIAN AGRICULTURE',
    description:
      'Direct farm supply of organic Moringa Oleifera, bulk agricultural raw produce, and private label solutions.',
    images: ['/logo.jpg'],
  },
  alternates: {
    canonical: 'https://indianagriculture.online/products',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
