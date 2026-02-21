import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { name, phone } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    await sql`
      UPDATE users SET name = ${name.trim()}, phone = ${phone || null}, updated_at = NOW()
      WHERE id = ${session.userId}
    `;

    const rows = await sql`
      SELECT id, name, email, phone, role, created_at FROM users WHERE id = ${session.userId}
    `;

    return NextResponse.json({ success: true, data: rows[0], message: 'Profile updated' });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
