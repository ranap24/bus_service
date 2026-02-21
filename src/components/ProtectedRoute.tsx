'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, only admins are allowed */
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      toast.error('Please log in to access this page', { id: 'auth-required' });
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (adminOnly && !isAdmin) {
      toast.error('You do not have permission to access this page', { id: 'admin-required' });
      router.push('/');
    }
  }, [loading, isLoggedIn, isAdmin, adminOnly, router, pathname]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚌</div>
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in — show inline gate instead of blank page during redirect
  if (!isLoggedIn) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <div className="text-6xl mb-5">🔐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h2>
            <p className="text-gray-500 mb-8">
              You need to be logged in to view this page. Please sign in to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="btn-primary"
              >
                Sign In
              </Link>
              <Link href="/register" className="btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin-only gate
  if (adminOnly && !isAdmin) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <div className="text-6xl mb-5">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
            <p className="text-gray-500 mb-8">
              This page is restricted to administrators only.
            </p>
            <Link href="/" className="btn-primary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
