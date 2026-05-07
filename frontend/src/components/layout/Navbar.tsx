'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthModal from '../auth/AuthModal';
import { api } from '@/lib/api';

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
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/" className="navbar-logo">
            CENTRA
          </Link>

          <div className="navbar-links">
            {/* Show common links if not logged in */}
            {!user && (
              <>
                <Link href="/" className="navbar-link">Inicio</Link>
                <Link href="/#sobre-mi" className="navbar-link">Sobre Mí</Link>
                <Link href="/#cursos" className="navbar-link">Cursos</Link>
              </>
            )}

            {/* If logged in, show their respective dashboard link */}
            {user && !user.is_admin && (
              <Link href="/client" className="navbar-link">Mis Cursos</Link>
            )}

            {user && user.is_admin && (
              <>
                <Link href="/admin" className="navbar-link">Panel Admin</Link>
              </>
            )}
            
            <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {isLoadingUser ? (
                <div style={{ width: '100px' }}></div> // Spacer
              ) : user ? (
                <>
                  <span style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                    Hola, {user.first_name}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="btn-outline"
                    style={{ borderColor: '#dc2626', color: '#dc2626' }}
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setAuthModal(true)}
                    className="btn-outline"
                  >
                    Iniciar Sesión
                  </button>
                  <Link 
                    href="/register"
                    className="btn-primary"
                  >
                    Registrarse
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
