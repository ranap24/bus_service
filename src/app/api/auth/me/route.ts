import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const rows = await sql`SELECT id, name, email, phone, role, created_at FROM users WHERE id = ${session.userId}`;
    const user = rows[0] as {
      id: number;
      name: string;
      email: string;
      phone: string;
      role: string;
      created_at: string;
    } | undefined;

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get user' }, { status: 500 });
  }
}
