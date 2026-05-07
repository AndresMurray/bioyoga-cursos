import { useState, useEffect } from 'react';

interface Location {
  name: string;
  apiName: string;
  id?: string; // For Argentina API
}

export const useLocations = (isOpen: boolean, mode: string) => {
  const [countries, setCountries] = useState<Location[]>([]);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState({ countries: false, provinces: false, cities: false });

  const countryTranslations: Record<string, string> = {
    'Argentina': 'Argentina',
    'Spain': 'España',
    'Mexico': 'México',
    'Chile': 'Chile',
    'Uruguay': 'Uruguay',
    'Colombia': 'Colombia',
    'Peru': 'Perú',
    'Brazil': 'Brasil',
    'United States': 'Estados Unidos'
  };

  useEffect(() => {
    if (isOpen && mode === 'register' && countries.length === 0) {
      setLoading(prev => ({ ...prev, countries: true }));
      fetch('https://countriesnow.space/api/v0.1/countries')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            const mapped = data.data.map((c: any) => ({
              name: countryTranslations[c.country] || c.country,
              apiName: c.country
            })).sort((a: any, b: any) => a.name.localeCompare(b.name));
            setCountries(mapped);
          }
          setLoading(prev => ({ ...prev, countries: false }));
        })
        .catch(() => setLoading(prev => ({ ...prev, countries: false })));
    }
  }, [isOpen, mode, countries.length]);

  const fetchProvinces = async (countryApiName: string) => {
    setProvinces([]);
    setCities([]);
    if (!countryApiName) return;

    setLoading(prev => ({ ...prev, provinces: true }));

    // SPECIAL CASE: ARGENTINA (Better API)
    if (countryApiName === 'Argentina') {
      try {
        const res = await fetch('https://apis.datos.gob.ar/georef/api/provincias');
        const data = await res.json();
        const mapped = data.provincias.map((p: any) => ({
          name: p.nombre === 'Ciudad Autónoma de Buenos Aires' ? 'CABA' : p.nombre,
          apiName: p.nombre,
          id: p.id
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
        setProvinces(mapped);
        setLoading(prev => ({ ...prev, provinces: false }));
        return;
      } catch (e) {
        // Fallback to CountriesNow if Argentina API fails
      }
    }

    // Default API: CountriesNow
    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryApiName })
      });
      const data = await res.json();
      if (!data.error) {
        const mapped = data.data.states.map((s: any) => {
          let cleanName = s.name;
          if (cleanName.includes('Autonomous City of')) cleanName = 'CABA';
          else {
            cleanName = cleanName.replace(' Province', '').replace(' State', '').replace(' Department', '');
          }
          return { name: cleanName, apiName: s.name };
        }).sort((a: any, b: any) => a.name.localeCompare(b.name));
        setProvinces(mapped);
      }
    } catch (e) {}
    setLoading(prev => ({ ...prev, provinces: false }));
  };

  const fetchCities = async (countryApiName: string, stateApiName: string, stateId?: string) => {
    setCities([]);
    if (!stateApiName) return;

    setLoading(prev => ({ ...prev, cities: true }));

    // SPECIAL CASE: ARGENTINA (Better API)
    if (countryApiName === 'Argentina' && stateId) {
      try {
        // We use 'municipios' or 'localidades'
        const endpoint = stateApiName.includes('Ciudad Autónoma') 
          ? `https://apis.datos.gob.ar/georef/api/localidades?provincia=${stateId}&max=500`
          : `https://apis.datos.gob.ar/georef/api/municipios?provincia=${stateId}&max=500`;
          
        const res = await fetch(endpoint);
        const data = await res.json();
        const results = stateApiName.includes('Ciudad Autónoma') ? data.localidades : data.municipios;
        setCities(results.map((m: any) => m.nombre).sort());
        setLoading(prev => ({ ...prev, cities: false }));
        return;
      } catch (e) {}
    }

    // Default API: CountriesNow
    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryApiName, state: stateApiName })
      });
      const data = await res.json();
      if (!data.error) {
        setCities(data.data.sort());
      }
    } catch (e) {}
    setLoading(prev => ({ ...prev, cities: false }));
  };

  return {
    countries,
    provinces,
    cities,
    loading,
    fetchProvinces,
    fetchCities
  };
};
