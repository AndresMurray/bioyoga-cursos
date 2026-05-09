'use client';

import React, { useState, useEffect } from 'react';
import { Course, CourseImage } from '@/hooks/useCourses';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageCropper, validateImageFile, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_LABEL } from '@/components/ui/ImageCropper';

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
    duracion_dias: 30,
    link_pago: '',
    is_visible: false,
  });
  
  // Imágenes ya recortadas listas para subir (Blobs)
  const [croppedImages, setCroppedImages] = useState<{ blob: Blob; preview: string }[]>([]);
  const [existingImages, setExistingImages] = useState<CourseImage[]>([]);
  
  // Estado del cropper
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        duracion_dias: course.duracion_dias || 30,
        link_pago: course.link_pago || '',
        is_visible: course.is_visible || false,
      });
      if (course.images && course.images.length > 0) {
        setExistingImages(course.images);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validar tipo y tamaño
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        e.target.value = '';
        return;
      }
      
      setError('');
      setCropperSrc(URL.createObjectURL(file));
      e.target.value = ''; // Reset input para poder seleccionar el mismo archivo
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const preview = URL.createObjectURL(croppedBlob);
    setCroppedImages(prev => [...prev, { blob: croppedBlob, preview }]);
    setCropperSrc(null);
  };

  const handleCropCancel = () => {
    if (cropperSrc) URL.revokeObjectURL(cropperSrc);
    setCropperSrc(null);
  };

  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  const removeExistingImage = (index: number) => {
    const url = existingImages[index].url;
    setDeletedImageUrls(prev => [...prev, url]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(croppedImages[index].preview);
    setCroppedImages(prev => prev.filter((_, i) => i !== index));
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

    setIsUploading(true);

    try {
      // Upload cropped images to Cloudinary
      const uploadedUrls: string[] = [];
      for (const img of croppedImages) {
        const uploadData = new FormData();
        uploadData.append('file', img.blob, 'imagen_curso.jpg');
        const response = await api.upload('/uploads/image', uploadData);
        uploadedUrls.push(response.url);
      }

      // Combine existing images + newly uploaded images
      const allImages = [
        ...existingImages.map(img => ({ url: img.url })),
        ...uploadedUrls.map(url => ({ url })),
      ];

      const result = await onSubmit({ ...formData, images: allImages } as any);
      if (!result) {
        setError('Ocurrió un error al guardar el curso.');
      } else {
        // Clean up deleted images from Cloudinary
        for (const url of deletedImageUrls) {
          try {
            await api.delete(`/uploads/image?url=${encodeURIComponent(url)}`);
          } catch (err) {
            console.error('Error al eliminar imagen de Cloudinary:', err);
          }
        }
      }
    } catch (err: any) {
      setError(`Error al subir imagen: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isWorking = isLoading || isUploading;

  return (
    <>
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
            <label className="text-sm font-medium text-foreground">Imágenes del Curso</label>
            
            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {existingImages.map((img, i) => (
                  <div key={`existing-${i}`} className="relative rounded-lg overflow-hidden border border-border aspect-video">
                    <img src={img.url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Cropped image previews */}
            {croppedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {croppedImages.map((img, i) => (
                  <div key={`new-${i}`} className="relative rounded-lg overflow-hidden border-2 border-primary/40 aspect-video">
                    <img src={img.preview} alt={`Nueva ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1 left-1 text-[10px] bg-primary/80 text-white px-1.5 py-0.5 rounded-md font-medium">
                      Nueva
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Input
              type="file"
              accept={ALLOWED_IMAGE_EXTENSIONS}
              onChange={handleImageSelect}
            />
            <p className="text-xs text-muted-foreground">
              Formatos admitidos: {ALLOWED_IMAGE_LABEL}. Máx. 5MB. Se abrirá un recortador para ajustar la imagen.
            </p>
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
              {isUploading ? 'Subiendo imágenes...' : isLoading ? 'Guardando...' : course ? 'Guardar Cambios' : 'Crear Curso'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Image Cropper Overlay */}
      {cropperSrc && (
        <ImageCropper
          imageSrc={cropperSrc}
          aspectRatio={16 / 9}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          title="Ajustar imagen del curso"
        />
      )}
    </>
  );
}
