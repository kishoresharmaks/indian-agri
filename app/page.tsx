'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Leaf,
  CreditCard,
  QrCode,
  Smartphone,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Share2,
  Star,
  Award,
  Heart,
  Globe,
  Feather,
  Sparkles,
  Menu,
  Sprout,
  HeartHandshake,
} from 'lucide-react';
import useCart from '@/hooks/useCart';
import type { Product, ProductVariant } from '@/hooks/useCart';

import CommitmentSection from '../components/CommitmentSection';
import Footer from '../components/Footer';
import MoringaHero from '../components/MoringaHero';
import TrackOrderModal from '../components/TrackOrderModal';
import OrganicCatalogSection from '../components/OrganicCatalogSection';
import LicenseGate from '../components/licensing/LicenseGate';

interface CategoryItem {
  _id: string;
  name: string;
}

interface BannerItem {
  _id: string;
  title: string;
  image: string;
  link?: string;
}


interface TrackedOrder {
  _id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  pincode: string;
  items: Array<{ name: string; price: number; quantity: number; gst: number; image?: string }>;
  subtotal: number;
  totalGst: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  transactionId?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export default function CustomerStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Customer Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Order Tracking Modal State
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedOrders, setTrackedOrders] = useState<TrackedOrder[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = useState(false);
  const [trackSearched, setTrackSearched] = useState(false);

  // Cart state via shared hook (persistence handled internally)
  const {
    cart,
    isCartOpen,
    isCheckoutOpen,
    totals,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    selectedVariants,
    selectVariant,
    openCart,
    closeCart,
    openCheckout,
    closeCheckout,
    toastMessage,
    showToast,
    clearToast,
  } = useCart();

  // Customer Checkout Form
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    pincode: '',
    paymentMethod: 'UPI' as 'COD' | 'UPI',
    transactionId: '',
  });

  const [merchantUpiId, setMerchantUpiId] = useState(
    process.env.NEXT_PUBLIC_MERCHANT_UPI_ID || 'indianagriculturepvtltd@okicici'
  );
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [formError, setFormError] = useState('');

  // Payment Gateway Settings State
  const [paymentSettings, setPaymentSettings] = useState({ enableUPI: true, enableCOD: true });

  // Hero Banners State
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const fetchBanners = async () => {
    try {
      setLoadingBanners(true);
      const res = await fetch('/api/banners');
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBanners(false);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        const settings = {
          enableUPI: data.data.enableUPI ?? true,
          enableCOD: data.data.enableCOD ?? true,
        };
        setPaymentSettings(settings);

        setCheckoutForm((prev) => {
          if (!settings.enableUPI && prev.paymentMethod === 'UPI' && settings.enableCOD) {
            return { ...prev, paymentMethod: 'COD' };
          }
          if (!settings.enableCOD && prev.paymentMethod === 'COD' && settings.enableUPI) {
            return { ...prev, paymentMethod: 'UPI' };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Failed to fetch payment settings:', err);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchPaymentSettings();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Cart state is managed by the shared useCart hook — persistence is handled internally

  // Fetch Dynamic Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch Dynamic Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/products', window.location.origin);
      if (searchQuery) url.searchParams.append('search', searchQuery);
      if (selectedCategory !== 'All') url.searchParams.append('category', selectedCategory);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  // Handle URL product link auto-open and highlight
  useEffect(() => {
    if (typeof window === 'undefined' || products.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    let targetId = urlParams.get('product');

    if (!targetId && window.location.hash.startsWith('#product-')) {
      targetId = window.location.hash.replace('#product-', '');
    }

    if (targetId) {
      const foundProduct = products.find((p) => p._id === targetId);
      if (foundProduct) {
        setSelectedProduct(foundProduct);
        setHighlightedProductId(foundProduct._id);

        setTimeout(() => {
          const elem = document.getElementById(`product-${targetId}`);
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 350);
      }
    }
  }, [products]);

  // Handle Customer Order Tracking Search
  const handleSearchTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    try {
      setIsSearchingOrders(true);
      setTrackSearched(true);
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(trackQuery.trim())}`);
      const data = await res.json();
      if (data.success) {
        setTrackedOrders(data.data);
      } else {
        setTrackedOrders([]);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
    } finally {
      setIsSearchingOrders(false);
    }
  };
  // Variant selection delegates to useCart hook
  const handleSelectVariant = selectVariant;

  // Cart totals derived from useCart hook
  const cartSubtotal = totals.subtotal;
  const cartGstTotal = totals.gstTotal;
  const cartGrandTotal = totals.grandTotal;
  const cartItemCount = totals.itemCount;

  // Sorting & Pagination
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Copy UPI ID helper
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // UPI Intent URL
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent('INDIAN AGRICULTURE')}&am=${cartGrandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Indian Agriculture Order')}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiIntentUrl)}`;

  // Handle Order Submit
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !checkoutForm.customerName ||
      !checkoutForm.customerPhone ||
      !checkoutForm.customerEmail ||
      !checkoutForm.shippingAddress ||
      !checkoutForm.pincode
    ) {
      setFormError('Please fill in all required customer details.');
      return;
    }

    if (!paymentSettings.enableUPI && !paymentSettings.enableCOD) {
      setFormError('Checkout is currently disabled as all payment options are disabled by store administration.');
      return;
    }

    if (checkoutForm.paymentMethod === 'UPI' && !paymentSettings.enableUPI) {
      setFormError('Online UPI Payment option is currently disabled by store administration. Please choose Cash on Delivery.');
      return;
    }

    if (checkoutForm.paymentMethod === 'COD' && !paymentSettings.enableCOD) {
      setFormError('Cash on Delivery payment option is currently disabled by store administration. Please choose Online UPI.');
      return;
    }

    if (checkoutForm.paymentMethod === 'UPI' && !checkoutForm.transactionId.trim()) {
      setFormError('Please enter your 12-digit UPI Reference / UTR Number after completing payment.');
      return;
    }

    try {
      setSubmittingOrder(true);
      const payload = {
        ...checkoutForm,
        items: cart.map((item) => ({
          productId: item.product._id,
          name: item.selectedVariant ? `${item.product.name} (${item.selectedVariant.name})` : item.product.name,
          variantName: item.selectedVariant ? item.selectedVariant.name : '',
          price: item.selectedVariant ? item.selectedVariant.price : item.product.price,
          quantity: item.quantity,
          gst: item.product.gst !== undefined ? item.product.gst : 0,
          image: item.product.image,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.data);
        clearCart();
        closeCheckout();
        closeCart();

        // Clear local storage after successful checkout
        try {
          localStorage.removeItem('indianagri_cart');
          localStorage.removeItem('indianagri_checkout_form');
          localStorage.removeItem('indianagri_checkout_open');
        } catch {
          // Silently ignore localStorage errors (private browsing, quota exceeded)
        }

        fetchProducts(); // Refresh stock
      } else {
        setFormError(data.message || 'Failed to place order.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Network error occurred while submitting order.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const getWhatsAppSupportLink = (order: any) => {
    if (!order) return 'https://wa.me/919597250344';
    const itemsList = order.items
      ? order.items.map((it: any) => `• ${it.name} x ${it.quantity} (₹${(it.price * it.quantity).toLocaleString('en-IN')})`).join('\n')
      : '';

    const text = `Hello Indian Agriculture Team 👋,

I need support regarding my order:

🆔 *Order ID:* ${order.orderId || ''}
👤 *Name:* ${order.customerName || ''}
${order.customerPhone ? `📞 *Phone:* ${order.customerPhone}\n` : ''}${order.shippingAddress ? `📍 *Address:* ${order.shippingAddress} - ${order.pincode || ''}\n` : ''}
🛒 *Items Ordered:*
${itemsList}

💰 *Total Amount:* ₹${order.totalAmount ? order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: order.totalAmount % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 }) : 0}
💳 *Payment Mode:* ${order.paymentMethod === 'UPI' ? 'Online UPI' : 'Cash on Delivery'} (${order.paymentStatus || 'Pending'})
${order.transactionId ? `🔢 *UTR / Ref:* ${order.transactionId}\n` : ''}${order.status ? `📦 *Status:* ${order.status}\n` : ''}
Please assist me with this order. Thank you!`;

    return `https://wa.me/919597250344?text=${encodeURIComponent(text)}`;
  };

  const getWhatsAppProductShareLink = (product: Product, variant?: ProductVariant) => {
    const selectedVar = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
    const price = selectedVar ? selectedVar.price : product.price;
    const mrp = selectedVar ? selectedVar.mrp : product.mrp;
    const variantName = selectedVar ? ` (${selectedVar.name})` : '';
    const discount = selectedVar
      ? selectedVar.mrp > selectedVar.price
        ? Math.round(((selectedVar.mrp - selectedVar.price) / selectedVar.mrp) * 100)
        : 0
      : product.discount;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://INDIANAGRICULTURE.online';
    const productUrl = `${baseUrl}/product/${product._id}`;

    const text = `🌿 *${product.name}${variantName}*

💰 *Price:* ₹${price.toLocaleString('en-IN')}${mrp > price ? ` (MRP: ~₹${mrp.toLocaleString('en-IN')}~ - ${discount}% OFF)` : ''}
🏷️ *Category:* ${product.category || 'Pure Organic Produce'}
✨ *Highlight:* 100% Pure & Fresh Organic Harvest directly from Indian Agriculture.

🛒 *View Product & Order Online:*
${productUrl}

— *INDIAN AGRICULTURE*`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const dynamicCategoryList = ['All', ...categories.map((c) => c.name)];

  return (
    <LicenseGate>
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F5] text-[#1C1917] selection:bg-[#1E3524] selection:text-[#FAF8F5]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md sm:w-auto bg-[#183B24]/95 text-[#FAF8F5] px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-full shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 border border-[#C99A2E]/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#C99A2E]/20 text-[#C99A2E] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium font-sans truncate">{toastMessage}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openCart()}
              className="px-3 py-1.5 rounded-full bg-[#C99A2E] hover:bg-[#b08524] text-[#183B24] text-xs font-bold font-sans transition-colors flex items-center gap-1 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View Cart</span>
            </button>
            <button
              onClick={() => clearToast()}
              className="text-[#FAF8F5]/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Top Announcement Bar */}
      <div
        className="bg-[#1B2E1E] text-[#FAF8F5] text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 text-center font-bold tracking-wide"
        style={{ borderRadius: '0 0 1.1rem 1.1rem' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="w-full text-center flex items-center justify-center gap-1.5 sm:gap-2 flex-nowrap leading-tight overflow-hidden">
            <span className="truncate">🌱 <span className="hidden xs:inline">100% Pure Organic · </span>Direct Farm Supply Across India</span>
            <span className="hidden md:inline text-[#D4A017] font-bold flex-shrink-0">&nbsp;★ GST & Lab COA Certified</span>
          </p>
        </div>
      </div>

      {/* Sticky Floating Pill Header Nav */}
      <header className="sticky top-0 z-40 transition-all duration-300" style={{ background: 'transparent' }}>
        <div className="px-3 sm:px-5 pt-2.5 pb-2">
        <div
          className="mx-auto flex items-center justify-between gap-3 sm:gap-6 px-3 sm:px-5 lg:px-7"
          style={{
            minHeight: '4.25rem',
            background: 'rgba(250, 248, 245, 0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '3rem',
            border: '1.5px solid rgba(229, 224, 216, 0.95)',
            boxShadow: '0 2px 20px -2px rgba(27,46,30,0.10), 0 0 0 0 transparent',
            maxWidth: '1200px',
          }}
        >
          {/* Brand Wordmark */}
          <Link href="/" className="flex items-center gap-3 sm:gap-3.5 group flex-shrink-0 py-1">
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden flex items-center justify-center shadow-md border border-[#D4A017]/50 bg-[#FFFDE7] group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <img
                src="/logo-nav.png"
                alt="Indian Agriculture Logo"
                className="w-full h-full object-contain p-0.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
            </div>
            <div className="min-w-0">
              <span className="font-serif font-black text-[14px] sm:text-[18px] tracking-tight text-[#1B2E1E] block leading-tight">
                INDIAN AGRICULTURE
              </span>
              <span className="hidden sm:block text-[9.5px] uppercase tracking-[0.2em] text-[#3D5A3E] font-bold mt-0.5">
                PREMIUM ORGANIC MORINGA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-sans font-bold uppercase tracking-[0.12em] text-[#1C1917]">
            <a href="#products-section" className="whitespace-nowrap nav-link-animated py-1 text-[#1C1917] hover:text-[#1E3524]">
              Products
            </a>
            <a href="#story-section" className="whitespace-nowrap nav-link-animated py-1 text-[#1C1917] hover:text-[#1E3524]">
              Our Story
            </a>
            <a href="#benefits-section" className="whitespace-nowrap nav-link-animated py-1 text-[#1C1917] hover:text-[#1E3524]">
              Advantages
            </a>
            <a href="#b2b-rfq-section" className="whitespace-nowrap nav-link-animated py-1 text-[#1C1917] hover:text-[#1E3524]">
              Get Quote
            </a>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Request Quote Button */}
            <a
              href="#b2b-rfq-section"
              className="whitespace-nowrap flex items-center gap-1.5 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1E3524] hover:bg-[#152519] text-[#FAF8F5] rounded-full transition-all duration-300 shadow-sm active:scale-95 border border-[#D4A017]/40"
            >
              <Leaf className="w-3.5 h-3.5 text-[#D4A017]" />
              <span className="hidden xs:inline sm:inline">Request Quote</span>
            </a>

            {/* Track Order Button */}
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="whitespace-nowrap flex items-center gap-1.5 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 bg-[#F5F2EB] hover:bg-[#E5E0D8] text-[#1B2E1E] rounded-full border border-[#E5E0D8] transition-all duration-300 shadow-xs active:scale-95"
            >
              <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E3524]" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => openCart()}
              className="relative p-2.5 sm:p-3 bg-[#1E3524] text-[#FAF8F5] rounded-full hover:bg-[#152519] transition-all duration-300 active:scale-95 shadow-md"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4A017] text-[#1B2E1E] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[#F5F2EB] text-[#1B2E1E] hover:bg-[#1E3524] hover:text-[#FAF8F5] transition-all duration-200 border border-[#E5E0D8] flex-shrink-0"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
        </div>

        {/* Mobile Navigation Drawer — Smooth Glassmorphism Card */}
        {isMobileMenuOpen && (
          <div className="lg:hidden px-2.5 pt-1 pb-2">
            <div
              style={{
                background: 'rgba(250, 248, 245, 0.97)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '1.5rem',
                border: '1px solid rgba(229, 224, 216, 0.9)',
                boxShadow: '0 8px 32px -8px rgba(27,46,30,0.15)',
                overflow: 'hidden',
              }}
            >
              {/* Search Bar */}
              <div className="px-4 pt-4 pb-3">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A655A]" />
                  <input
                    type="text"
                    placeholder="Search organic solutions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F5F2EB] border border-[#E5E0D8] rounded-full text-xs text-[#1C1917] placeholder-[#5A655A] focus:outline-none focus:border-[#1E3524] transition-colors"
                  />
                </div>
              </div>

              {/* Nav Links */}
              <nav className="px-3 pb-3 flex flex-col gap-1 font-sans text-xs font-bold uppercase tracking-wider">
                {[
                  { label: 'Products', href: '#products-section' },
                  { label: 'Our Story', href: '#story-section' },
                  { label: 'Advantages', href: '#benefits-section' },
                  { label: 'Get Quote', href: '#b2b-rfq-section', gold: true },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      item.gold
                        ? 'bg-[#1E3524] text-[#D4A017] hover:bg-[#152519]'
                        : 'text-[#1C1917] hover:bg-[#F5F2EB] hover:text-[#1E3524]'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">

        {/* MORINGA HERO SECTION */}
        <MoringaHero
          products={products}
          banners={banners}
          onOpenProductModal={(p) => setSelectedProduct(p)}
        />

        {/* OUR COMMITMENT SECTION */}
        <CommitmentSection />

        {/* ORGANIC HARVEST CATALOG SECTION */}
        <OrganicCatalogSection
          products={products}
          onAddToCart={(p, qty) => addToCart(p, qty)}
          onOpenProductModal={(p) => setSelectedProduct(p)}
        />

        {/* PHILOSOPHY & STORY SECTION */}
        <section id="story-section" className="py-16 sm:py-24 bg-[#F9F8F3] text-[#1C2A1E] relative overflow-hidden">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

              {/* Left Side */}
              <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">

                <div className="inline-flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#C4922A]" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C4922A]">
                    OUR PHILOSOPHY
                  </span>
                  <div className="w-12 h-[2px] bg-[#C4922A]" />
                </div>

                <div className="space-y-1">
                  <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C2A1E] leading-[1.08] tracking-tight">
                    Direct Farm Sourcing.
                  </h2>
                  <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C2A1E] leading-[1.08] tracking-tight">
                    Pure Quality.
                  </h2>
                  <h2 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-bold text-[#C4922A] leading-[1.08] tracking-tight pt-1">
                    Certified Excellence.
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-[#1C2A1E] leading-relaxed max-w-xl font-semibold font-sans">
                  At <strong className="text-[#1C2A1E] font-bold">Indian Agriculture</strong>, we cultivate traditional organic produce with modern processing standards to provide top-quality Moringa Oleifera, farm produce, and natural raw ingredients.
                </p>

                {/* 4 Feature Stat Pills */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-3 sm:pt-4">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-br from-white via-[#FDFCF9] to-[#F4F0E6] border border-[#C99A2E]/35 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-[#183B24] transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden space-y-3">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent absolute top-0 inset-x-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="w-9 h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shrink-0 shadow-xs border border-[#C99A2E]/40 group-hover:scale-110 transition-transform">
                      <Leaf className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="font-serif font-extrabold text-xl sm:text-2xl text-[#183B24] leading-tight">1,000+</div>
                      <p className="text-[11px] font-extrabold text-[#4A554D] uppercase tracking-wider leading-tight font-sans mt-1">
                        Organic Acres
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-gradient-to-br from-white via-[#FDFCF9] to-[#F4F0E6] border border-[#C99A2E]/35 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-[#183B24] transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden space-y-3">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent absolute top-0 inset-x-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="w-9 h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shrink-0 shadow-xs border border-[#C99A2E]/40 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="font-serif font-extrabold text-xl sm:text-2xl text-[#183B24] leading-tight">100%</div>
                      <p className="text-[11px] font-extrabold text-[#4A554D] uppercase tracking-wider leading-tight font-sans mt-1">
                        Lab Tested
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-gradient-to-br from-white via-[#FDFCF9] to-[#F4F0E6] border border-[#C99A2E]/35 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-[#183B24] transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden space-y-3">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent absolute top-0 inset-x-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="w-9 h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shrink-0 shadow-xs border border-[#C99A2E]/40 group-hover:scale-110 transition-transform">
                      <Feather className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="font-serif font-extrabold text-lg sm:text-xl text-[#183B24] leading-tight">Stem-Free</div>
                      <p className="text-[11px] font-extrabold text-[#4A554D] uppercase tracking-wider leading-tight font-sans mt-1">
                        Low Temp Dried
                      </p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-gradient-to-br from-white via-[#FDFCF9] to-[#F4F0E6] border border-[#C99A2E]/35 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-[#183B24] transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden space-y-3">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent absolute top-0 inset-x-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="w-9 h-9 rounded-full bg-[#183B24] text-[#D4A017] flex items-center justify-center shrink-0 shadow-xs border border-[#C99A2E]/40 group-hover:scale-110 transition-transform">
                      <Heart className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="font-serif font-extrabold text-lg sm:text-xl text-[#183B24] leading-tight">GST Invoice</div>
                      <p className="text-[11px] font-extrabold text-[#4A554D] uppercase tracking-wider leading-tight font-sans mt-1">
                        Tax Invoiced
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 sm:pt-6">
                  <a
                    href="#b2b-rfq-section"
                    className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#1C2A1E] hover:bg-[#273B24] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md group border border-[#D4A017]/40"
                  >
                    <Leaf className="w-4 h-4 text-[#D4A017]" />
                    <span>Request Wholesale Quote</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

              </div>

              {/* Right Side */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[4/3] sm:aspect-[1.12/1] rounded-[32px] overflow-hidden shadow-2xl border border-[#E6E2D8] bg-slate-100">
                  <img
                    src="/moringa_farm_philosophy.png"
                    alt="Indian Agriculture Organic Moringa Harvest"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20 pointer-events-none" />

                  <div className="absolute top-5 left-5 max-w-[270px] bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xl z-10">
                    <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs inline-block">
                      <img
                        src="/logo.jpg"
                        alt="Indian Agriculture Logo"
                        className="h-10 sm:h-12 w-auto object-contain"
                      />
                    </div>
                    <div className="mt-3 border-l-2 border-[#C4922A] pl-3 py-0.5">
                      <p className="font-serif italic text-xs sm:text-sm text-[#1C2A1E] leading-relaxed">
                        Ethical cultivation, certified quality, and farm fresh supply across India.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CLIENT TESTIMONIALS SECTION */}
        <section id="reviews-section" className="py-20 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-[#1C2A1E] font-bold">Client Reviews</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1B2E1E] mt-2 mb-12">
              Trusted Produce & Supply Quality
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-8 rounded-3xl bg-[#F5F2EB] border border-[#E5E0D8] space-y-4 shadow-sm">
                <div className="flex text-[#D4A017] gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4A017]" />)}
                </div>
                <p className="text-xs text-[#1B2E1E] font-medium leading-relaxed italic font-sans">
                  "The quality of the Organic Moringa Leaf Powder is unmatched. Fresh green color, fine grinding, and prompt delivery."
                </p>
                <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between text-xs font-sans">
                  <span className="font-bold text-[#1B2E1E]">Dr. V. K. Raman</span>
                  <span className="text-[10px] text-[#FAF8F5] font-bold bg-[#1B2E1E] px-2.5 py-1 rounded-full">Verified Client</span>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#F5F2EB] border border-[#E5E0D8] space-y-4 shadow-sm">
                <div className="flex text-[#D4A017] gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4A017]" />)}
                </div>
                <p className="text-xs text-[#1B2E1E] font-medium leading-relaxed italic font-sans">
                  "Sourced bulk produce for our kitchen and retail. Zero stems, exact mesh fineness, and transparent pricing."
                </p>
                <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between text-xs font-sans">
                  <span className="font-bold text-[#1B2E1E]">Rajesh Patel</span>
                  <span className="text-[10px] text-[#FAF8F5] font-bold bg-[#1B2E1E] px-2.5 py-1 rounded-full">Bulk Buyer</span>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#F5F2EB] border border-[#E5E0D8] space-y-4 shadow-sm">
                <div className="flex text-[#D4A017] gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4A017]" />)}
                </div>
                <p className="text-xs text-[#1B2E1E] font-medium leading-relaxed italic font-sans">
                  "Fast response on WhatsApp, lab test certificates provided with every batch, and excellent eco-friendly packaging."
                </p>
                <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between text-xs font-sans">
                  <span className="font-bold text-[#1B2E1E]">Ananya Iyer</span>
                  <span className="text-[10px] text-[#FAF8F5] font-bold bg-[#1B2E1E] px-2.5 py-1 rounded-full">Verified Client</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REQUEST FOR QUOTE (RFQ) SECTION — SEAMLESS DARK-GREEN TRANSITION */}
        <section id="b2b-rfq-section" className="relative text-white overflow-hidden">

          {/* TOP SMOOTH ORGANIC WAVE — cream (#FAF8F5) bg, dark fill */}
          <div className="w-full overflow-hidden leading-none pointer-events-none" style={{ background: '#FAF8F5' }}>
            <svg
              className="relative block w-full"
              style={{ height: '80px', display: 'block', fill: '#09180b' }}
              viewBox="0 0 1440 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" />
            </svg>
          </div>

          {/* MAIN RFQ CONTENT BLOCK */}
          <div className="bg-[#09180b] pt-8 pb-4 sm:pt-12 sm:pb-6 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left Text Box */}
                <div className="lg:col-span-6 space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b3d22]/90 border border-[#D4A017]/40 text-[#D4A017] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <Leaf className="w-4 h-4 text-[#D4A017]" />
                    <span>WHOLESALE &amp; BULK INQUIRY DESK</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                    Request Wholesale Pricing &amp; Produce Details
                  </h2>

                  <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed font-sans">
                    Get direct farm-to-business quotes, batch lab test COAs, custom mesh sizes, and freight rates delivered to your WhatsApp.
                  </p>

                  <div className="space-y-3 pt-2 font-sans text-xs sm:text-sm font-bold text-white/95">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0" />
                      <span>Flexible MOQ from 5kg small packs to multi-ton loads</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0" />
                      <span>Custom OEM packaging and mesh fineness (60-120 mesh)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0" />
                      <span>100% Tax Compliant GST Invoicing &amp; Express Freight</span>
                    </div>
                  </div>
                </div>

                {/* Right Form Card */}
                <div className="lg:col-span-6 bg-white text-[#1C2A1E] p-6 sm:p-10 rounded-3xl shadow-2xl border-2 border-[#D4A017]">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2A1E] mb-1">
                    Get Wholesale Quote
                  </h3>
                  <p className="text-xs text-[#4A554D] font-medium mb-6 font-sans">
                    Fill in your details below to send an instant quote request.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const company = (form.elements.namedItem('company') as HTMLInputElement).value;
                      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                      const product = (form.elements.namedItem('product') as HTMLSelectElement).value;
                      const quantity = (form.elements.namedItem('quantity') as HTMLInputElement).value;

                      const formattedMsg =
                        `🌱 *INDIAN AGRICULTURE — QUOTE INQUIRY* 🌱\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `🏢 *Company / Business:* ${company}\n` +
                        `👤 *Contact Person:* ${name}\n` +
                        `📦 *Target Product:* ${product}\n` +
                        `📊 *Target Volume:* ${quantity}\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `💬 *Inquiry:* Please share your wholesale rate card, batch COA test report, and dispatch schedule.\n\n` +
                        `_Sent via Indian Agriculture Online Desk_`;

                      window.open(`https://wa.me/919597250344?text=${encodeURIComponent(formattedMsg)}`, '_blank');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1C2A1E] uppercase mb-1 font-sans">Company / Brand *</label>
                        <input
                          name="company"
                          type="text"
                          required
                          placeholder="e.g. Hand India"
                          className="w-full px-4 py-3 rounded-xl bg-[#F5F2EB] border border-[#E5E0D8] text-xs font-bold text-[#1C2A1E] focus:outline-none focus:border-[#1C2A1E] font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1C2A1E] uppercase mb-1 font-sans">Contact Name *</label>
                        <input
                          name="name"
                          type="text"
                          required
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl bg-[#F5F2EB] border border-[#E5E0D8] text-xs font-bold text-[#1C2A1E] focus:outline-none focus:border-[#1C2A1E] font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1C2A1E] uppercase mb-1 font-sans">Target Product *</label>
                        <select
                          name="product"
                          className="w-full px-4 py-3 rounded-xl bg-[#F5F2EB] border border-[#E5E0D8] text-xs font-bold text-[#1C2A1E] focus:outline-none focus:border-[#1C2A1E] font-sans"
                        >
                          {products && products.length > 0 ? (
                            products.map((p) => (
                              <option key={p._id} value={p.name}>
                                {p.name}
                              </option>
                            ))
                          ) : categories && categories.length > 0 ? (
                            <>
                              <option value="General Organic Produce Inquiry">Select Target Category / Produce</option>
                              {categories.map((c) => (
                                <option key={c._id} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option value="General Organic Farm Produce">General Organic Farm Produce Inquiry</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1C2A1E] uppercase mb-1 font-sans">Volume (Kg / Tons) *</label>
                        <input
                          name="quantity"
                          type="text"
                          required
                          placeholder="e.g. 25kg, 500kg, 5 Tons"
                          className="w-full px-4 py-3 rounded-xl bg-[#F5F2EB] border border-[#E5E0D8] text-xs font-bold text-[#1C2A1E] focus:outline-none focus:border-[#1C2A1E] font-sans"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#1C2A1E] hover:bg-[#253D28] text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all border border-[#D4A017] font-sans"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Submit Quote Request via WhatsApp</span>
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER SECTION */}
      <Footer products={products} onOpenTrackModal={() => setIsTrackModalOpen(true)} />

      {/* SHOPPING CART SLIDE-OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => closeCart()} />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF8F5] text-[#1C1917] shadow-2xl flex flex-col justify-between">

              {/* Drawer Header */}
              <div className="p-6 bg-[#1B2E1E] text-[#FAF8F5] flex items-center justify-between border-b border-[#2A402D]">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-[#D4A017]" />
                  <h3 className="font-serif text-xl font-medium">Your Shopping Bag ({cartItemCount})</h3>
                </div>
                <button onClick={() => closeCart()} className="p-1 rounded-full hover:bg-white/10 text-[#FAF8F5]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 mx-auto text-[#5A655A]" />
                    <h4 className="font-serif text-xl text-[#1B2E1E]">Your Cart is Empty</h4>
                    <p className="text-xs text-[#5A655A]">Discover our organic moringa solutions.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => {
                    const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#E5E0D8] flex gap-4">
                        <img
                          src={item.product.image || '/logo.jpg'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-white border border-[#E5E0D8]"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <h5 className="font-medium text-sm text-[#1B2E1E] line-clamp-1">
                                {item.product.name}
                              </h5>
                              <button
                                onClick={() => removeFromCart(item.product._id, item.selectedVariant?.name)}
                                className="text-stone-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {item.selectedVariant && (
                              <span className="text-[10px] text-[#5A655A] bg-[#E5E0D8] px-2 py-0.5 rounded-full inline-block mt-0.5">
                                {item.selectedVariant.name}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="font-serif font-bold text-sm text-[#1B2E1E]">
                              ₹{(price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: (price * item.quantity) % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}
                            </span>
                            <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-full px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.product._id, item.selectedVariant?.name, item.quantity - 1)}
                                className="text-stone-600 hover:text-black p-0.5"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-semibold px-1">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.selectedVariant?.name, item.quantity + 1)}
                                className="text-stone-600 hover:text-black p-0.5"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer / Checkout */}
              {cart.length > 0 && (
                <div className="p-6 bg-[#F5F2EB] border-t border-[#E5E0D8] space-y-4">
                  <div className="space-y-1.5 text-xs text-[#5A655A]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#1C1917]">
                        ₹{cartSubtotal.toLocaleString('en-IN', { minimumFractionDigits: cartSubtotal % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {cartGstTotal > 0 && (
                      <div className="flex justify-between">
                        <span>GST</span>
                        <span className="text-[#1C1917]">
                          ₹{cartGstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-[#1B2E1E] pt-2 border-t border-[#E5E0D8]">
                      <span>Grand Total</span>
                      <span className="font-serif text-lg">
                        ₹{cartGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: cartGrandTotal % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      closeCart();
                      openCheckout();
                    }}
                    className="w-full py-3.5 rounded-full bg-[#1E3524] text-[#FAF8F5] font-semibold text-xs hover:bg-[#152519] transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#183B24]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#FAF8F2] text-[#1C1917] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#C99A2E]/40 my-auto max-h-[90vh] flex flex-col transition-all">

            {/* Modal Top Header Bar (Fixed / Sticky Header) */}
            <div className="p-4 sm:p-5 bg-[#183B24] text-white flex items-center justify-between border-b border-[#C99A2E]/30 relative overflow-hidden shrink-0">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C99A2E]/10 blur-3xl rounded-full pointer-events-none" />

              <div className="space-y-0.5 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-[#C99A2E] font-sans">
                  <Leaf className="w-3 h-3 text-[#C99A2E]" />
                  <span>SECURE ORGANIC CHECKOUT</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-white leading-tight">
                  Complete Your Order
                </h3>
              </div>

              <button
                onClick={() => closeCheckout()}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0 z-10"
                aria-label="Close checkout"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Scrollable Modal Body Form */}
            <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {formError && (
                <div className="p-3.5 bg-rose-100 text-rose-800 text-xs rounded-xl border border-rose-200 font-sans flex items-center gap-2">
                  <span className="font-bold">Error:</span> {formError}
                </div>
              )}

              {/* Customer Info Fields */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E8E4DA]">
                  <MapPin className="w-4 h-4 text-[#C99A2E]" />
                  <h4 className="font-serif text-lg sm:text-xl font-normal text-[#183B24]">Shipping Address</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#4A554D] mb-1.5 font-sans font-semibold text-[11px] uppercase tracking-wider">
                      Full Name <span className="text-[#C99A2E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={checkoutForm.customerName}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, customerName: e.target.value })}
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-[#D5D0C5] focus:border-[#183B24] focus:ring-2 focus:ring-[#183B24]/10 rounded-xl text-xs sm:text-sm text-[#183B24] font-sans placeholder-[#8C968E] transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#4A554D] mb-1.5 font-sans font-semibold text-[11px] uppercase tracking-wider">
                      Phone Number <span className="text-[#C99A2E]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={checkoutForm.customerPhone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, customerPhone: e.target.value })}
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-[#D5D0C5] focus:border-[#183B24] focus:ring-2 focus:ring-[#183B24]/10 rounded-xl text-xs sm:text-sm text-[#183B24] font-sans placeholder-[#8C968E] transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#4A554D] mb-1.5 font-sans font-semibold text-[11px] uppercase tracking-wider">
                      Email Address <span className="text-[#C99A2E]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={checkoutForm.customerEmail}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, customerEmail: e.target.value })}
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-[#D5D0C5] focus:border-[#183B24] focus:ring-2 focus:ring-[#183B24]/10 rounded-xl text-xs sm:text-sm text-[#183B24] font-sans placeholder-[#8C968E] transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#4A554D] mb-1.5 font-sans font-semibold text-[11px] uppercase tracking-wider">
                      PIN Code <span className="text-[#C99A2E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="6-digit PIN code"
                      value={checkoutForm.pincode}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-[#D5D0C5] focus:border-[#183B24] focus:ring-2 focus:ring-[#183B24]/10 rounded-xl text-xs sm:text-sm text-[#183B24] font-sans placeholder-[#8C968E] transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#4A554D] mb-1.5 font-sans font-semibold text-[11px] uppercase tracking-wider">
                    Full Shipping Address <span className="text-[#C99A2E]">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No., Building, Street Name, Landmark, Area"
                    value={checkoutForm.shippingAddress}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, shippingAddress: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 bg-white border border-[#D5D0C5] focus:border-[#183B24] focus:ring-2 focus:ring-[#183B24]/10 rounded-xl text-xs sm:text-sm text-[#183B24] font-sans placeholder-[#8C968E] transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E8E4DA]">
                  <CreditCard className="w-4 h-4 text-[#C99A2E]" />
                  <h4 className="font-serif text-lg sm:text-xl font-normal text-[#183B24]">Payment Options</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {paymentSettings.enableUPI && (
                    <div
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'UPI' })}
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col gap-2 transition-all font-sans ${checkoutForm.paymentMethod === 'UPI'
                          ? 'bg-[#183B24] text-white border-[#183B24] shadow-md ring-2 ring-[#C99A2E]/50'
                          : 'bg-[#F4F0E6]/80 text-[#183B24] border-[#E5E0D8] hover:border-[#C99A2E]/60'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm">Instant UPI Payment</span>
                        <QrCode className={`w-4 h-4 ${checkoutForm.paymentMethod === 'UPI' ? 'text-[#C99A2E]' : 'text-[#5C665E]'}`} />
                      </div>
                      <span className={`text-[11px] ${checkoutForm.paymentMethod === 'UPI' ? 'text-white/80' : 'text-[#5C665E]'}`}>
                        GPay, PhonePe, Paytm, BHIM & All UPI
                      </span>
                    </div>
                  )}

                  {paymentSettings.enableCOD && (
                    <div
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'COD' })}
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col gap-2 transition-all font-sans ${checkoutForm.paymentMethod === 'COD'
                          ? 'bg-[#183B24] text-white border-[#183B24] shadow-md ring-2 ring-[#C99A2E]/50'
                          : 'bg-[#F4F0E6]/80 text-[#183B24] border-[#E5E0D8] hover:border-[#C99A2E]/60'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm">Cash on Delivery</span>
                        <Truck className={`w-4 h-4 ${checkoutForm.paymentMethod === 'COD' ? 'text-[#C99A2E]' : 'text-[#5C665E]'}`} />
                      </div>
                      <span className={`text-[11px] ${checkoutForm.paymentMethod === 'COD' ? 'text-white/80' : 'text-[#5C665E]'}`}>
                        Pay cash upon delivery at your doorstep
                      </span>
                    </div>
                  )}
                </div>

                {/* UPI QR & UTR input */}
                {checkoutForm.paymentMethod === 'UPI' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#C99A2E]/40 shadow-xs space-y-4 font-sans">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                      <img
                        src={qrCodeImageUrl}
                        alt="UPI QR Code"
                        className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl border-2 border-[#183B24]/10 bg-white p-2 shadow-xs shrink-0"
                      />
                      <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                        <p className="font-sans font-bold text-sm sm:text-base text-[#183B24]">Scan QR Code with any UPI App</p>
                        <p className="text-xs text-[#5C665E]">Works with GPay, PhonePe, Paytm, BHIM & All Indian Banks</p>

                        <div className="inline-flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                          <div className="px-3 py-1.5 rounded-xl bg-[#F4F0E6] border border-[#E5E0D8] text-xs text-[#183B24]">
                            <span className="text-[#5C665E] font-normal">UPI ID: </span>
                            <span className="font-mono font-bold text-[#183B24]">{merchantUpiId}</span>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-3.5 py-1.5 bg-[#183B24] hover:bg-[#112B1A] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Copy className="w-3.5 h-3.5 text-[#C99A2E]" />
                            <span>{copiedUpi ? 'Copied!' : 'Copy UPI ID'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#4A554D] mb-1.5 font-semibold text-[11px] uppercase tracking-wider">
                        12-Digit UPI UTR / Reference Number <span className="text-[#C99A2E]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 423589123456"
                        value={checkoutForm.transactionId}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, transactionId: e.target.value })}
                        className="w-full px-4 py-2.5 sm:py-3 bg-[#FAF8F5] border border-[#D5D0C5] focus:border-[#183B24] focus:bg-white focus:ring-2 focus:ring-[#183B24]/10 rounded-xl text-xs sm:text-sm font-mono text-[#183B24] transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-5 border-t border-[#E8E4DA] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left space-y-0.5">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#5C665E] font-sans block">
                    Total Amount Payable
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-normal text-[#183B24]">
                    ₹{cartGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: cartGrandTotal % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#183B24] hover:bg-[#112B1A] text-white font-sans font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2.5"
                >
                  <Leaf className="w-4 h-4 text-[#C99A2E]" />
                  <span>{submittingOrder ? 'Processing Order...' : 'CONFIRM & PLACE ORDER'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* TRACK ORDER MODAL */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      {/* QUICK VIEW PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-[#1C1917] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#E5E0D8] relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#FAF8F5] text-[#1B2E1E] hover:scale-110 transition-transform shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square bg-[#EFECE6] p-6 flex items-center justify-center">
                <img
                  src={selectedProduct.image || '/logo.jpg'}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain rounded-2xl"
                />
              </div>

              <div className="p-8 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4A017] tracking-widest">{selectedProduct.category}</span>
                  <h3 className="font-serif text-3xl font-medium text-[#1B2E1E] mt-1">{selectedProduct.name}</h3>
                  <p className="text-xs text-[#5A655A] leading-relaxed mt-3 font-light">{selectedProduct.description}</p>

                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="font-serif text-3xl font-bold text-[#1B2E1E]">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    {selectedProduct.mrp > selectedProduct.price && (
                      <span className="text-xs text-[#5A655A] line-through">₹{selectedProduct.mrp.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#E5E0D8]">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="w-full py-3.5 rounded-full bg-[#1E3524] text-[#FAF8F5] font-semibold text-xs hover:bg-[#152519] transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </button>

                  <a
                    href={getWhatsAppProductShareLink(selectedProduct)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-full bg-[#FAF8F5] text-[#1E3524] font-semibold text-xs border border-[#1E3524] hover:bg-[#F5F2EB] transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Product on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS CONFIRMATION MODAL */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#183B24]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF8F2] text-[#1C1917] w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6 border border-[#C99A2E]/40 transition-all">

            {/* Top Success Badge Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-[#183B24] text-[#C99A2E] flex items-center justify-center shadow-lg border-2 border-[#C99A2E]/40">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            {/* Title & Order ID */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183B24]/10 border border-[#C99A2E]/30 text-[10px] font-bold uppercase tracking-wider text-[#C99A2E] font-sans">
                <span>ORDER CONFIRMED</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-normal text-[#183B24] leading-tight">
                Thank You For Your Order
              </h3>
              <p className="text-xs sm:text-sm text-[#5C665E] font-sans">
                Your order <span className="font-sans font-bold text-[#183B24] bg-[#F4F0E6] px-2 py-0.5 rounded-md border border-[#E5E0D8]">#{orderSuccess.orderId}</span> has been confirmed.
              </p>
            </div>

            {/* Summary Details Card (Crisp Font & Number Formatting) */}
            <div className="p-5 rounded-2xl bg-white border border-[#C99A2E]/30 shadow-xs text-xs sm:text-sm font-sans text-left space-y-3">
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E8E4DA]">
                <span className="text-[#5C665E] font-medium">Customer:</span>
                <span className="font-bold text-[#183B24]">{orderSuccess.customerName}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E8E4DA]">
                <span className="text-[#5C665E] font-medium">Total Paid:</span>
                <span className="font-sans font-extrabold text-[#183B24] text-base sm:text-lg">
                  ₹{orderSuccess.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: orderSuccess.totalAmount % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5C665E] font-medium">Payment Mode:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183B24]/10 text-[#183B24] font-bold text-xs">
                  {orderSuccess.paymentMethod}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 font-sans">
              <a
                href={getWhatsAppSupportLink(orderSuccess)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#183B24] hover:bg-[#112B1A] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 group"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Get Instant WhatsApp Support</span>
              </a>

              <button
                onClick={() => setOrderSuccess(null)}
                className="w-full py-3 sm:py-3.5 rounded-full bg-[#F4F0E6] hover:bg-[#EAE6DC] text-[#183B24] font-bold text-xs uppercase tracking-wider transition-all border border-[#E5E0D8]"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
    </LicenseGate>
  );
}
