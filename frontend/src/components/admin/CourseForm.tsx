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

interface ImageItem {
  id: string;
  type: 'existing' | 'new';
  url?: string;
  blob?: Blob;
  preview?: string;
  is_cover: boolean;
  order: number;
}

export default function CourseForm({ course, onSubmit, onCancel, isLoading }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duracion_dias: 30,
    link_pago: '',
    price: 0,
    discount_percentage: 0,
    is_visible: false,
  });
  
  // Unified image list
  const [imagesList, setImagesList] = useState<ImageItem[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  
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
        price: course.price || 0,
        discount_percentage: course.discount_percentage || 0,
        is_visible: course.is_visible || false,
      });
      if (course.images && course.images.length > 0) {
        // Sort by order before setting to state
        const sortedImages = [...course.images].sort((a, b) => (a.order || 0) - (b.order || 0));
        setImagesList(
          sortedImages.map((img, index) => ({
            id: `existing-${img.id || index}`,
            type: 'existing',
            url: img.url,
            is_cover: img.is_cover || false,
            order: img.order || index,
          }))
        );
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
      
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        e.target.value = '';
        return;
      }
      
      setError('');
      setCropperSrc(URL.createObjectURL(file));
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const preview = URL.createObjectURL(croppedBlob);
    setImagesList(prev => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        type: 'new',
        blob: croppedBlob,
        preview,
        is_cover: prev.length === 0 && !prev.some(img => img.is_cover), // Auto cover if it's the first or no cover exists
        order: prev.length,
      }
    ]);
    setCropperSrc(null);
  };

  const handleCropCancel = () => {
    if (cropperSrc) URL.revokeObjectURL(cropperSrc);
    setCropperSrc(null);
  };

  const removeImage = (id: string) => {
    setImagesList(prev => {
      const imgToRemove = prev.find(i => i.id === id);
      if (imgToRemove) {
        if (imgToRemove.type === 'existing' && imgToRemove.url) {
          setDeletedImageUrls(urls => [...urls, imgToRemove.url!]);
        }
        if (imgToRemove.type === 'new' && imgToRemove.preview) {
          URL.revokeObjectURL(imgToRemove.preview);
        }
      }
      const newList = prev.filter(i => i.id !== id);
      // Auto-assign cover if the deleted one was the cover
      if (imgToRemove?.is_cover && newList.length > 0) {
        newList[0].is_cover = true;
      }
      return newList;
    });
  };

  const setAsCover = (id: string) => {
    setImagesList(prev => prev.map(img => ({
      ...img,
      is_cover: img.id === id
    })));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImagesList(prev => {
      const newList = [...prev];
      if (direction === 'up' && index > 0) {
        [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
      } else if (direction === 'down' && index < newList.length - 1) {
        [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
      }
      return newList;
    });
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
      const uploadedUrls: Record<string, string> = {};
      for (const img of imagesList) {
        if (img.type === 'new' && img.blob) {
          const uploadData = new FormData();
          uploadData.append('file', img.blob, 'imagen_curso.jpg');
          const response = await api.upload('/uploads/image', uploadData);
          uploadedUrls[img.id] = response.url;
        }
      }

      // Ensure at least one image is marked as cover if there are any images
      const imagesWithCover = [...imagesList];
      if (imagesWithCover.length > 0 && !imagesWithCover.some(img => img.is_cover)) {
        imagesWithCover[0].is_cover = true;
      }

      // Build the final array respecting the list order
      const allImages = imagesWithCover.map((img, index) => ({
        url: img.type === 'existing' ? img.url : uploadedUrls[img.id],
        order: index,
        is_cover: img.is_cover || false,
      }));

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
      <Modal isOpen={true} onClose={onCancel} className="max-w-3xl">
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

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Imágenes del Curso</label>
              <span className="text-xs text-muted-foreground">La imagen marcada como ⭐ será la portada.</span>
            </div>
            
            {/* Images List */}
            {imagesList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-2">
                {imagesList.map((img, index) => (
                  <div key={img.id} className={`relative rounded-lg overflow-hidden border-2 aspect-video ${img.is_cover ? 'border-amber-500 shadow-md shadow-amber-500/20' : 'border-border'}`}>
                    <img src={img.type === 'existing' ? img.url : img.preview} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                    
                    {/* Top Right: Delete */}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                      title="Eliminar imagen"
                    >
                      ✕
                    </button>

                    {/* Bottom overlay: Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-1.5 flex justify-between items-center z-10">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'up')}
                          disabled={index === 0}
                          className="bg-white/20 hover:bg-white/40 disabled:opacity-30 disabled:hover:bg-white/20 text-white rounded p-1 px-2 text-xs transition-colors"
                          title="Mover a la izquierda"
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'down')}
                          disabled={index === imagesList.length - 1}
                          className="bg-white/20 hover:bg-white/40 disabled:opacity-30 disabled:hover:bg-white/20 text-white rounded p-1 px-2 text-xs transition-colors"
                          title="Mover a la derecha"
                        >
                          ▶
                        </button>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setAsCover(img.id)}
                        className={`text-xs px-2 py-1 rounded font-medium transition-colors ${img.is_cover ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                      >
                        {img.is_cover ? '⭐ Portada' : 'Hacer Portada'}
                      </button>
                    </div>

                    {/* Badge for new images */}
                    {img.type === 'new' && (
                      <span className="absolute top-1.5 left-1.5 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md font-medium z-10">
                        Nueva
                      </span>
                    )}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
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
            
            <Input
              label="Precio (ARS) *"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min={0}
              required
            />
            
            <Input
              label="Descuento (%)"
              type="number"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
              min={0}
              max={100}
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

