import { NextResponse } from 'next/server';
import { getAlerts, addAlert } from '@/data/inMemoryStore';

export async function GET() {
  const alerts = getAlerts();
  return NextResponse.json(alerts);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = addAlert(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid alert payload' }, { status: 400 });
  }
}
