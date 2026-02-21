'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

function ProfileContent() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
          setFormData({ name: data.data.name, phone: data.data.phone || '' });
        }
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
        setEditing(false);
        toast.success('Profile updated successfully! ✅');
      } else {
        toast.error('Update failed. Please try again.');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('You have been logged out. See you soon! 👋');
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">👤</div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl font-bold backdrop-blur-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-blue-100">{user.email}</p>
          <span className="inline-flex items-center gap-1 mt-3 bg-white/20 text-white px-3 py-1 rounded-full text-sm">
            {user.role === 'admin' ? '🛡️ Admin' : '🎫 Passenger'}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/my-bookings" className="card p-4 text-center hover:border-blue-200 transition-all">
            <div className="text-2xl mb-2">🎫</div>
            <p className="text-sm font-medium text-gray-700">My Bookings</p>
          </Link>
          <Link href="/search" className="card p-4 text-center hover:border-blue-200 transition-all">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-sm font-medium text-gray-700">Search Buses</p>
          </Link>
          {user.role === 'admin' && (
            <Link href="/admin" className="card p-4 text-center hover:border-blue-200 transition-all">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="text-sm font-medium text-gray-700">Admin Panel</p>
            </Link>
          )}
          <button onClick={handleLogout} className="card p-4 text-center hover:border-red-200 transition-all">
            <div className="text-2xl mb-2">🚪</div>
            <p className="text-sm font-medium text-red-600">Logout</p>
          </button>
        </div>

        {/* Profile Details */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-secondary text-sm px-4 py-2">
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary text-sm px-4 py-2">
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="label">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                />
              ) : (
                <p className="text-gray-900 font-medium py-3 px-4 bg-gray-50 rounded-lg">{user.name}</p>
              )}
            </div>

            <div>
              <label className="label">Email Address</label>
              <p className="text-gray-900 font-medium py-3 px-4 bg-gray-50 rounded-lg">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="label">Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field"
                  placeholder="9800000100"
                />
              ) : (
                <p className="text-gray-900 font-medium py-3 px-4 bg-gray-50 rounded-lg">
                  {user.phone || <span className="text-gray-400 italic">Not provided</span>}
                </p>
              )}
            </div>

            <div>
              <label className="label">Account Role</label>
              <p className="text-gray-900 font-medium py-3 px-4 bg-gray-50 rounded-lg capitalize">{user.role}</p>
            </div>

            <div>
              <label className="label">Member Since</label>
              <p className="text-gray-900 font-medium py-3 px-4 bg-gray-50 rounded-lg">
                {new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
