'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { validateField } from '@/utils/validations';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Kept initialMode prop for backward compatibility, but it will always act as Login
  initialMode?: 'login' | 'register'; 
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasErrors = Object.values(fieldErrors).some(err => err !== '');
    if (hasErrors) {
      setErrorMsg('Por favor, corrige los errores indicados antes de continuar.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', { email: formData.email, password: formData.password });
      localStorage.setItem('token', response.access_token);
      
      // Fetch user profile to know if they are an admin
      const user = await api.get('/auth/me');
      window.location.href = user.is_admin ? '/admin' : '/client';
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(74, 63, 53, 0.4)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000, backdropFilter: 'blur(4px)',
      }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="form-container" style={{ width: '95%', maxWidth: '420px', margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            ¡Bienvenido!
          </h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
            Ingresá para acceder a tus cursos
          </p>
        </div>

        {errorMsg && (
          <div className="form-global-error">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" />
            {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="eye-btn"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && <span className="form-error">{fieldErrors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="form-submit-btn"
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--muted-foreground)' }}>¿No tenés cuenta?</span>
          <Link
            href="/register"
            onClick={onClose}
            style={{ background: 'none', color: 'var(--primary)', fontWeight: 600, marginLeft: '0.5rem', textDecoration: 'underline' }}
          >
            Registrate
          </Link>
        </div>
      </div>
    </div>
  );
}
