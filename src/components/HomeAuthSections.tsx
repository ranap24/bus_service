'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function GuestBanner() {
  const { isLoggedIn, loading, user } = useAuth();

  if (loading) return null;

  if (isLoggedIn) {
    // Personalised welcome strip for logged-in users
    return (
      <div className="bg-blue-600 text-white py-3 px-4 text-center text-sm">
        <span className="font-medium">👋 Welcome back, {user?.name?.split(' ')[0]}!</span>
        <span className="text-blue-200 mx-2">•</span>
        <Link href="/my-bookings" className="underline hover:text-blue-100 font-medium">
          View My Bookings →
        </Link>
      </div>
    );
  }

  // Guest banner
  return (
    <div className="bg-amber-50 border-b border-amber-200 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-amber-800">
          <span className="text-lg">🔔</span>
          <span>
            <strong>You&apos;re not logged in.</strong> Sign in to book tickets, view your bookings and manage your profile.
          </span>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/login"
            className="px-4 py-1.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 bg-white border border-amber-300 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors text-sm"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export function GuestCTASection() {
  const { isLoggedIn, loading } = useAuth();

  if (loading || isLoggedIn) return null;

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-center text-white shadow-xl">
          <div className="text-5xl mb-4">🚌</div>
          <h2 className="text-3xl font-bold mb-3">Create a Free Account to Book Tickets</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join BusConnect today to book bus tickets across 100+ Indian cities, track your journeys, 
            and get exclusive member-only discounts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            {[
              { icon: '🎫', title: 'Instant Booking', desc: 'Book in under 2 minutes' },
              { icon: '💰', title: 'Best Prices', desc: 'Guaranteed lowest fares' },
              { icon: '📱', title: 'e-Tickets', desc: 'Paperless, always accessible' },
            ].map(item => (
              <div key={item.title} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-blue-200 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-md"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="border-2 border-white/60 text-white px-8 py-3 rounded-xl font-bold text-base hover:bg-white/10 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
          <p className="text-blue-200 text-xs mt-4">Free forever • No credit card required</p>
        </div>
      </div>
    </section>
  );
}
