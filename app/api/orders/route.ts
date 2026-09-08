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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10) || PAGE_SIZE)
    );
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};

    const status = searchParams.get('status');
    if (status) filter.status = status;

    const orderType = searchParams.get('orderType');
    if (orderType) filter.orderType = orderType;

    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) (filter.createdAt as Record<string, string>).$gte = new Date(fromDate);
      if (toDate) (filter.createdAt as Record<string, string>).$lte = new Date(toDate);
    }

    // Parallel count + fetch
    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-customerEmail -shippingAddress -customerPhone -transactionId')
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
