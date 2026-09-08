import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Banner from '@/models/Banner';
import { isAuthenticatedAdmin, unauthenticatedResponse } from '@/lib/authCheck';

const ALLOWED_FIELDS = ['title', 'image', 'link'];

/**
 * Validate and sanitize a banner link.
 * Only allows http(s) URLs or empty string. Blocks javascript:, data:, file:, etc.
 */
function sanitizeBannerLink(link: unknown): string {
  if (typeof link !== 'string') return '';
  const trimmed = link.trim();
  if (!trimmed) return '';
  // Only allow http(s) URLs
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return '';
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticatedAdmin(request)) return unauthenticatedResponse();

  try {
    await connectToDatabase();
    const body = await request.json();

    // Only allow whitelisted fields to prevent mass-assignment
    const update: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in body) update[field] = body[field];
    }

    // Sanitize link if provided
    if (update.link !== undefined) {
      update.link = sanitizeBannerLink(update.link);
    }

    const updatedBanner = await Banner.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedBanner) {
      return NextResponse.json(
        { success: false, message: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Banner updated successfully', data: updatedBanner },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticatedAdmin(request)) return unauthenticatedResponse();

  try {
    await connectToDatabase();
    const deletedBanner = await Banner.findByIdAndDelete(params.id);
    if (!deletedBanner) {
      return NextResponse.json(
        { success: false, message: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Banner deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
