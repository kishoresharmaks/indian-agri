import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Party from '@/models/Party';
import { isAuthenticatedAdmin, unauthenticatedResponse } from '@/lib/authCheck';

const PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  if (!isAuthenticatedAdmin(request)) return unauthenticatedResponse();

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    // Build filter
    const filter: Record<string, unknown> = {};

    const status = searchParams.get('status');
    if (status && status !== 'All') filter.status = status;

    const orderType = searchParams.get('orderType');
    if (orderType) filter.orderType = orderType;

    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    if (fromDate || toDate) {
      const dateFilter: Record<string, Date> = {};
      if (fromDate) dateFilter.$gte = new Date(fromDate);
      if (toDate) dateFilter.$lte = new Date(toDate);
      filter.createdAt = dateFilter;
    }

    // Support pagination when requested via query param
    if (searchParams.has('page')) {
      const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
      const limit = Math.min(
        MAX_PAGE_SIZE,
        Math.max(1, parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10) || PAGE_SIZE)
      );
      const skip = (page - 1) * limit;

      const [total, orders] = await Promise.all([
        Order.countDocuments(filter),
        Order.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      ]);

      return NextResponse.json({
        success: true,
        data: orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
          hasNext: page * limit < total,
        },
      });
    }

    // Default: fetch all orders matching filter for admin dashboard metrics & instant filtering
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      pincode,
      items,
      paymentMethod,
      transactionId,
    } = body;

    if (
      !customerName ||
      !customerPhone ||
      !customerEmail ||
      !shippingAddress ||
      !pincode ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: 'Customer details and at least one order item are required.' },
        { status: 400 }
      );
    }

    // Precise GST & Subtotal Calculation
    let subtotal = 0;
    let totalGst = 0;

    for (const item of items) {
      const itemPrice = Number(item.price) || 0;
      const itemQty = Number(item.quantity) || 1;
      const itemGstRate = item.gst !== undefined ? Number(item.gst) : 0;

      const itemSubtotal = itemPrice * itemQty;
      const itemGstAmount = (itemSubtotal * itemGstRate) / 100;

      subtotal += itemSubtotal;
      totalGst += itemGstAmount;

      // Decrement product inventory if product exists and ensure hsnCode is set
      if (item.productId) {
        const prod = await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -itemQty },
        });
        if (prod && !item.hsnCode && prod.hsnCode) {
          item.hsnCode = prod.hsnCode;
        }
      }
    }

    subtotal = Math.round(subtotal);
    totalGst = Math.round(totalGst);
    const totalAmount = subtotal + totalGst;

    // Generate strictly sequential order ID starting from ORD-1001
    const orderCount = await Order.countDocuments();
    const nextSeqNumber = 1001 + orderCount;
    const orderId = `ORD-${nextSeqNumber}`;

    const method = paymentMethod === 'UPI' ? 'UPI' : 'COD';
    // Online UPI & COD orders start as 'Pending' until manually verified by Admin
    const pStatus = 'Pending';

    const newOrder = await Order.create({
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      pincode,
      items,
      subtotal,
      totalGst,
      totalAmount,
      paymentMethod: method,
      paymentStatus: pStatus,
      transactionId: transactionId || '',
      status: 'Pending',
    });

    // Auto-sync Customer into Party Directory for billing & accounting
    if (customerPhone && customerPhone !== '0000000000') {
      try {
        await Party.findOneAndUpdate(
          { phone: customerPhone.trim() },
          {
            $setOnInsert: { partyType: 'CUSTOMER', openingBalance: 0, currentBalance: 0 },
            $set: {
              name: customerName.trim(),
              phone: customerPhone.trim(),
              email: customerEmail.trim(),
              address: `${shippingAddress}, ${pincode}`,
            },
          },
          { upsert: true, new: true }
        );
      } catch (partyErr) {
        console.error('Failed to sync party', partyErr);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Order created successfully', data: newOrder },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
