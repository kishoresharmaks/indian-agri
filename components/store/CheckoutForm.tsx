'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, QrCode, Copy, Check } from 'lucide-react';
import type { CartItem } from '@/hooks/useCart';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: unknown) => void;
  onBackToCart: () => void;
  cart: CartItem[];
  grandTotal: number;
}

interface CheckoutFormState {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  pincode: string;
  paymentMethod: 'COD' | 'UPI';
  transactionId: string;
}

const STORAGE_KEY = 'indianagri_checkout_form';

function loadSavedForm(): Partial<CheckoutFormState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveForm(form: CheckoutFormState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  } catch { /* ignore */ }
}

export default function CheckoutForm({
  isOpen,
  onClose,
  onOrderSuccess,
  onBackToCart,
  cart,
  grandTotal,
}: CheckoutFormProps) {
  const saved = loadSavedForm();

  const [form, setForm] = useState<CheckoutFormState>({
    customerName: saved.customerName ?? '',
    customerPhone: saved.customerPhone ?? '',
    customerEmail: saved.customerEmail ?? '',
    shippingAddress: saved.shippingAddress ?? '',
    pincode: saved.pincode ?? '',
    paymentMethod: saved.paymentMethod ?? 'UPI',
    transactionId: saved.transactionId ?? '',
  });

  const [paymentSettings, setPaymentSettings] = useState({ enableUPI: true, enableCOD: true });
  const [merchantUpiId, setMerchantUpiId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load payment settings
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setPaymentSettings({
            enableUPI: d.data.enableUPI ?? true,
            enableCOD: d.data.enableCOD ?? true,
          });
        }
      })
      .catch(() => {});

    const upiId = process.env.NEXT_PUBLIC_MERCHANT_UPI_ID || '';
    setMerchantUpiId(upiId);
  }, [isOpen]);

  // Persist form to localStorage
  useEffect(() => {
    saveForm(form);
  }, [form]);

  // Auto-select valid payment method if current one is disabled
  useEffect(() => {
    if (!form.paymentMethod) return;
    if (form.paymentMethod === 'UPI' && !paymentSettings.enableUPI && paymentSettings.enableCOD) {
      setForm((f) => ({ ...f, paymentMethod: 'COD' }));
    }
    if (form.paymentMethod === 'COD' && !paymentSettings.enableCOD && paymentSettings.enableUPI) {
      setForm((f) => ({ ...f, paymentMethod: 'UPI' }));
    }
  }, [paymentSettings]);

  const updateField = (field: keyof CheckoutFormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId).then(() => {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    });
  };

  const upiIntentUrl =
    `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent('INDIAN AGRICULTURE')}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent('Indian Agriculture Order')}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiIntentUrl)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.customerName || !form.customerPhone || !form.customerEmail ||
        !form.shippingAddress || !form.pincode) {
      setError('Please fill in all required customer details.');
      return;
    }

    if (!paymentSettings.enableUPI && !paymentSettings.enableCOD) {
      setError('Checkout is currently disabled by store administration.');
      return;
    }

    if (form.paymentMethod === 'UPI' && !paymentSettings.enableUPI) {
      setError('Online UPI Payment is disabled. Please choose Cash on Delivery.');
      return;
    }

    if (form.paymentMethod === 'COD' && !paymentSettings.enableCOD) {
      setError('Cash on Delivery is disabled. Please choose Online UPI.');
      return;
    }

    if (form.paymentMethod === 'UPI' && !form.transactionId.trim()) {
      setError('Please enter your 12-digit UPI Reference / UTR Number after completing payment.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        items: cart.map((item) => ({
          productId: item.product._id,
          name: item.selectedVariant
            ? `${item.product.name} (${item.selectedVariant.name})`
            : item.product.name,
          variantName: item.selectedVariant ? item.selectedVariant.name : '',
          price: item.selectedVariant ? item.selectedVariant.price : item.product.price,
          quantity: item.quantity,
          gst: item.product.gst ?? 0,
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
        // Clear saved form
        localStorage.removeItem('indianagri_checkout_form');
        localStorage.removeItem('indianagri_checkout_open');
        localStorage.removeItem('indianagri_cart');
        onOrderSuccess(data.data);
      } else {
        setError(data.message || 'Failed to place order.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#E8EDF2] px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-lg font-bold text-[#163B5C]">Checkout</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F5F5F5]" aria-label="Close">
              <X className="w-5 h-5 text-[#64748B]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-[#FAF8F5] rounded-xl p-4 space-y-2">
              <p className="text-sm text-[#64748B]">{cart.length} item(s) in cart</p>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Subtotal + GST</span>
                <span className="font-bold text-[#163B5C]">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#163B5C]">Customer Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={form.customerName}
                  onChange={(e) => updateField('customerName', e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500] focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={form.customerPhone}
                  onChange={(e) => updateField('customerPhone', e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500] focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={form.customerEmail}
                  onChange={(e) => updateField('customerEmail', e.target.value)}
                  className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500] focus:border-transparent"
                  required
                />
                <textarea
                  placeholder="Shipping Address *"
                  value={form.shippingAddress}
                  onChange={(e) => updateField('shippingAddress', e.target.value)}
                  rows={3}
                  className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500] focus:border-transparent resize-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode *"
                  value={form.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#163B5C]">Payment Method</h3>
              <div className="flex gap-3 flex-wrap">
                {paymentSettings.enableUPI && (
                  <label className={`flex-1 min-w-[140px] cursor-pointer`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={form.paymentMethod === 'UPI'}
                      onChange={() => updateField('paymentMethod', 'UPI')}
                      className="peer sr-only"
                    />
                    <div className="px-4 py-3 rounded-xl border-2 text-center transition-all peer-checked:border-[#ED3500] peer-checked:bg-[#ED3500]/5 border-[#E8EDF2] hover:border-[#163B5C]">
                      <QrCode className="w-5 h-5 mx-auto mb-1 text-[#64748B]" />
                      <span className="text-sm font-medium text-[#163B5C]">UPI / QR Code</span>
                    </div>
                  </label>
                )}
                {paymentSettings.enableCOD && (
                  <label className={`flex-1 min-w-[140px] cursor-pointer`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={form.paymentMethod === 'COD'}
                      onChange={() => updateField('paymentMethod', 'COD')}
                      className="peer sr-only"
                    />
                    <div className="px-4 py-3 rounded-xl border-2 text-center transition-all peer-checked:border-[#ED3500] peer-checked:bg-[#ED3500]/5 border-[#E8EDF2] hover:border-[#163B5C]">
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#64748B]" />
                      <span className="text-sm font-medium text-[#163B5C]">Cash on Delivery</span>
                    </div>
                  </label>
                )}
              </div>

              {/* UPI Payment Section */}
              {form.paymentMethod === 'UPI' && paymentSettings.enableUPI && (
                <div className="bg-[#FAF8F5] rounded-xl p-4 space-y-4">
                  <p className="text-sm text-[#64748B]">
                    Pay <strong className="text-[#ED3500]">₹{grandTotal.toLocaleString('en-IN')}</strong> using UPI
                  </p>
                  <div className="flex items-center justify-center">
                    <img
                      src={qrCodeImageUrl}
                      alt="UPI QR Code"
                      className="w-48 h-48 border rounded-xl bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white rounded-lg text-sm font-mono text-[#163B5C] border border-[#E8EDF2]">
                      {merchantUpiId}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-2 bg-[#ED3500] text-white rounded-lg hover:bg-[#D02E00] transition-colors"
                    >
                      {copiedUpi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter UPI Reference / UTR Number *"
                    value={form.transactionId}
                    onChange={(e) => updateField('transactionId', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#ED3500]"
                  />
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBackToCart}
                className="px-4 py-2.5 border border-[#E8EDF2] rounded-xl text-sm font-medium text-[#64748B] hover:bg-[#FAF8F5] transition-colors"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-[#ED3500] hover:bg-[#D02E00] text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Placing Order...' : `Place Order — ₹${grandTotal.toLocaleString('en-IN')}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
