import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { generateBookingReference } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { schedule_id, passenger_name, passenger_email, passenger_phone, seat_number } = await request.json();

    if (!schedule_id || !passenger_name || !passenger_email || !passenger_phone || !seat_number) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const id = Number(schedule_id);

    // Check schedule exists and has seats
    const scheduleRows = await sql`SELECT * FROM schedules WHERE id = ${id} AND status = 'scheduled'`;
    const schedule = scheduleRows[0] as {
      id: number;
      available_seats: number;
      price: number;
    } | undefined;

    if (!schedule) {
      return NextResponse.json({ success: false, error: 'Schedule not found or unavailable' }, { status: 404 });
    }

    if (schedule.available_seats <= 0) {
      return NextResponse.json({ success: false, error: 'No seats available' }, { status: 400 });
    }

    // Check if seat is already taken for this schedule
    const seatCheck = await sql`
      SELECT id FROM bookings WHERE schedule_id = ${id} AND seat_number = ${seat_number} AND status != 'cancelled'
    `;

    if (seatCheck.length > 0) {
      return NextResponse.json({ success: false, error: 'Seat already taken. Please select another seat.' }, { status: 409 });
    }

    const booking_reference = generateBookingReference();

    // Create booking and decrement seats
    const bookingResult = await sql`
      INSERT INTO bookings 
        (user_id, schedule_id, booking_reference, passenger_name, passenger_email, passenger_phone, seat_number, total_fare)
      VALUES (${session.userId}, ${id}, ${booking_reference}, ${passenger_name}, ${passenger_email}, ${passenger_phone}, ${seat_number}, ${schedule.price})
      RETURNING id
    `;

    await sql`UPDATE schedules SET available_seats = available_seats - 1 WHERE id = ${id}`;

    const bookingId = bookingResult[0].id;

    return NextResponse.json({
      success: true,
      data: { id: bookingId, booking_reference },
      message: 'Booking created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ success: false, error: 'Booking failed' }, { status: 500 });
  }
}
