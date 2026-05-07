'use client';

import React, { useState } from 'react';
import { useLocations } from '@/hooks/useLocations';
import { api } from '@/lib/api';
import { validateField } from '@/utils/validations';
import Link from 'next/link';
import RedirectIfLoggedIn from '@/components/auth/RedirectIfLoggedIn';

export default function RegisterPage() {
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
  } = useLocations(true, 'register');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
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
      await api.post('/auth/register', formData);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const EyeButton = () => (
    <button
      type="button"
      onClick={() => setShowPassword(v => !v)}
      className="eye-btn"
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {showPassword ? '🙈' : '👁️'}
    </button>
  );

  if (isSuccess) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="form-container" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>¡Registro casi listo!</h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Hemos enviado un mail a <strong>{formData.email}</strong>.<br />
            Por favor revisá tu bandeja de entrada para validar tu cuenta e ingresar.
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            marginTop: '2rem', padding: '1rem 2rem',
            borderRadius: 'var(--radius)', backgroundColor: 'var(--primary)',
            color: 'white', fontWeight: 600,
          }}>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem' }}>
      <RedirectIfLoggedIn />
      <div className="form-container" style={{ width: '100%', maxWidth: '800px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Crea tu cuenta
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Completá tus datos para registrarte en Centra
          </p>
        </div>

        {errorMsg && (
          <div className="form-global-error">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Nombre */}
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input name="first_name" required value={formData.first_name} onChange={handleChange} className="form-input" />
              {fieldErrors.first_name && <span className="form-error">{fieldErrors.first_name}</span>}
            </div>

            {/* Apellido */}
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input name="last_name" required value={formData.last_name} onChange={handleChange} className="form-input" />
              {fieldErrors.last_name && <span className="form-error">{fieldErrors.last_name}</span>}
            </div>

            {/* DNI */}
            <div className="form-group">
              <label className="form-label">DNI</label>
              <input name="dni" required value={formData.dni} inputMode="numeric" onChange={handleChange} className="form-input" />
              {fieldErrors.dni && <span className="form-error">{fieldErrors.dni}</span>}
            </div>

            {/* Fecha de Nacimiento */}
            <div className="form-group">
              <label className="form-label">Fecha de Nacimiento</label>
              <input type="date" name="birth_date" required value={formData.birth_date} onChange={handleChange} className="form-input" />
            </div>

            {/* Celular */}
            <div className="form-group">
              <label className="form-label">Celular</label>
              <input name="phone" required value={formData.phone} inputMode="tel" onChange={handleChange} className="form-input" />
            </div>

            {/* País */}
            <div className="form-group">
              <label className="form-label">País</label>
              <select name="country" required value={formData.country} onChange={handleCountryChange} className="form-input">
                <option value="">Selecciona un país</option>
                {countries.map(c => <option key={c.apiName} value={c.apiName}>{c.name}</option>)}
              </select>
            </div>

            {/* Provincia */}
            <div className="form-group">
              <label className="form-label">Provincia / Estado</label>
              <input
                name="province"
                list="province-list"
                required
                disabled={!formData.country}
                value={formData.province}
                onChange={handleProvinceChange}
                placeholder={loadingLocations.provinces ? 'Cargando...' : 'Escribí o seleccioná'}
                className="form-input"
              />
              <datalist id="province-list">
                {provinces.map(p => <option key={p.apiName} value={p.apiName}>{p.name}</option>)}
              </datalist>
            </div>

            {/* Ciudad */}
            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input
                name="city"
                list="city-list"
                required
                disabled={!formData.province}
                value={formData.city}
                onChange={handleChange}
                placeholder={loadingLocations.cities ? 'Cargando...' : 'Escribí o seleccioná'}
                className="form-input"
              />
              <datalist id="city-list">
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </datalist>
            </div>

            {/* Email — spans full width */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" />
              {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
            </div>

            {/* Contraseña — spans full width */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Contraseña</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingRight: '2.5rem' }}
                />
                <EyeButton />
              </div>
              {fieldErrors.password && <span className="form-error">{fieldErrors.password}</span>}
            </div>

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="form-submit-btn"
          >
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--muted-foreground)' }}>¿Ya tenés cuenta?</span>
          <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600, marginLeft: '0.5rem', textDecoration: 'underline' }}>
            Ir al inicio para iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
