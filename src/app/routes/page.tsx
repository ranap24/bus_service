import { sql } from '@/lib/db';
import { Route } from '@/types';
import Link from 'next/link';
import { formatDuration, formatCurrency } from '@/lib/utils';

async function getRoutes(): Promise<Route[]> {
  const rows = await sql`SELECT * FROM routes WHERE status = 'active' ORDER BY origin, destination`;
  return rows as Route[];
}

export default async function RoutesPage() {
  const routes = await getRoutes();
  const today = new Date().toISOString().split('T')[0];

  const busTypeIcons: Record<string, string> = {
    luxury: '👑',
    express: '⚡',
    standard: '🚌',
  };

  // Group routes by origin
  const routesByOrigin = routes.reduce((acc, route) => {
    if (!acc[route.origin]) acc[route.origin] = [];
    acc[route.origin].push(route);
    return acc;
  }, {} as Record<string, Route[]>);

  return (
    <div className="pt-16">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Bus Routes</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Explore all available routes. Click on any route to find available schedules and book your tickets.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Routes', value: routes.length },
            { label: 'Cities Served', value: new Set([...routes.map(r => r.origin), ...routes.map(r => r.destination)]).size },
            { label: 'Avg. Fare', value: `$${(routes.reduce((s, r) => s + r.base_fare, 0) / routes.length).toFixed(0)}` },
            { label: 'Daily Trips', value: '40+' },
          ].map(stat => (
            <div key={stat.label} className="card p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Routes by Origin */}
        {Object.entries(routesByOrigin).map(([origin, originRoutes]) => (
          <div key={origin} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">📍</span>
              <h2 className="text-2xl font-bold text-gray-900">From {origin}</h2>
              <span className="badge badge-info">{originRoutes.length} route{originRoutes.length > 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {originRoutes.map(route => (
                <div key={route.id} className="card group hover:border-blue-200 transition-all duration-300">
                  <div className="p-6">
                    {/* Route Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="badge badge-info mb-2">{route.route_number}</span>
                        <h3 className="text-lg font-bold text-gray-900">
                          {route.origin} → {route.destination}
                        </h3>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-5">
                      <div className="flex items-center gap-2">
                        <span>📏</span>
                        <span>{route.distance_km} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⏱️</span>
                        <span>{formatDuration(route.duration_minutes)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span>From {formatCurrency(route.base_fare)}</span>
                      </div>
                    </div>

                    {/* Bus Types Available */}
                    <div className="flex gap-2 mb-5">
                      {Object.entries(busTypeIcons).map(([type, icon]) => (
                        <span key={type} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                          {icon} {type}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/search?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}&travel_date=${today}`}
                      className="btn-primary w-full text-center block text-sm"
                    >
                      View Schedules
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {routes.length === 0 && (
          <div className="text-center py-20 card">
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No routes available</h3>
            <p className="text-gray-500">Please run the database seed to populate routes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
