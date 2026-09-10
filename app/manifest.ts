import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Indian Agriculture - Premier B2B Organic Supplier',
    short_name: 'Indian Agriculture',
    description: 'Direct farm-to-business supplier of premium Organic Moringa Oleifera & bulk agricultural produce in India.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#1E3524',
    icons: [
      {
        src: '/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
