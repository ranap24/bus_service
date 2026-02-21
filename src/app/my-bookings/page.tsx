'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';

function MyBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings/my-bookings');
        if (res.ok) {
          const data = await res.json();
          setBookings(data.data || []);
        } else {
          toast.error('Failed to load bookings');
        }
      } catch {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-gray-900">Cancel this booking?</p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PATCH' });
                  if (res.ok) {
                    toast.success('Booking cancelled successfully');
                    setBookings(prev =>
                      prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
                    );
                  } else {
                    const data = await res.json();
                    toast.error(data.error || 'Cancellation failed');
                  }
                } catch {
                  toast.error('Something went wrong');
                }
              }}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
            >
              Keep Booking
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const statusColors: Record<string, string> = {
    confirmed: 'badge-success',
    cancelled: 'badge-error',
    completed: 'badge-info',
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎫</div>
          <p className="text-gray-500 text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Header */}
      <div className="hero-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-blue-100">Manage your bus ticket bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {bookings.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-7xl mb-6">🎫</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No bookings yet</h3>
            <p className="text-gray-500 mb-8">You haven&apos;t made any bookings. Start your journey today!</p>
            <Link href="/search" className="btn-primary">
              Search Buses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 mb-6">{bookings.length} booking{bookings.length > 1 ? 's' : ''} found</p>
            {bookings.map(booking => (
              <div key={booking.id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    {/* Reference & Status */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {booking.booking_reference}
                      </span>
                      <span className={`badge ${statusColors[booking.status] || 'badge-info'}`}>
                        {booking.status}
                      </span>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-bold text-gray-900">{booking.origin}</span>
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="text-xl font-bold text-gray-900">{booking.destination}</span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📅 {formatDate(booking.travel_date || '')}</span>
                      <span>🕐 {booking.departure_time}</span>
                      <span>💺 Seat {booking.seat_number}</span>
                      <span>🚌 {booking.bus_number}</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(booking.total_fare)}</p>
                      <p className="text-xs text-gray-400">{booking.payment_status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/booking-confirmation/${booking.booking_reference}`}
                        className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        View
                      </Link>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  );
}
