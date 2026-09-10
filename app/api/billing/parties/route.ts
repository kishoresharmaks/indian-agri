import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Party from '@/models/Party';
import { isAuthenticatedAdmin, unauthenticatedResponse } from '@/lib/authCheck';
import { validateLicenseRequest } from '@/lib/licensing/validateLicenseRoute';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/billing/parties
export async function GET(req: NextRequest) {
  if (!isAuthenticatedAdmin(req)) return unauthenticatedResponse();
  const license = await validateLicenseRequest(req);
  if (license.error) return license.error;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const filter: any = {};

    // Filter by type: CUSTOMER, VENDOR, or BOTH
    if (type && type !== 'ALL') {
      if (type === 'CUSTOMER') {
        filter.$or = [{ partyType: 'CUSTOMER' }, { partyType: 'BOTH' }];
      } else if (type === 'VENDOR') {
        filter.$or = [{ partyType: 'VENDOR' }, { partyType: 'BOTH' }];
      } else {
        filter.partyType = type;
      }
    }

    // Optional text search filter
    if (search && search.trim()) {
      const q = search.trim();
      const searchConditions = [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { gstin: { $regex: q, $options: 'i' } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const parties = await Party.find(filter).sort({ name: 1 }).lean();
    return NextResponse.json({
      success: true,
      count: parties.length,
      data: parties,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch parties' },
      { status: 500 }
    );
  }
}

// POST /api/billing/parties
export async function POST(req: NextRequest) {
  if (!isAuthenticatedAdmin(req)) return unauthenticatedResponse();
  const license = await validateLicenseRequest(req);
  if (license.error) return license.error;

  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      partyType = 'CUSTOMER',
      name,
      phone,
      email = '',
      address = '',
      gstin = '',
      openingBalance = 0,
    } = body;

    if (!name || !name.trim() || !phone || !phone.trim()) {
      return NextResponse.json(
        { success: false, message: 'Party name and mobile phone are required.' },
        { status: 400 }
      );
    }

    const validPartyTypes = ['CUSTOMER', 'VENDOR', 'BOTH'];
    const resolvedPartyType = validPartyTypes.includes(partyType) ? partyType : 'CUSTOMER';
    const numOpening = Number(openingBalance || 0);

    const newParty = await Party.create({
      partyType: resolvedPartyType,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? String(email).trim() : '',
      address: address ? String(address).trim() : '',
      gstin: gstin ? String(gstin).trim().toUpperCase() : '',
      openingBalance: numOpening,
      currentBalance: numOpening,
    });

    return NextResponse.json(
      { success: true, message: 'Party created successfully.', data: newParty },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create party.' },
      { status: 500 }
    );
  }
}

// PUT /api/billing/parties
export async function PUT(req: NextRequest) {
  if (!isAuthenticatedAdmin(req)) return unauthenticatedResponse();
  const license = await validateLicenseRequest(req);
  if (license.error) return license.error;

  try {
    await connectToDatabase();
    const body = await req.json();

    const id = body.partyId || body._id || body.id;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Party ID is required for update.' },
        { status: 400 }
      );
    }

    const {
      partyType,
      name,
      phone,
      email,
      address,
      gstin,
      openingBalance,
    } = body;

    if (!name || !name.trim() || !phone || !phone.trim()) {
      return NextResponse.json(
        { success: false, message: 'Party name and mobile phone are required.' },
        { status: 400 }
      );
    }

    const updateFields: any = {
      name: name.trim(),
      phone: phone.trim(),
      email: email !== undefined ? String(email).trim() : '',
      address: address !== undefined ? String(address).trim() : '',
      gstin: gstin !== undefined ? String(gstin).trim().toUpperCase() : '',
    };

    if (partyType && ['CUSTOMER', 'VENDOR', 'BOTH'].includes(partyType)) {
      updateFields.partyType = partyType;
    }

    if (openingBalance !== undefined) {
      const numOpening = Number(openingBalance || 0);
      updateFields.openingBalance = numOpening;
      const current = await Party.findById(id).lean();
      if (current) {
        const diff = numOpening - (current.openingBalance || 0);
        updateFields.currentBalance = (current.currentBalance || 0) + diff;
      }
    }

    const updatedParty = await Party.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedParty) {
      return NextResponse.json(
        { success: false, message: 'Party not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Party updated successfully.',
      data: updatedParty,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update party.' },
      { status: 500 }
    );
  }
}

// DELETE /api/billing/parties
export async function DELETE(req: NextRequest) {
  if (!isAuthenticatedAdmin(req)) return unauthenticatedResponse();
  const license = await validateLicenseRequest(req);
  if (license.error) return license.error;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Party ID required.' },
        { status: 400 }
      );
    }

    const deleted = await Party.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Party not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Party deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete party.' },
      { status: 500 }
    );
  }
}

