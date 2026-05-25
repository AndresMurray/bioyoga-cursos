'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHomeConfig } from '@/hooks/useHomeConfig';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { ImageCropper, validateImageFile, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_LABEL } from '@/components/ui/ImageCropper';

export default function HomeConfigForm() {
  const { config, loading: configLoading, fetchConfig, updateConfig } = useHomeConfig();

  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle_1: '',
    hero_subtitle_2: '',
    hero_image_url: '',
    whatsapp_number: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Cropper states
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropperError, setCropperError] = useState<string>('');
  
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
        hero_image_url: config.hero_image_url,
        whatsapp_number: config.whatsapp_number
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
      
      const validationError = validateImageFile(file);
      if (validationError) {
        setCropperError(validationError);
        e.target.value = '';
        return;
      }
      
      setCropperError('');
      setCropperSrc(URL.createObjectURL(file));
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const preview = URL.createObjectURL(croppedBlob);
    const file = new File([croppedBlob], 'foto_presentacion.jpg', { type: 'image/jpeg' });
    setImageFile(file);
    setImagePreview(preview);
    setCropperSrc(null);
  };

  const handleCropCancel = () => {
    if (cropperSrc) URL.revokeObjectURL(cropperSrc);
    setCropperSrc(null);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, hero_image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    <div className="max-w-3xl mx-auto bg-white/50 backdrop-blur-md rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] border border-white/70 p-8 md:p-10 shadow-sm animate-fade">
      <h2 className="text-2xl font-bold font-serif mb-6 text-foreground">Configuración de la Sección "Sobre Mí"</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-2xl text-sm font-medium border animate-fade ${
          message.type === 'success' 
            ? 'bg-green-500/10 text-green-800 border-green-500/20' 
            : 'bg-red-500/10 text-red-800 border-red-500/20'
        }`}>
          {message.type === 'success' ? '✨ ' : '⚠️ '}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-foreground/80 mb-3">Foto de Presentación</label>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-48 h-48 rounded-[2rem] rounded-tr-[0.5rem] rounded-bl-[0.5rem] overflow-hidden bg-primary/5 border border-white/75 flex items-center justify-center shrink-0 shadow-sm relative group">
              {imagePreview && imagePreview !== "/images/yoga_teacher.png" ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary/40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="text-xs text-foreground/60 font-bold">Sin foto de presentación</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-grow w-full">
              <input 
                type="file" 
                accept={ALLOWED_IMAGE_EXTENSIONS}
                ref={fileInputRef}
                onChange={handleImageChange}
                className="block w-full text-sm text-foreground/70 file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary/95 file:cursor-pointer transition-all"
              />
              <p className="text-xs text-foreground/50 leading-relaxed mt-1">
                Sube una imagen de presentación para mostrar en tu Home pública ({ALLOWED_IMAGE_LABEL}, máximo 5MB). Se abrirá un recortador para ajustar la imagen a formato circular (1:1).
              </p>
              {cropperError && (
                <p className="text-xs text-red-500 font-bold mt-1 animate-fade">{cropperError}</p>
              )}
              {imagePreview && imagePreview !== "/images/yoga_teacher.png" && (
                <Button 
                  type="button" 
                  variant="danger" 
                  size="sm" 
                  onClick={handleRemoveImage}
                  className="mt-2 self-start rounded-full font-bold px-4 py-1.5 h-auto text-xs"
                >
                  Quitar Imagen
                </Button>
              )}
            </div>
          </div>
        </div>

        <Input 
          label="Título Principal"
          name="hero_title"
          value={formData.hero_title}
          onChange={handleChange}
          required
          className="bg-white/60 backdrop-blur-sm border-white/60 rounded-xl focus:ring-primary/20 focus:border-primary"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-foreground/80">
            Primer Párrafo de Presentación
          </label>
          <textarea
            name="hero_subtitle_1"
            value={formData.hero_subtitle_1}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/60 bg-white/60 backdrop-blur-sm px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[120px] leading-relaxed text-foreground"
            placeholder="Introduce la primera parte de tu historia o visión de yoga..."
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-foreground/80">
            Segundo Párrafo de Presentación
          </label>
          <textarea
            name="hero_subtitle_2"
            value={formData.hero_subtitle_2}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/60 bg-white/60 backdrop-blur-sm px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[120px] leading-relaxed text-foreground"
            placeholder="Introduce la segunda parte con detalles de las clases, tu recorrido, etc."
            required
          />
        </div>

        <div className="pt-6 border-t border-white/60 mt-6">
          <h3 className="text-lg font-bold font-serif mb-4 text-foreground">Redes Sociales & Contacto</h3>
          <Input 
            label="Número de WhatsApp (con código de país, ej: 54911...)"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleChange}
            placeholder="5491112345678"
            required
            className="bg-white/60 backdrop-blur-sm border-white/60 rounded-xl focus:ring-primary/20 focus:border-primary"
          />
          <p className="text-xs text-foreground/50 mt-1.5 leading-relaxed">
            Este número alimentará el botón de contacto directo de WhatsApp para los alumnos.
          </p>
        </div>

        <div className="flex justify-end pt-6 border-t border-white/60">
          <Button type="submit" disabled={isSaving || configLoading} className="px-8 rounded-full font-bold shadow-md">
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>

      {/* Image Cropper Overlay for perfect 1:1 circle crop */}
      {cropperSrc && (
        <ImageCropper
          imageSrc={cropperSrc}
          aspectRatio={1}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          title="Ajustar foto de presentación (Formato Circular)"
        />
      )}
    </div>
  );
}
