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
  Eye,
  SlidersHorizontal,
  Leaf,
  Copy,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  MessageCircle,
  Star,
  Share2,
  Menu,
  QrCode,
  Truck,
  MapPin,
  CreditCard,
} from 'lucide-react';

import Footer from '@/components/Footer';
import TrackOrderModal from '@/components/TrackOrderModal';

interface ProductVariant {
  _id?: string;
  name: string;
  mrp: number;
  price: number;
  quantity: number;
  discount?: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  hsnCode?: string;
  mrp: number;
  price: number;
  discount: number;
  quantity: number;
  gst: number;
  category: string;
  variants?: ProductVariant[];
  createdAt?: string;
}

interface CategoryItem {
  _id: string;
  name: string;
}

interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
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

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Customer Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Order Tracking Modal State
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedOrders, setTrackedOrders] = useState<TrackedOrder[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = useState(false);
  const [trackSearched, setTrackSearched] = useState(false);

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

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setPaymentSettings({
          enableUPI: data.data.enableUPI ?? true,
          enableCOD: data.data.enableCOD ?? true,
        });
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  // Restore Session State from localStorage on Mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('indianagri_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist Cart to localStorage
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem('indianagri_cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('indianagri_cart');
      }
    } catch {
      // ignore
    }
  }, [cart]);

  // Fetch Dynamic Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch {
      // ignore
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
    } catch {
      // ignore
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

  // Selected Variant State per Product
  const [selectedVariants, setSelectedVariants] = useState<{ [productId: string]: ProductVariant }>({});

  const handleSelectVariant = (productId: string, variant: ProductVariant) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  // Toast Message State
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Cart Management
  const addToCart = (product: Product, quantityToAdd = 1, customVariant?: ProductVariant) => {
    const activeVariant =
      customVariant ||
      selectedVariants[product._id] ||
      (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);

    const activeStock = activeVariant ? activeVariant.quantity : product.quantity;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product._id === product._id &&
          ((!item.selectedVariant && !activeVariant) ||
            item.selectedVariant?.name === activeVariant?.name)
      );

      if (existingIndex > -1) {
        const newQty = prevCart[existingIndex]!.quantity + quantityToAdd;
        if (newQty > activeStock) {
          alert(`Sorry, only ${activeStock} items available for ${activeVariant ? activeVariant.name : 'this product'}.`);
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIndex] = { ...updated[existingIndex]!, quantity: newQty };
        return updated;
      } else {
        if (quantityToAdd > activeStock) {
          alert(`Sorry, only ${activeStock} items available in stock.`);
          return prevCart;
        }
        return [...prevCart, { product, selectedVariant: activeVariant, quantity: quantityToAdd }];
      }
    });

    const rawName = product.name || 'Product';
    const cleanName = rawName.replace(/_Shyn&Dev/gi, '').trim();
    const label = activeVariant ? `${cleanName} (${activeVariant.name})` : cleanName;
    showToast(`Added "${label}" to cart!`);
  };

  const updateCartQty = (productId: string, variantName: string | undefined, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId, variantName);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product._id === productId && item.selectedVariant?.name === variantName) {
          const maxStock = item.selectedVariant ? item.selectedVariant.quantity : item.product.quantity;
          if (newQty > maxStock) {
            alert(`Only ${maxStock} units available.`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variantName?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product._id === productId && item.selectedVariant?.name === variantName)
      )
    );
  };

  // Calculations
  const cartSubtotal = Number(
    cart.reduce(
      (sum, item) =>
        sum + (item.selectedVariant ? item.selectedVariant.price : item.product.price) * item.quantity,
      0
    ).toFixed(2)
  );
  const cartGstTotal = Number(
    cart.reduce((sum, item) => {
      const unitPrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      const gstRate = item.product.gst !== undefined ? item.product.gst : 0;
      return sum + ((unitPrice * item.quantity) * gstRate) / 100;
    }, 0).toFixed(2)
  );
  const cartGrandTotal = Number((cartSubtotal + cartGstTotal).toFixed(2));
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

  const dynamicCategoryList = ['All', ...categories.map((c) => c.name)];

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=${merchantUpiId}&pn=INDIAN_AGRICULTURE&am=${cartGrandTotal.toFixed(2)}&cu=INR`
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSearchTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    try {
      setIsSearchingOrders(true);
      setTrackSearched(true);
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(trackQuery.trim())}`);
      const data = await res.json();
      if (data.success) {
        setTrackedOrders(data.data);
      } else {
        setTrackedOrders([]);
      }
    } catch (err) {
      setTrackedOrders([]);
    } finally {
      setIsSearchingOrders(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cart.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }

    if (
      !checkoutForm.customerName.trim() ||
      !checkoutForm.customerPhone.trim() ||
      !checkoutForm.customerEmail.trim() ||
      !checkoutForm.shippingAddress.trim() ||
      !checkoutForm.pincode.trim()
    ) {
      setFormError('Please fill in all required customer details.');
      return;
    }

    if (checkoutForm.paymentMethod === 'UPI' && !checkoutForm.transactionId.trim()) {
      setFormError('Please enter your 12-digit UPI UTR / Reference Number.');
      return;
    }

    try {
      setSubmittingOrder(true);

      const itemsPayload = cart.map((item) => {
        const unitPrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
        return {
          productId: item.product._id,
          name: item.selectedVariant
            ? `${item.product.name} (${item.selectedVariant.name})`
            : item.product.name,
          price: unitPrice,
          quantity: item.quantity,
          gst: item.product.gst || 0,
          image: item.product.image,
        };
      });

      const payload = {
        customerName: checkoutForm.customerName,
        customerPhone: checkoutForm.customerPhone,
        customerEmail: checkoutForm.customerEmail,
        shippingAddress: checkoutForm.shippingAddress,
        pincode: checkoutForm.pincode,
        items: itemsPayload,
        subtotal: cartSubtotal,
        totalGst: cartGstTotal,
        totalAmount: cartGrandTotal,
        paymentMethod: checkoutForm.paymentMethod,
        transactionId: checkoutForm.transactionId,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.data);
        setCart([]);
        setIsCheckoutOpen(false);
        setCheckoutForm({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          shippingAddress: '',
          pincode: '',
          paymentMethod: 'UPI',
          transactionId: '',
        });
      } else {
        setFormError(data.error || 'Failed to place order.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error connecting to server.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const getWhatsAppProductShareLink = (product: Product) => {
    const text = `Check out ${product.name} at INDIAN AGRICULTURE: ₹${product.price} - https://INDIANAGRICULTURE.online`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const getWhatsAppSupportLink = (order: any) => {
    const formattedAmt = order.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: order.totalAmount % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 }) || '0';
    const text = `Hi, I placed an order #${order.orderId} for ₹${formattedAmt}. Please help with tracking.`;
    return `https://wa.me/919597250344?text=${encodeURIComponent(text)}`;
  };

  return (
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
              onClick={() => setIsCartOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#C99A2E] hover:bg-[#b08524] text-[#183B24] text-xs font-bold font-sans transition-colors flex items-center gap-1 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View Cart</span>
            </button>
            <button
              onClick={() => setToastMessage('')}
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
        className="bg-[#1B2E1E] text-[#FAF8F5] text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 text-center font-medium tracking-wide"
        style={{ borderRadius: '0 0 1.1rem 1.1rem' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="w-full text-center flex items-center justify-center gap-1.5 flex-nowrap leading-tight overflow-hidden">
            <span className="truncate">UPI · Cards · Net Banking · <span className="hidden xs:inline">e-Wallet · </span>COD Accepted</span>
            <span className="hidden md:inline text-[#D4A017] font-semibold flex-shrink-0">&nbsp;★ Direct Farm Shipping</span>
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
            boxShadow: '0 2px 20px -2px rgba(27,46,30,0.10)',
            maxWidth: '1200px',
          }}
        >
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
                PREMIUM B2B ORGANIC
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 text-xs font-sans font-extrabold uppercase tracking-[0.14em] text-[#1C1917]">
            <Link href="/" className="whitespace-nowrap nav-link-animated py-1 hover:text-[#1E3524]">Home</Link>
            <Link href="/products" className="whitespace-nowrap nav-link-animated py-1 text-[#1E3524]">Bulk Catalog</Link>
            <Link href="/#story-section" className="whitespace-nowrap nav-link-animated py-1 hover:text-[#1E3524]">B2B Sourcing</Link>
            <Link href="/#benefits-section" className="whitespace-nowrap nav-link-animated py-1 hover:text-[#1E3524]">Advantages</Link>
            <a href="https://wa.me/919578784431?text=Hello%20Indian%20Agriculture%20B2B%20Desk%2C%20I%20want%20a%20wholesale%20quote." target="_blank" rel="noreferrer" className="whitespace-nowrap nav-link-animated py-1 text-[#D4A017] hover:text-[#1E3524]">Request Quote</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="whitespace-nowrap flex items-center gap-1.5 text-[11px] sm:text-xs font-bold px-3 sm:px-5 py-2 sm:py-2.5 bg-[#F5F2EB] hover:bg-[#1E3524] hover:text-[#FAF8F5] text-[#1B2E1E] rounded-full border border-[#E5E0D8] transition-all shadow-xs"
            >
              <PackageCheck className="w-4 h-4 text-[#1E3524]" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:p-3 bg-[#1E3524] text-[#FAF8F5] rounded-full hover:bg-[#152519] transition-all shadow-md"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4A017] text-[#1B2E1E] font-bold text-[10px] w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

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
              <nav className="px-3 py-3 flex flex-col gap-1 font-sans text-xs font-bold uppercase tracking-wider">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Bulk Catalog', href: '/products', active: true },
                  { label: 'B2B Sourcing', href: '/#story-section' },
                  { label: 'Request Quote', href: '/#b2b-rfq-section', gold: true },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      item.gold
                        ? 'bg-[#1E3524] text-[#D4A017] hover:bg-[#152519]'
                        : item.active
                        ? 'bg-[#F5F2EB] text-[#1E3524]'
                        : 'text-[#1C1917] hover:bg-[#F5F2EB] hover:text-[#1E3524]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#1B2E1E] mb-6 font-bold">
            <Link href="/" className="hover:text-[#1E3524]">Home</Link>
            <span>/</span>
            <span className="font-extrabold text-[#1B2E1E]">B2B Bulk Products</span>
          </div>

          {/* Page Heading & Search Toolbar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E0D8]">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A017] font-extrabold">B2B Wholesale Catalog</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1B2E1E] mt-1">
                All Bulk Organic Products & Raw Supplies
              </h1>
              <p className="text-xs sm:text-sm text-[#1B2E1E] font-bold mt-1 font-sans">
                Explore our full range of 100% regeneratively farmed produce, bulk raw Moringa Oleifera, and OEM private label options.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A655A]" />
              <input
                type="text"
                placeholder="Search all products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#F5F2EB] border border-[#E5E0D8] rounded-full text-xs text-[#1C1917] focus:outline-none focus:border-[#1E3524] transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5A655A]">✕</button>
              )}
            </div>
          </div>

          {/* Category Filter Pills & Sorting Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {dynamicCategoryList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex-shrink-0 ${selectedCategory === cat
                    ? 'bg-[#1E3524] text-[#FAF8F5] shadow-md'
                    : 'bg-[#F5F2EB] text-[#5A655A] border border-[#E5E0D8] hover:text-[#1C1917]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#5A655A]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F5F2EB] border border-[#E5E0D8] text-xs text-[#1C1917] rounded-full px-4 py-2 focus:outline-none"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 rounded-3xl bg-[#F5F2EB] animate-pulse" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#F5F2EB] rounded-3xl border border-[#E5E0D8] space-y-3">
              <Leaf className="w-12 h-12 mx-auto text-[#5A655A]" />
              <h3 className="font-serif text-2xl text-[#1B2E1E]">No Products Available</h3>
              <p className="text-xs text-[#5A655A]">Try resetting your search query or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProducts.map((product) => {
                const selectedVar = selectedVariants[product._id];
                const currentPrice = selectedVar ? selectedVar.price : product.price;
                const currentMrp = selectedVar ? selectedVar.mrp : product.mrp;
                const currentStock = selectedVar ? selectedVar.quantity : product.quantity;
                const isOutOfStock = currentStock <= 0;

                return (
                  <div
                    key={product._id}
                    className="group rounded-3xl bg-[#F5F2EB] border border-[#E5E0D8] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-square bg-[#EFECE6] overflow-hidden">
                      <img
                        src={product.image || '/logo.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 bg-[#1B2E1E]/90 backdrop-blur-md text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-wider rounded-full">
                          {product.category || 'Organic'}
                        </span>
                        {product.discount > 0 && (
                          <span className="px-3 py-1 bg-[#D4A017] text-[#1B2E1E] text-[10px] font-bold rounded-full shadow-sm">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="absolute bottom-4 right-4 p-2.5 bg-[#FAF8F5] text-[#1B2E1E] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-1 text-[#D4A017] text-xs font-medium mb-1.5">
                          <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                          <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                          <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                          <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                          <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                          <span className="text-[#5A655A] text-[11px] ml-1">4.9 (48)</span>
                        </div>
                        <h3 className="font-sans text-base sm:text-lg font-semibold text-[#1B2E1E] line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#5A655A] line-clamp-2 mt-1.5 font-light leading-relaxed">
                          {product.description}
                        </p>

                        {product.variants && product.variants.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {product.variants.map((v) => {
                              const isSelected = selectedVar ? selectedVar.name === v.name : product.variants![0]!.name === v.name;
                              return (
                                <button
                                  key={v.name}
                                  onClick={() => handleSelectVariant(product._id, v)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${isSelected
                                    ? 'bg-[#1E3524] text-[#FAF8F5] border-[#1E3524]'
                                    : 'bg-[#FAF8F5] text-[#5A655A] border-[#E5E0D8]'
                                    }`}
                                >
                                  {v.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between gap-4">
                        <div>
                          <div className="text-[11px] text-[#5A655A]">Price</div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-sans text-lg font-bold text-[#1B2E1E]">
                              ₹{currentPrice.toLocaleString('en-IN')}
                            </span>
                            {currentMrp > currentPrice && (
                              <span className="text-xs text-[#5A655A] line-through">
                                ₹{currentMrp.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={isOutOfStock}
                          className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${isOutOfStock
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            : 'bg-[#1E3524] hover:bg-[#152519] text-[#FAF8F5] active:scale-95'
                            }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-14 flex justify-center items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-full bg-[#F5F2EB] border border-[#E5E0D8] text-[#1B2E1E] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-[#5A655A]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full bg-[#F5F2EB] border border-[#E5E0D8] text-[#1B2E1E] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Unified Customer Footer */}
      <Footer products={products} onOpenTrackModal={() => setIsTrackModalOpen(true)} />

      {/* SLIDE-OVER CART DRAWER MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF8F5] text-[#1C1917] shadow-2xl flex flex-col">
              <div className="p-6 bg-[#1B2E1E] text-[#FAF8F5] flex items-center justify-between border-b border-[#2A402D]">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-[#D4A017]" />
                  <h3 className="font-serif text-xl font-light">Shopping Bag ({cartItemCount})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 text-[#FAF8F5] hover:opacity-80">
                  <X className="w-5 h-5" />
                </button>
              </div>

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
                                onClick={() => updateCartQty(item.product._id, item.selectedVariant?.name, item.quantity - 1)}
                                className="text-stone-600 hover:text-black p-0.5"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-semibold px-1">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQty(item.product._id, item.selectedVariant?.name, item.quantity + 1)}
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
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
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
                onClick={() => setIsCheckoutOpen(false)}
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
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col gap-2 transition-all font-sans ${
                        checkoutForm.paymentMethod === 'UPI'
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
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col gap-2 transition-all font-sans ${
                        checkoutForm.paymentMethod === 'COD'
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
  );
}
