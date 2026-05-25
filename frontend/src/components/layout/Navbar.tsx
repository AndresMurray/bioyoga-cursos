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
            <svg className="h-11 w-11 mr-2" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <defs>
                <linearGradient id="tealGradTop" x1="20" y1="10" x2="60" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#b7dada" stopOpacity="0.95"/>
                  <stop offset="100%" stopColor="#8bbab7" stopOpacity="0.7"/>
                </linearGradient>
                <linearGradient id="tealGradBottom" x1="30" y1="50" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6c9e9b" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#b7dada" stopOpacity="0.4"/>
                </linearGradient>
              </defs>
              
              <path d="M 25,30 C 20,10 60,10 55,30 C 50,45 30,40 25,30 Z" fill="url(#tealGradTop)" />
              <path d="M 30,12 C 45,10 58,25 54,38 C 45,55 20,40 30,12 Z" fill="url(#tealGradTop)" opacity="0.6" />
              
              <path d="M 35,65 C 30,85 70,85 85,65 C 65,50 40,55 35,65 Z" fill="url(#tealGradBottom)" />
              <path d="M 40,58 C 50,55 80,62 82,75 C 75,90 40,82 40,58 Z" fill="url(#tealGradBottom)" opacity="0.5" />

              <path d="M 54,12 C 54,20 40,30 35,38 C 28,47 16,68 16,72" stroke="#3d312a" strokeWidth="3" strokeLinecap="round" />
              <path d="M 35,38 C 45,43 55,58 55,75" stroke="#3d312a" strokeWidth="3" strokeLinecap="round" />
              
              <path d="M 40,49 L 52,65" stroke="#3d312a" strokeWidth="2.5" strokeLinecap="round" />
              
              <path d="M 64,38 C 61,38 58,41 58,45 C 58,49 61,52 64,52 C 62,50 61,48 61,45 C 61,42 62,40 64,38 Z" fill="#3d312a" />
              
              <path d="M 54,12 L 56,36" stroke="#3d312a" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
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
