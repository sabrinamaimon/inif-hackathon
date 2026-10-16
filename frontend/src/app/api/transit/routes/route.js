import { NextResponse } from 'next/server';
import { BASE_TRANSIT_EDGES } from '@/utils/dijkstra';

export async function GET() {
  return NextResponse.json({
    count: BASE_TRANSIT_EDGES.length,
    edges: BASE_TRANSIT_EDGES
  });
}
