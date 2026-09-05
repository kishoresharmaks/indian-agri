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

import CommitmentSection from '../components/CommitmentSection';
import Footer from '../components/Footer';
import MoringaHero from '../components/MoringaHero';
import TrackOrderModal from '../components/TrackOrderModal';
import OrganicCatalogSection from '../components/OrganicCatalogSection';

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

interface BannerItem {
  _id: string;
  title: string;
  image: string;
  link?: string;
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
    process.env.NEXT_PUBLIC_MERCHANT_UPI_ID || 'beeshubfarmland@upi'
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

  // Restore Session State from localStorage on Mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('beeshub_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
        }
      }

      const savedForm = localStorage.getItem('beeshub_checkout_form');
      if (savedForm) {
        setCheckoutForm((prev) => ({ ...prev, ...JSON.parse(savedForm) }));
      }

      const wasCheckoutOpen = localStorage.getItem('beeshub_checkout_open');
      if (wasCheckoutOpen === 'true') {
        setIsCheckoutOpen(true);
      }
    } catch (err) {
      console.error('Error restoring session state:', err);
    }
  }, []);

  // Persist Cart to localStorage
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem('beeshub_cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('beeshub_cart');
      }
    } catch (err) { }
  }, [cart]);

  // Persist Checkout Form & Modal state
  useEffect(() => {
    try {
      localStorage.setItem('beeshub_checkout_form', JSON.stringify(checkoutForm));
      localStorage.setItem('beeshub_checkout_open', isCheckoutOpen ? 'true' : 'false');
    } catch (err) { }
  }, [checkoutForm, isCheckoutOpen]);

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

  // Cart Management with Variant Support
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
        const newQty = prevCart[existingIndex].quantity + quantityToAdd;
        if (newQty > activeStock) {
          alert(`Sorry, only ${activeStock} items available for ${activeVariant ? activeVariant.name : 'this product'}.`);
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
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
  const cartSubtotal = cart.reduce(
    (sum, item) =>
      sum + (item.selectedVariant ? item.selectedVariant.price : item.product.price) * item.quantity,
    0
  );
  const cartGstTotal = cart.reduce(
    (sum, item) => {
      const unitPrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      const gstRate = item.product.gst !== undefined ? item.product.gst : 0;
      return sum + ((unitPrice * item.quantity) * gstRate) / 100;
    },
    0
  );
  const cartGrandTotal = Math.round(cartSubtotal + cartGstTotal);
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

  // Copy UPI ID helper
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // UPI Intent URL
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent('INDIAN AGRICULTURE')}&am=${cartGrandTotal}&cu=INR&tn=${encodeURIComponent('Indian Agriculture Order')}`;
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
        setCart([]);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);

        // Clear local storage after successful checkout
        try {
          localStorage.removeItem('beeshub_cart');
          localStorage.removeItem('beeshub_checkout_form');
          localStorage.removeItem('beeshub_checkout_open');
        } catch (e) { }

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
    if (!order) return 'https://wa.me/919578784431';
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

💰 *Total Amount:* ₹${order.totalAmount ? order.totalAmount.toLocaleString('en-IN') : 0}
💳 *Payment Mode:* ${order.paymentMethod === 'UPI' ? 'Online UPI' : 'Cash on Delivery'} (${order.paymentStatus || 'Pending'})
${order.transactionId ? `🔢 *UTR / Ref:* ${order.transactionId}\n` : ''}${order.status ? `📦 *Status:* ${order.status}\n` : ''}
Please assist me with this order. Thank you!`;

    return `https://wa.me/919578784431?text=${encodeURIComponent(text)}`;
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

      {/* Top Announcement Bar (Treelogy Dark Olive Header) */}
      <div className="bg-[#1B2E1E] text-[#FAF8F5] text-[10px] sm:text-xs py-2 px-3 text-center font-medium tracking-wide border-b border-[#2A402D]">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="w-full text-center flex items-center justify-center gap-1.5 flex-wrap leading-tight">
            <span>We accept UPI · Credit Cards · Net Banking · e-Wallet · Cash on Delivery</span>
            <span className="hidden sm:inline text-[#D4A017] font-semibold">★ Direct Farm Shipping Across India</span>
          </p>
        </div>
      </div>

      {/* Sticky Glassmorphism Header Nav */}
      <header className="sticky top-0 z-40 glass-nav transition-all duration-300">
        <div className="w-full px-3 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Wordmark (Serif Treelogy Style) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#183B24] ring-2 ring-[#55753F]/25 bg-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0 p-0.5">
              <img
                src="/logo.jpg"
                alt="Indian Agriculture Logo"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
            </div>
            <div className="min-w-0">
              <span className="font-serif font-bold text-base sm:text-2xl tracking-tight text-[#1B2E1E] block leading-tight truncate">
                INDIAN AGRICULTURE
              </span>
              <span className="hidden sm:block text-[8.5px] uppercase tracking-[0.25em] text-[#5A655A] font-semibold mt-0.5">
                PREMIUM ORGANIC SOLUTIONS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Generous Spacing */}
          <nav className="hidden lg:flex items-center gap-10 xl:gap-14 text-xs font-sans font-semibold uppercase tracking-[0.12em] text-[#1C1917]">
            <a href="#products-section" className="whitespace-nowrap nav-link-animated py-1 text-[#1C1917] hover:text-[#1E3524]">
              Shop Products
            </a>
            <a href="#story-section" className="whitespace-nowrap nav-link-animated py-1 text-[#1C1917] hover:text-[#1E3524]">
              Our Story
            </a>
            <a href="#benefits-section" className="whitespace-nowrap nav-link-animated py-1 text-[#1C1917] hover:text-[#1E3524]">
              Benefits
            </a>
            <a href="#reviews-section" className="whitespace-nowrap nav-link-animated py-1 text-[#1C1917] hover:text-[#1E3524]">
              Reviews
            </a>
          </nav>

          {/* Header Actions (Pushed to far right) */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Track Order Button */}
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="whitespace-nowrap flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-3 sm:px-5 py-2 sm:py-2.5 bg-[#F5F2EB] hover:bg-[#1E3524] hover:text-[#FAF8F5] text-[#1B2E1E] rounded-full border border-[#E5E0D8] transition-all duration-300 shadow-xs active:scale-95"
            >
              <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E3524]" />
              <span className="hidden xs:inline sm:inline">Track Order</span>
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:p-3 bg-[#1E3524] text-[#FAF8F5] rounded-full hover:bg-[#152519] transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4A017] text-[#1B2E1E] font-bold text-[10px] w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 sm:p-3 rounded-full bg-[#F5F2EB] text-[#1B2E1E] hover:bg-[#E5E0D8] transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E5E0D8] px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
            {/* Mobile Search Bar */}
            <div className="relative w-full mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A655A]" />
              <input
                type="text"
                placeholder="Search organic solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#F5F2EB] border border-[#E5E0D8] rounded-full text-xs text-[#1C1917] placeholder-[#5A655A] focus:outline-none focus:border-[#1E3524]"
              />
            </div>

            <nav className="flex flex-col space-y-3 font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              <a
                href="#products-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-[#E5E0D8]/60 hover:text-[#1E3524]"
              >
                Shop Products
              </a>
              <a
                href="#story-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-[#E5E0D8]/60 hover:text-[#1E3524]"
              >
                Our Story
              </a>
              <a
                href="#benefits-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-[#E5E0D8]/60 hover:text-[#1E3524]"
              >
                Benefits
              </a>
              <a
                href="#reviews-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 hover:text-[#1E3524]"
              >
                Reviews
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">

        {/* REDESIGNED MORINGA HERO SECTION (Desktop & Mobile Reference Replica) */}
        <MoringaHero
          products={products}
          banners={banners}
          onOpenProductModal={(p) => setSelectedProduct(p)}
        />

        {/* OUR COMMITMENT SECTION */}
        <CommitmentSection />

        {/* ORGANIC HARVEST CATALOG SECTION (EDITORIAL CATALOG REPLICA) */}
        <OrganicCatalogSection
          products={products}
          onAddToCart={(p, qty) => addToCart(p, qty)}
          onOpenProductModal={(p) => setSelectedProduct(p)}
        />

        {/* PHILOSOPHY & STORY SECTION (Matching Reference Image Design) */}
        <section id="story-section" className="py-16 sm:py-24 bg-[#F9F8F3] text-[#1C2A1E] relative overflow-hidden">
          {/* Watermark leaf accent */}
          <div className="absolute top-4 left-4 pointer-events-none opacity-20 hidden lg:block">
            <svg className="w-36 h-36 text-[#C4922A]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M30,90 Q40,40 90,10 Q60,30 30,90 Z" />
              <path d="M50,60 Q30,40 20,45 Q35,55 50,60 Z" />
            </svg>
          </div>

          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

              {/* Left Side: Editorial Headline, Text, 4 Stat Cards & CTA */}
              <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">

                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#C4922A]" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C4922A]">
                    OUR PHILOSOPHY
                  </span>
                  <div className="w-12 h-[1.5px] bg-[#C4922A]" />
                </div>

                {/* Main Headline */}
                <div className="space-y-1">
                  <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1C2A1E] leading-[1.08] tracking-tight">
                    Ancient Wisdom.
                  </h2>
                  <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1C2A1E] leading-[1.08] tracking-tight">
                    Modern Science.
                  </h2>
                  <h2 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-normal text-[#C4922A] leading-[1.08] tracking-tight pt-1">
                    Pure Wellness.
                  </h2>
                </div>

                {/* Paragraph */}
                <p className="text-sm sm:text-base text-[#4A554D] leading-relaxed max-w-xl font-normal">
                  Oleifera (Moringa) — the Tree of Life — has nourished generations in India for centuries. At{' '}
                  <strong className="text-[#1C2A1E] font-bold">Indian Agriculture</strong>, we blend traditional knowledge with cutting-edge science to bring you pure, stem-free, low-temperature dehydrated Moringa products — rich in nutrients, antioxidants, and natural goodness.
                </p>

                {/* 4 Feature Stat Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-white/90 border border-[#E6E2D8] rounded-2xl p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#486027] text-white flex items-center justify-center shrink-0">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-bold text-xl sm:text-2xl text-[#1C2A1E]">92+</span>
                    </div>
                    <p className="text-[11px] text-[#5C665E] font-medium leading-tight">
                      Nutrients & Bio-compounds
                    </p>
                  </div>

                  <div className="bg-white/90 border border-[#E6E2D8] rounded-2xl p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#486027] text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-bold text-xl sm:text-2xl text-[#1C2A1E]">46+</span>
                    </div>
                    <p className="text-[11px] text-[#5C665E] font-medium leading-tight">
                      Natural Antioxidants
                    </p>
                  </div>

                  <div className="bg-white/90 border border-[#E6E2D8] rounded-2xl p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#486027] text-white flex items-center justify-center shrink-0">
                        <Feather className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-bold text-xl sm:text-2xl text-[#1C2A1E]">100%</span>
                    </div>
                    <p className="text-[11px] text-[#5C665E] font-medium leading-tight">
                      Stem-Free Purity
                    </p>
                  </div>

                  <div className="bg-white/90 border border-[#E6E2D8] rounded-2xl p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#486027] text-white flex items-center justify-center shrink-0">
                        <Heart className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-bold text-xl sm:text-2xl text-[#1C2A1E]">100%</span>
                    </div>
                    <p className="text-[11px] text-[#5C665E] font-medium leading-tight">
                      Organic & Chemical-Free
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <a
                    href="#products-section"
                    className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#273B24] hover:bg-[#1E2E1C] text-white font-medium text-xs sm:text-sm tracking-wide transition-all shadow-md group"
                  >
                    <Leaf className="w-4 h-4 text-[#C4922A]" />
                    <span>Discover Our Products</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

              </div>

              {/* Right Side: Seamless Image Canvas (Outer White Frame Removed) */}
              <div className="lg:col-span-6 relative">

                {/* Soft ambient background glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#C4922A]/15 via-transparent to-[#486027]/15 rounded-[40px] blur-2xl pointer-events-none" />

                {/* Main Image Frame directly on canvas */}
                <div className="relative aspect-[4/3] sm:aspect-[1.12/1] rounded-[32px] overflow-hidden shadow-2xl border border-[#E6E2D8] bg-slate-100">
                  <img
                    src="/moringa_farm_philosophy.png"
                    alt="Indian Agriculture Organic Moringa Harvest"
                    className="w-full h-full object-cover object-center scale-[1.01] hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gentle Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/30 pointer-events-none" />

                  {/* LOGO OVERLAY CARD */}
                  <div className="absolute top-5 left-5 max-w-[270px] sm:max-w-[320px] bg-white/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/80 shadow-xl z-10 hover:bg-white/95 transition-all duration-300">
                    {/* Logo loaded from /logo.jpg */}
                    <div className="bg-white p-2 sm:p-2.5 rounded-xl border border-slate-100 shadow-2xs inline-block">
                      <img
                        src="/logo.jpg"
                        alt="Indian Agriculture Logo"
                        className="h-10 sm:h-14 w-auto object-contain"
                      />
                    </div>

                    {/* Tagline text below logo */}
                    <div className="mt-3 border-l-2 border-[#C4922A] pl-3 py-0.5">
                      <p className="font-serif italic text-xs sm:text-sm text-[#1C2A1E] leading-relaxed">
                        In harmony with Earth, Empowering farmers, Caring for future generations.
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM-RIGHT BADGE */}
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#273B24]/90 text-white text-xs font-semibold shadow-xl backdrop-blur-md border border-white/20 hover:scale-105 transition-transform">
                      <Leaf className="w-3.5 h-3.5 text-[#C4922A]" />
                      <span>From Indian Farms to Your Home</span>
                    </div>
                  </div>

                  {/* FLOATING RIGHT FEATURE STRIP (Frosted Glass Badges) */}
                  <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-white/85 backdrop-blur-xl rounded-[28px] p-3 sm:p-4 shadow-xl border border-white/90 space-y-4 sm:space-y-5 hidden xs:flex flex-col items-center text-center w-24 sm:w-28 z-20">
                    <div className="flex flex-col items-center text-center space-y-1.5 group cursor-default">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#486027]/10 text-[#486027] flex items-center justify-center group-hover:bg-[#486027] group-hover:text-white transition-colors duration-300">
                        <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#2C382E] leading-tight">
                        Sustainable Farming
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-1.5 group cursor-default">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#486027]/10 text-[#486027] flex items-center justify-center group-hover:bg-[#486027] group-hover:text-white transition-colors duration-300">
                        <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#2C382E] leading-tight">
                        Farmer Empowerment
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-1.5 group cursor-default">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#486027]/10 text-[#486027] flex items-center justify-center group-hover:bg-[#486027] group-hover:text-white transition-colors duration-300">
                        <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#2C382E] leading-tight">
                        Pure & Natural
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-1.5 group cursor-default">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#486027]/10 text-[#486027] flex items-center justify-center group-hover:bg-[#486027] group-hover:text-white transition-colors duration-300">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#2C382E] leading-tight">
                        Safe & Trusted
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS SECTION */}
        <section id="reviews-section" className="py-20 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-[#5A655A] font-semibold">Testimonials</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#1B2E1E] mt-2 mb-12">
              They Speak About It Better Than Us
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-8 rounded-3xl bg-[#F5F2EB] border border-[#E5E0D8] space-y-4">
                <div className="flex text-[#D4A017] gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4A017]" />)}
                </div>
                <p className="text-xs text-[#5A655A] font-light leading-relaxed italic">
                  "The quality of the Moringa powder is unmatched. You can immediately tell by the rich green color and fresh organic smell. Exceptional delivery speed!"
                </p>
                <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1B2E1E]">Priya Sharma</span>
                  <span className="text-[10px] text-[#1E3524] font-semibold bg-[#E5E0D8] px-2 py-0.5 rounded-full">Verified Buyer</span>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#F5F2EB] border border-[#E5E0D8] space-y-4">
                <div className="flex text-[#D4A017] gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4A017]" />)}
                </div>
                <p className="text-xs text-[#5A655A] font-light leading-relaxed italic">
                  "Ordered bulk produce for our organic kitchen. 100% natural, no stems, perfect fineness. Customer support on WhatsApp is super helpful."
                </p>
                <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1B2E1E]">Rajesh Patel</span>
                  <span className="text-[10px] text-[#1E3524] font-semibold bg-[#E5E0D8] px-2 py-0.5 rounded-full">Verified Buyer</span>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#F5F2EB] border border-[#E5E0D8] space-y-4">
                <div className="flex text-[#D4A017] gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4A017]" />)}
                </div>
                <p className="text-xs text-[#5A655A] font-light leading-relaxed italic">
                  "Love the packaging and mission. Fresh organic produce shipped directly from farms. My energy levels have improved noticeably."
                </p>
                <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1B2E1E]">Ananya Iyer</span>
                  <span className="text-[10px] text-[#1E3524] font-semibold bg-[#E5E0D8] px-2 py-0.5 rounded-full">Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <Footer onOpenTrackModal={() => setIsTrackModalOpen(true)} />

      {/* SHOPPING CART SLIDE-OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF8F5] text-[#1C1917] shadow-2xl flex flex-col justify-between">

              {/* Drawer Header */}
              <div className="p-6 bg-[#1B2E1E] text-[#FAF8F5] flex items-center justify-between border-b border-[#2A402D]">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-[#D4A017]" />
                  <h3 className="font-serif text-xl font-medium">Your Shopping Bag ({cartItemCount})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-[#FAF8F5]">
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
                              ₹{(price * item.quantity).toLocaleString('en-IN')}
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

              {/* Drawer Footer / Checkout */}
              {cart.length > 0 && (
                <div className="p-6 bg-[#F5F2EB] border-t border-[#E5E0D8] space-y-4">
                  <div className="space-y-1.5 text-xs text-[#5A655A]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#1C1917]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {cartGstTotal > 0 && (
                      <div className="flex justify-between">
                        <span>GST</span>
                        <span className="text-[#1C1917]">₹{cartGstTotal.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-[#1B2E1E] pt-2 border-t border-[#E5E0D8]">
                      <span>Grand Total</span>
                      <span className="font-serif text-lg">₹{cartGrandTotal.toLocaleString('en-IN')}</span>
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
                    ₹{cartGrandTotal.toLocaleString('en-IN')}
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
                <span className="font-sans font-extrabold text-[#183B24] text-base sm:text-lg">₹{orderSuccess.totalAmount?.toLocaleString('en-IN')}</span>
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
