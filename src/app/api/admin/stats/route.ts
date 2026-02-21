import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const [usersRow] = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'passenger'`;
    const [routesRow] = await sql`SELECT COUNT(*) as count FROM routes WHERE status = 'active'`;
    const [bookingsRow] = await sql`SELECT COUNT(*) as count FROM bookings`;
    const [confirmedRow] = await sql`SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'`;
    const [revenueRow] = await sql`SELECT SUM(total_fare) as total FROM bookings WHERE status != 'cancelled'`;
    const [todayRow] = await sql`SELECT COUNT(*) as count FROM bookings WHERE created_at::date = CURRENT_DATE`;

    const recentBookings = await sql`
      SELECT b.*, r.origin, r.destination, s.travel_date, u.name as user_name
      FROM bookings b
      JOIN schedules s ON b.schedule_id = s.id
      JOIN routes r ON s.route_id = r.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `;

    const popularRoutes = await sql`
      SELECT r.origin, r.destination, r.route_number, COUNT(b.id) as booking_count
      FROM bookings b
      JOIN schedules s ON b.schedule_id = s.id
      JOIN routes r ON s.route_id = r.id
      WHERE b.status != 'cancelled'
      GROUP BY r.id, r.origin, r.destination, r.route_number
      ORDER BY booking_count DESC
      LIMIT 5
    `;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers: Number(usersRow.count),
          totalRoutes: Number(routesRow.count),
          totalBookings: Number(bookingsRow.count),
          confirmedBookings: Number(confirmedRow.count),
          totalRevenue: Number(revenueRow.total) || 0,
          todayBookings: Number(todayRow.count),
        },
        recentBookings,
        popularRoutes,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get stats' }, { status: 500 });
  }
}
