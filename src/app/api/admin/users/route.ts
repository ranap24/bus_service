import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const users = await sql`
      SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC
    `;

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get users' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const { userId, role } = await request.json();
    await sql`UPDATE users SET role = ${role} WHERE id = ${userId}`;

    return NextResponse.json({ success: true, message: 'User updated' });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
