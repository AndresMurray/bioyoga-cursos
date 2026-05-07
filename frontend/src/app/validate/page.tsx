'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

function ValidateContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Validando tu cuenta...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de validación no encontrado.');
      return;
    }

    const validateEmail = async () => {
      try {
        const response = await api.get(`/auth/validate?token=${token}`);
        setStatus('success');
        setMessage(response.message || '¡Tu cuenta ha sido validada con éxito!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Hubo un error al validar tu cuenta.');
      }
    };

    validateEmail();
  }, [token]);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: 'var(--radius)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
        animation: 'fadeIn 0.5s ease'
      }}>
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              border: '4px solid var(--muted)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem'
            }}></div>
            <p style={{ color: 'var(--muted-foreground)' }}>{message}</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>¡Excelente!</h2>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>{message}</p>
            <Link href="/" style={{
              padding: '1rem 2rem',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--primary)',
              color: 'white',
              fontWeight: 600,
              display: 'inline-block'
            }}>
              Ir al Inicio para entrar
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>❌</div>
            <h2 style={{ color: '#d9534f', marginBottom: '1rem' }}>Ups...</h2>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>{message}</p>
            <Link href="/" style={{
              padding: '1rem 2rem',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
              fontWeight: 600,
              display: 'inline-block'
            }}>
              Volver al Inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ValidatePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando...</div>}>
      <ValidateContent />
    </Suspense>
  );
}
