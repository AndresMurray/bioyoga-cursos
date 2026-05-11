'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthModal from '../auth/AuthModal';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

const Navbar = () => {
  const [authModal, setAuthModal] = useState(false);
  const [user, setUser] = useState<{ is_admin: boolean; first_name: string } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setIsLoadingUser(false));
    } else {
      setIsLoadingUser(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center font-outfit text-2xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity h-20">
            <img src="/logo.png" alt="Centra Logo" className="h-16 w-auto object-contain mx-2" style={{ display: 'block' }} />
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              {/* Show common links if not logged in */}
              {!user && (
                <>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
                  <Link href="/#sobre-mi" className="text-muted-foreground hover:text-foreground transition-colors">Sobre Mí</Link>
                  <Link href="/#cursos" className="text-muted-foreground hover:text-foreground transition-colors">Cursos</Link>
                </>
              )}

              {/* If logged in, show their respective dashboard link */}
              {user && !user.is_admin && (
                <Link href="/client" className="text-muted-foreground hover:text-foreground transition-colors">Mis Cursos</Link>
              )}

              {user && user.is_admin && (
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-semibold">Panel Admin</Link>
              )}
            </div>
            
            <div className="flex items-center gap-3 border-l border-border pl-6 ml-2">
              {isLoadingUser ? (
                <div className="w-24 h-8 animate-pulse bg-muted rounded-lg"></div>
              ) : user ? (
                <>
                  <span className="text-sm font-medium text-foreground hidden sm:inline-block">
                    Hola, {user.first_name}
                  </span>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setAuthModal(true)}
                  >
                    Iniciar Sesión
                  </Button>
                  <Link href="/register">
                    <Button size="sm">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={authModal} 
        onClose={() => setAuthModal(false)} 
      />
    </>
  );
};

export default Navbar;
