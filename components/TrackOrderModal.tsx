'use client';

import React, { useState } from 'react';
import {
  X,
  Search,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
  AlertCircle,
  Store,
  Globe,
  Receipt,
} from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrackedOrderItem {
  name: string;
  price: number;
  quantity: number;
  gst?: number;
  image?: string;
}

interface TrackedOrder {
  _id: string;
  orderId: string;
  orderType?: 'ONLINE' | 'POS';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress?: string;
  pincode?: string;
  items: TrackedOrderItem[];
  subtotal: number;
  totalGst: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI' | 'CASH';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  transactionId?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export default function TrackOrderModal({ isOpen, onClose }: TrackOrderModalProps) {
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedOrders, setTrackedOrders] = useState<TrackedOrder[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orderTypeFilter, setOrderTypeFilter] = useState<'ALL' | 'ONLINE' | 'POS'>('ALL');

  if (!isOpen) return null;

  const handleSearchTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    try {
      setIsSearching(true);
      setSearched(true);
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(trackQuery.trim())}`);
      const data = await res.json();
      if (data.success) {
        setTrackedOrders(data.data || []);
      } else {
        setTrackedOrders([]);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setTrackedOrders([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-600 text-white';
      case 'Processing':
        return 'bg-blue-600 text-white';
      case 'Cancelled':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-[#C4922A] text-white';
    }
  };

  // Filter logic
  const filteredOrders = trackedOrders.filter((ord) => {
    const isPOS = ord.orderType === 'POS' || ord.orderId?.startsWith('ORD-POS-');
    if (orderTypeFilter === 'POS') return isPOS;
    if (orderTypeFilter === 'ONLINE') return !isPOS;
    return true;
  });

  const posCount = trackedOrders.filter(
    (o) => o.orderType === 'POS' || o.orderId?.startsWith('ORD-POS-')
  ).length;
  const onlineCount = trackedOrders.length - posCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] text-[#1C2A1E] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#E6E2D8] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#1B2E1E] text-[#FAF8F5] flex items-center justify-between border-b border-[#2A402D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#233A27] text-[#D4A017] flex items-center justify-center border border-[#2D4A31]">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-normal text-white">Track Order Status</h3>
              <p className="text-xs text-[#A3B8A6] font-light">Search Online Orders & Direct Shop Purchases (POS)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Search Form */}
          <form onSubmit={handleSearchTracking} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A554D]" />
              <input
                type="text"
                placeholder="Enter Order ID, Mobile Number or Email..."
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E6E2D8] rounded-full text-xs text-[#1C2A1E] focus:outline-none focus:border-[#273B24] shadow-2xs font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 rounded-full bg-[#273B24] hover:bg-[#1E2E1C] text-white font-medium text-xs tracking-wide transition-all shadow-md disabled:opacity-50 shrink-0 font-sans"
            >
              {isSearching ? 'Searching...' : 'Track Order'}
            </button>
          </form>

          {/* Filter Bar (If Orders Exist) */}
          {searched && trackedOrders.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E2D8] pb-3 pt-1">
              <span className="text-xs font-bold text-[#1C2A1E] font-sans">
                Found {filteredOrders.length} Order{filteredOrders.length === 1 ? '' : 's'}
              </span>

              <div className="flex items-center gap-1.5 bg-[#F4F2EA] p-1 rounded-full border border-[#E6E2D8]">
                <button
                  onClick={() => setOrderTypeFilter('ALL')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all font-sans ${
                    orderTypeFilter === 'ALL'
                      ? 'bg-[#273B24] text-white shadow-xs'
                      : 'text-[#4A554D] hover:text-[#1C2A1E]'
                  }`}
                >
                  All ({trackedOrders.length})
                </button>
                <button
                  onClick={() => setOrderTypeFilter('ONLINE')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all font-sans inline-flex items-center gap-1 ${
                    orderTypeFilter === 'ONLINE'
                      ? 'bg-[#273B24] text-white shadow-xs'
                      : 'text-[#4A554D] hover:text-[#1C2A1E]'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  Online ({onlineCount})
                </button>
                <button
                  onClick={() => setOrderTypeFilter('POS')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all font-sans inline-flex items-center gap-1 ${
                    orderTypeFilter === 'POS'
                      ? 'bg-[#273B24] text-white shadow-xs'
                      : 'text-[#4A554D] hover:text-[#1C2A1E]'
                  }`}
                >
                  <Store className="w-3 h-3" />
                  Direct Shop ({posCount})
                </button>
              </div>
            </div>
          )}

          {/* Results Display */}
          {searched && (
            <div className="space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-[#E6E2D8] p-6 space-y-3">
                  <AlertCircle className="w-10 h-10 text-[#C4922A] mx-auto opacity-80" />
                  <p className="text-sm font-semibold text-[#1C2A1E] font-sans">No Matching Orders Found</p>
                  <p className="text-xs text-[#5C665E] max-w-sm mx-auto font-sans">
                    Please verify your search query or switch order type filters above.
                  </p>
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const isPOS = ord.orderType === 'POS' || ord.orderId?.startsWith('ORD-POS-');
                  const isCompleted = ord.status === 'Completed';
                  const isProcessing = ord.status === 'Processing' || isCompleted;
                  const isPending = true;

                  return (
                    <div
                      key={ord._id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6E2D8] shadow-md space-y-6 text-xs"
                    >
                      {/* Top Bar: Order ID, Type Badge & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E2D8] pb-4">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-sans text-base font-bold tracking-tight text-[#1C2A1E]">
                              Order #{ord.orderId}
                            </span>
                            
                            {/* ORDER TYPE BADGE (Direct Shop Purchase vs Online Order) */}
                            {isPOS ? (
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300/80 font-sans text-[10px] font-bold inline-flex items-center gap-1 shadow-2xs">
                                <Store className="w-3 h-3 text-amber-700" />
                                Direct Shop Purchase (POS)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300/80 font-sans text-[10px] font-bold inline-flex items-center gap-1 shadow-2xs">
                                <Globe className="w-3 h-3 text-emerald-700" />
                                Online Web Order
                              </span>
                            )}

                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans ${getStatusBadge(ord.status)}`}>
                              {ord.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#5C665E] font-sans">
                            Placed on {new Date(ord.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-[#5C665E] font-sans block">Total Amount</span>
                          <span className="font-sans text-base font-bold text-[#273B24]">
                            ₹{ord.totalAmount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Live Tracking Timeline Stepper */}
                      <div className="bg-[#FAF8F3] p-4 sm:p-5 rounded-2xl border border-[#E6E2D8] space-y-3 overflow-hidden relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C4922A] block font-sans">
                            {isPOS ? 'In-Store Purchase Timeline' : 'Delivery Timeline Status'}
                          </span>
                          <span className="text-[10px] text-[#5C665E] font-sans font-medium">
                            {isPOS ? '🛒 Direct Store Billing' : '🚚 Home Shipping'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-center relative py-1">
                          {/* Stepper Bar Background */}
                          <div className="absolute top-4 left-[12.5%] right-[12.5%] h-[2px] bg-[#E6E2D8] pointer-events-none z-0" />
                          <div
                            className="absolute top-4 left-[12.5%] h-[2px] bg-[#273B24] transition-all duration-500 pointer-events-none z-0"
                            style={{
                              width: isCompleted ? '75%' : isProcessing ? '50%' : '25%',
                            }}
                          />

                          {/* Step 1 */}
                          <div className="flex flex-col items-center space-y-1 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isPending ? 'bg-[#273B24] text-white border-[#273B24]' : 'bg-white text-slate-400 border-slate-300'}`}>
                              {isPOS ? <Receipt className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <span className="text-[10px] font-semibold text-[#1C2A1E] font-sans">
                              {isPOS ? 'Billed' : 'Placed'}
                            </span>
                          </div>

                          {/* Step 2 */}
                          <div className="flex flex-col items-center space-y-1 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isProcessing ? 'bg-[#273B24] text-white border-[#273B24]' : 'bg-white text-slate-400 border-slate-300'}`}>
                              <Clock className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-semibold text-[#1C2A1E] font-sans">
                              {isPOS ? 'Paid' : 'Processing'}
                            </span>
                          </div>

                          {/* Step 3 */}
                          <div className="flex flex-col items-center space-y-1 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? 'bg-[#273B24] text-white border-[#273B24]' : 'bg-white text-slate-400 border-slate-300'}`}>
                              {isPOS ? <ShoppingBag className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                            </div>
                            <span className="text-[10px] font-semibold text-[#1C2A1E] font-sans">
                              {isPOS ? 'Packed' : 'Dispatched'}
                            </span>
                          </div>

                          {/* Step 4 */}
                          <div className="flex flex-col items-center space-y-1 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-300'}`}>
                              {isPOS ? <Store className="w-4 h-4" /> : <PackageCheck className="w-4 h-4" />}
                            </div>
                            <span className="text-[10px] font-semibold text-[#1C2A1E] font-sans">
                              {isPOS ? 'Handed Over' : 'Delivered'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered Breakdown */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#1C2A1E] font-sans flex items-center gap-1.5">
                          <ShoppingBag className="w-4 h-4 text-[#273B24]" />
                          <span>Items Purchased ({ord.items?.length || 0})</span>
                        </span>

                        <div className="divide-y divide-[#E6E2D8] border border-[#E6E2D8] rounded-2xl overflow-hidden bg-[#FAF8F3]">
                          {ord.items && ord.items.length > 0 ? (
                            ord.items.map((item, idx) => (
                              <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs font-sans">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E6E2D8] overflow-hidden shrink-0 flex items-center justify-center">
                                    <img
                                      src={item.image || '/logo.jpg'}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-[#1C2A1E]">{item.name}</h5>
                                    <span className="text-[11px] text-[#5C665E]">Qty: {item.quantity} × ₹{item.price}</span>
                                  </div>
                                </div>
                                <span className="font-semibold text-[#273B24]">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-[#5C665E] font-sans">Standard Organic Produce Order</div>
                          )}
                        </div>
                      </div>

                      {/* Customer & Fulfillment Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E6E2D8] text-[11px] text-[#4A554D]">
                        <div className="space-y-1">
                          <span className="font-bold text-[#1C2A1E] font-sans block mb-1 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-[#C4922A]" />
                            <span>Customer Details</span>
                          </span>
                          <p className="font-sans"><strong className="text-[#1C2A1E]">Name:</strong> {ord.customerName}</p>
                          <p className="font-sans"><strong className="text-[#1C2A1E]">Phone:</strong> {ord.customerPhone}</p>
                          {ord.customerEmail && <p className="font-sans"><strong className="text-[#1C2A1E]">Email:</strong> {ord.customerEmail}</p>}
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-[#1C2A1E] font-sans block mb-1 flex items-center gap-1">
                            {isPOS ? <Store className="w-3.5 h-3.5 text-[#C4922A]" /> : <MapPin className="w-3.5 h-3.5 text-[#C4922A]" />}
                            <span>{isPOS ? 'Fulfillment Center' : 'Shipping Address'}</span>
                          </span>
                          <p className="leading-relaxed font-sans">
                            {isPOS
                              ? 'Indian Agriculture Store Counter — In-Person Direct Purchase'
                              : (ord.shippingAddress || 'Store Pickup / In-Store Sale')}
                            {!isPOS && ord.pincode ? ` — ${ord.pincode}` : ''}
                          </p>
                          <p className="pt-1 font-sans">
                            <strong className="text-[#1C2A1E]">Payment Method:</strong> {ord.paymentMethod} ({ord.paymentStatus})
                          </p>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
