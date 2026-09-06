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

export default function OrganicCatalogSection({
  products = [],
  onAddToCart,
  onOpenProductModal,
}: OrganicCatalogSectionProps) {
  // Use real backend products when available
  const hasProducts = products && products.length > 0;
  const displayProducts = hasProducts ? products.slice(0, 4) : [];

  return (
    <section id="products-section" className="py-10 sm:py-20 lg:py-24 bg-[#FAF8F2] text-[#1C1917] relative overflow-hidden">

      {/* Background Soft Organic Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 sm:w-[550px] h-72 sm:h-[550px] bg-[#EAE6DC]/60 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-[450px] h-64 sm:h-[450px] bg-[#C99A2E]/5 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -z-0" />

      {/* Background Botanical Moringa Leaf Watermark */}
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
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-left relative z-10">

            {/* 1. Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183B24] border border-[#C99A2E] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#D4A017] shadow-sm font-sans">
              <Leaf className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>ORGANIC HARVEST CATALOG</span>
            </div>

            {/* 2. Editorial Serif Heading */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.8rem] font-bold text-[#183B24] leading-[1.08] sm:leading-[1.04] tracking-tight">
                Pure Organic <br className="hidden sm:inline" />
                <em className="font-serif italic font-normal text-[#183B24]">Farm Solutions.</em>
              </h2>

              {/* Gold Botanical Line Accent */}
              <div className="flex items-center gap-2 pt-0.5 sm:pt-1">
                <div className="w-12 sm:w-14 h-[3px] bg-[#C99A2E] rounded-full" />
                <Leaf className="w-3.5 h-3.5 text-[#C99A2E]" />
              </div>
            </div>

            {/* 3. Concise Description */}
            <p className="text-xs sm:text-base text-[#2C382E] leading-relaxed max-w-md font-semibold font-sans">
              Cultivated on fertile Indian soil. Stem-free dehydration and certified organic standards deliver pure, nutrient-dense produce for daily wellness and commercial demand.
            </p>

            {/* 4. Quality Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <div className="flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-2 rounded-xl bg-white border border-[#183B24]/15 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#183B24] text-xs font-sans">100% Organic</span>
              </div>

              <div className="flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-2 rounded-xl bg-white border border-[#183B24]/15 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shrink-0">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#183B24] text-xs font-sans">Lab Tested</span>
              </div>

              <div className="flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-2 rounded-xl bg-white border border-[#183B24]/15 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#183B24] text-xs font-sans">Direct Farm</span>
              </div>

              <div className="flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-2 rounded-xl bg-white border border-[#183B24]/15 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#183B24] text-xs font-sans">Fast Freight</span>
              </div>
            </div>

            {/* 5. Primary CTA Button */}
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 rounded-full bg-[#183B24] hover:bg-[#112B1A] text-white font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:scale-105 active:scale-95 group w-full sm:w-auto border border-[#C99A2E]/40"
              >
                <Leaf className="w-4 h-4 text-[#C99A2E]" />
                <span>EXPLORE ALL PRODUCTS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: PRODUCTS OR SMOOTH FALLBACK UI ================= */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-8">
            {hasProducts ? (
              <div className="divide-y divide-[#E8E4DA]">
                {displayProducts.map((product, index) => {
                  const benefits = getProductBenefits(index, product.name);
                  const discountVal = product.discount || 0;
                  const imageSrc = product.image || '/logo.jpg';

                  return (
                    <div
                      key={product._id || index}
                      className="py-5 sm:py-6 first:pt-0 last:pb-0 group transition-all"
                    >
                      <div className="flex flex-row items-start gap-3.5 sm:gap-6">

                        {/* LEFT: Product Image */}
                        <div className="relative shrink-0">
                          <div
                            className="relative w-24 h-24 sm:w-40 sm:h-40 overflow-hidden shadow-md bg-[#F4F0E6] border border-[#C99A2E]/40 transition-transform duration-500 group-hover:scale-105 cursor-pointer"
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

                          {discountVal > 0 && (
                            <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#C99A2E] text-white flex flex-col items-center justify-center shadow-md border border-white font-sans z-10">
                              <span className="text-[9px] font-black leading-none">{discountVal}%</span>
                              <span className="text-[7px] font-bold uppercase leading-none">OFF</span>
                            </div>
                          )}
                        </div>

                        {/* CENTER / RIGHT DETAILS */}
                        <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2 text-left">
                          <h3
                            className="font-serif text-base sm:text-2xl text-[#183B24] font-bold leading-snug cursor-pointer hover:text-[#C99A2E] transition-colors line-clamp-2"
                            onClick={() => onOpenProductModal && onOpenProductModal(product)}
                          >
                            {product.name}
                          </h3>

                          <p className="text-[11px] sm:text-sm text-[#4A554D] font-medium leading-relaxed font-sans line-clamp-2">
                            {product.description}
                          </p>

                          <div className="bg-[#F4F0E6] rounded-xl px-3 py-1.5 flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-[#183B24] font-bold font-sans">
                            {benefits.map((b, bIdx) => (
                              <div key={bIdx} className="flex items-center gap-1">
                                <span className="text-xs">{b.icon}</span>
                                <span>{b.label}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-1 sm:pt-2">
                            <span className="font-sans text-sm sm:text-lg font-extrabold text-[#183B24]">
                              ₹{product.price}
                            </span>

                            <button
                              onClick={() => onAddToCart && onAddToCart(product, 1)}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#183B24] text-white flex items-center justify-center hover:bg-[#C99A2E] hover:text-[#183B24] transition-all shadow-md active:scale-95 shrink-0"
                              title="Add to Cart"
                            >
                              <Plus className="w-4 h-4 stroke-[3]" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* SMOOTH PREMIUM UI FALLBACK STATE WHEN DATABASE HAS NO PRODUCTS YET */
              <div className="bg-[#F5F2EB] border-2 border-[#183B24]/15 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center mx-auto shadow-md">
                  <Sprout className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#183B24]">
                    Fresh Harvest In Progress
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A554D] font-bold font-sans leading-relaxed">
                    Our current organic moringa and farm harvest is being processed and packaged. Connect with us directly for custom bulk orders and stock availability.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="https://wa.me/919597250344?text=Hello%20Indian%20Agriculture%20Team%2C%20I%20want%20to%20inquire%20about%20product%20stock%20and%20harvest%20pricing."
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-full bg-[#183B24] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#253D28] transition-all shadow-md border border-[#C99A2E]/40"
                  >
                    Inquire Harvest Stock
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

