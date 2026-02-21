// Seed the database with sample data — Neon Postgres
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await sql`DELETE FROM bookings`;
  await sql`DELETE FROM schedules`;
  await sql`DELETE FROM stops`;
  await sql`DELETE FROM buses`;
  await sql`DELETE FROM routes`;
  await sql`DELETE FROM users`;

  // Reset sequences
  await sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE routes_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE buses_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE schedules_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE stops_id_seq RESTART WITH 1`;

  // Seed users
  const passwordHash = bcrypt.hashSync('password123', 10);
  const adminHash = bcrypt.hashSync('admin123', 10);

  await sql`INSERT INTO users (name, email, password_hash, phone, role) VALUES ('Admin User', 'admin@busservice.com', ${adminHash}, '9800000100', 'admin')`;
  await sql`INSERT INTO users (name, email, password_hash, phone, role) VALUES ('Rahul Sharma', 'rahul@example.com', ${passwordHash}, '9800000101', 'passenger')`;
  await sql`INSERT INTO users (name, email, password_hash, phone, role) VALUES ('Priya Patel', 'priya@example.com', ${passwordHash}, '9800000102', 'passenger')`;

  // Seed routes
  const routes = [
    { route_number: 'IND-101', origin: 'Mumbai',    destination: 'Pune',       distance_km: 148, duration_minutes: 210, base_fare: 350  },
    { route_number: 'IND-102', origin: 'Pune',      destination: 'Mumbai',     distance_km: 148, duration_minutes: 210, base_fare: 350  },
    { route_number: 'IND-103', origin: 'Bangalore', destination: 'Chennai',    distance_km: 346, duration_minutes: 360, base_fare: 650  },
    { route_number: 'IND-104', origin: 'Chennai',   destination: 'Bangalore',  distance_km: 346, duration_minutes: 360, base_fare: 650  },
    { route_number: 'IND-105', origin: 'Hyderabad', destination: 'Bangalore',  distance_km: 570, duration_minutes: 600, base_fare: 800  },
    { route_number: 'IND-106', origin: 'Bangalore', destination: 'Hyderabad',  distance_km: 570, duration_minutes: 600, base_fare: 800  },
    { route_number: 'IND-107', origin: 'Delhi',     destination: 'Jaipur',     distance_km: 282, duration_minutes: 300, base_fare: 500  },
    { route_number: 'IND-108', origin: 'Jaipur',    destination: 'Delhi',      distance_km: 282, duration_minutes: 300, base_fare: 500  },
    { route_number: 'IND-109', origin: 'Mumbai',    destination: 'Goa',        distance_km: 597, duration_minutes: 540, base_fare: 950  },
    { route_number: 'IND-110', origin: 'Pune',      destination: 'Bangalore',  distance_km: 836, duration_minutes: 660, base_fare: 900  },
    { route_number: 'IND-111', origin: 'Chennai',   destination: 'Coimbatore', distance_km: 496, duration_minutes: 420, base_fare: 550  },
    { route_number: 'IND-112', origin: 'Hyderabad', destination: 'Chennai',    distance_km: 630, duration_minutes: 540, base_fare: 750  },
    { route_number: 'IND-113', origin: 'Kochi',     destination: 'Bangalore',  distance_km: 545, duration_minutes: 510, base_fare: 850  },
    { route_number: 'IND-114', origin: 'Bangalore', destination: 'Mysore',     distance_km: 145, duration_minutes: 180, base_fare: 300  },
    { route_number: 'IND-115', origin: 'Mumbai',    destination: 'Ahmedabad',  distance_km: 530, duration_minutes: 480, base_fare: 700  },
  ];

  for (const r of routes) {
    await sql`INSERT INTO routes (route_number, origin, destination, distance_km, duration_minutes, base_fare) VALUES (${r.route_number}, ${r.origin}, ${r.destination}, ${r.distance_km}, ${r.duration_minutes}, ${r.base_fare})`;
  }

  // Seed buses
  const buses = [
    { bus_number: 'MH-01-AB-1234', route_id: 1,  capacity: 41, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging, Blanket, Water Bottle' },
    { bus_number: 'MH-01-CD-5678', route_id: 1,  capacity: 45, bus_type: 'standard', amenities: 'AC, Charging Point' },
    { bus_number: 'MH-12-EF-2345', route_id: 2,  capacity: 41, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging, Blanket' },
    { bus_number: 'MH-12-GH-6789', route_id: 2,  capacity: 45, bus_type: 'express',  amenities: 'AC, USB Charging' },
    { bus_number: 'KA-01-MN-3456', route_id: 3,  capacity: 40, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging, Blanket, Snacks' },
    { bus_number: 'KA-03-PQ-7890', route_id: 3,  capacity: 36, bus_type: 'sleeper',  amenities: 'AC, Sleeping Berth, Curtain, Charging Point' },
    { bus_number: 'TN-09-RS-1122', route_id: 4,  capacity: 40, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging' },
    { bus_number: 'TN-01-TU-3344', route_id: 4,  capacity: 36, bus_type: 'sleeper',  amenities: 'AC, Sleeping Berth, Curtain' },
    { bus_number: 'TS-09-VW-5566', route_id: 5,  capacity: 36, bus_type: 'sleeper',  amenities: 'AC, Sleeping Berth, Curtain, Charging Point' },
    { bus_number: 'TS-01-XY-7788', route_id: 5,  capacity: 40, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging, Blanket' },
    { bus_number: 'KA-05-ZA-9900', route_id: 6,  capacity: 36, bus_type: 'sleeper',  amenities: 'AC, Sleeping Berth, Curtain' },
    { bus_number: 'KA-07-BC-1234', route_id: 6,  capacity: 45, bus_type: 'standard', amenities: 'AC, Charging Point' },
    { bus_number: 'DL-01-DE-2233', route_id: 7,  capacity: 45, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging, Snacks' },
    { bus_number: 'DL-03-FG-4455', route_id: 7,  capacity: 50, bus_type: 'express',  amenities: 'AC, Charging Point' },
    { bus_number: 'RJ-14-HI-6677', route_id: 8,  capacity: 45, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging' },
    { bus_number: 'RJ-01-JK-8899', route_id: 8,  capacity: 50, bus_type: 'standard', amenities: 'AC' },
    { bus_number: 'MH-04-LM-1357', route_id: 9,  capacity: 36, bus_type: 'sleeper',  amenities: 'AC, Sleeping Berth, Curtain, Charging Point' },
    { bus_number: 'MH-06-NO-2468', route_id: 9,  capacity: 41, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging, Blanket, Snacks' },
    { bus_number: 'MH-14-PQ-3579', route_id: 10, capacity: 36, bus_type: 'sleeper',  amenities: 'AC, Sleeping Berth, Curtain, Charging Point' },
    { bus_number: 'TN-38-RS-4680', route_id: 11, capacity: 45, bus_type: 'express',  amenities: 'AC, USB Charging' },
    { bus_number: 'TN-11-TU-5791', route_id: 11, capacity: 40, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging' },
    { bus_number: 'TS-07-VW-6802', route_id: 12, capacity: 36, bus_type: 'sleeper',  amenities: 'AC, Sleeping Berth, Curtain, Charging Point' },
    { bus_number: 'KL-05-XY-7913', route_id: 13, capacity: 36, bus_type: 'sleeper',  amenities: 'AC, Sleeping Berth, Curtain, Charging Point' },
    { bus_number: 'KA-09-ZA-8024', route_id: 14, capacity: 50, bus_type: 'express',  amenities: 'AC, Charging Point' },
    { bus_number: 'KA-11-BC-9135', route_id: 14, capacity: 44, bus_type: 'standard', amenities: 'AC' },
    { bus_number: 'MH-09-DE-0246', route_id: 15, capacity: 40, bus_type: 'luxury',   amenities: 'AC, WiFi, USB Charging, Blanket' },
    { bus_number: 'GJ-01-FG-1357', route_id: 15, capacity: 45, bus_type: 'express',  amenities: 'AC, Charging Point' },
  ];

  for (const b of buses) {
    await sql`INSERT INTO buses (bus_number, route_id, capacity, bus_type, amenities) VALUES (${b.bus_number}, ${b.route_id}, ${b.capacity}, ${b.bus_type}, ${b.amenities})`;
  }

  // Seed schedules for next 7 days
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const d = date.toISOString().split('T')[0];

    // Route 1: Mumbai -> Pune (bus 1 & 2)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (1, 1, '06:00', '09:30', ${d}, 41, 550)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (2, 1, '09:00', '12:30', ${d}, 45, 380)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (1, 1, '14:00', '17:30', ${d}, 41, 600)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (2, 1, '21:00', '00:30', ${d}, 45, 420)`;

    // Route 2: Pune -> Mumbai (bus 3 & 4)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (3, 2, '07:00', '10:30', ${d}, 41, 550)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (4, 2, '13:00', '16:30', ${d}, 45, 380)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (3, 2, '20:00', '23:30', ${d}, 41, 600)`;

    // Route 3: Bangalore -> Chennai (bus 5 & 6)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (5, 3, '07:00', '13:00', ${d}, 40, 900)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (6, 3, '22:00', '04:00', ${d}, 36, 1100)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (5, 3, '15:00', '21:00', ${d}, 40, 850)`;

    // Route 4: Chennai -> Bangalore (bus 7 & 8)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (7, 4, '07:30', '13:30', ${d}, 40, 900)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (8, 4, '22:30', '04:30', ${d}, 36, 1100)`;

    // Route 5: Hyderabad -> Bangalore (bus 9 & 10)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (9, 5, '21:00', '07:00', ${d}, 36, 1400)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (10, 5, '08:00', '18:00', ${d}, 40, 1200)`;

    // Route 6: Bangalore -> Hyderabad (bus 11 & 12)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (11, 6, '21:30', '07:30', ${d}, 36, 1400)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (12, 6, '08:30', '18:30', ${d}, 45, 1100)`;

    // Route 7: Delhi -> Jaipur (bus 13 & 14)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (13, 7, '06:00', '11:00', ${d}, 45, 750)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (14, 7, '08:00', '13:00', ${d}, 50, 500)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (13, 7, '15:00', '20:00', ${d}, 45, 800)`;

    // Route 8: Jaipur -> Delhi (bus 15 & 16)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (15, 8, '07:00', '12:00', ${d}, 45, 750)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (16, 8, '14:00', '19:00', ${d}, 50, 500)`;

    // Route 9: Mumbai -> Goa (bus 17 & 18)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (17, 9, '21:00', '08:00', ${d}, 36, 1200)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (18, 9, '22:00', '09:00', ${d}, 41, 1000)`;

    // Route 10: Pune -> Bangalore (bus 19)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (19, 10, '20:00', '08:00', ${d}, 36, 1100)`;

    // Route 11: Chennai -> Coimbatore (bus 20 & 21)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (20, 11, '07:00', '12:00', ${d}, 45, 550)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (21, 11, '22:00', '03:00', ${d}, 40, 700)`;

    // Route 12: Hyderabad -> Chennai (bus 22)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (22, 12, '20:00', '07:00', ${d}, 36, 1300)`;

    // Route 13: Kochi -> Bangalore (bus 23)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (23, 13, '19:00', '07:00', ${d}, 36, 1500)`;

    // Route 14: Bangalore -> Mysore (bus 24 & 25)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (24, 14, '07:00', '10:00', ${d}, 50, 350)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (25, 14, '12:00', '15:00', ${d}, 44, 300)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (24, 14, '17:00', '20:00', ${d}, 50, 380)`;

    // Route 15: Mumbai -> Ahmedabad (bus 26 & 27)
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (26, 15, '07:00', '15:00', ${d}, 40, 950)`;
    await sql`INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, available_seats, price) VALUES (27, 15, '22:00', '06:00', ${d}, 45, 750)`;
  }

  // Seed stops
  const stops = [
    [1, 'Mumbai - Dadar Bus Depot', 1, 0],
    [1, 'Khopoli', 2, 60],
    [1, 'Pune - Shivajinagar', 3, 210],
    [2, 'Pune - Shivajinagar', 1, 0],
    [2, 'Khopoli', 2, 90],
    [2, 'Mumbai - Dadar Bus Depot', 3, 210],
    [3, 'Bangalore - Majestic (KSRTC)', 1, 0],
    [3, 'Krishnagiri', 2, 120],
    [3, 'Vellore', 3, 210],
    [3, 'Chennai - CMBT', 4, 360],
    [4, 'Chennai - CMBT', 1, 0],
    [4, 'Vellore', 2, 90],
    [4, 'Krishnagiri', 3, 180],
    [4, 'Bangalore - Majestic (KSRTC)', 4, 360],
    [5, 'Hyderabad - Mahatma Gandhi Bus Station', 1, 0],
    [5, 'Kurnool', 2, 180],
    [5, 'Anantapur', 3, 360],
    [5, 'Bangalore - Majestic (KSRTC)', 4, 600],
    [7, 'Delhi - Kashmere Gate ISBT', 1, 0],
    [7, 'Gurgaon', 2, 45],
    [7, 'Alwar', 3, 150],
    [7, 'Jaipur - Sindhi Camp', 4, 300],
    [9, 'Mumbai - Dadar Bus Depot', 1, 0],
    [9, 'Pune', 2, 180],
    [9, 'Kolhapur', 3, 360],
    [9, 'Goa - Panaji Bus Stand', 4, 540],
    [14, 'Bangalore - Majestic (KSRTC)', 1, 0],
    [14, 'Mandya', 2, 90],
    [14, 'Mysore - Central Bus Stand', 3, 180],
  ];

  for (const [route_id, stop_name, stop_order, arrival_offset_minutes] of stops) {
    await sql`INSERT INTO stops (route_id, stop_name, stop_order, arrival_offset_minutes) VALUES (${route_id}, ${stop_name}, ${stop_order}, ${arrival_offset_minutes})`;
  }

  // Sample booking
  await sql`
    INSERT INTO bookings (user_id, schedule_id, booking_reference, passenger_name, passenger_email, passenger_phone, seat_number, total_fare, status)
    VALUES (2, 1, 'BKG-2024-001', 'Rahul Sharma', 'rahul@example.com', '9800000100', 'L4', 550, 'confirmed')
  `;

  console.log('✅ Database seeded successfully!');
  console.log('   Admin: admin@busservice.com / admin123');
  console.log('   User:  rahul@example.com / password123');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

