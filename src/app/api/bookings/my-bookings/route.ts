import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const bookings = await sql`
      SELECT 
        b.*,
        r.origin, r.destination, r.route_number,
        s.departure_time, s.arrival_time, s.travel_date,
        bus.bus_number
      FROM bookings b
      JOIN schedules s ON b.schedule_id = s.id
      JOIN routes r ON s.route_id = r.id
      JOIN buses bus ON s.bus_id = bus.id
      WHERE b.user_id = ${session.userId}
      ORDER BY b.created_at DESC
    `;

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get bookings' }, { status: 500 });
  }
}
