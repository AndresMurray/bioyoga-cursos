'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token, redirect to home with login modal open
        router.push('/?login=true');
        return;
      }

      try {
        // Verify token by fetching user profile
        // Since api.get doesn't automatically attach the token, we need to make sure the api utility supports passing headers or we can use fetch directly.
        // Wait, the `api` utility in `src/lib/api.ts` currently doesn't send the Authorization header! 
        // We need to update `api.ts` to attach the token.
        
        const response = await api.get('/auth/me');
        
        // Check admin role if required
        if (requireAdmin && !response.is_admin) {
          router.push('/client'); // Redirect clients trying to access admin
          return;
        }

        // Check if admin is trying to access a client route
        if (!requireAdmin && response.is_admin) {
          router.push('/admin'); // Redirect admins trying to access client
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        router.push('/?login=true');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requireAdmin]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <p style={{ color: 'var(--muted-foreground)' }}>Cargando...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
