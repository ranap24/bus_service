import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { GuestBanner } from '@/components/HomeAuthSections';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BusConnect - Book Bus Tickets Online',
  description: 'Book bus tickets online with ease. Find routes, check schedules, and travel comfortably.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <GuestBanner />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-blue-400">🚌 BusConnect</h3>
                <p className="text-gray-400 text-sm">Your trusted partner for comfortable and affordable bus travel across the country.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/search" className="hover:text-white transition-colors">Search Buses</a></li>
                  <li><a href="/routes" className="hover:text-white transition-colors">View Routes</a></li>
                  <li><a href="/my-bookings" className="hover:text-white transition-colors">My Bookings</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Contact</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>📞 1-800-BUS-CONNECT</li>
                  <li>✉️ support@busconnect.com</li>
                  <li>⏰ 24/7 Customer Support</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} BusConnect. All rights reserved.</p>
            </div>
          </div>
        </footer>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
