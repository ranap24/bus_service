import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { bookingId } = await params;
    const id = Number(bookingId);

    const rows = await sql`SELECT * FROM bookings WHERE id = ${id} AND user_id = ${session.userId}`;
    const booking = rows[0] as { id: number; status: string; schedule_id: number } | undefined;

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json({ success: false, error: 'Booking is already cancelled' }, { status: 400 });
    }

    await sql`UPDATE bookings SET status = 'cancelled' WHERE id = ${id}`;
    await sql`UPDATE schedules SET available_seats = available_seats + 1 WHERE id = ${booking.schedule_id}`;

    return NextResponse.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json({ success: false, error: 'Cancellation failed' }, { status: 500 });
  }
}
