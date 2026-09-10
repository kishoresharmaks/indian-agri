'use client';

import React from 'react';
import Link from 'next/link';
import {
  Leaf,
  Award,
  Phone,
  FileText,
  Sparkles,
  MapPin,
  Heart,
  Sprout,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import {
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaPinterest,
  FaFacebook,
  FaGoogle,
} from 'react-icons/fa';

interface FooterProps {
  products?: any[];
  onOpenTrackModal?: () => void;
}

export default function Footer({
  onOpenTrackModal,
}: FooterProps) {
  return (
    <footer
      className="relative overflow-hidden bg-[#07130a] text-[#FAF8F5]"
      style={{
        backgroundImage: "url('/footer_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="absolute inset-0 bg-[#06120a]/90" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,160,23,0.10),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(37,211,102,0.08),transparent_30%)]" />

      <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D4A017]/5 blur-[100px]" />

      <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#25D366]/5 blur-[120px]" />

      {/* =========================================================
          MAIN CONTAINER
      ========================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8 lg:py-10">

        {/* =======================================================
            TOP TRUST BAR
        ======================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-2.5 sm:mb-8 sm:grid-cols-3 sm:gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 backdrop-blur-md">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10">
              <Leaf className="h-3.5 w-3.5 text-[#25D366]" />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                Naturally Grown
              </p>
              <p className="text-[10px] text-[#9eb8a2]">
                Ethical farm partnerships
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 backdrop-blur-md">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4A017]/10">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D4A017]" />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                Quality Assured
              </p>
              <p className="text-[10px] text-[#9eb8a2]">
                Certified quality standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 backdrop-blur-md">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10">
              <Sprout className="h-3.5 w-3.5 text-[#25D366]" />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                From Indian Farms
              </p>
              <p className="text-[10px] text-[#9eb8a2]">
                Supporting local agriculture
              </p>
            </div>
          </div>
        </div>

        {/* =======================================================
            MAIN FOOTER GRID
        ======================================================== */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* =====================================================
              BRAND
          ====================================================== */}

          <div className="lg:col-span-4">
            <div className="space-y-3.5">

              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4A017]/60 bg-[#FFFDE7] p-1 shadow-[0_4px_20px_rgba(212,160,23,0.15)]">
                  <img
                    src="/logo-nav.png"
                    alt="Indian Agriculture Logo"
                    className="h-full w-full rounded-lg object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.jpg';
                    }}
                  />

                  <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#07130a] bg-[#25D366]">
                    <Leaf className="h-2.5 w-2.5 text-[#06120a]" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold tracking-wide text-white sm:text-xl">
                    INDIAN AGRICULTURE
                  </h3>

                  <p className="mt-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017] sm:text-[9.5px]">
                    Organic Produce & Bulk Supply
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="max-w-md text-xs font-medium leading-5 text-[#a9bcae]">
                India&apos;s trusted source for stem-free organic Moringa
                Oleifera, pure veg HPMC capsules, and quality agricultural
                produce sourced through ethical farm partnerships.
              </p>

              {/* Social */}
              <div>
                <p className="mb-2 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
                  Connect With Us
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919597250344"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-[#25D366]/20 bg-[#25D366]/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/60 hover:bg-[#25D366]/20 hover:shadow-[0_4px_15px_rgba(37,211,102,0.15)]"
                  >
                    <FaWhatsapp className="h-4 w-4 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/indian_agriculture_pvt?stkn=bTlsY3pxdDNnampt"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10"
                  >
                    <FaInstagram className="h-4 w-4 text-[#E1306C] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@indianagriculturepvtltd?si=k4SxOPJr1EiebDRS"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    title="YouTube"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10"
                  >
                    <FaYoutube className="h-4 w-4 text-[#FF0000] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* Pinterest */}
                  <a
                    href="https://pin.it/1J93BoPq8"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Pinterest"
                    title="Pinterest"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E60023]/50 hover:bg-[#E60023]/10"
                  >
                    <FaPinterest className="h-4 w-4 text-[#E60023] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/share/18GynvVubk/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10"
                  >
                    <FaFacebook className="h-4 w-4 text-[#1877F2] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* Google */}
                  <a
                    href="https://share.google/Gjio1PWvVXsbz2iNL"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Google Business"
                    title="Google Business"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4285F4]/50 hover:bg-[#4285F4]/10"
                  >
                    <FaGoogle className="h-4 w-4 text-[#4285F4] transition-transform duration-300 group-hover:scale-110" />
                  </a>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <p className="mb-2 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
                  Certified Standards
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-2.5 py-1.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
                    <img
                      src="/iso-9001.svg"
                      alt="ISO 9001"
                      className="h-7 w-8 shrink-0 object-contain"
                    />

                    <div>
                      <p className="text-[9.5px] font-bold text-white">
                        ISO 9001
                      </p>
                      <p className="text-[7.5px] text-[#8da593]">
                        Quality
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-2.5 py-1.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
                    <img
                      src="/iso-22000.svg"
                      alt="ISO 22000"
                      className="h-7 w-8 shrink-0 object-contain"
                    />

                    <div>
                      <p className="text-[9.5px] font-bold text-white">
                        ISO 22000
                      </p>
                      <p className="text-[7.5px] text-[#8da593]">
                        Food Safety
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-2.5 py-1.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
                    <img
                      src="/GMP_CERTIFIED.jpg"
                      alt="GMP Certified"
                      className="h-7.5 w-7.5 shrink-0 rounded-md bg-white p-0.5 object-contain"
                    />

                    <div>
                      <p className="text-[9.5px] font-bold text-white">
                        GMP
                      </p>
                      <p className="text-[7.5px] text-[#8da593]">
                        Certified
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-2.5 py-1.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
                    <img
                      src="/best_quality.jpg"
                      alt="Best Quality"
                      className="h-7.5 w-7.5 shrink-0 rounded-md bg-white p-0.5 object-contain"
                    />

                    <div>
                      <p className="text-[9.5px] font-bold text-white">
                        Best Quality
                      </p>
                      <p className="text-[7.5px] text-[#8da593]">
                        100% Original
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              QUICK LINKS
          ====================================================== */}

          <div className="lg:col-span-2">
            <div>
              <p className="mb-2.5 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
                Explore
              </p>

              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/products"
                    className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-xs sm:text-[13px] font-medium text-[#b4c5b8] transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-3.5 w-3.5 text-[#D4A017]" />
                      Products
                    </span>

                    <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/#story-section"
                    className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-xs sm:text-[13px] font-medium text-[#b4c5b8] transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#D4A017]" />
                      Our Story
                    </span>

                    <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>

                {onOpenTrackModal && (
                  <li>
                    <button
                      onClick={onOpenTrackModal}
                      className="group flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs sm:text-[13px] font-medium text-[#b4c5b8] transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-[#D4A017]" />
                        Track Order
                      </span>

                      <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </button>
                  </li>
                )}

                <li>
                  <Link
                    href="/"
                    className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-xs sm:text-[13px] font-medium text-[#b4c5b8] transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Leaf className="h-3.5 w-3.5 text-[#D4A017]" />
                      Home
                    </span>

                    <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* =====================================================
              LEGAL
          ====================================================== */}

          <div className="lg:col-span-2">
            <div>
              <p className="mb-2.5 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
                Compliance
              </p>

              <div className="space-y-2">

                {/* FSSAI */}
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3 backdrop-blur-md transition-all duration-300 hover:border-[#D4A017]/20 hover:bg-white/[0.05]">
                  <div className="mb-1 flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D4A017]/10">
                      <Award className="h-3 w-3 text-[#D4A017]" />
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-wide text-[#c8d5cb]">
                      FSSAI License
                    </span>
                  </div>

                  <p className="font-mono text-xs font-bold tracking-wide text-white sm:text-[13px]">
                    22426046000077
                  </p>

                  <p className="mt-0.5 text-[8px] leading-3 text-[#819786]">
                    Food Safety & Standards Authority of India
                  </p>
                </div>

                {/* GST */}
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3 backdrop-blur-md transition-all duration-300 hover:border-[#D4A017]/20 hover:bg-white/[0.05]">
                  <div className="mb-1 flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D4A017]/10">
                      <FileText className="h-3 w-3 text-[#D4A017]" />
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-wide text-[#c8d5cb]">
                      GSTIN
                    </span>
                  </div>

                  <p className="font-mono text-xs font-bold tracking-wide text-white sm:text-[13px]">
                    33CQHPP4937J1ZG
                  </p>

                  <p className="mt-0.5 text-[8px] leading-3 text-[#819786]">
                    GST tax invoicing & trade documentation
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* =====================================================
              CONTACT
          ====================================================== */}

          <div className="lg:col-span-4">
            <p className="mb-2.5 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
              Let&apos;s Connect
            </p>

            <div className="relative overflow-hidden rounded-2xl border border-[#D4A017]/20 bg-gradient-to-br from-[#102617]/90 to-[#08150b]/95 p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.18)] sm:p-4">

              {/* Decorative glow */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#D4A017]/10 blur-3xl" />

              <div className="relative">

                <div className="mb-2.5 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366]/10">
                        <FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" />
                      </div>

                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#8fa895]">
                        Direct Support
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white sm:text-base">
                      Need help with an order?
                    </h4>

                    <p className="mt-0.5 text-[11px] leading-4 text-[#91a696]">
                      Talk directly with our team through WhatsApp.
                    </p>
                  </div>

                  <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#25D366]/20 bg-[#25D366]/10 sm:flex">
                    <Phone className="h-3.5 w-3.5 text-[#25D366]" />
                  </div>
                </div>

                {/* Phone */}
                <a
                  href="https://wa.me/919597250344"
                  target="_blank"
                  rel="noreferrer"
                  className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2 transition-all hover:border-[#25D366]/30 hover:bg-[#25D366]/5"
                >
                  <Phone className="h-3.5 w-3.5 text-[#25D366]" />

                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-wider text-[#728778]">
                      WhatsApp / Helpline
                    </p>

                    <p className="mt-0.5 font-mono text-sm font-bold tracking-wide text-white">
                      +91 95972 50344
                    </p>
                  </div>
                </a>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/919597250344?text=Hello%20Indian%20Agriculture%20Team%2C%20I%20want%20to%20inquire%20about%20organic%20produce%20and%20orders."
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-full items-center justify-between rounded-xl bg-[#25D366] px-3.5 py-2.5 font-bold text-[#06120a] shadow-[0_8px_25px_rgba(37,211,102,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2ee871] hover:shadow-[0_12px_30px_rgba(37,211,102,0.22)]"
                >
                  <span className="flex items-center gap-2">
                    <FaWhatsapp className="h-4 w-4" />
                    <span className="text-xs">
                      Chat on WhatsApp
                    </span>
                  </span>

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#06120a]/10">
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>

              </div>
            </div>

            {/* Address */}
            <div className="mt-2.5 flex gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4A017]" />

              <p className="text-[11px] font-medium leading-4.5 text-[#9caf9f]">
                No 3/101, Mandukovil Street, S.Thummalapatti,
                Batlagundu – 624211, Tamil Nadu
              </p>
            </div>
          </div>
        </div>

        {/* =======================================================
            BRAND MESSAGE
        ======================================================== */}

        <div className="mt-6 border-t border-white/[0.07] pt-3.5">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-[#809585] sm:text-[11px]">
            <span className="flex items-center gap-1.5">
              <Leaf className="h-3 w-3 text-[#25D366]" />
              Sustainable Farming
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="flex items-center gap-1.5">
              <Heart className="h-3 w-3 text-[#25D366]" />
              Healthier Living
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="flex items-center gap-1.5">
              <Sprout className="h-3 w-3 text-[#25D366]" />
              Stronger India
            </span>
          </div>
        </div>

        {/* =======================================================
            BOTTOM SECTION
        ======================================================== */}

        <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-3.5 md:flex-row">

          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-[11px] font-medium text-[#738678]">
              © 2026 INDIAN AGRICULTURE
            </p>

            <p className="mt-0.5 text-[8.5px] uppercase tracking-[0.15em] text-[#536557]">
              All Rights Reserved
            </p>
          </div>

          {/* Developer Card */}
          <Link
            href="/developer"
            className="group relative flex w-full max-w-sm items-center gap-2.5 overflow-hidden rounded-xl border border-[#D4A017]/25 bg-[#08150b]/80 px-3 py-1.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4A017]/60 hover:bg-[#0b1c0e] hover:shadow-[0_10px_30px_rgba(212,160,23,0.12)] sm:w-auto"
          >
            {/* Gold glow */}
            <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-[#D4A017]/10 blur-xl transition-opacity group-hover:opacity-100" />

            {/* Code icon */}
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#D4A017]/30 bg-[#D4A017]/10 font-mono text-[10px] font-bold text-[#D4A017]">
              {'</>'}
            </div>

            {/* Text */}
            <div className="relative min-w-0 flex-1">
              <p className="text-[7.5px] font-bold uppercase tracking-[0.18em] text-[#718273]">
                Designed & Developed by
              </p>

              <p className="mt-0.5 truncate text-[10.5px] font-bold tracking-wide text-[#D4A017]">
                Code for a Greener Tomorrow
              </p>
            </div>

            {/* Arrow */}
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#D4A017]/20 bg-[#D4A017]/5 text-[#D4A017] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#D4A017]/10">
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </Link>
        </div>

        {/* Tagline */}
        <div className="mt-3 flex items-center justify-center gap-2 text-center">
          <span className="h-px w-6 bg-[#D4A017]/20" />

          <p className="font-serif text-[11px] italic tracking-wide text-[#718474]">
            Good Food
            <span className="mx-1.5 text-[#D4A017]">•</span>
            Healthy People
            <span className="mx-1.5 text-[#D4A017]">•</span>
            Greener Tomorrow
          </p>

          <span className="h-px w-6 bg-[#D4A017]/20" />
        </div>

      </div>
    </footer>
  );
}