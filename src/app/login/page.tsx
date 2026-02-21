'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Welcome back, ${data.data.name}! 👋`);
        router.push(redirect);
        router.refresh();
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-700 mb-6">
              <span>🚌</span> BusConnect
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm font-medium text-blue-800 mb-2">Demo accounts:</p>
              <button
                type="button"
                onClick={() => { setEmail('john@example.com'); setPassword('password123'); }}
                className="block text-sm text-blue-600 hover:underline mb-1"
              >
                👤 john@example.com / password123
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@busservice.com'); setPassword('admin123'); }}
                className="block text-sm text-blue-600 hover:underline"
              >
                🔑 admin@busservice.com / admin123
              </button>
            </div>

            <p className="text-center text-gray-500 mt-6 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 font-medium hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="text-8xl mb-8">🚌</div>
          <h2 className="text-3xl font-bold mb-4">Travel with Ease</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Book comfortable bus tickets to hundreds of destinations. Fast, reliable, and affordable.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: '🎫', label: 'Instant E-Tickets' },
              { icon: '💺', label: 'Seat Selection' },
              { icon: '🔄', label: 'Easy Cancellation' },
              { icon: '📞', label: '24/7 Support' },
            ].map(item => (
              <div key={item.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
