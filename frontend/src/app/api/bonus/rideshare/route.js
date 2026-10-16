import { NextResponse } from 'next/server';
import { getRideShares, addRideShare } from '@/data/inMemoryStore';

export async function GET() {
  return NextResponse.json(getRideShares());
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = addRideShare(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ride share' }, { status: 400 });
  }
}
