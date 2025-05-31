'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout/MainLayout';

export default function Dashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('http://localhost:4000/api/me', {
        credentials: 'include',
      });
      if (!res.ok) {
        router.replace('/');
      } else {
        setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  if (checking) return null;

  return (
    <main>
      <MainLayout />
    </main>
  );
}
