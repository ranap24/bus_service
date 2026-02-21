'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchForm from '@/components/SearchForm';
import BusCard from '@/components/BusCard';
import { Schedule } from '@/types';

function SearchResults() {
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const travelDate = searchParams.get('travel_date') || '';
  const passengers = Number(searchParams.get('passengers') || 1);

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'duration'>('departure');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (!origin || !destination || !travelDate) return;

    const fetchSchedules = async () => {
      setLoading(true);
      setSearched(true);
      try {
        const params = new URLSearchParams({ origin, destination, travel_date: travelDate });
        const res = await fetch(`/api/schedules/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSchedules(data.data || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [origin, destination, travelDate]);

  const filteredAndSorted = schedules
    .filter(s => filterType === 'all' || s.bus_type === filterType)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'departure') return a.departure_time.localeCompare(b.departure_time);
      if (sortBy === 'duration') return (a.duration_minutes || 0) - (b.duration_minutes || 0);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Form */}
      <div className="mb-8">
        <SearchForm
          initialOrigin={origin}
          initialDestination={destination}
          initialDate={travelDate}
        />
      </div>

      {/* Results */}
      {searched && (
        <div>
          {/* Filter/Sort Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {loading ? 'Searching...' : `${filteredAndSorted.length} bus${filteredAndSorted.length !== 1 ? 'es' : ''} found`}
              </h2>
              {origin && destination && (
                <p className="text-gray-500 text-sm mt-1">
                  {origin} → {destination} • {passengers} passenger{passengers > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {!loading && schedules.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input-field w-auto text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="luxury">Luxury</option>
                  <option value="express">Express</option>
                  <option value="standard">Standard</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'departure' | 'duration')}
                  className="input-field w-auto text-sm"
                >
                  <option value="departure">Sort: Earliest</option>
                  <option value="price">Sort: Cheapest</option>
                  <option value="duration">Sort: Fastest</option>
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredAndSorted.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSorted.map(schedule => (
                <BusCard key={schedule.id} schedule={schedule} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 card">
              <div className="text-6xl mb-4">🚌</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No buses found</h3>
              <p className="text-gray-500 mb-6">
                No buses available for {origin} → {destination} on {travelDate}
              </p>
              <p className="text-gray-400 text-sm">Try a different date or route</p>
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="text-center py-20">
          <div className="text-7xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Search for your bus</h3>
          <p className="text-gray-500">Select your origin, destination, and travel date above to find available buses.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="pt-16">
      <div className="hero-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Search Buses</h1>
          <p className="text-blue-100">Find the best bus for your journey</p>
        </div>
      </div>
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
