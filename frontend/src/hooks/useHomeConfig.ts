import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface HomeConfig {
  id: number;
  hero_title: string;
  hero_subtitle_1: string;
  hero_subtitle_2: string;
  hero_image_url: string;
  whatsapp_number: string;
}

export function useHomeConfig() {
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/home-config');
      setConfig(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la configuración de la Home');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = async (updateData: Partial<HomeConfig>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.put('/home-config', updateData);
      setConfig(data);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la configuración');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { config, loading, error, fetchConfig, updateConfig };
}
