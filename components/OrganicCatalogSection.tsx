'use client';

import React from 'react';
import Link from 'next/link';
import {
  Leaf,
  FlaskConical,
  Sprout,
  Heart,
  ArrowRight,
  Plus,
} from 'lucide-react';

interface OrganicCatalogSectionProps {
  products?: any[];
  onAddToCart?: (product: any, qty: number) => void;
  onOpenProductModal?: (product: any) => void;
}

// Benefits lookup per product or default organic benefits
const getProductBenefits = (index: number, name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('sweet potato powder') || index === 0) {
    return [
      { icon: '🌿', label: 'Rich in Nutrients' },
      { icon: '🛡', label: 'Immunity Booster' },
      { icon: '🍃', label: 'Natural Energy' },
    ];
  }
  if (lower.includes('sweet potato') || index === 1) {
    return [
      { icon: '🩺', label: 'Helps in Digestion' },
      { icon: '❤️', label: 'Good for Heart' },
      { icon: '🌾', label: 'Source of Fiber' },
    ];
  }
  if (lower.includes('capsule') || index === 2) {
    return [
      { icon: '✨', label: 'Detox & Cleanse' },
      { icon: '☀️', label: 'Daily Wellness' },
      { icon: '💪', label: 'Strengthens Body' },
    ];
  }
  return [
    { icon: '🌿', label: 'Supports Digestion' },
    { icon: '✨', label: 'Healthy Skin' },
    { icon: '🛡', label: 'Supports Immunity' },
  ];
};

// Default fallback catalog items matching exact spec if backend DB has no products
const defaultCatalogProducts = [
  {
    _id: 'default-1',
    name: 'Sweet Potato Powder',
    image: '/sweet_potato_jar.png',
    discount: 10,
    price: 250,
    mrp: 278,
    description: '100% Natural No Preservatives Powder',
  },
  {
    _id: 'default-2',
    name: 'Sweet Potato Powder (Organic)',
    image: '/sweet_potato_bowl.png',
    discount: 7,
    price: 700,
    mrp: 753,
    description: '100% Natural Product Powder Type',
  },
  {
    _id: 'default-3',
    name: 'Moringa Powder Capsules',
    image: '/moringa_capsules_bowl.png',
    discount: 25,
    price: 2,
    mrp: 3,
    description: '100% Natural and Organic No Preservatives',
  },
  {
    _id: 'default-4',
    name: 'Moringa Leaf Powder',
    image: '/moringa_powder_hero.png',
    discount: 16,
    price: 400,
    mrp: 476,
    description: 'Organic and Natural No Preservatives',
  },
];

export default function OrganicCatalogSection({
  products = [],
  onAddToCart,
  onOpenProductModal,
}: OrganicCatalogSectionProps) {
  // Use backend products dynamically or fallback if empty
  const displayProducts =
    products && products.length > 0 ? products.slice(0, 4) : defaultCatalogProducts;

  return (
    <section id="products-section" className="py-10 sm:py-20 lg:py-28 bg-[#FAF8F2] text-[#1C1917] relative overflow-hidden">
      
      {/* Background Soft Organic Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 sm:w-[550px] h-72 sm:h-[550px] bg-[#EAE6DC]/60 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-[450px] h-64 sm:h-[450px] bg-[#C99A2E]/5 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -z-0" />

      {/* Background Botanical Moringa Leaf Watermark (Soft, artistic & responsive) */}
      <div className="absolute top-12 sm:top-16 -left-10 sm:left-2 w-48 sm:w-72 lg:w-80 pointer-events-none opacity-20 sm:opacity-25 mix-blend-multiply -z-0">
        <img
          src="/moringa_leaf_transparent.png"
          alt="Moringa Oleifera Watermark"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* ================= LEFT COLUMN: STORYTELLING & BRAND CONTENT ================= */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-7 text-left relative z-10">
            
            {/* 1. Small Elegant Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EFE8] border border-[#E5E0D8] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#55753F] shadow-2xs font-sans">
              <Leaf className="w-3.5 h-3.5 text-[#55753F]" />
              <span>ORGANIC HARVEST CATALOG</span>
            </div>

            {/* 2. Editorial Serif Heading */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-[4.2rem] font-normal text-[#183B24] leading-[1.08] sm:leading-[1.04] tracking-tight">
                Health From <br className="hidden sm:inline" />
                the <em className="font-serif italic font-normal text-[#183B24]">Inside & Out.</em>
              </h2>

              {/* Gold Botanical Line Accent */}
              <div className="flex items-center gap-2 pt-0.5 sm:pt-1">
                <div className="w-12 sm:w-14 h-[2px] bg-[#C99A2E] rounded-full" />
                <Leaf className="w-3 h-3 text-[#C99A2E]" />
              </div>
            </div>

            {/* 3. Concise Description */}
            <p className="text-xs sm:text-base text-[#4A554D] leading-relaxed max-w-md font-light font-sans">
              At IndianAgriculture, we elevate moringa into exceptional products, grown and crafted with care to deliver pure quality, complete transparency, and lasting well-being.
            </p>

            {/* 4. Quality Indicators (2x2 Grid on Mobile, 4-col on Tablet/Desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              {/* Indicator 1 */}
              <div className="flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-2 p-2 sm:p-0 rounded-xl sm:rounded-none bg-[#F4F0E6]/60 sm:bg-transparent border border-[#E5E0D8]/60 sm:border-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EAE6DC] text-[#183B24] flex items-center justify-center shrink-0 shadow-2xs">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="font-sans text-xs">
                  <span className="font-bold text-[#183B24] block sm:inline">100%</span>
                  <span className="text-[#5A655A] font-light text-[11px] sm:block"> Organic</span>
                </div>
              </div>

              {/* Indicator 2 */}
              <div className="flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-2 p-2 sm:p-0 rounded-xl sm:rounded-none bg-[#F4F0E6]/60 sm:bg-transparent border border-[#E5E0D8]/60 sm:border-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EAE6DC] text-[#183B24] flex items-center justify-center shrink-0 shadow-2xs">
                  <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="font-sans text-xs">
                  <span className="font-bold text-[#183B24] block sm:inline">Lab</span>
                  <span className="text-[#5A655A] font-light text-[11px] sm:block"> Tested</span>
                </div>
              </div>

              {/* Indicator 3 */}
              <div className="flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-2 p-2 sm:p-0 rounded-xl sm:rounded-none bg-[#F4F0E6]/60 sm:bg-transparent border border-[#E5E0D8]/60 sm:border-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EAE6DC] text-[#183B24] flex items-center justify-center shrink-0 shadow-2xs">
                  <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="font-sans text-xs">
                  <span className="font-bold text-[#183B24] block sm:inline">No</span>
                  <span className="text-[#5A655A] font-light text-[11px] sm:block"> Preservatives</span>
                </div>
              </div>

              {/* Indicator 4 */}
              <div className="flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-2 p-2 sm:p-0 rounded-xl sm:rounded-none bg-[#F4F0E6]/60 sm:bg-transparent border border-[#E5E0D8]/60 sm:border-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EAE6DC] text-[#183B24] flex items-center justify-center shrink-0 shadow-2xs">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="font-sans text-xs">
                  <span className="font-bold text-[#183B24] block sm:inline">Pure &</span>
                  <span className="text-[#5A655A] font-light text-[11px] sm:block"> Natural</span>
                </div>
              </div>
            </div>

            {/* 5. Primary CTA Button */}
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#183B24] hover:bg-[#112B1A] text-white font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:scale-105 active:scale-95 group w-full sm:w-auto"
              >
                <Leaf className="w-4 h-4 text-[#C99A2E]" />
                <span>ALL PRODUCTS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: EDITORIAL PRODUCT ROWS ================= */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-8">
            <div className="divide-y divide-[#E8E4DA]">
              {displayProducts.map((product, index) => {
                const benefits = getProductBenefits(index, product.name);
                const discountVal = product.discount || 10;
                const imageSrc = product.image || '/logo.jpg';

                return (
                  <div
                    key={product._id || index}
                    className="py-5 sm:py-6 first:pt-0 last:pb-0 group transition-all"
                  >
                    <div className="flex flex-row items-start gap-3.5 sm:gap-6">
                      
                      {/* LEFT: Organic Blob/Circular Product Image with Overlapping Gold Discount Badge */}
                      <div className="relative shrink-0">
                        {/* Organic Asymmetric Blob Image Frame */}
                        <div
                          className="relative w-28 h-28 sm:w-44 sm:h-44 overflow-hidden shadow-md bg-[#F4F0E6] border border-[#C99A2E]/40 transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                          style={{
                            borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
                          }}
                          onClick={() => onOpenProductModal && onOpenProductModal(product)}
                        >
                          <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Overlapping Gold Circular Discount Badge */}
                        {discountVal > 0 && (
                          <div className="absolute top-0 left-0 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#C99A2E] text-white flex flex-col items-center justify-center shadow-lg border border-white font-sans z-10">
                            <span className="text-[9px] sm:text-[10px] font-extrabold leading-none">{discountVal}%</span>
                            <span className="text-[7px] sm:text-[8px] font-bold uppercase leading-none">OFF</span>
                          </div>
                        )}
                      </div>

                      {/* CENTER / RIGHT DETAILS */}
                      <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2 text-left">
                        
                        {/* Title using Editorial Serif Typography */}
                        <h3
                          className="font-serif text-base sm:text-2xl lg:text-3xl text-[#183B24] font-medium sm:font-normal leading-snug cursor-pointer hover:text-[#C99A2E] transition-colors line-clamp-2"
                          onClick={() => onOpenProductModal && onOpenProductModal(product)}
                        >
                          {product.name}
                        </h3>

                        {/* Description Subtext */}
                        <p className="text-[11px] sm:text-sm text-[#5C665E] font-light leading-relaxed font-sans line-clamp-2">
                          {product.description}
                        </p>

                        {/* Horizontal Benefits Pill Strip */}
                        <div className="bg-[#F4F0E6] rounded-xl sm:rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2 flex flex-wrap items-center gap-1.5 sm:gap-4 text-[10px] sm:text-xs text-[#183B24] font-medium font-sans">
                          {benefits.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-1">
                              <span className="text-xs sm:text-sm">{b.icon}</span>
                              <span className="text-[10px] sm:text-xs text-[#183B24]">{b.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Price & Circular Add Button Bar */}
                        <div className="flex items-center justify-between pt-1 sm:pt-2">
                          <span className="font-sans text-sm sm:text-lg font-bold text-[#183B24]">
                            From ₹{product.price}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onAddToCart) onAddToCart(product, 1);
                            }}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#183B24] hover:bg-[#112B1A] text-white flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 shrink-0"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

