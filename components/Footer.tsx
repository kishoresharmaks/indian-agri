'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Leaf, ShieldCheck, Award } from 'lucide-react';

interface FooterProps {
  onOpenTrackModal?: () => void;
}

export default function Footer({ onOpenTrackModal }: FooterProps) {
  return (
    <footer className="bg-[#1B2E1E] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2A402D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Newsletter Subscription Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#233A27] border border-[#2D4A31] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs text-[#D4A017] uppercase tracking-widest font-semibold mb-2">
              <Leaf className="w-3.5 h-3.5" />
              <span>Organic Living Newsletter</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#FAF8F5]">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-[#A3B8A6] mt-2 font-light leading-relaxed">
              Get 10% off your first order plus farm updates, traditional wellness guides, and exclusive organic harvest alerts.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 w-full lg:w-auto">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="px-5 py-3.5 rounded-full bg-[#1B2E1E] border border-[#2D4A31] text-xs text-[#FAF8F5] placeholder-[#A3B8A6] focus:outline-none focus:border-[#D4A017] w-full sm:w-80 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full bg-[#D4A017] text-[#1B2E1E] font-bold text-xs hover:bg-[#b88a14] transition-all shadow-md flex-shrink-0"
            >
              Join Now
            </button>
          </form>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-[#2A402D] text-xs">

          {/* Brand Summary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="Indian Agriculture Logo" className="w-10 h-10 rounded-full object-contain border-2 border-[#D4A017]/80 bg-white p-0.5 shadow-sm" />
              <div className="font-serif font-bold text-lg text-[#FAF8F5] tracking-wide">INDIAN AGRICULTURE</div>
            </div>
            <p className="text-[#A3B8A6] font-light leading-relaxed">
              Nourishing health and farmlands across India with 100% regeneratively farmed organic produce. Stem-free & low-temperature dehydrated.
            </p>
            <div className="text-[11px] text-[#D4A017] font-semibold tracking-wider uppercase">
              INDIANAGRICULTURE.online
            </div>
          </div>

          {/* Quick Links / Shop */}
          <div className="space-y-2.5">
            <div className="font-semibold text-[#FAF8F5] uppercase tracking-wider text-[11px]">Shop Products</div>
            <ul className="space-y-2 text-[#A3B8A6] font-light">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Moringa Oleifera Powder</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Organic Wellness Spices</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Natural Farm Harvest</Link></li>
            </ul>
          </div>

          {/* Company Information */}
          <div className="space-y-2.5">
            <div className="font-semibold text-[#FAF8F5] uppercase tracking-wider text-[11px]">Information</div>
            <ul className="space-y-2 text-[#A3B8A6] font-light">
              <li><Link href="/#story-section" className="hover:text-white transition-colors">Our Philosophy & Story</Link></li>
              <li><Link href="/#benefits-section" className="hover:text-white transition-colors">Regenerative Farming</Link></li>
              <li><Link href="/#reviews-section" className="hover:text-white transition-colors">Customer Reviews</Link></li>
              {onOpenTrackModal ? (
                <li>
                  <button onClick={onOpenTrackModal} className="hover:text-white transition-colors text-left">
                    Track Order Status
                  </button>
                </li>
              ) : (
                <li><Link href="/" className="hover:text-white transition-colors">Track Order</Link></li>
              )}
            </ul>
          </div>

          {/* Contact & Direct Support */}
          <div className="space-y-3">
            <div className="font-semibold text-[#FAF8F5] uppercase tracking-wider text-[11px]">Contact & Support</div>
            <p className="text-[#A3B8A6] font-light leading-relaxed">
              India Direct Customer Care & Wholesale Inquiries:
            </p>
            <a
              href="https://wa.me/919578784431"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#233A27] text-[#D4A017] border border-[#2D4A31] font-semibold text-xs hover:bg-[#2B4630] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Direct Support</span>
            </a>

            {/* Certifications */}
            <div className="pt-2 flex items-center gap-3 text-[11px] text-[#A3B8A6]">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>100% Organic</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>FSSAI Certified</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="pt-8 border-t border-[#2A402D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3B8A6]">
          <p>© 2026 INDIAN AGRICULTURE. All Rights Reserved. INDIANAGRICULTURE.online</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#233A27] border border-[#2D4A31]">UPI / GPay / PhonePe</span>
            <span className="px-2 py-0.5 rounded bg-[#233A27] border border-[#2D4A31]">Credit & Debit Cards</span>
            <span className="px-2 py-0.5 rounded bg-[#233A27] border border-[#2D4A31]">Net Banking</span>
            <span className="px-2 py-0.5 rounded bg-[#233A27] border border-[#2D4A31]">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
