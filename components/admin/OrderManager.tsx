'use client';

import React, { useState } from 'react';
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  gst: number;
  image?: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  totalGst: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI' | 'CASH';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  transactionId?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: string;
  orderType?: string;
}

interface OrderManagerProps {
  orders: Order[];
  loading: boolean;
  statusFilter: string;
  currentPage: number;
  onFilterChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
  onRefresh: () => void;
}

const PER_PAGE = 5;

export default function OrderManager({
  orders,
  loading,
  statusFilter,
  currentPage,
  onFilterChange,
  onPageChange,
  onStatusChange,
  onRefresh,
}: OrderManagerProps) {
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) =>
    statusFilter === 'All' ? true : o.status === statusFilter
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentBadge = (method: string, status: string) => {
    const color = status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${color}`}>
        {method}{status === 'Pending' ? ' (Pending)' : ''}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header + Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] overflow-x-auto pb-1 scrollbar-none">
          <span className="flex items-center gap-1 shrink-0">
            <Filter className="w-4 h-4" /> Status:
          </span>
          {['All', 'Pending', 'Processing', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => { onFilterChange(st); onPageChange(1); }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-all ${
                statusFilter === st
                  ? 'bg-[#163B5C] text-white font-bold'
                  : 'bg-white border border-[#E8EDF2] text-[#64748B] hover:text-[#163B5C]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#163B5C] text-white text-xs font-bold hover:bg-[#0f2744] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-[#163B5C] border-t-transparent rounded-full" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-semibold">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl border border-[#E8EDF2] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#163B5C] text-sm">
                      #{order.orderId}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {getPaymentBadge(order.paymentMethod, order.paymentStatus)}
                    {order.orderType === 'POS' && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700">
                        POS
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {order.customerName} · {order.customerPhone}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.shippingAddress}, {order.pincode}
                  </p>
                  {order.transactionId && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      UTR: {order.transactionId}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#163B5C] text-lg">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Item Summary */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex gap-1 overflow-hidden">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i} className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-600 truncate max-w-[120px]">
                      {item.name} ×{item.quantity}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-500">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value as Order['status'])}
                    className="text-xs border border-[#E8EDF2] rounded-lg px-2 py-1.5 text-[#163B5C] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#163B5C]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => setViewingOrder(order)}
                    className="p-1.5 rounded-lg border border-[#E8EDF2] text-[#163B5C] hover:bg-gray-50 transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">
            Page <strong className="text-[#163B5C]">{currentPage}</strong> of{' '}
            <strong className="text-[#163B5C]">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1.5 rounded-lg border border-[#E8EDF2] bg-white font-bold disabled:opacity-40 hover:bg-[#FFFCFB] flex items-center gap-1 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1.5 rounded-lg border border-[#E8EDF2] bg-white font-bold disabled:opacity-40 hover:bg-[#FFFCFB] flex items-center gap-1 text-xs"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setViewingOrder(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[#E8EDF2] px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#163B5C]">Order #{viewingOrder.orderId}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(viewingOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <p className="font-semibold text-[#163B5C]">{viewingOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold text-[#163B5C]">{viewingOrder.customerPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="font-semibold text-[#163B5C]">{viewingOrder.shippingAddress}, {viewingOrder.pincode}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Items</p>
                <div className="space-y-2">
                  {viewingOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-[#163B5C]">{item.name} ×{item.quantity}</span>
                      <span className="font-bold text-[#163B5C]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#E8EDF2] pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{viewingOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST</span>
                  <span>₹{viewingOrder.totalGst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#163B5C] pt-1">
                  <span>Total</span>
                  <span>₹{viewingOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
