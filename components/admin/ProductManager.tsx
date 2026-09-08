'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit, Trash2, Search, RefreshCw, Image as ImageIcon,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';

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
  createdAt: string;
}

interface ProductManagerProps {
  initialProducts?: Product[];
  categories: { _id: string; name: string }[];
}

export default function ProductManager({ initialProducts = [], categories }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length > 0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const perPage = 8;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialProducts.length === 0) {
      fetchProducts();
    }
  }, [initialProducts.length, fetchProducts]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p._id !== product._id));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleSave = async (formData: Partial<Product>) => {
    setSubmitting(true);
    setError('');
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        if (editingProduct) {
          setProducts(prev =>
            prev.map(p => (p._id === editingProduct._id ? { ...p, ...data.data } : p))
          );
        } else {
          setProducts(prev => [data.data, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        setError(data.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#ED3500] text-white rounded-xl font-semibold hover:bg-[#D02E00] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 px-4 py-2 border border-[#E8EDF2] text-[#64748B] rounded-xl font-medium hover:bg-[#F5F5F5] transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-[#E8EDF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E8EDF2] h-48 animate-pulse" />
          ))}
        </div>
      ) : pageItems.length === 0 ? (
        <div className="text-center py-12 text-[#64748B]">
          <p className="font-medium">No products found</p>
          <button onClick={handleAdd} className="mt-2 text-[#ED3500] hover:underline text-sm font-medium">
            Add your first product
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pageItems.map(product => (
              <div key={product._id} className="bg-white rounded-xl border border-[#E8EDF2] overflow-hidden group">
                <div className="relative h-32 bg-[#FAF8F5]">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-[#E8EDF2]" />
                    </div>
                  )}
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#ED3500] text-white text-xs font-bold rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-[#163B5C] text-sm truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#ED3500] font-bold text-sm">₹{product.price}</span>
                    <span className="text-[#94A3B8] text-xs line-through">₹{product.mrp}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1 truncate">{product.category}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#F5F5F5] hover:bg-[#E8EDF2] text-[#163B5C] rounded-lg text-xs font-medium transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="flex items-center justify-center px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[#E8EDF2] disabled:opacity-40 hover:bg-[#F5F5F5] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[#64748B]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[#E8EDF2] disabled:opacity-40 hover:bg-[#F5F5F5] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
}

// ============================================================
// Product Form Modal (inline to avoid extra file)
// ============================================================
interface ProductFormModalProps {
  product: Product | null;
  categories: { _id: string; name: string }[];
  onSave: (data: Partial<Product>) => void;
  onClose: () => void;
  submitting: boolean;
  error: string;
}

function ProductFormModal({ product, categories, onSave, onClose, submitting, error }: ProductFormModalProps) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    image: product?.image ?? '',
    mrp: product?.mrp ?? 0,
    price: product?.price ?? 0,
    quantity: product?.quantity ?? 0,
    gst: product?.gst ?? 18,
    category: product?.category ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EDF2]">
          <h2 className="text-lg font-bold text-[#163B5C]">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F5F5F5] rounded-lg">
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#163B5C] mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 border border-[#E8EDF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30"
              placeholder="e.g. Organic Moringa Powder"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#163B5C] mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 border border-[#E8EDF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30 resize-none"
              placeholder="Product description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#163B5C] mb-1">MRP (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.mrp}
                onChange={e => setForm(f => ({ ...f, mrp: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 border border-[#E8EDF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#163B5C] mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 border border-[#E8EDF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#163B5C] mb-1">Stock Qty *</label>
              <input
                type="number"
                required
                min={0}
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 border border-[#E8EDF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#163B5C] mb-1">GST % *</label>
              <input
                type="number"
                required
                min={0}
                max={100}
                value={form.gst}
                onChange={e => setForm(f => ({ ...f, gst: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 border border-[#E8EDF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#163B5C] mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2.5 border border-[#E8EDF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30"
            >
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
              {form.category && !categories.find(c => c.name === form.category) && (
                <option value={form.category}>{form.category}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#163B5C] mb-1">Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              className="w-full px-4 py-2.5 border border-[#E8EDF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]/30"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#E8EDF2] text-[#64748B] rounded-xl font-medium hover:bg-[#F5F5F5] transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-[#ED3500] text-white rounded-xl font-semibold hover:bg-[#D02E00] transition-colors text-sm disabled:opacity-60"
            >
              {submitting ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
