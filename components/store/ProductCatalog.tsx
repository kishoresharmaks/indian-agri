'use client';

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product, ProductVariant } from '@/hooks/useCart';

interface ProductCatalogProps {
  products: Product[];
  loading?: boolean;
  selectedVariants: Record<string, ProductVariant>;
  onSelectVariant: (productId: string, variant: ProductVariant) => void;
  onAddToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
}

const CATEGORIES = ['All', 'Moringa', 'Organic', 'Bulk', 'Seeds', 'Spices', 'Oils', 'General'];

export default function ProductCatalog({
  products,
  loading = false,
  selectedVariants,
  onSelectVariant,
  onAddToCart,
}: ProductCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'newest'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p =>
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price - (a.discount ? a.price * (1 - a.discount / 100) : 0)) -
                                 (b.price - (b.discount ? b.price * (1 - b.discount / 100) : 0)));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price - (b.discount ? b.price * (1 - b.discount / 100) : 0)) -
                                 (a.price - (a.discount ? a.price * (1 - a.discount / 100) : 0)));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
        break;
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E8EDF2] animate-pulse h-80" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8EDF2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#163B5C]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-[#ED3500] text-white border-[#ED3500]'
                : 'bg-white text-[#163B5C] border-[#E8EDF2]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-2xl border border-[#E8EDF2]">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#163B5C] text-white'
                    : 'bg-[#F5F5F5] text-[#64748B] hover:bg-[#E8EDF2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-medium">Sort:</span>
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'name', label: 'Name A-Z' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value as typeof sortBy)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  sortBy === opt.value
                    ? 'bg-[#ED3500] text-white'
                    : 'bg-[#F5F5F5] text-[#64748B] hover:bg-[#E8EDF2]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-[#64748B] mb-4">
        Showing {filtered.length} of {products.length} products
      </p>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#64748B] text-lg">No products found</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-[#ED3500] text-sm font-medium hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              selectedVariant={selectedVariants[product._id]}
              onAddToCart={onAddToCart}
              onSelectVariant={onSelectVariant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
