'use client';

import React, { useState, useEffect } from 'react';
import { Lesson } from '@/hooks/useCourses';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

import { api } from '@/lib/api';

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
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [existingPdfs, setExistingPdfs] = useState<string[]>([]);
  
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        image_url: lesson.image_url || '',
        link_drive: lesson.link_drive || '',
      });
      if (lesson.image_url) {
        setImagePreview(lesson.image_url);
      }
      setExistingPdfs(lesson.recursos_pdf || []);
    }
  }, [lesson]);

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

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('El título de la clase es obligatorio.');
      return;
    }

    setIsUploading(true);
    let finalImageUrl = formData.image_url;

    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const response = await api.upload('/uploads/image', uploadData);
        finalImageUrl = response.url;
      }

      let newPdfUrls: string[] = [];
      if (pdfFiles.length > 0) {
        const uploadData = new FormData();
        pdfFiles.forEach(file => {
          uploadData.append('files', file);
        });
        const response = await api.upload('/uploads/pdf', uploadData);
        newPdfUrls = response.urls;
      }

      const allPdfs = [...existingPdfs, ...newPdfUrls];

      const result = await onSubmit({
        title: formData.title,
        description: formData.description || undefined,
        image_url: finalImageUrl || undefined,
        link_drive: formData.link_drive || undefined,
        recursos_pdf: allPdfs,
      });

      if (!result) {
        setError('Ocurrió un error al guardar la clase.');
      }
    } catch (err: any) {
      setError(`Error en la subida de archivos: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isWorking = isLoading || isUploading;

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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Imagen de Portada</label>
          {imagePreview && (
            <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden border border-border">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <Input
          label="Link de Drive / Video"
          name="link_drive"
          value={formData.link_drive}
          onChange={handleChange}
          placeholder="https://drive.google.com/..."
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Subir Nuevos PDFs</label>
          <Input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handlePdfChange}
          />
          {pdfFiles.length > 0 && (
            <p className="text-xs text-primary">{pdfFiles.length} archivo(s) seleccionado(s) listos para subir.</p>
          )}
        </div>

        {existingPdfs.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">PDFs Actuales</label>
            <ul className="text-sm space-y-2">
              {existingPdfs.map((url, i) => {
                const fileName = url.split('/').pop() || `Documento ${i + 1}`;
                return (
                  <li key={i} className="flex items-center justify-between bg-muted px-3 py-2 rounded-md">
                    <a href={url} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[250px]" title={fileName}>
                      {fileName}
                    </a>
                    <button
                      type="button"
                      onClick={() => setExistingPdfs(prev => prev.filter((_, index) => index !== i))}
                      className="text-red-500 hover:text-red-700 font-medium text-xs"
                    >
                      Eliminar
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isWorking}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isWorking}>
            {isUploading ? 'Subiendo archivos...' : isLoading ? 'Guardando...' : lesson ? 'Guardar Cambios' : 'Crear Clase'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
