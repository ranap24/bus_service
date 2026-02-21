import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import { GuestCTASection } from '@/components/HomeAuthSections';

export default function HomePage() {
  const features = [
    { icon: '🚌', title: 'Wide Network', desc: 'Travel to 100+ cities across the country with our extensive bus network.' },
    { icon: '💰', title: 'Best Prices', desc: 'Get the best bus fares with exclusive discounts and offers.' },
    { icon: '🛡️', title: 'Safe & Secure', desc: 'All buses are regularly maintained with trained drivers for your safety.' },
    { icon: '📱', title: 'Easy Booking', desc: 'Book tickets in minutes with our simple online booking system.' },
    { icon: '🎫', title: 'Instant Confirmation', desc: 'Get instant booking confirmation with your e-ticket via email.' },
    { icon: '⏰', title: '24/7 Support', desc: 'Our customer support team is available around the clock.' },
  ];

  const popularRoutes = [
    { from: 'Mumbai', to: 'Pune', price: 350, duration: '3h 30m', buses: 24 },
    { from: 'Bangalore', to: 'Chennai', price: 650, duration: '6h', buses: 18 },
    { from: 'Hyderabad', to: 'Bangalore', price: 800, duration: '10h', buses: 14 },
    { from: 'Delhi', to: 'Jaipur', price: 500, duration: '5h', buses: 20 },
    { from: 'Mumbai', to: 'Goa', price: 950, duration: '9h', buses: 10 },
    { from: 'Pune', to: 'Bangalore', price: 900, duration: '11h', buses: 8 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden pt-16">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <span>🎉</span>
              <span>Book now & save up to 20% on select routes</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Travel Comfortably,
              <br />
              <span className="text-blue-200">Book Easily</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your trusted bus booking platform. Find schedules, compare prices, and book tickets for hundreds of routes across the country.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto">
            <SearchForm />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            {[
              { value: '500+', label: 'Daily Routes' },
              { value: '50K+', label: 'Happy Travelers' },
              { value: '100+', label: 'Cities Covered' },
              { value: '99%', label: 'On-Time Rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-header">Why Choose BusConnect?</h2>
            <p className="section-subtitle mt-4">Everything you need for a great bus travel experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-header">Popular Routes</h2>
            <p className="section-subtitle mt-4">Most traveled routes with frequent departures</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route) => {
              const today = new Date().toISOString().split('T')[0];
              const searchUrl = `/search?origin=${encodeURIComponent(route.from)}&destination=${encodeURIComponent(route.to)}&travel_date=${today}`;
              return (
                <Link key={`${route.from}-${route.to}`} href={searchUrl} className="block">
                  <div className="card p-6 group hover:border-blue-200 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-gray-900 font-semibold">
                          <span>{route.from}</span>
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span>{route.to}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">🕒 {route.duration} • {route.buses} buses/day</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">₹{route.price}</p>
                        <p className="text-xs text-gray-400">from</p>
                      </div>
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
                    <p className="text-sm text-blue-600 mt-3 font-medium group-hover:underline">View schedules →</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/routes" className="btn-secondary">
              View All Routes
            </Link>
          </div>
        </div>
      </section>

      {/* Guest CTA — visible only when not logged in */}
      <GuestCTASection />

      {/* CTA Section */}
      <section className="py-24 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 text-xl mb-10">
            Join thousands of happy travelers. Book your bus ticket today and enjoy a comfortable ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
              Create Free Account
            </Link>
            <Link href="/search" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
              Search Buses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
