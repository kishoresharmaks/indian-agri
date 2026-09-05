'use client';

import React from 'react';
import {
  Leaf,
  Sprout,
  Feather,
  ShieldCheck,
  Recycle,
  HeartHandshake,
  Users,
} from 'lucide-react';

interface CommitmentItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const commitments: CommitmentItem[] = [
  {
    icon: Leaf,
    title: 'Regenerative Farming',
    description:
      'Cultivated using holistic agricultural methods that restore soil biology and retain natural moisture.',
  },
  {
    icon: Sprout,
    title: '100% Organic',
    description:
      'Zero chemical pesticides or synthetic growth enhancers. Pure, nutrient-rich produce guaranteed.',
  },
  {
    icon: Feather,
    title: 'Stem-Free Handcrafted',
    description:
      'Carefully selected leaves processed at low temperatures to lock in vibrant green chlorophyll & minerals.',
  },
  {
    icon: ShieldCheck,
    title: 'Ethically Crafted',
    description:
      'Direct partnership with local farm communities ensuring fair livelihood and eco-friendly packaging.',
  },
];

const bottomValues = [
  {
    icon: Leaf,
    title: 'Sustainable',
    subtitle: 'Better for the planet',
  },
  {
    icon: HeartHandshake,
    title: 'Better Quality',
    subtitle: 'Pure. Safe. Effective.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    subtitle: 'Empowering local farmers',
  },
  {
    icon: Recycle,
    title: 'Eco-Friendly',
    subtitle: 'Thoughtful at every step',
  },
];

export default function CommitmentSection() {
  return (
    <section id="benefits-section" className="py-16 sm:py-20 lg:py-28 bg-[#FAF8F3] text-[#123524] relative overflow-hidden transition-colors duration-500">
      {/* Smooth Soft Gradient Divider Blend (Eliminates sharp border line) */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#FAF8F3] via-[#FAF8F3]/90 to-transparent pointer-events-none z-10" />

      {/* Background Organic Ambient Gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E5E9D9]/40 blur-[130px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C9952E]/5 blur-[120px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20 lg:space-y-24">
        
        {/* HERO / INTRO TWO-COLUMN EDITORIAL COMPOSITION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Typography & Messaging */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Upper-Left Eyebrow Label with Botanical Leaf Icon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9952E]/40 bg-[#FCFBF7] text-[#C9952E] shadow-2xs">
              <Leaf className="w-3.5 h-3.5 text-[#C9952E]" />
              <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">
                Our Commitment
              </span>
            </div>

            {/* Main Editorial Serif Headline */}
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-[5.2rem] xl:text-[5.8rem] font-light text-[#123524] leading-[1.04] tracking-tight">
              Health From <br className="hidden sm:block" />
              the Inside & Out
            </h2>

            {/* Gold Decorative Accent Line */}
            <div className="w-16 h-[2px] bg-[#C9952E] rounded-full" />

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-[#5E685F] font-normal leading-relaxed max-w-lg">
              We combine ancient wisdom with modern science to bring you pure, effective and planet-friendly products.
            </p>
          </div>

          {/* RIGHT SIDE: Botanical Visual Area & Overlapping Commitment Panel */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              
              {/* Outer Top-Right Botanical Leaf Vine Accent */}
              <div className="absolute -top-12 -right-8 pointer-events-none z-10 text-[#C9952E] hidden sm:block">
                <svg className="w-40 h-40" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 120 C50 85 90 45 125 15"
                    stroke="#C9952E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <path
                    d="M50 85 C35 70 45 55 58 68 C70 80 55 90 50 85 Z"
                    stroke="#C9952E"
                    strokeWidth="1.2"
                    fill="#C9952E"
                    fillOpacity="0.15"
                    opacity="0.8"
                  />
                  <path
                    d="M82 53 C68 38 78 22 90 35 C102 48 88 58 82 53 Z"
                    stroke="#C9952E"
                    strokeWidth="1.2"
                    fill="#C9952E"
                    fillOpacity="0.2"
                    opacity="0.85"
                  />
                  <path
                    d="M115 22 C108 12 118 2 125 9 C132 16 122 26 115 22 Z"
                    stroke="#C9952E"
                    strokeWidth="1.2"
                    fill="#C9952E"
                    fillOpacity="0.3"
                    opacity="0.9"
                  />
                  <circle cx="128" cy="7" r="2.5" fill="#C9952E" opacity="0.9" />
                </svg>
              </div>

              {/* Organic Curved Botanical Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full rounded-tl-[100px] rounded-br-[100px] sm:rounded-tl-[140px] sm:rounded-br-[140px] overflow-hidden bg-gradient-to-br from-[#123524] via-[#0D281C] to-[#1E4530] shadow-2xl border-2 border-[#C9952E]/30 group">
                <img
                  src="/moringa_farm_philosophy.png"
                  alt="Fresh Organic Moringa Oleifera Plantation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Gentle Gradient Shading Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D281C]/80 via-transparent to-black/10 pointer-events-none" />
              </div>

              {/* OVERLAPPING CONTENT PANEL */}
              <div className="bg-[#0D281C]/95 backdrop-blur-md text-[#FCFBF7] p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#C9952E]/30 shadow-2xl max-w-md w-full relative sm:absolute sm:-bottom-8 sm:left-6 z-20 mt-6 sm:mt-0 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#123524] border border-[#C9952E]/40 text-[#C9952E] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[#C9952E] text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">
                    OUR COMMITMENT
                  </span>
                  <p className="text-xs sm:text-sm text-[#FCFBF7]/90 font-light leading-relaxed">
                    We are committed to restoring soil health, supporting local communities and creating products that are good for you and the planet.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* FOUR COMMITMENT FEATURES EDITORIAL GRID */}
        <div className="pt-8 lg:pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x lg:divide-[#123524]/15">
            {commitments.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="px-4 lg:px-8 text-center group flex flex-col items-center justify-between space-y-4"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#E5E9D9]/70 border border-[#C9952E]/30 text-[#123524] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#E5E9D9]">
                      <IconComp className="w-9 h-9 stroke-[1.4]" />
                    </div>
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#C9952E]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-light text-[#123524] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5E685F] font-normal leading-relaxed mt-2 max-w-xs mx-auto">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACCENT ROW */}
        <div className="pt-10 border-t border-[#123524]/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {bottomValues.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <div key={idx} className="flex items-center gap-3 bg-[#FCFBF7] p-4 rounded-2xl border border-[#C9952E]/20">
                <div className="w-10 h-10 rounded-full bg-[#E5E9D9]/60 text-[#C9952E] flex items-center justify-center shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#123524]">{val.title}</h4>
                  <p className="text-[11px] text-[#5E685F] font-light">{val.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
