/**
 * Standalone Checkout Page
 *
 * This page can be accessed directly at /checkout after adding items to the cart.
 * It reads cart state from localStorage and renders the CheckoutForm component.
 *
 * The main storefront (app/page.tsx) also embeds the checkout flow inline.
 * This standalone page provides a direct checkout URL for deep-linking and redirects.
 */
'use client';

import React, { useState, useEffect } from 'react';
import CheckoutForm from '@/components/store/CheckoutForm';
import type { CartItem } from '@/hooks/useCart';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('indianagri_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="animate-spin w-8 h-8 border-4 border-[#ED3500] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] px-4">
        <h1 className="text-2xl font-bold text-[#163B5C] mb-4">Your cart is empty</h1>
        <a
          href="/"
          className="px-6 py-3 bg-[#ED3500] text-white rounded-full font-semibold hover:bg-[#D02E00] transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const gstTotal = cart.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
    const gstRate = item.product.gst || 18;
    return sum + (price * item.quantity * gstRate) / 100;
  }, 0);

  const grandTotal = subtotal + gstTotal;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#163B5C] mb-6">Checkout</h1>
        <CheckoutForm
          isOpen={true}
          onClose={() => window.history.back()}
          onOrderSuccess={() => {}}
          onBackToCart={() => window.history.back()}
          cart={cart}
          grandTotal={grandTotal}
        />
      </div>
    </div>
  );
}
