import { NextResponse } from 'next/server';
import { STATIC_HUBS } from '@/data/staticData';

export async function GET() {
  return NextResponse.json(STATIC_HUBS);
}
