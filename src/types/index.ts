export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'passenger' | 'admin';
  created_at: string;
}

export interface Route {
  id: number;
  route_number: string;
  origin: string;
  destination: string;
  distance_km: number;
  duration_minutes: number;
  base_fare: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Bus {
  id: number;
  bus_number: string;
  route_id: number;
  capacity: number;
  bus_type: 'standard' | 'luxury' | 'express';
  amenities?: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
}

export interface Schedule {
  id: number;
  bus_id: number;
  route_id: number;
  departure_time: string;
  arrival_time: string;
  travel_date: string;
  available_seats: number;
  price: number;
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled';
  // Joined fields
  route_number?: string;
  origin?: string;
  destination?: string;
  distance_km?: number;
  duration_minutes?: number;
  bus_number?: string;
  bus_type?: string;
  amenities?: string;
  booked_seats?: string[];
  capacity?: number;
}

export interface Booking {
  id: number;
  user_id: number;
  schedule_id: number;
  booking_reference: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  seat_number: string;
  total_fare: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'paid' | 'pending' | 'refunded';
  created_at: string;
  // Joined fields
  origin?: string;
  destination?: string;
  departure_time?: string;
  arrival_time?: string;
  travel_date?: string;
  bus_number?: string;
  route_number?: string;
}

export interface Stop {
  id: number;
  route_id: number;
  stop_name: string;
  stop_order: number;
  arrival_offset_minutes: number;
}

export interface SearchParams {
  origin: string;
  destination: string;
  travel_date: string;
  passengers?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
