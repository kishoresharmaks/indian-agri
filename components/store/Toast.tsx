'use client';

import React from 'react';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  onViewCart?: () => void;
}

export default function Toast({ message, onClose, onViewCart }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md sm:w-auto bg-[#183B24]/95 text-[#FAF8F5] px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-full shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 border border-[#C99A2E]/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-full bg-[#C99A2E]/20 text-[#C99A2E] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <span className="text-xs sm:text-sm font-medium font-sans truncate">{message}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onViewCart && (
          <button
            onClick={onViewCart}
            className="px-3 py-1.5 rounded-full bg-[#C99A2E] hover:bg-[#b08524] text-[#183B24] text-xs font-bold font-sans transition-colors flex items-center gap-1 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Cart</span>
          </button>
        )}
        <button
          onClick={onClose}
          className="text-[#FAF8F5]/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
