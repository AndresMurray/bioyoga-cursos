'use client';

import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, initialMode }: AuthModalProps) => {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(74, 63, 53, 0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius)',
          width: '90%',
          maxWidth: '400px',
          padding: '2.5rem',
          animation: 'fadeIn 0.3s ease forwards',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            {mode === 'login' ? '¡Bienvenido!' : 'Crea tu cuenta'}
          </h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
            {mode === 'login' ? 'Ingresa para acceder a tus cursos' : 'Únete a nuestra comunidad de aprendizaje'}
          </p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Nombre Completo</label>
              <input type="text" placeholder="Ej: Maria Perez" style={{
                padding: '0.8rem 1rem',
                borderRadius: '0.8rem',
                border: '1px solid var(--border)',
                outline: 'none',
                background: 'var(--background)'
              }} />
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
            <input type="email" placeholder="tu@email.com" style={{
              padding: '0.8rem 1rem',
              borderRadius: '0.8rem',
              border: '1px solid var(--border)',
              outline: 'none',
              background: 'var(--background)'
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Contraseña</label>
            <input type="password" placeholder="••••••••" style={{
              padding: '0.8rem 1rem',
              borderRadius: '0.8rem',
              border: '1px solid var(--border)',
              outline: 'none',
              background: 'var(--background)'
            }} />
          </div>

          <button type="submit" style={{
            marginTop: '0.5rem',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--primary)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 14px 0 rgba(248, 180, 166, 0.39)'
          }}>
            {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--muted-foreground)' }}>
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </span>
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ 
              background: 'none', 
              color: 'var(--primary)', 
              fontWeight: 600, 
              marginLeft: '0.5rem',
              textDecoration: 'underline'
            }}
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
