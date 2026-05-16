'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { validateField } from '@/utils/validations';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onLoginSuccess?: () => void;
  contextMessage?: string;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, contextMessage }: AuthModalProps) {
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
      
      if (onLoginSuccess) {
        onClose();
        onLoginSuccess();
      } else {
        const user = await api.get('/auth/me');
        window.location.href = user.is_admin ? '/admin' : '/client';
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[420px]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-semibold text-primary mb-2">¡Bienvenido!</h2>
        <p className="text-sm text-muted-foreground">Ingresá para acceder a tus cursos</p>
      </div>

      {contextMessage && (
        <div className="mb-4 p-3 bg-primary/5 border border-primary/20 text-foreground rounded-lg text-sm text-center leading-relaxed">
          {contextMessage}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input 
          label="Email"
          type="email" 
          name="email" 
          required 
          value={formData.email} 
          onChange={handleChange} 
          error={fieldErrors.email}
        />
        
        <div className="relative">
          <Input 
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full mt-2">
          {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">¿No tenés cuenta?</span>
        <Link
          href="/register"
          onClick={onClose}
          className="ml-2 font-semibold text-primary underline hover:text-primary/80 transition-colors"
        >
          Registrate
        </Link>
      </div>
    </Modal>
  );
}
