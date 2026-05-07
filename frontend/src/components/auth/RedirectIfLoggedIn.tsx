'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function RedirectIfLoggedIn() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await api.get('/auth/me');
          if (user.is_admin) {
            router.push('/admin');
          } else {
            router.push('/client');
          }
        } catch (error) {
          // Token is invalid, let them stay on the home page
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, [router]);

  return null;
}
