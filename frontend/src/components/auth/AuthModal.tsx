import React, { useState } from 'react';
import { useLocations } from '@/hooks/useLocations';
import { api } from '@/lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, initialMode }: AuthModalProps) => {
  const [mode, setMode] = useState(initialMode);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { 
    countries, 
    provinces, 
    cities, 
    loading: loadingLocations, 
    fetchProvinces, 
    fetchCities 
  } = useLocations(isOpen, mode);

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
    city: ''
  });

  if (!isOpen) return null;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryApiName = e.target.value;
    const countryDisplayName = countries.find(c => c.apiName === countryApiName)?.name || countryApiName;
    
    setFormData({ ...formData, country: countryApiName, province: '', city: '' });
    fetchProvinces(countryApiName);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceApiName = e.target.value;
    const selectedProvince = provinces.find(p => p.apiName === provinceApiName);
    
    setFormData({ ...formData, province: provinceApiName, city: '' });
    fetchCities(formData.country, provinceApiName, selectedProvince?.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setErrorMsg(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          width: '95%',
          maxWidth: mode === 'register' ? '800px' : '400px',
          padding: '2.5rem',
          animation: 'fadeIn 0.3s ease forwards',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>¡Registro casi listo!</h2>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Hemos enviado un mail a <strong>{formData.email}</strong>. 
              Por favor revisa tu bandeja de entrada para validar tu cuenta e ingresar.
            </p>
            <button 
              onClick={onClose}
              style={{
                marginTop: '2rem',
                padding: '1rem 2rem',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontWeight: 600
              }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {mode === 'login' ? '¡Bienvenido!' : 'Crea tu cuenta'}
              </h2>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                {mode === 'login' ? 'Ingresa para acceder a tus cursos' : 'Completa tus datos para registrarte'}
              </p>
            </div>

            {errorMsg && (
              <div style={{ 
                padding: '0.8rem', 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                borderRadius: '0.8rem', 
                fontSize: '0.85rem',
                textAlign: 'center'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {mode === 'register' ? (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '1.5rem' 
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Nombre</label>
                    <input name="first_name" required onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Apellido</label>
                    <input name="last_name" required onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>DNI</label>
                    <input name="dni" required onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Fecha de Nacimiento</label>
                    <input type="date" name="birth_date" required onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Celular</label>
                    <input name="phone" required onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>País</label>
                    <select name="country" required value={formData.country} onChange={handleCountryChange} style={inputStyle}>
                      <option value="">Selecciona un país</option>
                      {countries.map(c => <option key={c.apiName} value={c.apiName}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Provincia / Estado</label>
                    <input 
                      name="province" 
                      list="province-list"
                      required 
                      disabled={!formData.country} 
                      value={formData.province} 
                      onChange={handleProvinceChange} 
                      placeholder={loadingLocations.provinces ? 'Cargando...' : 'Escribe o selecciona'}
                      style={{...inputStyle, opacity: !formData.country ? 0.6 : 1}}
                    />
                    <datalist id="province-list">
                      {provinces.map(p => <option key={p.apiName} value={p.apiName}>{p.name}</option>)}
                    </datalist>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Ciudad</label>
                    <input 
                      name="city" 
                      list="city-list"
                      required 
                      disabled={!formData.province} 
                      value={formData.city} 
                      onChange={handleChange} 
                      placeholder={loadingLocations.cities ? 'Cargando...' : 'Escribe o selecciona'}
                      style={{...inputStyle, opacity: !formData.province ? 0.6 : 1}}
                    />
                    <datalist id="city-list">
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </datalist>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Email</label>
                    <input type="email" name="email" required onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Contraseña</label>
                    <input type="password" name="password" required onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
                    <input type="email" name="email" required onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Contraseña</label>
                    <input type="password" name="password" required onChange={handleChange} style={inputStyle} />
                  </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px 0 rgba(248, 180, 166, 0.39)',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Cargando...' : (mode === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
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
          </>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '0.8rem',
  border: '1px solid var(--border)',
  outline: 'none',
  background: 'var(--background)',
  fontSize: '0.9rem',
  width: '100%'
};

export default AuthModal;
