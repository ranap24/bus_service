import { sql } from '@/lib/db';
import { Booking } from '@/types';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

interface BookingWithDetails extends Booking {
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  travel_date: string;
  bus_number: string;
  route_number: string;
}

async function getBookingByRef(ref: string): Promise<BookingWithDetails | null> {
  const rows = await sql`
    SELECT b.*, 
      r.origin, r.destination, r.route_number,
      s.departure_time, s.arrival_time, s.travel_date,
      bus.bus_number
    FROM bookings b
    JOIN schedules s ON b.schedule_id = s.id
    JOIN routes r ON s.route_id = r.id
    JOIN buses bus ON s.bus_id = bus.id
    WHERE b.booking_reference = ${ref}
  `;
  return (rows[0] as BookingWithDetails) ?? null;
}

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const booking = await getBookingByRef(reference);

  if (!booking) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking not found</h2>
          <p className="text-gray-500 mb-6">The booking reference {reference} does not exist.</p>
          <Link href="/search" className="btn-primary">Search Buses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500">Your ticket has been booked successfully. Safe travels! 🎉</p>
        </div>

        {/* Ticket Card */}
        <div className="card overflow-hidden">
          {/* Ticket Header */}
          <div className="hero-gradient px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm mb-1">Booking Reference</p>
                <p className="text-2xl font-bold tracking-widest">{booking.booking_reference}</p>
              </div>
              <div className="text-right">
                <span className="badge bg-green-400 text-green-900 text-sm">{booking.status}</span>
              </div>
            </div>
          </div>

          {/* Dotted separator */}
          <div className="flex items-center px-6">
            <div className="w-6 h-6 bg-gray-50 rounded-full -ml-9 border-r-0 border border-gray-200"></div>
            <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2"></div>
            <div className="w-6 h-6 bg-gray-50 rounded-full -mr-9 border-l-0 border border-gray-200"></div>
          </div>

          {/* Ticket Body */}
          <div className="p-8">
            {/* Route */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{booking.departure_time}</p>
                <p className="text-lg font-semibold text-gray-700 mt-1">{booking.origin}</p>
              </div>
              <div className="flex-1 flex flex-col items-center px-6">
                <div className="w-full h-0.5 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 relative">
                  <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-blue-500">🚌</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{booking.arrival_time}</p>
                <p className="text-lg font-semibold text-gray-700 mt-1">{booking.destination}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 rounded-xl p-6">
              {[
                { label: 'Date', value: formatDate(booking.travel_date) },
                { label: 'Passenger', value: booking.passenger_name },
                { label: 'Seat', value: booking.seat_number },
                { label: 'Bus', value: booking.bus_number },
                { label: 'Route', value: booking.route_number },
                { label: 'Fare', value: formatCurrency(booking.total_fare) },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="font-semibold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700">
                📧 Confirmation sent to: <strong>{booking.passenger_email}</strong>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                📞 Contact: {booking.passenger_phone}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/my-bookings" className="btn-primary flex-1 text-center">
            View All Bookings
          </Link>
          <Link href="/search" className="btn-secondary flex-1 text-center">
            Book Another Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}
