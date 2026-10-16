import { NextResponse } from 'next/server';
import { getBaseFareSettings, updateBaseFareSettings } from '@/data/inMemoryStore';

export async function GET() {
  const settings = getBaseFareSettings();
  return NextResponse.json(settings);
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = updateBaseFareSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update fare settings' }, { status: 400 });
  }
}
