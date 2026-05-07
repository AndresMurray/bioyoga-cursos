'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthModal from '../auth/AuthModal';

const Navbar = () => {
  const [authModal, setAuthModal] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({
    isOpen: false,
    mode: 'login'
  });

  const openAuth = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode });
  };

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 250, 245, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '-0.5px'
          }}>
            CENTRA
          </Link>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/" style={{ fontWeight: 500 }}>Inicio</Link>
            <Link href="#sobre-mi" style={{ fontWeight: 500 }}>Sobre Mí</Link>
            <Link href="#cursos" style={{ fontWeight: 500 }}>Cursos</Link>
            
            <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
              <button 
                onClick={() => openAuth('login')}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  fontWeight: 500
                }}
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => openAuth('register')}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontWeight: 500,
                  boxShadow: '0 4px 14px 0 rgba(248, 180, 166, 0.39)'
                }}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        initialMode={authModal.mode} 
      />
    </>
  );
};

export default Navbar;
