'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchFormProps {
  initialOrigin?: string;
  initialDestination?: string;
  initialDate?: string;
}

const CITIES = [
  'Mumbai', 'Pune', 'Bangalore', 'Chennai',
  'Hyderabad', 'Delhi', 'Kolkata', 'Ahmedabad',
  'Jaipur', 'Surat', 'Nagpur', 'Coimbatore',
  'Kochi', 'Goa', 'Mysore', 'Mangalore',
];

export default function SearchForm({ initialOrigin = '', initialDestination = '', initialDate = '' }: SearchFormProps) {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !date) return;
    const params = new URLSearchParams({ origin, destination, travel_date: date, passengers: passengers.toString() });
    router.push(`/search?${params.toString()}`);
  };

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Origin */}
        <div className="relative">
          <label className="label">From</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="input-field pl-8"
              required
            >
              <option value="">Select origin</option>
              {CITIES.filter(c => c !== destination).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap button + Destination */}
        <div className="relative">
          <label className="label">To</label>
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={swapLocations}
              className="absolute -left-4 z-10 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors text-sm"
              title="Swap locations"
            >
              ⇄
            </button>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🏁</span>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input-field pl-8"
                required
              >
                <option value="">Select destination</option>
                {CITIES.filter(c => c !== origin).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="label">Travel Date</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📅</span>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="input-field pl-8"
              required
            />
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="label">Passengers</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👥</span>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="input-field pl-8"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button type="submit" className="btn-primary px-12 text-base">
          🔍 Search Buses
        </button>
      </div>
    </form>
  );
}
