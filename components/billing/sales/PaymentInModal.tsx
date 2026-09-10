'use client';

import React, { useState } from 'react';
import { X, IndianRupee, CheckCircle2 } from 'lucide-react';

interface PaymentInModalProps {
  linkedDoc?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentInModal({
  linkedDoc,
  onClose,
  onSuccess,
}: PaymentInModalProps) {
  const isAdvance = Boolean(linkedDoc && linkedDoc.docType !== 'SALE_INVOICE');
  const [partyName, setPartyName] = useState(linkedDoc?.customerName || '');
  const [partyPhone, setPartyPhone] = useState(linkedDoc?.customerPhone || '');
  const [amount, setAmount] = useState(linkedDoc?.balanceAmount ? String(linkedDoc.balanceAmount) : '');
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE'>('CASH');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState(
    isAdvance
      ? `Advance payment against ${linkedDoc.docType?.replace('_', ' ') || 'Document'} #${linkedDoc.docNumber}`
      : linkedDoc
      ? `Payment against #${linkedDoc.docNumber}`
      : ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName || !amount || Number(amount) <= 0) {
      setError('Customer name and valid payment amount are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const res = await fetch('/api/billing/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType: 'PAYMENT_IN',
          partyId: linkedDoc?.partyId?._id || linkedDoc?.partyId || '',
          partyName,
          partyPhone,
          amount: Number(amount),
          paymentMode,
          referenceNo,
          docId: linkedDoc?._id || '',
          docNumber: linkedDoc?.docNumber || '',
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Failed to record payment.');
      }
    } catch (err: any) {
      setError(err.message || 'Server error recording payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#E8EDF2] shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-[#64748B]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#163B5C]">
              {isAdvance ? 'Record Advance Payment' : 'Record Customer Payment In'}
            </h3>
            <p className="text-xs text-[#64748B]">
              {linkedDoc
                ? `Linked to ${linkedDoc.docType?.replace('_', ' ') || 'Document'} #${linkedDoc.docNumber}`
                : 'Record customer payment credit'}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#163B5C] uppercase">Customer Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kishore Sharma"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-xs font-semibold focus:outline-none focus:border-[#ED3500]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#163B5C] uppercase">
              {isAdvance ? 'Advance Amount Received (₹) *' : 'Amount Received (₹) *'}
            </label>
            <input
              type="number"
              required
              min="0.01"
              step="any"
              placeholder="e.g. 500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-sm font-black text-emerald-700 focus:outline-none focus:border-[#ED3500]"
            />
            {linkedDoc?.grandTotal && (
              <p className="text-[11px] text-gray-500">
                Document Total: ₹{linkedDoc.grandTotal.toLocaleString('en-IN')} (Balance: ₹
                {linkedDoc.balanceAmount?.toLocaleString('en-IN')})
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#163B5C] uppercase">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e: any) => setPaymentMode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-xs font-semibold bg-white"
            >
              <option value="BANK_TRANSFER">Bank Transfer / NEFT / RTGS</option>
              <option value="UPI">Online UPI (GPay/PhonePe)</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#163B5C] uppercase">Reference No / UTR (Optional)</label>
            <input
              type="text"
              placeholder="e.g. UTR / NEFT Reference or Cheque No"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#163B5C] uppercase">Notes / Remarks</label>
            <input
              type="text"
              placeholder="e.g. 50% advance before dispatch"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF2] text-xs font-semibold"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#E8EDF2] font-bold text-xs text-[#64748B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : isAdvance ? 'Save Advance' : 'Save Payment In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
