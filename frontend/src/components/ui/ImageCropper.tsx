'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from './Button';

// ── Tipos de imagen admitidos ──────────────────────────
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = '.jpg,.jpeg,.png,.webp';
export const ALLOWED_IMAGE_LABEL = 'JPG, PNG o WebP';
export const MAX_IMAGE_SIZE_MB = 5;

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  /** The source image to crop (object URL or data URL) */
  imageSrc: string;
  /** Aspect ratio for the crop area (e.g. 16/9, 3/2, 1) */
  aspectRatio?: number;
  /** Called when the user confirms the crop, with the resulting Blob */
  onCropComplete: (croppedBlob: Blob) => void;
  /** Called when the user cancels */
  onCancel: () => void;
  /** Optional label shown above the cropper */
  title?: string;
}

/**
 * Reusable image cropper component.
 * Opens as a modal overlay where the user can pan/zoom to frame
 * their image into the desired aspect ratio.
 */
export function ImageCropper({
  imageSrc,
  aspectRatio = 16 / 9,
  onCropComplete,
  onCancel,
  title = 'Ajustar imagen',
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (err) {
      console.error('Error al recortar imagen:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#4a3f35]/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-background rounded-xl shadow-2xl animate-fade w-[95%] max-w-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Arrastrá y usá el zoom para encuadrar la imagen.
          </p>
        </div>

        {/* Cropper area */}
        <div className="relative mx-6 my-4 rounded-lg overflow-hidden bg-muted" style={{ height: '350px' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: { background: 'var(--muted, #f5f0eb)' },
              cropAreaStyle: {
                border: '2px solid var(--primary, #c9a87c)',
                borderRadius: '8px',
              },
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center justify-center gap-4 px-6 py-3">
          <span className="text-muted-foreground text-sm font-medium select-none">🔍−</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-48 h-1.5 appearance-none rounded-full bg-border cursor-pointer accent-primary"
          />
          <span className="text-muted-foreground text-sm font-medium select-none">🔍+</span>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing || !croppedAreaPixels}
          >
            {isProcessing ? 'Procesando...' : 'Confirmar recorte'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Validación de archivos de imagen ───────────────────
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Formato no admitido. Usá ${ALLOWED_IMAGE_LABEL}.`;
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `La imagen no puede superar los ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return null;
}

// ── Helper: recortar imagen en un canvas ───────────────
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      },
      'image/jpeg',
      0.92,
    );
  });
}
