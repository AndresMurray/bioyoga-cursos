'use client';

import React, { useState, useEffect } from 'react';
import { useHomeConfig } from '@/hooks/useHomeConfig';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function HomeConfigForm() {
  const { config, loading: configLoading, fetchConfig, updateConfig } = useHomeConfig();

  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle_1: '',
    hero_subtitle_2: '',
    hero_image_url: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      setFormData({
        hero_title: config.hero_title,
        hero_subtitle_1: config.hero_subtitle_1,
        hero_subtitle_2: config.hero_subtitle_2,
        hero_image_url: config.hero_image_url
      });
      setImagePreview(config.hero_image_url);
    }
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      let finalImageUrl = formData.hero_image_url;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const response = await api.upload('/uploads/image', uploadData);
        finalImageUrl = response.url;
      }

      const success = await updateConfig({
        ...formData,
        hero_image_url: finalImageUrl
      });

      if (success) {
        setMessage({ text: 'Configuración guardada correctamente.', type: 'success' });
        setImageFile(null); // Reset file selection after successful upload
      } else {
        setMessage({ text: 'Error al guardar la configuración.', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Ocurrió un error inesperado.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (configLoading && !config) {
    return <div className="p-8 text-center text-muted-foreground">Cargando configuración...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-8 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Configuración de la Sección "Sobre Mí"</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Foto Principal</label>
          <div className="flex gap-6 items-start">
            <div className="w-48 h-48 rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-muted-foreground">Sin foto</span>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-grow">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Subí una imagen tuya para mostrar en la Home (JPG, PNG o WebP, máximo 5MB).
              </p>
            </div>
          </div>
        </div>

        <Input 
          label="Título Principal"
          name="hero_title"
          value={formData.hero_title}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Párrafo 1
          </label>
          <textarea
            name="hero_subtitle_1"
            value={formData.hero_subtitle_1}
            onChange={handleChange}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent min-h-[100px]"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Párrafo 2
          </label>
          <textarea
            name="hero_subtitle_2"
            value={formData.hero_subtitle_2}
            onChange={handleChange}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent min-h-[100px]"
            required
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" disabled={isSaving || configLoading} className="px-8">
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}
