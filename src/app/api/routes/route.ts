import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const routes = await sql`SELECT * FROM routes ORDER BY origin, destination`;
    return NextResponse.json({ success: true, data: routes });
  } catch (error) {
    console.error('Get routes error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get routes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const { route_number, origin, destination, distance_km, duration_minutes, base_fare } = await request.json();

    if (!route_number || !origin || !destination || !distance_km || !duration_minutes || !base_fare) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO routes (route_number, origin, destination, distance_km, duration_minutes, base_fare)
      VALUES (${route_number}, ${origin}, ${destination}, ${Number(distance_km)}, ${Number(duration_minutes)}, ${Number(base_fare)})
      RETURNING id
    `;

    return NextResponse.json({ success: true, data: { id: result[0].id }, message: 'Route created' }, { status: 201 });
  } catch (error) {
    console.error('Create route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create route' }, { status: 500 });
  }
}
