import Link from 'next/link';
import { Schedule } from '@/types';
import { formatCurrency, formatDuration, formatDate } from '@/lib/utils';

interface BusCardProps {
  schedule: Schedule;
}

export default function BusCard({ schedule }: BusCardProps) {
  const busTypeColors: Record<string, string> = {
    luxury: 'bg-purple-100 text-purple-700',
    express: 'bg-orange-100 text-orange-700',
    standard: 'bg-gray-100 text-gray-700',
  };

  const amenityList = schedule.amenities ? schedule.amenities.split(', ') : [];

  return (
    <div className="card p-6 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Route & Time Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-gray-500">{schedule.route_number}</span>
            <span className={`badge ${busTypeColors[schedule.bus_type || 'standard']}`}>
              {schedule.bus_type}
            </span>
            {schedule.available_seats < 10 && (
              <span className="badge bg-red-100 text-red-700">
                Only {schedule.available_seats} seats left!
              </span>
            )}
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{schedule.departure_time}</p>
              <p className="text-sm text-gray-500 font-medium">{schedule.origin}</p>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <p className="text-xs text-gray-400 mb-1">{formatDuration(schedule.duration_minutes || 0)}</p>
              <div className="relative w-full">
                <div className="h-0.5 bg-gray-200 w-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{schedule.distance_km} km</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{schedule.arrival_time}</p>
              <p className="text-sm text-gray-500 font-medium">{schedule.destination}</p>
            </div>
          </div>

          {/* Date */}
          <p className="text-sm text-gray-400 mt-2">📅 {formatDate(schedule.travel_date)}</p>

          {/* Amenities */}
          {amenityList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {amenityList.map((amenity, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  {amenity.includes('WiFi') && '📶'}
                  {amenity.includes('AC') && '❄️'}
                  {amenity.includes('USB') && '🔌'}
                  {amenity.includes('Reclining') && '💺'}
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Book */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:pl-6 lg:border-l border-gray-100">
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(schedule.price)}</p>
            <p className="text-sm text-gray-400">per person</p>
            <p className="text-sm text-green-600 font-medium mt-1">
              {schedule.available_seats} seats available
            </p>
          </div>
          <Link
            href={`/book/${schedule.id}`}
            className="btn-primary whitespace-nowrap"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
