import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { rateLimit, getClientIP } from '@/lib/rateLimit';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(request: Request) {
  // Rate limit: 20 tracking queries per 5 minutes per IP
  const ip = getClientIP(request);
  const { success, reset } = rateLimit(`track_${ip}`, 20, 5 * 60 * 1000);
  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many tracking requests. Please try again in ${reset} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || !query.trim()) {
      return NextResponse.json(
        { success: false, message: 'Phone number, email, or order ID is required to track order' },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim();
    if (cleanQuery.length < 4) {
      return NextResponse.json(
        { success: false, message: 'Search term is too short. Please enter a valid Order ID, Phone number, or Email.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const escaped = escapeRegex(cleanQuery);
    const digitsOnly = cleanQuery.replace(/\D/g, '');

    const orConditions: any[] = [];

    // 1. Order ID match (case-insensitive exact match)
    orConditions.push({ orderId: new RegExp(`^${escaped}$`, 'i') });

    // 2. Email match (case-insensitive exact match if query contains @)
    if (cleanQuery.includes('@')) {
      orConditions.push({ customerEmail: new RegExp(`^${escaped}$`, 'i') });
    }

    // 3. Phone number match (requires at least 10 digits to prevent fuzzy scraping)
    if (digitsOnly.length >= 10) {
      orConditions.push({ customerPhone: new RegExp(`${digitsOnly.slice(-10)}$`) });
    }

    const orders = await Order.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to track order' },
      { status: 500 }
    );
  }
}
