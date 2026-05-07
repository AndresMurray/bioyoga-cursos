'use client';

import React, { useState, useEffect } from 'react';
import { Lesson } from '@/hooks/useCourses';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface LessonFormProps {
  lesson?: Lesson | null;
  onSubmit: (data: Partial<Lesson>) => Promise<any>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function LessonForm({ lesson, onSubmit, onCancel, isLoading }: LessonFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_drive: '',
    recursos_pdf: '' as string,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        image_url: lesson.image_url || '',
        link_drive: lesson.link_drive || '',
        recursos_pdf: (lesson.recursos_pdf || []).join(', '),
      });
    }
  }, [lesson]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('El título de la clase es obligatorio.');
      return;
    }

    const pdfList = formData.recursos_pdf
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const result = await onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      image_url: formData.image_url || undefined,
      link_drive: formData.link_drive || undefined,
      recursos_pdf: pdfList,
    });

    if (!result) {
      setError('Ocurrió un error al guardar la clase.');
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} className="max-w-xl">
      <h3 className="text-2xl font-semibold mb-6 text-foreground">
        {lesson ? 'Editar Clase' : 'Nueva Clase'}
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
          rows={3}
        />

        <Input
          label="Imagen de Portada (URL)"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://res.cloudinary.com/..."
        />

        <Input
          label="Link de Drive / Video"
          name="link_drive"
          value={formData.link_drive}
          onChange={handleChange}
          placeholder="https://drive.google.com/..."
        />

        <Textarea
          label="Recursos PDF (URLs separadas por coma)"
          name="recursos_pdf"
          value={formData.recursos_pdf}
          onChange={handleChange}
          rows={2}
          placeholder="https://..., https://..."
        />

        <div className="flex gap-3 justify-end mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : lesson ? 'Guardar Cambios' : 'Crear Clase'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
