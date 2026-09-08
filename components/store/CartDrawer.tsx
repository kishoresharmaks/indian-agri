'use client';

import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/hooks/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  cart: CartItem[];
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  onUpdateQuantity: (productId: string, variantName: string | undefined, newQty: number) => void;
  onRemove: (productId: string, variantName?: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  onCheckout,
  cart,
  subtotal,
  gstTotal,
  grandTotal,
  onUpdateQuantity,
  onRemove,
}: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EDF2]">
          <h2 className="text-lg font-bold text-[#163B5C] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({cart.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5F5F5] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-[#E8EDF2] mb-4" />
              <p className="text-[#64748B] font-medium">Your cart is empty</p>
              <p className="text-[#64748B] text-sm mt-1">Browse our products and add items</p>
            </div>
          ) : (
            cart.map((item, idx) => {
              const unitPrice = item.selectedVariant
                ? item.selectedVariant.price
                : item.product.price;
              const variantLabel = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';

              return (
                <div
                  key={`${item.product._id}-${item.selectedVariant?.name ?? 'default'}-${idx}`}
                  className="flex gap-3 p-3 bg-[#FAF8F5] rounded-xl"
                >
                  {/* Image */}
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-white">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-[#E8EDF2]" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#163B5C] line-clamp-1">
                      {item.product.name}{variantLabel}
                    </h3>
                    <p className="text-[#ED3500] font-bold text-sm mt-0.5">
                      ₹{unitPrice.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product._id, item.selectedVariant?.name, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E8EDF2] hover:bg-[#ED3500] hover:text-white hover:border-[#ED3500] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm text-[#163B5C]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product._id, item.selectedVariant?.name, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E8EDF2] hover:bg-[#ED3500] hover:text-white hover:border-[#ED3500] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() =>
                          onRemove(item.product._id, item.selectedVariant?.name)
                        }
                        className="ml-auto p-1.5 rounded-lg text-[#64748B] hover:text-[#ED3500] hover:bg-[#ED3500]/5 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-[#163B5C]">
                      ₹{(unitPrice * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Totals + Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-[#E8EDF2] px-5 py-4 space-y-3 bg-white">
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B]">Subtotal</span>
              <span className="font-medium text-[#163B5C]">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B]">GST (incl.)</span>
              <span className="font-medium text-[#163B5C]">₹{gstTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span className="text-[#163B5C]">Grand Total</span>
              <span className="text-[#ED3500]">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 px-4 bg-[#ED3500] hover:bg-[#D02E00] text-white font-bold rounded-xl transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
