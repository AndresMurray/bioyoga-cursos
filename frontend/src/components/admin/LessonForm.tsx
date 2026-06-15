'use client';

import React, { useState, useEffect } from 'react';
import { Lesson, LessonPdf } from '@/hooks/useCourses';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageCropper, validateImageFile, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_LABEL } from '@/components/ui/ImageCropper';

import { api } from '@/lib/api';
import { downloadPdf } from '@/utils/downloadPdf';
import { uploadFileToCloudinary, uploadPdfsToCloudinary } from '@/utils/uploadToCloudinary';


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
    link_drive: '',
  });
  
  // Imagen de portada (single)
  const [croppedImage, setCroppedImage] = useState<{ blob: Blob; preview: string } | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [existingPdfs, setExistingPdfs] = useState<LessonPdf[]>([]);
  
  const [error, setError] = useState('');
  const [pdfError, setPdfError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        link_drive: lesson.link_drive || '',
      });
      if (lesson.image_url) {
        setExistingImageUrl(lesson.image_url);
      }
      setExistingPdfs(lesson.pdfs || []);
    }
  }, [lesson]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (croppedImage) URL.revokeObjectURL(croppedImage.preview);
    const preview = URL.createObjectURL(croppedBlob);
    setCroppedImage({ blob: croppedBlob, preview });
    setExistingImageUrl(''); // Reemplaza la existente
    setCropperSrc(null);
  };

  const handleCropCancel = () => {
    if (cropperSrc) URL.revokeObjectURL(cropperSrc);
    setCropperSrc(null);
  };

  const [deletedImageUrl, setDeletedImageUrl] = useState<string | null>(null);
  const [deletedPdfUrls, setDeletedPdfUrls] = useState<string[]>([]);

  const removeImage = () => {
    if (croppedImage) {
      URL.revokeObjectURL(croppedImage.preview);
      setCroppedImage(null);
    }
    if (existingImageUrl) {
      setDeletedImageUrl(existingImageUrl);
      setExistingImageUrl('');
    }
  };

  const MAX_PDF_SIZE_MB = 10;
  const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const oversized = selected.filter(f => f.size > MAX_PDF_SIZE_BYTES);
    if (oversized.length > 0) {
      const names = oversized.map(f => `"${f.name}" (${(f.size / 1024 / 1024).toFixed(1)} MB)`).join(', ');
      setPdfError(`${oversized.length > 1 ? 'Los archivos' : 'El archivo'} ${names} ${oversized.length > 1 ? 'superan' : 'supera'} el límite de ${MAX_PDF_SIZE_MB} MB por archivo.`);
      e.target.value = '';
      setPdfFiles([]);
      return;
    }
    setPdfError('');
    setPdfFiles(selected);
  };

  const removeExistingPdf = (index: number) => {
    const url = existingPdfs[index].url;
    setDeletedPdfUrls(prev => [...prev, url]);
    setExistingPdfs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('El título de la clase es obligatorio.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    let finalImageUrl = existingImageUrl;

    try {
      // Subida directa a Cloudinary desde el browser (sin pasar por Vercel)
      if (croppedImage) {
        const imageFile = new File([croppedImage.blob], 'portada_clase.jpg', { type: 'image/jpeg' });
        finalImageUrl = await uploadFileToCloudinary(
          imageFile,
          'image',
          'centra/images',
          setUploadProgress
        );
      }

      // Upload PDFs directo a Cloudinary (sin límite de tamaño ni timeout de Vercel)
      let newPdfs: LessonPdf[] = [];
      if (pdfFiles.length > 0) {
        const pdfUrls = await uploadPdfsToCloudinary(pdfFiles, setUploadProgress);
        newPdfs = pdfUrls.map((url: string, i: number) => ({
          title: pdfFiles[i]?.name?.replace('.pdf', '') || `Documento ${i + 1}`,
          url,
        }));
      }

      const allPdfs = [
        ...existingPdfs.map(pdf => ({ title: pdf.title, url: pdf.url })),
        ...newPdfs,
      ];

      const result = await onSubmit({
        title: formData.title,
        description: formData.description || undefined,
        image_url: finalImageUrl || undefined,
        link_drive: formData.link_drive || undefined,
        pdfs: allPdfs,
      });

      if (!result) {
        setError('Ocurrió un error al guardar la clase.');
      } else {
        // Clean up deleted cover image from Cloudinary
        if (deletedImageUrl) {
          try {
            await api.delete(`/uploads/image?url=${encodeURIComponent(deletedImageUrl)}`);
          } catch (err) { console.error('Error al eliminar imagen de Cloudinary:', err); }
        }
        // Clean up deleted PDFs from Cloudinary
        for (const url of deletedPdfUrls) {
          try {
            await api.delete(`/uploads/pdf?url=${encodeURIComponent(url)}`);
          } catch (err) { console.error('Error al eliminar PDF de Cloudinary:', err); }
        }
      }
    } catch (err: any) {
      setError(`Error en la subida de archivos: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isWorking = isLoading || isUploading;
  const currentPreview = croppedImage?.preview || existingImageUrl;

  return (
    <>
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
            {currentPreview && (
              <div className="relative w-full aspect-video mb-2 rounded-lg overflow-hidden border border-border">
                <img src={currentPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                >
                  ✕
                </button>
                {croppedImage && (
                  <span className="absolute bottom-2 left-2 text-[10px] bg-primary/80 text-white px-2 py-0.5 rounded-md font-medium">
                    Nueva imagen
                  </span>
                )}
              </div>
            )}
            <Input
              type="file"
              accept={ALLOWED_IMAGE_EXTENSIONS}
              onChange={handleImageSelect}
            />
            <p className="text-xs text-muted-foreground">
              Formatos admitidos: {ALLOWED_IMAGE_LABEL}. Máx. 5MB.
            </p>
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
            {pdfError && (
              <div className="text-xs bg-red-50 border border-red-200 rounded-md px-3 py-2 flex flex-col gap-1">
                <p className="text-red-600 font-medium">⚠️ {pdfError}</p>
                <p className="text-red-500">
                  Podés comprimir el PDF con una herramienta gratuita como{' '}
                  <a
                    href="https://www.ilovepdf.com/es/comprimir_pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium hover:text-red-700"
                  >
                    ilovepdf.com
                  </a>
                  {' '}e intentar subirlo nuevamente.
                </p>
              </div>
            )}
            {pdfFiles.length > 0 && (
              <ul className="text-xs text-primary space-y-0.5">
                {pdfFiles.map((f, i) => (
                  <li key={i}>
                    ✓ {f.name} <span className="text-muted-foreground">({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground">Solo PDF. Máx. {MAX_PDF_SIZE_MB} MB por archivo.</p>
          </div>

          {existingPdfs.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">PDFs Actuales</label>
              <ul className="text-sm space-y-2">
                {existingPdfs.map((pdf, i) => (
                  <li key={i} className="flex items-center justify-between bg-muted px-3 py-2 rounded-md">
                    <button 
                      type="button"
                      onClick={() => pdf.id && downloadPdf(pdf.id, pdf.title)}
                      className="text-primary hover:underline truncate max-w-[250px] text-left" 
                      title={pdf.title}
                    >
                      {pdf.title}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeExistingPdf(i)}
                      className="text-red-500 hover:text-red-700 font-medium text-xs"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isWorking}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isWorking}>
              {isUploading
                ? uploadProgress > 0
                  ? `Subiendo... ${uploadProgress}%`
                  : 'Preparando subida...'
                : isLoading
                ? 'Guardando...'
                : lesson
                ? 'Guardar Cambios'
                : 'Crear Clase'}
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
          title="Ajustar imagen de portada"
        />
      )}
    </>
  );
}
