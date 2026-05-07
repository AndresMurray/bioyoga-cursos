'use client';

import React, { useState } from 'react';
import { useLocations } from '@/hooks/useLocations';
import { api } from '@/lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
}

const inputStyle: React.CSSProperties = {
  padding: '0.8rem 1rem',
  borderRadius: '0.8rem',
  border: '1px solid var(--border)',
  outline: 'none',
  background: 'var(--background)',
  fontSize: '0.9rem',
  width: '100%',
  boxSizing: 'border-box',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 500,
};

const errorSpanStyle: React.CSSProperties = {
  color: '#dc2626',
  fontSize: '0.75rem',
};

// ─────────────────────────────────────────────
//  AuthModal
// ─────────────────────────────────────────────
const AuthModal = ({ isOpen, onClose, initialMode }: AuthModalProps) => {
  // All hooks at the top — no early returns before this block
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    dni: '',
    birth_date: '',
    phone: '',
    country: '',
    province: '',
    city: '',
  });

  const {
    countries,
    provinces,
    cities,
    loading: loadingLocations,
    fetchProvinces,
    fetchCities,
  } = useLocations(isOpen, mode);

  // ── Validation ──────────────────────────────
  const validateField = (name: string, value: string): string => {
    if (value.trim() === '') return ''; // empty fields handled by 'required' attribute

    switch (name) {
      case 'dni':
        if (!/^\d+$/.test(value)) return 'El DNI debe contener solo números.';
        if (value.length < 7 || value.length > 10) return 'El DNI debe tener entre 7 y 10 dígitos.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'El email no tiene un formato válido.';
        break;
      case 'password':
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
        break;
    }
    return '';
  };

  // ── Handlers ────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg(''); // clear global error when user starts typing
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryApiName = e.target.value;
    setFormData(prev => ({ ...prev, country: countryApiName, province: '', city: '' }));
    setFieldErrors(prev => ({ ...prev, country: '', province: '', city: '' }));
    fetchProvinces(countryApiName);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const provinceApiName = e.target.value;
    const selectedProvince = provinces.find(p => p.apiName === provinceApiName);
    setFormData(prev => ({ ...prev, province: provinceApiName, city: '' }));
    setFieldErrors(prev => ({ ...prev, province: '', city: '' }));
    fetchCities(formData.country, provinceApiName, selectedProvince?.id);
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
      if (mode === 'register') {
        await api.post('/auth/register', formData);
        setIsSuccess(true);
      } else {
        const response = await api.post('/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', response.access_token);
        window.location.href = response.is_admin ? '/admin' : '/client';
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Early return AFTER all hooks ─────────────
  if (!isOpen) return null;

  // ── Eye-toggle button ────────────────────────
  const EyeButton = () => (
    <button
      type="button"
      onClick={() => setShowPassword(v => !v)}
      style={{
        position: 'absolute',
        right: '0.8rem',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--muted-foreground)',
        display: 'flex',
        alignItems: 'center',
        fontSize: '1rem',
      }}
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {showPassword ? '🙈' : '👁️'}
    </button>
  );

  // ── Render ───────────────────────────────────
  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(74, 63, 53, 0.4)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000, backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius)',
          width: '95%',
          maxWidth: mode === 'register' ? '800px' : '420px',
          padding: '2.5rem',
          animation: 'fadeIn 0.3s ease forwards',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Success screen ── */}
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>¡Registro casi listo!</h2>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Hemos enviado un mail a <strong>{formData.email}</strong>.{' '}
              Por favor revisá tu bandeja de entrada para validar tu cuenta e ingresar.
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: '2rem', padding: '1rem 2rem',
                borderRadius: 'var(--radius)', backgroundColor: 'var(--primary)',
                color: 'white', fontWeight: 600,
              }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {/* ── Title ── */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {mode === 'login' ? '¡Bienvenido!' : 'Crea tu cuenta'}
              </h2>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                {mode === 'login' ? 'Ingresá para acceder a tus cursos' : 'Completá tus datos para registrarte'}
              </p>
            </div>

            {/* ── Global error ── */}
            {errorMsg && (
              <div style={{
                padding: '0.8rem', backgroundColor: '#fee2e2', color: '#dc2626',
                borderRadius: '0.8rem', fontSize: '0.85rem', textAlign: 'center',
                marginBottom: '1rem',
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              {/* ══ REGISTER FIELDS ══ */}
              {mode === 'register' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

                  {/* Nombre */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Nombre</label>
                    <input name="first_name" required value={formData.first_name} onChange={handleChange} style={inputStyle} />
                    {fieldErrors.first_name && <span style={errorSpanStyle}>{fieldErrors.first_name}</span>}
                  </div>

                  {/* Apellido */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Apellido</label>
                    <input name="last_name" required value={formData.last_name} onChange={handleChange} style={inputStyle} />
                    {fieldErrors.last_name && <span style={errorSpanStyle}>{fieldErrors.last_name}</span>}
                  </div>

                  {/* DNI */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>DNI</label>
                    <input name="dni" required value={formData.dni} inputMode="numeric" onChange={handleChange} style={inputStyle} />
                    {fieldErrors.dni && <span style={errorSpanStyle}>{fieldErrors.dni}</span>}
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Fecha de Nacimiento</label>
                    <input type="date" name="birth_date" required value={formData.birth_date} onChange={handleChange} style={inputStyle} />
                  </div>

                  {/* Celular */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Celular</label>
                    <input name="phone" required value={formData.phone} inputMode="tel" onChange={handleChange} style={inputStyle} />
                  </div>

                  {/* País */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>País</label>
                    <select name="country" required value={formData.country} onChange={handleCountryChange} style={inputStyle}>
                      <option value="">Selecciona un país</option>
                      {countries.map(c => <option key={c.apiName} value={c.apiName}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Provincia */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Provincia / Estado</label>
                    <input
                      name="province"
                      list="province-list"
                      required
                      disabled={!formData.country}
                      value={formData.province}
                      onChange={handleProvinceChange}
                      placeholder={loadingLocations.provinces ? 'Cargando...' : 'Escribí o seleccioná'}
                      style={{ ...inputStyle, opacity: !formData.country ? 0.6 : 1 }}
                    />
                    <datalist id="province-list">
                      {provinces.map(p => <option key={p.apiName} value={p.apiName}>{p.name}</option>)}
                    </datalist>
                  </div>

                  {/* Ciudad */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Ciudad</label>
                    <input
                      name="city"
                      list="city-list"
                      required
                      disabled={!formData.province}
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={loadingLocations.cities ? 'Cargando...' : 'Escribí o seleccioná'}
                      style={{ ...inputStyle, opacity: !formData.province ? 0.6 : 1 }}
                    />
                    <datalist id="city-list">
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </datalist>
                  </div>

                  {/* Email — spans full width */}
                  <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} style={inputStyle} />
                    {fieldErrors.email && <span style={errorSpanStyle}>{fieldErrors.email}</span>}
                  </div>

                  {/* Contraseña — spans full width */}
                  <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={handleChange}
                        style={{ ...inputStyle, paddingRight: '2.5rem' }}
                      />
                      <EyeButton />
                    </div>
                    {fieldErrors.password && <span style={errorSpanStyle}>{fieldErrors.password}</span>}
                  </div>

                </div>
              ) : (
                /* ══ LOGIN FIELDS ══ */
                <>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} style={inputStyle} />
                    {fieldErrors.email && <span style={errorSpanStyle}>{fieldErrors.email}</span>}
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        style={{ ...inputStyle, paddingRight: '2.5rem' }}
                      />
                      <EyeButton />
                    </div>
                    {fieldErrors.password && <span style={errorSpanStyle}>{fieldErrors.password}</span>}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: '0.5rem', padding: '1rem',
                  borderRadius: 'var(--radius)', backgroundColor: 'var(--primary)',
                  color: 'white', fontWeight: 600, fontSize: '1rem',
                  boxShadow: '0 4px 14px 0 rgba(248, 180, 166, 0.39)',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? 'Cargando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--muted-foreground)' }}>
                {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
              </span>
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrorMsg(''); setFieldErrors({}); }}
                style={{ background: 'none', color: 'var(--primary)', fontWeight: 600, marginLeft: '0.5rem', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {mode === 'login' ? 'Registrate' : 'Iniciá Sesión'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
