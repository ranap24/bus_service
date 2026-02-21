// Database migration script — Neon Postgres
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Running migrations...');

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'passenger',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS routes (
      id SERIAL PRIMARY KEY,
      route_number TEXT UNIQUE NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      distance_km NUMERIC NOT NULL,
      duration_minutes INTEGER NOT NULL,
      base_fare NUMERIC NOT NULL,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS buses (
      id SERIAL PRIMARY KEY,
      bus_number TEXT UNIQUE NOT NULL,
      route_id INTEGER REFERENCES routes(id),
      capacity INTEGER NOT NULL,
      bus_type TEXT NOT NULL DEFAULT 'standard',
      amenities TEXT,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS schedules (
      id SERIAL PRIMARY KEY,
      bus_id INTEGER NOT NULL REFERENCES buses(id),
      route_id INTEGER NOT NULL REFERENCES routes(id),
      departure_time TEXT NOT NULL,
      arrival_time TEXT NOT NULL,
      travel_date DATE NOT NULL,
      available_seats INTEGER NOT NULL,
      price NUMERIC NOT NULL,
      status TEXT DEFAULT 'scheduled',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      schedule_id INTEGER NOT NULL REFERENCES schedules(id),
      booking_reference TEXT UNIQUE NOT NULL,
      passenger_name TEXT NOT NULL,
      passenger_email TEXT NOT NULL,
      passenger_phone TEXT NOT NULL,
      seat_number TEXT NOT NULL,
      total_fare NUMERIC NOT NULL,
      status TEXT DEFAULT 'confirmed',
      payment_status TEXT DEFAULT 'paid',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS stops (
      id SERIAL PRIMARY KEY,
      route_id INTEGER NOT NULL REFERENCES routes(id),
      stop_name TEXT NOT NULL,
      stop_order INTEGER NOT NULL,
      arrival_offset_minutes INTEGER DEFAULT 0
    )
  `;

  console.log('✅ Database migration completed successfully!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
