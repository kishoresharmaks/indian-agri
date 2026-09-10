'use client';

import React, { useState, useEffect } from 'react';
import {
  Leaf,
  Sprout,
  FlaskConical,
  Heart,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface MoringaHeroProps {
  products?: any[];
  banners?: any[];
  onAddToCart?: (product: any, qty: number) => void;
  onOpenProductModal?: (product: any) => void;
}

const defaultSlides = [
  {
    id: 1,
    image: '/moringa_powder_hero.png',
    tagline: 'PURE. POWERFUL. NATURAL.',
    title: 'Direct Farm-To-Door Organic Produce',
    subtitle: 'High-Purity Moringa Oleifera Powder & Natural Harvest Solutions.',
  },
  {
    id: 2,
    image: '/moringa_plantation_hero.png',
    tagline: 'FARMED WITH PURPOSE',
    title: 'Regenerative Agriculture & Quality Sourcing',
    subtitle: 'Stem-free processing, low-temperature dehydration, and verified purity.',
  },
  {
    id: 3,
    image: '/moringa_pouch_hero.png',
    tagline: "NATURE'S SUPERFOOD",
    title: 'Certified Premium Raw Materials',
    subtitle: 'COA tested batches, zero additives, and fast delivery across India.',
  },
  {
    id: 4,
    image: '/moringa_seeds_oil_hero.png',
    tagline: 'EVERY PART WITH PURPOSE',
    title: 'Moringa Powder, Seeds & Essential Oils',
    subtitle: 'Competitive pricing, GST invoicing, and dedicated customer care.',
  },
];

export default function MoringaHero({
  products = [],
  banners = [],
  onOpenProductModal,
}: MoringaHeroProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dynamically load banners from backend API or fallback to default slides
  const slides =
    banners && banners.length > 0
      ? banners.map((b, idx) => {
        const fallback = defaultSlides[idx % defaultSlides.length]!;
        return {
          id: b._id || idx,
          image: b.image || fallback.image,
          tagline: b.tagline || fallback.tagline,
          title: b.title || fallback.title,
          subtitle: b.subtitle || fallback.subtitle,
          link: b.link || '',
        };
      })
      : defaultSlides;

  // Dynamically derive side preview cards from backend banners data
  const sidePreviews = slides.map((slide, idx) => ({
    id: slide.id || idx,
    title: slide.title,
    image: slide.image,
    isIcon: !slide.image,
  }));

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const featuredProduct = products.length > 0 ? products[0] : null;

  const currentSlide = slides[currentSlideIndex] ?? slides[0];

  if (!currentSlide || slides.length === 0) return null;

  return (
    <section className="relative overflow-hidden pt-4 pb-14 sm:py-16 lg:py-24 bg-[#FAF8F3] text-[#1C2A1E]">

      {/* Soft Background Leaf Watermark */}
      <div className="absolute top-2 left-2 pointer-events-none opacity-20 hidden lg:block">
        <svg className="w-28 h-28 text-[#C4922A]" viewBox="0 0 100 100" fill="currentColor">
          <path d="M30,90 Q40,40 90,10 Q60,30 30,90 Z" />
        </svg>
      </div>

      {/* BOTTOM-LEFT CORNER BOTANICAL ACCENT IMAGE */}
      <div className="absolute -bottom-4 -left-4 pointer-events-none z-10 hidden sm:block opacity-100 select-none">
        <img
          src="/moringa_corner_accent.png"
          alt="Fresh Moringa Leaves and Seeds"
          className="w-40 sm:w-48 lg:w-56 h-auto object-contain drop-shadow-xl"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* ================= LEFT SIDE COLUMN ================= */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left relative z-20 order-1 lg:order-1 pt-2 lg:pt-0">

            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#183B24] text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-md border border-[#C99A2E]/40 font-sans">
              <Leaf className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>100% DIRECT FARM PRODUCE & ORGANIC SUPPLIER</span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[4.2rem] font-bold text-[#183B24] leading-[1.06] tracking-tight">
                Premium Organic <span className="font-serif italic font-normal text-[#C99A2E]">Moringa & Produce</span>
              </h1>

              <p className="text-[11px] sm:text-sm uppercase tracking-[0.22em] font-extrabold text-[#C99A2E] pt-1 font-sans">
                PURE ORGANIC HARVEST • DIRECT SUPPLY • CERTIFIED QUALITY
              </p>

              <div className="w-16 h-[3px] bg-[#C99A2E] rounded-full mt-2" />
            </div>

            {/* Narrative Description */}
            <p className="text-xs sm:text-base text-[#4A554D] leading-relaxed max-w-xl font-bold font-sans">
              Nourish your crops and wellness with 100% organic Moringa Oleifera, essential oils, and raw farm produce direct from Indian farms.
            </p>

            {/* 4 Compact Luxury Mobile Bento Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-white via-[#FDFCF9] to-[#F4F0E6] border border-[#C99A2E]/35 rounded-2xl p-3 sm:p-3.5 shadow-sm hover:shadow-xl hover:border-[#183B24] transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden flex items-center gap-2.5 sm:flex-col sm:text-center sm:justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent absolute top-0 inset-x-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shadow-xs border border-[#C99A2E]/40 shrink-0 group-hover:scale-110 transition-transform">
                  <Sprout className="w-4 h-4 text-[#D4A017]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[#183B24] leading-tight uppercase tracking-wider block font-sans truncate">
                    Direct Farm
                  </span>
                  <span className="text-[9px] text-[#556358] font-bold block sm:hidden">100% Organic</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-white via-[#FDFCF9] to-[#F4F0E6] border border-[#C99A2E]/35 rounded-2xl p-3 sm:p-3.5 shadow-sm hover:shadow-xl hover:border-[#183B24] transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden flex items-center gap-2.5 sm:flex-col sm:text-center sm:justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent absolute top-0 inset-x-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shadow-xs border border-[#C99A2E]/40 shrink-0 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-4 h-4 text-[#D4A017]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[#183B24] leading-tight uppercase tracking-wider block font-sans truncate">
                    Lab Certified
                  </span>
                  <span className="text-[9px] text-[#556358] font-bold block sm:hidden">Purity Tested</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-white via-[#FDFCF9] to-[#F4F0E6] border border-[#C99A2E]/35 rounded-2xl p-3 sm:p-3.5 shadow-sm hover:shadow-xl hover:border-[#183B24] transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden flex items-center gap-2.5 sm:flex-col sm:text-center sm:justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent absolute top-0 inset-x-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shadow-xs border border-[#C99A2E]/40 shrink-0 group-hover:scale-110 transition-transform">
                  <Leaf className="w-4 h-4 text-[#D4A017]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[#183B24] leading-tight uppercase tracking-wider block font-sans truncate">
                    Stem-Free
                  </span>
                  <span className="text-[9px] text-[#556358] font-bold block sm:hidden">Dehydrated</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-gradient-to-br from-white via-[#FDFCF9] to-[#F4F0E6] border border-[#C99A2E]/35 rounded-2xl p-3 sm:p-3.5 shadow-sm hover:shadow-xl hover:border-[#183B24] transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden flex items-center gap-2.5 sm:flex-col sm:text-center sm:justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent absolute top-0 inset-x-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shadow-xs border border-[#C99A2E]/40 shrink-0 group-hover:scale-110 transition-transform">
                  <Heart className="w-4 h-4 text-[#D4A017]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[#183B24] leading-tight uppercase tracking-wider block font-sans truncate">
                    GST Invoiced
                  </span>
                  <span className="text-[9px] text-[#556358] font-bold block sm:hidden">Tax Invoice</span>
                </div>
              </div>
            </div>

            {/* Dark Premium Featured Product Card */}
            <div className="pt-2">
              <div
                className="flex items-center gap-3.5 p-3.5 sm:p-4 bg-gradient-to-r from-[#142617] via-[#183B24] to-[#142617] text-white rounded-2xl shadow-xl border border-[#C99A2E]/50 max-w-md w-full cursor-pointer hover:border-[#C99A2E] transition-all relative z-20 group"
                onClick={() => featuredProduct && onOpenProductModal && onOpenProductModal(featuredProduct)}
              >

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[#D4A017] text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                    <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                    <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                    <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                    <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                    <span className="text-white font-bold text-[10px] sm:text-[11px] ml-1 font-sans">4.8 / 5.0 Rating</span>
                  </div>
                  <p className="font-extrabold text-xs sm:text-sm text-white truncate mt-0.5 font-sans">
                    {featuredProduct?.name || 'Organic Moringa Oleifera Powder'}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#E0ECE1] truncate font-semibold font-sans">
                    Stem-free dehydrated leaves ·{' '}
                    <span className="text-[#D4A017] font-extrabold font-sans">
                      ₹{featuredProduct?.price || 250}
                    </span>
                  </p>
                </div>
                <a
                  href="#products-section"
                  aria-label="View featured product in store"
                  className="w-10 h-10 sm:w-10 sm:h-10 min-w-[40px] min-h-[40px] rounded-full bg-[#D4A017] text-[#183B24] flex items-center justify-center hover:scale-110 transition-transform shrink-0 shadow-md"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 relative z-20">
              <a
                href="#b2b-rfq-section"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#183B24] hover:bg-[#23472C] text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-lg group font-sans border border-[#C99A2E]/50 text-center"
              >
                <Leaf className="w-4 h-4 text-[#D4A017]" />
                <span>Request Wholesale Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#products-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#F4F2EA] text-[#183B24] font-extrabold text-xs sm:text-sm border-2 border-[#183B24] transition-colors font-sans shadow-xs text-center"
              >
                <span>Browse Catalog</span>
              </a>
            </div>

          </div>

          {/* ================= HERO CAROUSEL & PREVIEW LIST (SECTION 2: FULL MOBILE VIEWPORT FIT WITH ZERO GAPS & ANIMATED) ================= */}
          <div className="lg:col-span-6 relative order-2 lg:order-2 w-full flex flex-col justify-between py-1 sm:py-0 transition-all duration-500">
            <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 items-stretch">

              {/* MAIN CAROUSEL CARD */}
              <div
                className="relative flex-1 w-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-slate-100 shadow-2xl border border-[#E6E2D8] min-h-[440px] sm:min-h-[520px] lg:min-h-[560px] aspect-[4/4.6] sm:aspect-[1.05/1]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <img
                  key={currentSlideIndex}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover transition-all duration-700 animate-in fade-in zoom-in-95"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

                {/* OVERLAY GLASS CARD ON TOP-LEFT OF SLIDE */}
                <div className="absolute top-4 left-4 right-4 sm:right-auto max-w-[270px] sm:max-w-[330px] bg-[#FAF8F3]/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/80 shadow-xl z-10 space-y-1 text-left">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#486027] text-white flex items-center justify-center shadow-md mb-1">
                    <Sprout className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>

                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4922A] block font-sans">
                    {currentSlide.tagline}
                  </span>

                  <h2 className="font-serif text-xl sm:text-3xl text-[#1C2A1E] font-normal leading-snug">
                    {currentSlide.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#4A554D] font-light leading-relaxed font-sans">
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* Carousel Previous / Next Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#1C2A1E] flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 z-20 border border-slate-100"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#1C2A1E] flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 z-20 border border-slate-100"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlideIndex
                        ? 'w-6 bg-white shadow-md'
                        : 'w-2 bg-white/60 hover:bg-white'
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT-EDGE PREVIEW LIST (Desktop Vertical) */}
              <div className="hidden sm:grid grid-cols-4 xl:flex xl:flex-col gap-3 shrink-0 justify-center">
                {sidePreviews.map((prev, idx) => (
                  <div
                    key={prev.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Switch to slide ${prev.title}`}
                    onClick={() => setCurrentSlideIndex(idx % slides.length)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCurrentSlideIndex(idx % slides.length);
                      }
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 bg-white/90 backdrop-blur-md shadow-2xs hover:shadow-md w-full xl:w-52 ${currentSlideIndex === idx % slides.length
                      ? 'border-[#273B24] ring-2 ring-[#273B24]/30 bg-white shadow-sm'
                      : 'border-[#E6E2D8] hover:border-slate-300'
                      }`}
                  >
                    {prev.isIcon ? (
                      <div className="w-11 h-11 rounded-xl bg-[#F4F2EA] text-[#486027] flex items-center justify-center shrink-0">
                        <Sprout className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 shadow-2xs">
                        <img
                          src={prev.image}
                          alt={prev.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-[#2C382E] leading-tight text-left line-clamp-2 font-sans">
                      {prev.title}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* MOBILE PREVIEW STRIP DIRECTLY BELOW CAROUSEL CARD: 'Explore Our Goodness' */}
            <div className="sm:hidden mt-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-[#E6E2D8] space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#1C2A1E] font-sans px-1">
                <span>Explore Our Goodness</span>
                <a href="#products-section" className="text-[11px] font-bold text-[#875C0A] hover:text-[#5F4005] underline underline-offset-2">
                  View All →
                </a>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sidePreviews.map((prev, idx) => (
                  <div
                    key={prev.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Switch to slide ${prev.title}`}
                    onClick={() => setCurrentSlideIndex(idx % slides.length)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCurrentSlideIndex(idx % slides.length);
                      }
                    }}
                    className={`flex flex-col items-center text-center p-1.5 rounded-xl border transition-all cursor-pointer ${currentSlideIndex === idx % slides.length
                      ? 'border-[#273B24] bg-white ring-2 ring-[#273B24]/30 shadow-xs'
                      : 'border-[#E6E2D8] bg-white/70'
                      }`}
                  >
                    {prev.isIcon ? (
                      <div className="w-11 h-11 rounded-lg bg-[#F4F2EA] text-[#486027] flex items-center justify-center">
                        <Sprout className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                        <img
                          src={prev.image}
                          alt={prev.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-[9px] font-semibold text-[#2C382E] leading-tight mt-1.5 line-clamp-2 font-sans">
                      {prev.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
