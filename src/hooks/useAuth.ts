'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'passenger' | 'admin';
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/me');
        if (!cancelled) {
          if (res.ok) {
            const data = await res.json();
            setUser(data.data);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchUser();
    return () => { cancelled = true; };
  }, [pathname]);

  return { user, loading, isLoggedIn: !!user, isAdmin: user?.role === 'admin' };
}
