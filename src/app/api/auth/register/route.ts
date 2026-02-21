import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user and return id
    const result = await sql`
      INSERT INTO users (name, email, password_hash, phone)
      VALUES (${name}, ${email}, ${password_hash}, ${phone || null})
      RETURNING id
    `;
    const userId = result[0].id as number;

    // Sign JWT & set cookie
    const token = await signToken({ userId, email, role: 'passenger', name });
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      data: { id: userId, name, email, role: 'passenger' },
      message: 'Account created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}
