import { NextResponse } from 'next/server';
import { runDijkstraRouting } from '@/utils/dijkstra';
import { getAlerts } from '@/data/inMemoryStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      origin,
      destination,
      passenger_type = 'general',
      weather_condition = 'normal',
      is_rush_hour = false,
      active_alerts
    } = body;

    if (!origin || !destination) {
      return NextResponse.json({ error: 'Origin and destination are required' }, { status: 400 });
    }

    const alertsToUse = active_alerts || getAlerts();

    const routes = runDijkstraRouting({
      origin,
      destination,
      passengerType: passenger_type,
      weather: weather_condition,
      isRushHour: Boolean(is_rush_hour),
      activeAlerts: alertsToUse
    });

    return NextResponse.json({
      origin,
      destination,
      passenger_type,
      weather_condition,
      is_rush_hour,
      routes_count: routes.length,
      routes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Routing calculation error:', error);
    return NextResponse.json({ error: 'Routing failed', details: error.message }, { status: 500 });
  }
}
