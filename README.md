# 🚌 BusConnect - Bus Service Web Application

A full-stack bus booking platform built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **SQLite**.

## ✨ Features

- 🔍 **Search Buses** — Find buses by origin, destination, and date
- 🎫 **Book Tickets** — Select seats and confirm bookings instantly
- 👤 **User Authentication** — Register, login, JWT-based sessions
- 📋 **My Bookings** — View and cancel your bookings
- 🛡️ **Admin Dashboard** — Stats, user management, route overview
- 📱 **Responsive Design** — Works on all screen sizes

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite (better-sqlite3) |
| Auth | JWT (jose) + bcryptjs |
| Notifications | react-hot-toast |

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Seed the database
```bash
npm run db:seed
```

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Passenger | john@example.com | password123 |
| Admin | admin@busservice.com | admin123 |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # login, register, logout, me
│   │   ├── bookings/     # CRUD bookings
│   │   ├── schedules/    # search, detail
│   │   ├── routes/       # bus routes
│   │   ├── admin/        # admin endpoints
│   │   └── profile/      # update profile
│   ├── book/             # Booking page
│   ├── booking-confirmation/ # Confirmation page
│   ├── my-bookings/      # User bookings
│   ├── search/           # Search page
│   ├── routes/           # Routes listing
│   ├── profile/          # User profile
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── admin/            # Admin dashboard
├── components/
│   ├── Navbar.tsx
│   ├── BusCard.tsx
│   └── SearchForm.tsx
├── lib/
│   ├── db.ts             # SQLite connection
│   ├── auth.ts           # JWT helpers
│   └── utils.ts          # Utilities
└── types/
    └── index.ts          # TypeScript types
```

## 🗄️ Database Schema

- **users** — passengers and admins
- **routes** — bus routes (origin → destination)
- **buses** — bus fleet
- **schedules** — departure/arrival times per date
- **bookings** — ticket bookings
- **stops** — route intermediate stops
