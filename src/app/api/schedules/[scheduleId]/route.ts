import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const { scheduleId } = await params;
    const id = Number(scheduleId);

    const rows = await sql`
      SELECT 
        s.*,
        r.route_number, r.origin, r.destination, r.distance_km, r.duration_minutes,
        b.bus_number, b.bus_type, b.amenities, b.capacity
      FROM schedules s
      JOIN routes r ON s.route_id = r.id
      JOIN buses b ON s.bus_id = b.id
      WHERE s.id = ${id}
    `;
    const schedule = rows[0];

    if (!schedule) {
      return NextResponse.json({ success: false, error: 'Schedule not found' }, { status: 404 });
    }

    // Get already booked seat numbers for this schedule
    const bookedSeats = await sql`
      SELECT seat_number FROM bookings WHERE schedule_id = ${id} AND status != 'cancelled'
    ` as { seat_number: string }[];

    return NextResponse.json({
      success: true,
      data: {
        ...schedule,
        booked_seats: bookedSeats.map(b => b.seat_number),
      },
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get schedule' }, { status: 500 });
  }
}
