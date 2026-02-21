import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const travel_date = searchParams.get('travel_date');

    if (!origin || !destination || !travel_date) {
      return NextResponse.json(
        { success: false, error: 'origin, destination, and travel_date are required' },
        { status: 400 }
      );
    }

    const schedules = await sql`
      SELECT 
        s.*,
        r.route_number, r.origin, r.destination, r.distance_km, r.duration_minutes,
        b.bus_number, b.bus_type, b.amenities
      FROM schedules s
      JOIN routes r ON s.route_id = r.id
      JOIN buses b ON s.bus_id = b.id
      WHERE r.origin = ${origin}
        AND r.destination = ${destination}
        AND s.travel_date = ${travel_date}
        AND s.status = 'scheduled'
        AND s.available_seats > 0
      ORDER BY s.departure_time ASC
    `;

    return NextResponse.json({ success: true, data: schedules });
  } catch (error) {
    console.error('Search schedules error:', error);
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
  }
}
