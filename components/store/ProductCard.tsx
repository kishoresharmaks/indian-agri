'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import type { Product, ProductVariant } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  selectedVariant?: ProductVariant;
  onAddToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  onSelectVariant?: (productId: string, variant: ProductVariant) => void;
  onProductClick?: (product: Product) => void;
}

export default function ProductCard({
  product,
  selectedVariant,
  onAddToCart,
  onSelectVariant,
  onProductClick,
}: ProductCardProps) {
  const activeVariant = selectedVariant ?? (product.variants && product.variants[0]);

  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const displayMrp = activeVariant ? activeVariant.mrp : product.mrp;
  const displayDiscount = activeVariant
    ? activeVariant.mrp > activeVariant.price
      ? Math.round(((activeVariant.mrp - activeVariant.price) / activeVariant.mrp) * 100)
      : product.discount
    : product.discount;
  const displayStock = activeVariant ? activeVariant.quantity : product.quantity;
  const inStock = displayStock > 0;
  const hasMultipleVariants = product.variants && product.variants.length > 1;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-[#E8EDF2] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      id={`product-${product._id}`}
    >
      {/* Discount Badge */}
      {displayDiscount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-white bg-[#ED3500] rounded-full">
            -{displayDiscount}%
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:text-[#ED3500]"
        aria-label="Add to wishlist"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Heart className="w-4 h-4" />
      </button>

      {/* Product Image */}
      <Link
        href={`/product/${product._id}`}
        className="block relative aspect-square bg-[#FFF8F5] overflow-hidden"
        onClick={() => onProductClick?.(product)}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#E8EDF2]">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm px-3 py-1.5 bg-black/60 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Color Swatches */}
      {hasMultipleVariants && (
        <div className="px-3 pt-2 flex items-center gap-1.5 overflow-x-auto">
          {product.variants!.map((variant) => {
            const isSelected = activeVariant?.name === variant.name;
            return (
              <button
                key={variant.name}
                title={variant.name}
                className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${
                  isSelected
                    ? 'border-[#ED3500] ring-2 ring-[#ED3500]/20'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: getSwatchColor(variant.name) }}
                onClick={() => onSelectVariant?.(product._id, variant)}
              />
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {product.category && (
          <span className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1">
            {product.category}
          </span>
        )}
        <Link
          href={`/product/${product._id}`}
          className="block text-[#163B5C] font-semibold text-sm leading-snug line-clamp-2 hover:text-[#ED3500] transition-colors mb-2"
          onClick={() => onProductClick?.(product)}
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[#ED3500] font-bold text-lg">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {displayMrp > displayPrice && (
            <span className="text-[#64748B] text-sm line-through">
              ₹{displayMrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Variant Pills */}
        {hasMultipleVariants && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.variants!.slice(0, 3).map((variant) => {
              const isSelected = activeVariant?.name === variant.name;
              return (
                <button
                  key={variant.name}
                  onClick={() => onSelectVariant?.(product._id, variant)}
                  className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                    isSelected
                      ? 'border-[#ED3500] bg-[#ED3500]/5 text-[#ED3500]'
                      : 'border-[#E8EDF2] text-[#64748B] hover:border-[#163B5C]'
                  }`}
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Stock Status */}
        <div className="mt-auto flex items-center gap-1 mb-3">
          {inStock ? (
            <span className="text-xs text-[#10B981] font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              {displayStock <= 5 ? `Only ${displayStock} left` : 'In Stock'}
            </span>
          ) : (
            <span className="text-xs text-[#ED3500] font-medium">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product, 1, activeVariant)}
          disabled={!inStock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
            inStock
              ? 'bg-[#ED3500] hover:bg-[#D02E00] text-white active:scale-[0.98]'
              : 'bg-[#E8EDF2] text-[#64748B] cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

function getSwatchColor(variantName: string): string {
  const name = variantName.toLowerCase();
  const colorMap: Record<string, string> = {
    red: '#C82333', crimson: '#DC143C', blue: '#104E8B', navy: '#1A2744',
    green: '#054A29', olive: '#556B2F', black: '#1A1A1A', white: '#F5F5F5',
    ivory: '#FFFFF0', mustard: '#DAA520', terracotta: '#C85A32',
    indigo: '#2B3A67', gold: '#D4AF37',
  };
  for (const [key, hex] of Object.entries(colorMap)) {
    if (name.includes(key)) return hex;
  }
  let hash = 0;
  for (const char of variantName) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `hsl(${hash % 360}, 60%, 50%)`;
}
