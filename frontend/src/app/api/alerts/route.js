import { NextResponse } from 'next/server';
import { getAlerts, addAlert, updateAlert, deleteAlert } from '@/data/inMemoryStore';

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

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });
    const updated = updateAlert(id, updates);
    if (!updated) return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });
    const success = deleteAlert(id);
    if (!success) return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Alert removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
  }
}
