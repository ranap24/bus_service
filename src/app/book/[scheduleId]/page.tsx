'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Schedule } from '@/types';
import { formatCurrency, formatDuration, formatDate, generateBookingReference } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';

// ─── Seat layout helpers ──────────────────────────────────────────────────────

function buildSeatLayout(capacity: number, busType: string) {
  const isSleeper = busType === 'sleeper';

  if (isSleeper) {
    // Sleeper: upper & lower berths, 2 columns each side (L / R), rows
    const rows = Math.ceil(capacity / 4);
    const layout: { id: string; label: string; deck: 'lower' | 'upper' }[][] = [];
    for (let r = 0; r < rows; r++) {
      layout.push([
        { id: `L${r * 2 + 1}`, label: `L${r * 2 + 1}`, deck: 'lower' },
        { id: `L${r * 2 + 2}`, label: `L${r * 2 + 2}`, deck: 'upper' },
        { id: `R${r * 2 + 1}`, label: `R${r * 2 + 1}`, deck: 'lower' },
        { id: `R${r * 2 + 2}`, label: `R${r * 2 + 2}`, deck: 'upper' },
      ]);
    }
    return { type: 'sleeper' as const, layout };
  }

  // Seater: 2+2 layout — left pair (A/B) + aisle + right pair (C/D)
  const rows = Math.ceil(capacity / 4);
  const layout: { id: string; label: string; col: 'A' | 'B' | 'C' | 'D' }[][] = [];
  for (let r = 1; r <= rows; r++) {
    layout.push([
      { id: `${r}A`, label: `${r}A`, col: 'A' },
      { id: `${r}B`, label: `${r}B`, col: 'B' },
      { id: `${r}C`, label: `${r}C`, col: 'C' },
      { id: `${r}D`, label: `${r}D`, col: 'D' },
    ]);
  }
  return { type: 'seater' as const, layout };
}

// ─── Seat Button ─────────────────────────────────────────────────────────────

function SeatBtn({
  id,
  label,
  booked,
  selected,
  isSleeper,
  deck,
  onClick,
}: {
  id: string;
  label: string;
  booked: boolean;
  selected: boolean;
  isSleeper?: boolean;
  deck?: 'lower' | 'upper';
  onClick: () => void;
}) {
  const sizeClass = isSleeper ? 'h-8 w-16' : 'h-9 w-10';

  if (booked) {
    return (
      <div
        title={`${label} — Booked`}
        className={`flex items-center justify-center rounded-md text-xs font-semibold select-none
          ${sizeClass} bg-red-100 text-red-400 border border-red-200 cursor-not-allowed opacity-70`}
      >
        {deck === 'upper' ? '↑' : ''}{label}
      </div>
    );
  }
  if (selected) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={`${label} — Selected (click to deselect)`}
        className={`flex items-center justify-center rounded-md text-xs font-bold
          ${sizeClass} bg-blue-600 text-white border-2 border-blue-700 shadow-md transition-all`}
      >
        {deck === 'upper' ? '↑' : ''}{label}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${label} — Available`}
      className={`flex items-center justify-center rounded-md text-xs font-medium
        ${sizeClass} bg-white text-gray-700 border-2 border-green-400 hover:border-blue-500 hover:bg-blue-50 transition-all`}
    >
      {deck === 'upper' ? '↑' : ''}{label}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function BookContent() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.scheduleId as string;

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    passenger_name: '',
    passenger_email: '',
    passenger_phone: '',
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`/api/schedules/${scheduleId}`);
        if (res.ok) {
          const data = await res.json();
          setSchedule(data.data);
        } else {
          toast.error('Schedule not found');
          router.push('/search');
        }
      } catch {
        toast.error('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            passenger_name: data.data.name || '',
            passenger_email: data.data.email || '',
            passenger_phone: data.data.phone || '',
          }));
        }
      } catch {
        // Not logged in
      }
    };

    fetchSchedule();
    fetchUser();
  }, [scheduleId, router]);

  const toggleSeat = useCallback((seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) return prev.filter(s => s !== seatId);
      if (prev.length >= 6) {
        toast.error('Maximum 6 seats per booking');
        return prev;
      }
      return [...prev, seatId];
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    setBooking(true);

    let lastRef = '';
    try {
      for (const seat of selectedSeats) {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schedule_id: scheduleId,
            ...formData,
            seat_number: seat,
            booking_reference: generateBookingReference(),
          }),
        });
        const data = await res.json();
        if (res.ok) {
          lastRef = data.data.booking_reference;
        } else if (res.status === 401) {
          toast.error('Please login to book a ticket');
          router.push(`/login?redirect=/book/${scheduleId}`);
          return;
        } else {
          toast.error(data.error || `Failed to book seat ${seat}`);
          setBooking(false);
          return;
        }
      }
      toast.success(`${selectedSeats.length > 1 ? selectedSeats.length + ' tickets' : 'Ticket'} booked! 🎉`);
      router.push(`/booking-confirmation/${lastRef}`);
    } catch {
      toast.error('Something went wrong. Please try again.');
      setBooking(false);
    }
  };

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚌</div>
          <p className="text-gray-500 text-lg">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (!schedule) return null;

  const bookedSeats = schedule.booked_seats ?? [];
  const capacity = schedule.capacity ?? 40;
  const busType = schedule.bus_type ?? 'standard';
  const { type: layoutType, layout } = buildSeatLayout(capacity, busType);
  const totalFare = schedule.price * selectedSeats.length;

  // ─── Seat map renderers ────────────────────────────────────────────────────
  const renderSeaterLayout = () => (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full whitespace-nowrap">🚌 Front of Bus</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-10 h-9 flex items-center justify-center bg-gray-100 rounded-md text-xs text-gray-400 border border-dashed border-gray-300">🪟</div>
        <div className="flex-1" />
        <div className="w-10 h-9 flex items-center justify-center bg-yellow-50 rounded-md text-base border border-yellow-200">🧑‍✈️</div>
      </div>
      <div className="space-y-2">
        {(layout as { id: string; label: string; col: 'A' | 'B' | 'C' | 'D' }[][]).map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-4 text-right">{rowIdx + 1}</span>
            <SeatBtn id={row[0].id} label={row[0].label} booked={bookedSeats.includes(row[0].id)} selected={selectedSeats.includes(row[0].id)} onClick={() => toggleSeat(row[0].id)} />
            <SeatBtn id={row[1].id} label={row[1].label} booked={bookedSeats.includes(row[1].id)} selected={selectedSeats.includes(row[1].id)} onClick={() => toggleSeat(row[1].id)} />
            <div className="w-5 border-r-2 border-dashed border-gray-200 h-9" />
            <SeatBtn id={row[2].id} label={row[2].label} booked={bookedSeats.includes(row[2].id)} selected={selectedSeats.includes(row[2].id)} onClick={() => toggleSeat(row[2].id)} />
            <SeatBtn id={row[3].id} label={row[3].label} booked={bookedSeats.includes(row[3].id)} selected={selectedSeats.includes(row[3].id)} onClick={() => toggleSeat(row[3].id)} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full whitespace-nowrap">Rear of Bus</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    </div>
  );

  const renderSleeperLayout = () => (
    <div className="overflow-x-auto">
      {(['lower', 'upper'] as const).map(deck => (
        <div key={deck} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${deck === 'lower' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
              {deck === 'lower' ? '↓ Lower Berth' : '↑ Upper Berth'}
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="flex-1" />
            <div className="w-16 h-8 flex items-center justify-center bg-yellow-50 rounded-md text-sm border border-yellow-200">🧑‍✈️</div>
          </div>
          <div className="space-y-2">
            {(layout as { id: string; label: string; deck: 'lower' | 'upper' }[][]).map((row, rowIdx) => {
              const leftSeat = row.find(s => s.id.startsWith('L') && s.deck === deck);
              const rightSeat = row.find(s => s.id.startsWith('R') && s.deck === deck);
              if (!leftSeat || !rightSeat) return null;
              return (
                <div key={rowIdx} className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-4 text-right">{rowIdx + 1}</span>
                  <SeatBtn id={leftSeat.id} label={leftSeat.label} booked={bookedSeats.includes(leftSeat.id)} selected={selectedSeats.includes(leftSeat.id)} isSleeper deck={deck} onClick={() => toggleSeat(leftSeat.id)} />
                  <div className="w-6 border-r-2 border-dashed border-gray-200 h-8" />
                  <SeatBtn id={rightSeat.id} label={rightSeat.label} booked={bookedSeats.includes(rightSeat.id)} selected={selectedSeats.includes(rightSeat.id)} isSleeper deck={deck} onClick={() => toggleSeat(rightSeat.id)} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // ─── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="pt-16 min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/search" className="hover:text-blue-600">Search</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">Select Seats & Book</span>
        </nav>

        {/* Journey Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{schedule.departure_time}</p>
                <p className="text-sm text-gray-500 truncate">{schedule.origin}</p>
              </div>
              <div className="flex-1 flex flex-col items-center px-2">
                <p className="text-xs text-gray-400 mb-1">{formatDuration(schedule.duration_minutes || 0)}</p>
                <div className="w-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1 h-0.5 bg-blue-200" />
                  <span className="text-blue-500">🚌</span>
                  <div className="flex-1 h-0.5 bg-blue-200" />
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatDate(schedule.travel_date)}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{schedule.arrival_time}</p>
                <p className="text-sm text-gray-500 truncate">{schedule.destination}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium capitalize">{busType}</span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{schedule.bus_number}</span>
              {schedule.amenities?.split(', ').slice(0, 3).map(a => (
                <span key={a} className="bg-green-50 text-green-700 px-2 py-1 rounded-full">{a}</span>
              ))}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(schedule.price)}</p>
              <p className="text-xs text-gray-400">per seat</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Seat Map + Passenger Form ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Seat Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  {layoutType === 'sleeper' ? '🛏️ Select Berths' : '💺 Select Seats'}
                </h2>
                <span className="text-sm text-gray-500">
                  {capacity - bookedSeats.length} of {capacity} available
                </span>
              </div>

              {/* Legend */}
              <div className="flex gap-5 mb-6 text-xs text-gray-600 flex-wrap">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-6 h-5 rounded border-2 border-green-400 bg-white" />
                  Available
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-6 h-5 rounded border-2 border-blue-700 bg-blue-600" />
                  Selected
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-6 h-5 rounded border border-red-200 bg-red-100" />
                  Booked
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                {layoutType === 'seater' ? renderSeaterLayout() : renderSleeperLayout()}
              </div>

              {selectedSeats.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl flex flex-wrap items-center gap-2">
                  <span className="text-sm text-blue-700 font-medium">Selected:</span>
                  {selectedSeats.map(s => (
                    <span
                      key={s}
                      onClick={() => toggleSeat(s)}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full cursor-pointer hover:bg-red-500 transition-colors"
                      title="Click to deselect"
                    >
                      {s} ✕
                    </span>
                  ))}
                  <span className="text-xs text-blue-500 ml-auto">(max 6 seats)</span>
                </div>
              )}
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span>👤</span> Passenger Details
              </h2>
              <form id="booking-form" onSubmit={handleBooking}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label">Full Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="passenger_name"
                      value={formData.passenger_name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="As per your ID"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Email Address <span className="text-red-400">*</span></label>
                    <input
                      type="email"
                      name="passenger_email"
                      value={formData.passenger_email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="ticket@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      name="passenger_phone"
                      value={formData.passenger_phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="9800000100"
                      required
                    />
                  </div>
                </div>
              </form>
              <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <span className="text-xl">💳</span>
                <div>
                  <p className="text-sm font-semibold text-green-800">Secure Booking (Demo)</p>
                  <p className="text-xs text-green-700 mt-0.5">No real payment will be processed. Clicking Confirm will create a sample booking.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Fare Summary ───────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Fare Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Route</span>
                  <span className="font-medium text-right">{schedule.origin} → {schedule.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formatDate(schedule.travel_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Departure</span>
                  <span className="font-medium">{schedule.departure_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{formatDuration(schedule.duration_minutes || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bus Type</span>
                  <span className="font-medium capitalize">{busType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bus No.</span>
                  <span className="font-medium">{schedule.bus_number}</span>
                </div>
              </div>

              <div className="my-4 border-t border-gray-100" />

              {selectedSeats.length === 0 ? (
                <p className="text-sm text-orange-500 text-center py-2">← Select at least one seat</p>
              ) : (
                <div className="space-y-2 text-sm">
                  {selectedSeats.map(s => (
                    <div key={s} className="flex justify-between">
                      <span className="text-gray-500">Seat {s}</span>
                      <span className="font-medium">{formatCurrency(schedule.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedSeats.length > 0 && (
                <>
                  <div className="my-3 border-t border-gray-100" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      Total ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''})
                    </span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalFare)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">Taxes & fees included</p>
                </>
              )}

              <button
                type="submit"
                form="booking-form"
                disabled={booking || selectedSeats.length === 0}
                className="btn-primary w-full mt-6 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {booking ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Confirming...
                  </>
                ) : selectedSeats.length === 0 ? (
                  '✅ Confirm Booking'
                ) : (
                  `✅ Pay ${formatCurrency(totalFare)}`
                )}
              </button>

              {schedule.amenities && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-2">Included Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {schedule.amenities.split(', ').map((a: string) => (
                      <span key={a} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <ProtectedRoute>
      <BookContent />
    </ProtectedRoute>
  );
}
