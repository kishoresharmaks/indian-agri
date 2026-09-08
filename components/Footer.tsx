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
  ExternalLink,
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
  products: initialProducts = [],
  onOpenTrackModal,
}: FooterProps) {
  const [productList, setProductList] =
    React.useState<any[]>(initialProducts);

  React.useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProductList(initialProducts);
      return;
    }

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setProductList(data.data);
        }
      })
      .catch(() => {});
  }, [initialProducts]);

  const displayProducts =
    productList && productList.length > 0
      ? productList.slice(0, 4)
      : [];

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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

        {/* =======================================================
            TOP TRUST BAR
        ======================================================== */}

        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 backdrop-blur-md">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10">
              <Leaf className="h-4 w-4 text-[#25D366]" />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                Naturally Grown
              </p>
              <p className="mt-0.5 text-[10px] text-[#9eb8a2]">
                Ethical farm partnerships
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 backdrop-blur-md">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4A017]/10">
              <ShieldCheck className="h-4 w-4 text-[#D4A017]" />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                Quality Assured
              </p>
              <p className="mt-0.5 text-[10px] text-[#9eb8a2]">
                Certified quality standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 backdrop-blur-md">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10">
              <Sprout className="h-4 w-4 text-[#25D366]" />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                From Indian Farms
              </p>
              <p className="mt-0.5 text-[10px] text-[#9eb8a2]">
                Supporting local agriculture
              </p>
            </div>
          </div>
        </div>

        {/* =======================================================
            MAIN FOOTER GRID
        ======================================================== */}

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">

          {/* =====================================================
              BRAND
          ====================================================== */}

          <div className="lg:col-span-4">
            <div className="space-y-6">

              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D4A017]/60 bg-[#FFFDE7] p-1 shadow-[0_8px_30px_rgba(212,160,23,0.15)]">
                  <img
                    src="/logo-nav.png"
                    alt="Indian Agriculture Logo"
                    className="h-full w-full rounded-xl object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.jpg';
                    }}
                  />

                  <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#07130a] bg-[#25D366]">
                    <Leaf className="h-3 w-3 text-[#06120a]" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold tracking-wide text-white sm:text-2xl">
                    INDIAN AGRICULTURE
                  </h3>

                  <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017] sm:text-[10px]">
                    Organic Produce & Bulk Supply
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="max-w-md text-sm font-medium leading-6 text-[#a9bcae]">
                India&apos;s trusted source for stem-free organic Moringa
                Oleifera, pure veg HPMC capsules, and quality agricultural
                produce sourced through ethical farm partnerships.
              </p>

              {/* Social */}
              <div>
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
                  Connect With Us
                </p>

                <div className="flex flex-wrap gap-2">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919597250344"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#25D366]/60 hover:bg-[#25D366]/20 hover:shadow-[0_8px_25px_rgba(37,211,102,0.15)]"
                  >
                    <FaWhatsapp className="h-5 w-5 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/indian_agriculture_pvt?stkn=bTlsY3pxdDNnampt"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10"
                  >
                    <FaInstagram className="h-5 w-5 text-[#E1306C] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@indianagriculturepvtltd?si=k4SxOPJr1EiebDRS"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    title="YouTube"
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10"
                  >
                    <FaYoutube className="h-5 w-5 text-[#FF0000] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* Pinterest */}
                  <a
                    href="https://pin.it/1J93BoPq8"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Pinterest"
                    title="Pinterest"
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[#E60023]/50 hover:bg-[#E60023]/10"
                  >
                    <FaPinterest className="h-5 w-5 text-[#E60023] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/share/18GynvVubk/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10"
                  >
                    <FaFacebook className="h-5 w-5 text-[#1877F2] transition-transform duration-300 group-hover:scale-110" />
                  </a>

                  {/* Google */}
                  <a
                    href="https://share.google/Gjio1PWvVXsbz2iNL"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Google Business"
                    title="Google Business"
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[#4285F4]/50 hover:bg-[#4285F4]/10"
                  >
                    <FaGoogle className="h-5 w-5 text-[#4285F4] transition-transform duration-300 group-hover:scale-110" />
                  </a>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
                  Certified Standards
                </p>

                <div className="flex gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2">
                    <img
                      src="/iso-9001.svg"
                      alt="ISO 9001"
                      className="h-9 w-12 object-contain"
                    />

                    <div>
                      <p className="text-[10px] font-bold text-white">
                        ISO 9001
                      </p>
                      <p className="text-[8px] text-[#8da593]">
                        Quality
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2">
                    <img
                      src="/iso-22000.svg"
                      alt="ISO 22000"
                      className="h-9 w-12 object-contain"
                    />

                    <div>
                      <p className="text-[10px] font-bold text-white">
                        ISO 22000
                      </p>
                      <p className="text-[8px] text-[#8da593]">
                        Food Safety
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
              <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
                Explore
              </p>

              <ul className="space-y-1">
                <li>
                  <Link
                    href="/products"
                    className="group flex items-center justify-between rounded-xl px-2 py-2.5 text-sm font-medium text-[#b4c5b8] transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-[#D4A017]" />
                      Products
                    </span>

                    <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/#story-section"
                    className="group flex items-center justify-between rounded-xl px-2 py-2.5 text-sm font-medium text-[#b4c5b8] transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#D4A017]" />
                      Our Story
                    </span>

                    <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>

                {onOpenTrackModal && (
                  <li>
                    <button
                      onClick={onOpenTrackModal}
                      className="group flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left text-sm font-medium text-[#b4c5b8] transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#D4A017]" />
                        Track Order
                      </span>

                      <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </button>
                  </li>
                )}

                <li>
                  <Link
                    href="/"
                    className="group flex items-center justify-between rounded-xl px-2 py-2.5 text-sm font-medium text-[#b4c5b8] transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-[#D4A017]" />
                      Home
                    </span>

                    <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
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
              <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
                Compliance
              </p>

              <div className="space-y-3">

                {/* FSSAI */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 backdrop-blur-md transition-all duration-300 hover:border-[#D4A017]/20 hover:bg-white/[0.05]">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4A017]/10">
                      <Award className="h-3.5 w-3.5 text-[#D4A017]" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#c8d5cb]">
                      FSSAI License
                    </span>
                  </div>

                  <p className="font-mono text-sm font-bold tracking-wide text-white">
                    22426046000077
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#819786]">
                    Food Safety & Standards Authority of India
                  </p>
                </div>

                {/* GST */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 backdrop-blur-md transition-all duration-300 hover:border-[#D4A017]/20 hover:bg-white/[0.05]">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4A017]/10">
                      <FileText className="h-3.5 w-3.5 text-[#D4A017]" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#c8d5cb]">
                      GSTIN
                    </span>
                  </div>

                  <p className="font-mono text-sm font-bold tracking-wide text-white">
                    33CQHPP4937J1ZG
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#819786]">
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
            <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4A017]">
              Let&apos;s Connect
            </p>

            <div className="relative overflow-hidden rounded-3xl border border-[#D4A017]/20 bg-gradient-to-br from-[#102617]/90 to-[#08150b]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-6">

              {/* Decorative glow */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#D4A017]/10 blur-3xl" />

              <div className="relative">

                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/10">
                        <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#8fa895]">
                        Direct Support
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white">
                      Need help with an order?
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-[#91a696]">
                      Talk directly with our team through WhatsApp.
                    </p>
                  </div>

                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#25D366]/20 bg-[#25D366]/10 sm:flex">
                    <Phone className="h-4 w-4 text-[#25D366]" />
                  </div>
                </div>

                {/* Phone */}
                <a
                  href="https://wa.me/919597250344"
                  target="_blank"
                  rel="noreferrer"
                  className="mb-4 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 transition-all hover:border-[#25D366]/30 hover:bg-[#25D366]/5"
                >
                  <Phone className="h-4 w-4 text-[#25D366]" />

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[#728778]">
                      WhatsApp / Helpline
                    </p>

                    <p className="mt-0.5 font-mono text-base font-bold tracking-wide text-white">
                      +91 95972 50344
                    </p>
                  </div>
                </a>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/919597250344?text=Hello%20Indian%20Agriculture%20Team%2C%20I%20want%20to%20inquire%20about%20organic%20produce%20and%20orders."
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-full items-center justify-between rounded-2xl bg-[#25D366] px-4 py-3.5 font-bold text-[#06120a] shadow-[0_10px_30px_rgba(37,211,102,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2ee871] hover:shadow-[0_15px_35px_rgba(37,211,102,0.22)]"
                >
                  <span className="flex items-center gap-2">
                    <FaWhatsapp className="h-5 w-5" />
                    <span className="text-xs">
                      Chat on WhatsApp
                    </span>
                  </span>

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#06120a]/10">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>

              </div>
            </div>

            {/* Address */}
            <div className="mt-4 flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A017]" />

              <p className="text-xs font-medium leading-5 text-[#9caf9f]">
                No 3/101, Mandukovil Street, S.Thummalapatti,
                Batlagundu – 624211, Tamil Nadu
              </p>
            </div>
          </div>
        </div>

        {/* =======================================================
            BRAND MESSAGE
        ======================================================== */}

        <div className="mt-12 border-t border-white/[0.07] pt-7">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-wider text-[#809585] sm:text-xs">
            <span className="flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-[#25D366]" />
              Sustainable Farming
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-[#25D366]" />
              Healthier Living
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-[#25D366]" />
              Stronger India
            </span>
          </div>
        </div>

        {/* =======================================================
            BOTTOM SECTION
        ======================================================== */}

        <div className="mt-7 flex flex-col items-center justify-between gap-5 border-t border-white/[0.07] pt-7 md:flex-row">

          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-[11px] font-medium text-[#738678]">
              © 2026 INDIAN AGRICULTURE
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#536557]">
              All Rights Reserved
            </p>
          </div>

          {/* Developer Card */}
          <Link
            href="/developer"
            className="group relative flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-2xl border border-[#D4A017]/25 bg-[#08150b]/80 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A017]/60 hover:bg-[#0b1c0e] hover:shadow-[0_15px_40px_rgba(212,160,23,0.12)] sm:w-auto"
          >
            {/* Gold glow */}
            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#D4A017]/10 blur-2xl transition-opacity group-hover:opacity-100" />

            {/* Code icon */}
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D4A017]/30 bg-[#D4A017]/10 font-mono text-xs font-bold text-[#D4A017]">
              {'</>'}
            </div>

            {/* Text */}
            <div className="relative min-w-0 flex-1">
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#718273]">
                Designed & Developed by
              </p>

              <p className="mt-0.5 truncate text-[11px] font-bold tracking-wide text-[#D4A017]">
                Code for a Greener Tomorrow
              </p>
            </div>

            {/* Arrow */}
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D4A017]/20 bg-[#D4A017]/5 text-[#D4A017] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#D4A017]/10">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>

        {/* Tagline */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center">
          <span className="h-px w-8 bg-[#D4A017]/20" />

          <p className="font-serif text-xs italic tracking-wide text-[#718474]">
            Good Food
            <span className="mx-2 text-[#D4A017]">•</span>
            Healthy People
            <span className="mx-2 text-[#D4A017]">•</span>
            Greener Tomorrow
          </p>

          <span className="h-px w-8 bg-[#D4A017]/20" />
        </div>

      </div>
    </footer>
  );
}