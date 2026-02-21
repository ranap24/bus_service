'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Stats {
  totalUsers: number;
  totalRoutes: number;
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  todayBookings: number;
}

interface RecentBooking {
  id: number;
  booking_reference: string;
  passenger_name: string;
  total_fare: number;
  status: string;
  origin: string;
  destination: string;
  travel_date: string;
  user_name: string;
}

interface PopularRoute {
  origin: string;
  destination: string;
  route_number: string;
  booking_count: number;
}

function AdminContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.status === 403 || res.status === 401) {
          router.push('/');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setStats(data.data.stats);
          setRecentBookings(data.data.recentBookings);
          setPopularRoutes(data.data.popularRoutes);
        }
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-500' },
    { label: 'Active Routes', value: stats.totalRoutes, icon: '🗺️', color: 'bg-green-500' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: '🎫', color: 'bg-purple-500' },
    { label: "Today's Bookings", value: stats.todayBookings, icon: '📅', color: 'bg-orange-500' },
    { label: 'Confirmed Bookings', value: stats.confirmedBookings, icon: '✅', color: 'bg-teal-500' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰', color: 'bg-yellow-500' },
  ] : [];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-blue-100">Overview of your bus service operations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick Links */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <Link href="/admin/users" className="btn-secondary text-sm">👥 Manage Users</Link>
          <Link href="/admin/routes" className="btn-secondary text-sm">🗺️ Manage Routes</Link>
          <Link href="/admin/bookings" className="btn-secondary text-sm">🎫 All Bookings</Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {statCards.map(card => (
            <div key={card.label} className="card p-5 text-center">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-sm text-blue-600 hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {recentBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No bookings yet</p>
              ) : (
                recentBookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{booking.passenger_name}</p>
                      <p className="text-xs text-gray-500">{booking.origin} → {booking.destination}</p>
                      <p className="text-xs font-mono text-blue-600">{booking.booking_reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{formatCurrency(booking.total_fare)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Popular Routes */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Popular Routes</h2>
              <Link href="/routes" className="text-sm text-blue-600 hover:underline">View routes →</Link>
            </div>
            <div className="space-y-3">
              {popularRoutes.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No bookings data yet</p>
              ) : (
                popularRoutes.map((route, idx) => (
                  <div key={route.route_number} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-blue-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{route.origin} → {route.destination}</p>
                      <p className="text-xs text-gray-500">{route.route_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 text-sm">{route.booking_count}</p>
                      <p className="text-xs text-gray-400">bookings</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}
