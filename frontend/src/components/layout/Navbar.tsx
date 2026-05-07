'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthModal from '../auth/AuthModal';

const Navbar = () => {
  const [authModal, setAuthModal] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/" className="navbar-logo">
            CENTRA
          </Link>

          <div className="navbar-links">
            <Link href="/" className="navbar-link">Inicio</Link>
            <Link href="/client" className="navbar-link">Mis Cursos</Link>
            <Link href="/admin" className="navbar-link">Admin</Link>
            <Link href="/#sobre-mi" className="navbar-link">Sobre Mí</Link>
            <Link href="/#cursos" className="navbar-link">Cursos</Link>
            
            <div className="navbar-actions">
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
