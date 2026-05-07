'use client';

import React, { useState, useEffect } from 'react';
import { Course } from '@/hooks/useCourses';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

import { api } from '@/lib/api';

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (data: Partial<Course>) => Promise<any>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CourseForm({ course, onSubmit, onCancel, isLoading }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    duracion_dias: 30,
    link_pago: '',
    is_visible: false,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        image_url: course.image_url || '',
        duracion_dias: course.duracion_dias || 30,
        link_pago: course.link_pago || '',
        is_visible: course.is_visible || false,
      });
      if (course.image_url) {
        setImagePreview(course.image_url);
      }
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    setError('');

    if (!formData.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (formData.duracion_dias < 1) {
      setError('La duración debe ser al menos 1 día.');
      return;
    }

    let finalImageUrl = formData.image_url;

    if (imageFile) {
      setIsUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const response = await api.upload('/uploads/image', uploadData);
        finalImageUrl = response.url;
      } catch (err: any) {
        setIsUploading(false);
        setError(`Error al subir imagen: ${err.message}`);
        return;
      }
      setIsUploading(false);
    }

    const result = await onSubmit({ ...formData, image_url: finalImageUrl });
    if (!result) {
      setError('Ocurrió un error al guardar el curso.');
    }
  };

  const isWorking = isLoading || isUploading;

  return (
    <Modal isOpen={true} onClose={onCancel} className="max-w-2xl">
      <h3 className="text-2xl font-semibold mb-6 text-foreground">
        {course ? 'Editar Curso' : 'Nuevo Curso'}
      </h3>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Título *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Textarea
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Imagen de Portada</label>
          {imagePreview && (
            <div className="relative w-full h-40 mb-2 rounded-lg overflow-hidden border border-border">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <p className="text-xs text-muted-foreground">Sube una imagen para el curso. Si no subes ninguna, se mantendrá la actual.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Duración (días de acceso) *"
            type="number"
            name="duracion_dias"
            value={formData.duracion_dias}
            onChange={handleChange}
            min={1}
            required
          />

          <Input
            label="Link de Pago (Mercado Pago)"
            name="link_pago"
            value={formData.link_pago}
            onChange={handleChange}
            placeholder="https://www.mercadopago.com.ar/..."
          />
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            name="is_visible"
            checked={formData.is_visible}
            onChange={handleChange}
            id="is_visible"
            className="w-5 h-5 accent-primary cursor-pointer rounded border-border"
          />
          <label htmlFor="is_visible" className="text-sm font-medium text-foreground cursor-pointer">
            Visible en la tienda pública
          </label>
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isWorking}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isWorking}>
            {isUploading ? 'Subiendo imagen...' : isLoading ? 'Guardando...' : course ? 'Guardar Cambios' : 'Crear Curso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
