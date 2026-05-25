'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const Navbar = () => {
  const [authModal, setAuthModal] = useState(false);
  const { user, loading: isLoadingUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="sticky top-4 z-40 w-[calc(100%-2rem)] max-w-6xl mx-auto rounded-full border border-white/50 bg-white/40 backdrop-blur-lg shadow-md px-6 transition-all duration-300">
        <div className="flex h-16 items-center justify-between w-full">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img 
              src="/logo-sin-fondo.png" 
              alt="BioYoga Consciente" 
              className="h-12 w-12 mr-2 object-contain" 
            />
            <span className="font-sans text-2xl font-light text-[#3d312a] flex flex-col sm:flex-row sm:items-baseline leading-none">
              <span className="font-extrabold tracking-tight text-[#3d312a]">BioYoga</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#6c9e9b] sm:ml-2 mt-0.5 sm:mt-0">Consciente</span>
            </span>
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
