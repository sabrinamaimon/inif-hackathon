import { NextResponse } from 'next/server';
import { getTransitRoutes, addTransitRoute, updateTransitRoute, deleteTransitRoute } from '@/data/inMemoryStore';

export async function GET() {
  const routes = getTransitRoutes();
  return NextResponse.json({
    count: routes.length,
    routes: routes
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = addTransitRoute(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transit link' }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing route ID' }, { status: 400 });
    const updated = updateTransitRoute(id, updates);
    if (!updated) return NextResponse.json({ error: 'Transit route not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing route ID' }, { status: 400 });
    const success = deleteTransitRoute(id);
    if (!success) return NextResponse.json({ error: 'Transit route not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Transit route deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
  }
}
