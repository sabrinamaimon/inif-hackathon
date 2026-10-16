import { NextResponse } from 'next/server';
import { voteAlert } from '@/data/inMemoryStore';

export async function POST(request) {
  try {
    const { alert_id, vote_type } = await request.json();
    if (!alert_id || !vote_type) {
      return NextResponse.json({ error: 'Missing alert_id or vote_type' }, { status: 400 });
    }

    const updated = voteAlert(alert_id, vote_type);
    if (!updated) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
  }
}
