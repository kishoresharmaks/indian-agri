'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Leaf,
  Award,
  Phone,
  FileText,
  Sparkles,
  MapPin,
  ExternalLink,
  Heart,
  Sprout
} from 'lucide-react';

interface FooterProps {
  products?: any[];
  onOpenTrackModal?: () => void;
}

export default function Footer({ products: initialProducts = [], onOpenTrackModal }: FooterProps) {
  const [productList, setProductList] = React.useState<any[]>(initialProducts);

  React.useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProductList(initialProducts);
    } else {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data && data.data.length > 0) {
            setProductList(data.data);
          }
        })
        .catch(() => { });
    }
  }, [initialProducts]);

  const displayProducts =
    productList && productList.length > 0
      ? productList.slice(0, 4)
      : [];

  return (
    <footer
      className="text-[#FAF8F5] relative overflow-hidden bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundImage: "url('/footer_bg.png')" }}
    >
      {/* Dark overlay — starts at SAME #09180b as RFQ section, so zero seam */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09180b] via-[#09180b]/95 to-[#061207]/90 -z-0 pointer-events-none" />

      {/* Soft ambient glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4A017]/10 blur-[130px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#25D366]/5 blur-[140px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 pt-10 pb-10">

        {/* MAIN FOOTER CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">

          {/* COLUMN 1: BRAND INFO & SOCIAL MEDIA (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Logo & Brand Name */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full border-2 border-[#D4A017] bg-white p-0.5 shadow-md shrink-0 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Indian Agriculture Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-white tracking-wide leading-tight">
                  INDIAN AGRICULTURE
                </h3>
                <p className="text-[10px] font-extrabold text-[#D4A017] uppercase tracking-widest">
                  ORGANIC PRODUCE &amp; BULK SUPPLY
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#c5d6c7] font-medium leading-relaxed">
              India&apos;s trusted source for 100% stem-free organic Moringa Oleifera, pure 100% veg HPMC capsules, and bulk agricultural produce directly from ethical partner farms.
            </p>

            {/* Social Media Links */}
            <div className="space-y-3 pt-1">
              <div className="text-[11px] font-extrabold text-[#D4A017] uppercase tracking-wider">
                CONNECT WITH US ON SOCIAL MEDIA
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/919597250344"
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp Indian Agriculture"
                  className="w-10 h-10 rounded-full bg-[#0d2112]/90 border border-[#1e4225] hover:border-[#25D366] hover:bg-[#25D366]/20 text-[#FAF8F5] flex items-center justify-center transition-all duration-300 shadow-md group"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/indian_agriculture_pvt?stkn=bTlsY3pxdDNnampt"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram Page"
                  className="w-10 h-10 rounded-full bg-[#0d2112]/90 border border-[#1e4225] hover:border-[#E1306C] hover:bg-[#E1306C]/20 text-[#FAF8F5] flex items-center justify-center transition-all duration-300 shadow-md group"
                >
                  <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform text-[#E1306C]" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@indianagriculturepvtltd?si=k4SxOPJr1EiebDRS"
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube Channel"
                  className="w-10 h-10 rounded-full bg-[#0d2112]/90 border border-[#1e4225] hover:border-[#FF0000] hover:bg-[#FF0000]/20 text-[#FAF8F5] flex items-center justify-center transition-all duration-300 shadow-md group"
                >
                  <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform text-[#FF0000]" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Pinterest */}
                <a
                  href="https://pin.it/1J93BoPq8"
                  target="_blank"
                  rel="noreferrer"
                  title="Pinterest Profile"
                  className="w-10 h-10 rounded-full bg-[#0d2112]/90 border border-[#1e4225] hover:border-[#E60023] hover:bg-[#E60023]/20 text-[#FAF8F5] flex items-center justify-center transition-all duration-300 shadow-md group"
                >
                  <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform text-[#E60023]" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C24.007 5.367 18.628 0 12.017 0z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/18GynvVubk/"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Page"
                  className="w-10 h-10 rounded-full bg-[#0d2112]/90 border border-[#1e4225] hover:border-[#1877F2] hover:bg-[#1877F2]/20 text-[#FAF8F5] flex items-center justify-center transition-all duration-300 shadow-md group"
                >
                  <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform text-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Google Share / Business */}
                <a
                  href="https://share.google/Gjio1PWvVXsbz2iNL"
                  target="_blank"
                  rel="noreferrer"
                  title="Google Business Location & Share"
                  className="w-10 h-10 rounded-full bg-[#0d2112]/90 border border-[#1e4225] hover:border-[#4285F4] hover:bg-[#4285F4]/20 text-[#FAF8F5] flex items-center justify-center transition-all duration-300 shadow-md group"
                >
                  <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform text-[#4285F4]" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Cursive Tagline */}
            <p className="font-serif italic text-sm text-[#a0cfa7] tracking-wide pt-1 flex items-center gap-1.5 font-medium">
              <span>Good Food</span>
              <span className="text-[#D4A017]">•</span>
              <span>Healthy People</span>
              <span className="text-[#D4A017]">•</span>
              <span>Greener Tomorrow</span>
              <Leaf className="w-4 h-4 text-[#25D366] inline-block ml-0.5" />
            </p>
          </div>

          {/* COLUMN 2: LEGAL & GOVERNMENT LICENSING (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[11px] font-extrabold text-white uppercase tracking-wider">
              LEGAL &amp; GOVERNMENT LICENSING
            </div>

            <div className="space-y-3">
              {/* FSSAI License */}
              <div className="p-4 rounded-xl bg-[#0e2413]/90 border border-[#1e4225] space-y-1 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#D4A017] font-extrabold text-xs">
                  <Award className="w-4 h-4 text-[#D4A017]" />
                  <span>FSSAI License No.</span>
                </div>
                <div className="font-mono font-bold text-base text-white tracking-wider">
                  22426046000077
                </div>
                <p className="text-[10px] text-[#9eb8a2] font-medium leading-tight">
                  Food Safety &amp; Standards Authority of India Certified Manufacturing
                </p>
              </div>

              {/* GSTIN Registration */}
              <div className="p-4 rounded-xl bg-[#0e2413]/90 border border-[#1e4225] space-y-1 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#D4A017] font-extrabold text-xs">
                  <FileText className="w-4 h-4 text-[#D4A017]" />
                  <span>GSTIN Number</span>
                </div>
                <div className="font-mono font-bold text-base text-white tracking-wider">
                  33CQHPP4937J1ZG
                </div>
                <p className="text-[10px] text-[#9eb8a2] font-medium leading-tight">
                  Compliant GST Tax Invoicing &amp; Trade Documentation
                </p>
              </div>
            </div>
          </div>

          {/* COLUMN 3: PRODUCTS & LINKS (2 cols) */}
          <div className="lg:col-span-2 space-y-4 text-xs">
            <div className="text-[11px] font-extrabold text-white uppercase tracking-wider">
              PRODUCTS &amp; LINKS
            </div>
            <ul className="space-y-3 text-[#c5d6c7] font-medium">
              <li>
                <Link href="/products" className="hover:text-[#D4A017] transition-colors flex items-center gap-2 group">
                  <Leaf className="w-3.5 h-3.5 text-[#D4A017] shrink-0 group-hover:scale-110 transition-transform" />
                  <span>All Organic Products</span>
                </Link>
              </li>
              <li>
                <Link href="/#story-section" className="hover:text-[#D4A017] transition-colors flex items-center gap-2 group">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A017] shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Our Farming Story</span>
                </Link>
              </li>
              {onOpenTrackModal && (
                <li>
                  <button onClick={onOpenTrackModal} className="hover:text-[#D4A017] transition-colors text-left flex items-center gap-2 font-medium group">
                    <FileText className="w-3.5 h-3.5 text-[#D4A017] shrink-0 group-hover:scale-110 transition-transform" />
                    <span>Track Order</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* COLUMN 4: DIRECT CONTACT & ORDERS (3 cols) */}
          <div className="lg:col-span-3 space-y-4 text-xs">
            <div className="text-[11px] font-extrabold text-white uppercase tracking-wider">
              DIRECT CONTACT &amp; ORDERS
            </div>

            <div className="p-4 rounded-xl bg-[#0e2413]/90 border border-[#1e4225] space-y-3.5 shadow-md backdrop-blur-sm">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#c5d6c7]">Direct Helpline &amp; WhatsApp:</div>
                <a
                  href="https://wa.me/919597250344"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-lg font-extrabold text-[#25D366] hover:underline flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#25D366]" />
                  <span>+91 95972 50344</span>
                </a>
              </div>

              <a
                href="https://wa.me/919597250344?text=Hello%20Indian%20Agriculture%20Team%2C%20I%20want%20to%20inquire%20about%20organic%20produce%20and%20orders."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#081c0e] font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#081c0e]" />
                <span>Chat On WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <div className="flex items-start gap-2 text-xs text-[#c5d6c7] font-medium pt-1">
              <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
              <span>Nagercoil, Kanyakumari Dist, Tamil Nadu – 629501</span>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & DEVELOPER BADGE SECTION */}
        <div className="pt-8 border-t border-[#1e4225]/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#9eb8a2] font-medium">
          {/* Copyright */}
          <p>© 2026 INDIAN AGRICULTURE. All Rights Reserved.</p>

          {/* Core Values / Features */}
          <div className="flex items-center gap-4 text-xs font-semibold text-[#a0cfa7]">
            <span className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#25D366]" />
              Sustainable Farming
            </span>
            <span className="w-[1px] h-3 bg-[#1e4225]" />
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#25D366]" />
              Healthier Living
            </span>
            <span className="w-[1px] h-3 bg-[#1e4225]" />
            <span className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#25D366]" />
              Stronger India
            </span>
          </div>

          {/* Designed & Developed Badge */}
          <div className="flex flex-col items-center sm:items-end">
            <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#9eb8a2]/70 font-bold mb-1">
              <span className="w-6 h-[1px] bg-[#9eb8a2]/30" /> BUILT WITH PURPOSE <span className="w-6 h-[1px] bg-[#9eb8a2]/30" />
            </div>

            {/* Glowing Pill Button */}
            <div className="relative inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0a180c]/90 border border-[#D4A017] shadow-[0_0_15px_rgba(212,160,23,0.35)] hover:shadow-[0_0_25px_rgba(212,160,23,0.6)] transition-all cursor-pointer group">
              {/* Floating Leaf Graphic Accent */}
              <div className="absolute -top-2.5 -right-1 text-sm pointer-events-none drop-shadow-[0_0_6px_rgba(37,211,102,0.8)]">
                🍃
              </div>

              {/* Code Icon */}
              <div className="w-6 h-6 rounded-full bg-[#051007] border border-[#D4A017]/60 text-[#D4A017] flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                &lt;/&gt;
              </div>

              {/* Text */}
              <div className="text-left leading-tight">
                <div className="text-[9px] text-gray-300 font-medium">Designed &amp; Developed by</div>
                <div className="text-xs font-bold text-[#D4A017] tracking-wide">Code for a Greener Tomorrow</div>
              </div>

              {/* Arrow Icon */}
              <div className="w-5 h-5 rounded-full bg-[#051007] border border-[#D4A017]/60 text-[#D4A017] flex items-center justify-center font-bold text-xs shrink-0 group-hover:translate-x-0.5 transition-transform">
                &gt;
              </div>
            </div>

            <div className="text-[9px] uppercase tracking-[0.25em] text-[#9eb8a2]/70 text-center font-semibold mt-1">
              IDEAS • CODE • IMPACT
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
