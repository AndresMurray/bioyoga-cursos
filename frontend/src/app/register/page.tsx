'use client';

import React, { useState } from 'react';
import { useLocations } from '@/hooks/useLocations';
import { api } from '@/lib/api';
import { validateField } from '@/utils/validations';
import Link from 'next/link';
import RedirectIfLoggedIn from '@/components/auth/RedirectIfLoggedIn';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

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

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center p-4">
        <Card className="max-w-md w-full text-center p-8 animate-fade shadow-xl">
          <div className="text-6xl mb-6">📧</div>
          <h2 className="text-3xl font-bold text-primary mb-4">¡Registro casi listo!</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Hemos enviado un mail a <strong>{formData.email}</strong>.<br />
            Por favor revisá tu bandeja de entrada para validar tu cuenta e ingresar.
          </p>
          <Link href="/">
            <Button size="lg" className="w-full">
              Volver al inicio
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex justify-center items-center py-16 px-4 bg-background">
      <RedirectIfLoggedIn />
      <Card className="w-full max-w-3xl shadow-xl animate-fade">
        <CardContent className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary mb-2">Crea tu cuenta</h2>
            <p className="text-muted-foreground">Completá tus datos para registrarte en BioYoga</p>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nombre" name="first_name" required value={formData.first_name} onChange={handleChange} error={fieldErrors.first_name} />
              <Input label="Apellido" name="last_name" required value={formData.last_name} onChange={handleChange} error={fieldErrors.last_name} />
              <Input label="DNI" name="dni" required value={formData.dni} inputMode="numeric" onChange={handleChange} error={fieldErrors.dni} />
              <Input label="Fecha de Nacimiento" type="date" name="birth_date" required value={formData.birth_date} onChange={handleChange} />
              <Input label="Celular" name="phone" required value={formData.phone} inputMode="tel" onChange={handleChange} />
              
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-foreground">País</label>
                <select 
                  name="country" 
                  required 
                  value={formData.country} 
                  onChange={handleCountryChange} 
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary disabled:opacity-50"
                >
                  <option value="">Selecciona un país</option>
                  {countries.map(c => <option key={c.apiName} value={c.apiName}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-foreground">Provincia / Estado</label>
                <input
                  name="province"
                  list="province-list"
                  required
                  disabled={!formData.country}
                  value={formData.province}
                  onChange={handleProvinceChange}
                  placeholder={loadingLocations.provinces ? 'Cargando...' : 'Escribí o seleccioná'}
                  className={cn(
                    "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary disabled:opacity-50 disabled:cursor-not-allowed",
                    !formData.country && "bg-muted"
                  )}
                />
                <datalist id="province-list">
                  {provinces.map(p => <option key={p.apiName} value={p.apiName}>{p.name}</option>)}
                </datalist>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-foreground">Ciudad</label>
                <input
                  name="city"
                  list="city-list"
                  required
                  disabled={!formData.province}
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={loadingLocations.cities ? 'Cargando...' : 'Escribí o seleccioná'}
                  className={cn(
                    "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary disabled:opacity-50 disabled:cursor-not-allowed",
                    !formData.province && "bg-muted"
                  )}
                />
                <datalist id="city-list">
                  {cities.map(city => <option key={city} value={city}>{city}</option>)}
                </datalist>
              </div>

              <div className="md:col-span-2">
                <Input label="Email" type="email" name="email" required value={formData.email} onChange={handleChange} error={fieldErrors.email} />
              </div>

              <div className="md:col-span-2 relative">
                <Input 
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={6}
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
            </div>

            <Button type="submit" size="lg" disabled={isLoading} className="w-full mt-6 text-lg">
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">¿Ya tenés cuenta?</span>
            <Link href="/" className="ml-2 font-semibold text-primary underline hover:text-primary/80 transition-colors">
              Ir al inicio para iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
