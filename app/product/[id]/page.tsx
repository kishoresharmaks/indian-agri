import type { Metadata } from 'next';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import ProductClientRedirect from './ProductClientRedirect';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectToDatabase();
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return {
        title: 'Product Not Found — INDIAN AGRICULTURE',
      };
    }

    const priceText = product.price ? `₹${product.price.toLocaleString('en-IN')}` : '';
    const mrpText = product.mrp && product.mrp > product.price ? ` (MRP: ₹${product.mrp.toLocaleString('en-IN')})` : '';

    const title = `${product.name} — INDIAN AGRICULTURE`;
    const description = `Buy ${product.name} online for ${priceText}${mrpText}. 100% pure organic produce direct from farmlands. Express delivery & GST billing.`;

    return {
      title,
      description,
      openGraph: {
        title: `${product.name} | INDIAN AGRICULTURE`,
        description,
        url: `https://indianagriculture.online/product/${params.id}`,
        siteName: 'INDIAN AGRICULTURE',
        images: product.image
          ? [
              {
                url: product.image,
                width: 800,
                height: 800,
                alt: product.name,
              },
            ]
          : [{ url: '/logo.jpg' }],
        locale: 'en_IN',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} — INDIAN AGRICULTURE`,
        description,
        images: product.image ? [product.image] : ['/logo.jpg'],
      },
      alternates: {
        canonical: `https://indianagriculture.online/product/${params.id}`,
      },
    };
  } catch (error) {
    return {
      title: 'INDIAN AGRICULTURE — Pure Organic Produce',
    };
  }
}

export default async function ProductPage({ params }: Props) {
  let productJsonLd: any = null;

  try {
    await connectToDatabase();
    const product = await Product.findById(params.id).lean();

    if (product) {
      productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image || 'https://indianagriculture.online/logo.jpg',
        description: product.description || `Buy ${product.name} direct from farm.`,
        brand: {
          '@type': 'Brand',
          name: 'INDIAN AGRICULTURE',
        },
        offers: {
          '@type': 'Offer',
          url: `https://indianagriculture.online/product/${params.id}`,
          priceCurrency: 'INR',
          price: product.price,
          availability: (product.quantity && product.quantity > 0) ? 'https://schema.org/InStock' : 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
      };
    }
  } catch (e) {
    // Ignore error for jsonld
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductClientRedirect id={params.id} />
    </>
  );
}
