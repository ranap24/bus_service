# BusConnect - Bus Service Web Application

## Project Overview
A full-stack Next.js 15 Bus Service web application with:
- Multi-page routing with App Router
- Authentication (JWT via `jose`, stored in HTTP-only cookies)
- SQLite database via `better-sqlite3`
- Tailwind CSS for styling

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (`better-sqlite3`)
- **Auth**: JWT via `jose`, bcrypt via `bcryptjs`

## Pages
- `/` — Home page with search
- `/search` — Search bus schedules
- `/routes` — All available routes
- `/book/[scheduleId]` — Book a ticket
- `/booking-confirmation/[reference]` — Booking confirmation
- `/my-bookings` — User's bookings
- `/profile` — User profile
- `/login` — Login
- `/register` — Registration
- `/admin` — Admin dashboard (admin only)

## API Endpoints
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user
- `GET /api/schedules/search` — Search schedules
- `GET /api/schedules/[scheduleId]` — Single schedule
- `POST /api/bookings` — Create booking
- `GET /api/bookings/my-bookings` — User's bookings
- `PATCH /api/bookings/[bookingId]/cancel` — Cancel booking
- `GET /api/admin/stats` — Admin stats
- `GET /api/admin/users` — Manage users
- `GET /api/routes` — All routes
- `PATCH /api/profile` — Update profile

## Setup Instructions
1. `npm install`
2. `npm run db:migrate` (auto-runs on first start)
3. `npm run db:seed` (seed demo data)
4. `npm run dev`

## Demo Credentials
- **User**: john@example.com / password123
- **Admin**: admin@busservice.com / admin123
