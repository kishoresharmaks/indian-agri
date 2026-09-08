'use client';

import React from 'react';
import {
  Leaf,
  Sprout,
  ShieldCheck,
  Award,
  Recycle,
  Users,
  Sparkles,
} from 'lucide-react';

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  badge: string;
  description: string;
}

const commitmentFeatures: FeatureCard[] = [
  {
    icon: Leaf,
    title: 'Sustainable Sourcing',
    badge: '100% Regenerative',
    description:
      'Cultivated using ethical farming practices across thousands of organic acres with zero synthetic chemicals.',
  },
  {
    icon: ShieldCheck,
    title: 'Guaranteed Quality',
    badge: 'Lab COA Certified',
    description:
      'Stem-free low-temperature dehydration. Every batch verified by accredited laboratory quality reports.',
  },
  {
    icon: Users,
    title: 'Direct Farmer Support',
    badge: 'Fair Trade Value',
    description:
      'Empowering local Indian agricultural communities with direct farm contracts and transparent fair pricing.',
  },
  {
    icon: Recycle,
    title: 'Eco-Friendly Packing',
    badge: 'GST & Export Ready',
    description:
      'Custom OEM bulk drums, retail pouches, and tax-compliant invoicing with pan-India express freight.',
  },
];

export default function CommitmentSection() {
  return (
    <section id="benefits-section" className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F3] text-[#183B24] relative overflow-hidden">

      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#EAE6DC]/50 blur-[130px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#C99A2E]/5 blur-[120px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 sm:space-y-20">

        {/* HERO INTRO EDITORIAL SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* LEFT COLUMN: Messaging */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C99A2E] bg-[#183B24] text-[#D4A017] shadow-md">
              <Sparkles className="w-4 h-4 text-[#D4A017]" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-extrabold font-sans">
                OUR COMMITMENT TO EXCELLENCE
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[4rem] font-bold text-[#183B24] leading-[1.08] tracking-tight">
              Empowering Wellness With <br className="hidden sm:block" />
              <em className="italic text-[#183B24] font-serif font-normal">Direct Farm Supply.</em>
            </h2>

            <div className="flex items-center gap-2 pt-1">
              <div className="w-14 h-[3px] bg-[#C99A2E] rounded-full" />
              <Leaf className="w-4 h-4 text-[#C99A2E]" />
            </div>

            <p className="text-sm sm:text-base text-[#4A554D] font-semibold leading-relaxed max-w-lg font-sans">
              We combine traditional agricultural wisdom with modern processing standards to deliver pure, lab-tested, and planet-friendly organic produce directly from Indian farmlands.
            </p>
          </div>

          {/* RIGHT COLUMN: Visual Farm Story Container */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">

              {/* Organic Curved Image Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#183B24] shadow-2xl border-2 border-[#C99A2E]/30 group">
                <img
                  src="/moringa_farm_philosophy.png"
                  alt="Fresh Organic Moringa Oleifera Plantation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#183B24]/80 via-transparent to-black/10 pointer-events-none" />
              </div>

              {/* Overlapping Commitment Floating Card */}
              <div className="bg-[#183B24]/95 backdrop-blur-md text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#C99A2E]/40 shadow-2xl max-w-md w-full relative sm:absolute sm:-bottom-7 sm:left-6 z-20 mt-6 sm:mt-0 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#142617] border border-[#C99A2E]/40 text-[#D4A017] flex items-center justify-center shrink-0 shadow-md">
                  <Sprout className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <span className="text-[#D4A017] text-[10px] font-extrabold uppercase tracking-[0.2em] block mb-1 font-sans">
                    OUR GUARANTEE
                  </span>
                  <p className="text-xs sm:text-sm text-[#E0ECE1] font-medium leading-relaxed font-sans">
                    Restoring soil health, empowering farmer communities, and delivering 100% pure organic produce you can trust.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4 LUXURY COMMITMENT FEATURE CARDS WITH PERFECT SPACING */}
        <div className="pt-6 sm:pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {commitmentFeatures.map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F4F0E6] border border-[#C99A2E]/30 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-2xl hover:border-[#183B24] transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between space-y-5 group"
                >
                  {/* Top Gold Foil Accent Bar */}
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent absolute top-0 inset-x-0 opacity-60 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    {/* Top Row: Icon Badge + Badge Pill */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#183B24] text-[#D4A017] flex items-center justify-center border border-[#C99A2E]/40 shadow-md group-hover:scale-110 transition-transform shrink-0">
                        <IconComp className="w-6 h-6 text-[#D4A017]" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#183B24]/10 border border-[#C99A2E]/30 text-[10px] font-extrabold text-[#183B24] uppercase tracking-wider font-sans">
                        {feature.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#183B24] tracking-tight leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A554D] font-medium leading-relaxed mt-2 font-sans">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E0D8] flex items-center gap-1.5 text-[11px] font-extrabold text-[#183B24] uppercase tracking-wider font-sans">
                    <Award className="w-3.5 h-3.5 text-[#C99A2E]" />
                    <span>Verified Quality</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
