'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getToken, clearToken, setUser, type AdminUser } from '@/lib/api';

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    api<{ user: AdminUser }>('/api/auth/me')
      .then((r) => {
        setUser(r.user);
        setReady(true);
      })
      .catch(() => {
        clearToken();
        router.replace('/login');
      });
  }, [router]);

  if (!ready) {
    return (
      <div style={{ padding: 40 }} className="muted">Yuklanmoqda...</div>
    );
  }
  return <>{children}</>;
}
