'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================================
// Shared Type Definitions
// ============================================================

export interface ProductVariant {
  _id?: string;
  name: string;
  mrp: number;
  price: number;
  quantity: number;
  discount?: number;
}

export interface Product {
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

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  itemCount: number;
}

export interface UseCartReturn {
  // State
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;

  // Computed
  totals: CartTotals;

  // Cart mutations
  addToCart: (product: Product, quantityToAdd?: number, customVariant?: ProductVariant) => void;
  updateQuantity: (productId: string, variantName: string | undefined, newQty: number) => void;
  removeFromCart: (productId: string, variantName?: string) => void;
  clearCart: () => void;

  // Variant selection (stored in component state, not cart)
  selectedVariants: Record<string, ProductVariant>;
  selectVariant: (productId: string, variant: ProductVariant) => void;

  // UI state
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Toast
  toastMessage: string;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

const STORAGE_KEY = 'indianagri_cart';

// ============================================================
// Helper: Load cart from localStorage
// ============================================================
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveCartToStorage(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    if (cart.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

// ============================================================
// Hook Implementation
// ============================================================
export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});

  // ── Restore cart from localStorage on mount ──────────────
  useEffect(() => {
    const saved = loadCartFromStorage();
    if (saved.length > 0) setCart(saved);
  }, []);

  // ── Persist cart to localStorage on change ───────────────
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // ── Computed totals ─────────────────────────────────────
  const totals = ((): CartTotals => {
    let subtotal = 0;
    let gstTotal = 0;
    let itemCount = 0;

    for (const item of cart) {
      const unitPrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      const gstRate = item.product.gst ?? 0;

      const lineTotal = unitPrice * item.quantity;
      const lineGst = (lineTotal * gstRate) / 100;

      subtotal += lineTotal;
      gstTotal += lineGst;
      itemCount += item.quantity;
    }

    const cleanSubtotal = Number(subtotal.toFixed(2));
    const cleanGstTotal = Number(gstTotal.toFixed(2));
    const cleanGrandTotal = Number((cleanSubtotal + cleanGstTotal).toFixed(2));

    return {
      subtotal: cleanSubtotal,
      gstTotal: cleanGstTotal,
      grandTotal: cleanGrandTotal,
      itemCount,
    };
  })();

  // ── Cart mutations ───────────────────────────────────────
  const addToCart = useCallback(
    (product: Product, quantityToAdd = 1, customVariant?: ProductVariant) => {
      const activeVariant =
        customVariant ??
        selectedVariants[product._id] ??
        (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);

      const activeStock = activeVariant ? activeVariant.quantity : product.quantity;

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.product._id === product._id &&
            ((!item.selectedVariant && !activeVariant) ||
              item.selectedVariant?.name === activeVariant?.name),
        );

        if (existingIndex > -1) {
          const newQty = prev[existingIndex]!.quantity + quantityToAdd;
          if (newQty > activeStock) {
            alert(`Sorry, only ${activeStock} items available.`);
            return prev;
          }
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex]!, quantity: newQty };
          return updated;
        } else {
          if (quantityToAdd > activeStock) {
            alert(`Sorry, only ${activeStock} items available in stock.`);
            return prev;
          }
          return [...prev, { product, selectedVariant: activeVariant, quantity: quantityToAdd }];
        }
      });

      // Show toast
      const cleanName = (product.name || 'Product').replace(/_Shyn&Dev/gi, '').trim();
      const label = activeVariant ? `${cleanName} (${activeVariant.name})` : cleanName;
      setToastMessage(`Added "${label}" to cart!`);
    },
    [selectedVariants],
  );

  const updateQuantity = useCallback(
    (productId: string, variantName: string | undefined, newQty: number) => {
      if (newQty <= 0) {
        setCart((prev) =>
          prev.filter(
            (item) =>
              !(item.product._id === productId && item.selectedVariant?.name === variantName),
          ),
        );
        return;
      }

      setCart((prev) =>
        prev.map((item) => {
          if (item.product._id === productId && item.selectedVariant?.name === variantName) {
            const maxStock = item.selectedVariant ? item.selectedVariant.quantity : item.product.quantity;
            if (newQty > maxStock) {
              alert(`Only ${maxStock} units available.`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        }),
      );
    },
    [],
  );

  const removeFromCart = useCallback((productId: string, variantName?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product._id === productId && item.selectedVariant?.name === variantName),
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ── Variant selection ────────────────────────────────────
  const selectVariant = useCallback((productId: string, variant: ProductVariant) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  }, []);

  // ── UI state ─────────────────────────────────────────────
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const openCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  // ── Toast ───────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage('');
  }, []);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return {
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
  };
}

export default useCart;
