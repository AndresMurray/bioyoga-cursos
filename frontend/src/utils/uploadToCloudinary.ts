import { api } from '@/lib/api';

export interface UploadProgressCallback {
  (progress: number): void;
}

/**
 * Sube un archivo directamente a Cloudinary desde el browser,
 * sin que el archivo pase por el backend de Vercel.
 * Esto evita el timeout de 10s en uploads de archivos pesados.
 *
 * Flujo:
 *  1. Pide una firma al backend (< 10ms)
 *  2. Sube el archivo directo a api.cloudinary.com (sin límite de tiempo)
 *  3. Retorna la URL segura del archivo subido
 */
export async function uploadFileToCloudinary(
  file: File,
  resourceType: 'raw' | 'image',
  folder: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  // 1. Obtener firma del backend
  const signData = await api.get(
    `/uploads/sign?resource_type=${resourceType}&folder=${encodeURIComponent(folder)}`
  );

  const { signature, timestamp, api_key, cloud_name } = signData;

  // 2. Construir FormData para Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', api_key);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  // 3. Subir directamente a Cloudinary usando XMLHttpRequest (soporta progreso)
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`;

    xhr.open('POST', uploadUrl);

    // Progreso real del upload
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          resolve(result.secure_url);
        } catch {
          reject(new Error('Respuesta inválida de Cloudinary.'));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err?.error?.message || `Error Cloudinary: ${xhr.status}`));
        } catch {
          reject(new Error(`Error Cloudinary: ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Error de red al subir el archivo. Verificá tu conexión.'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('La subida fue cancelada.'));
    });

    xhr.send(formData);
  });
}

/**
 * Sube múltiples PDFs directamente a Cloudinary en paralelo.
 * Retorna un array de URLs en el mismo orden que los archivos.
 */
export async function uploadPdfsToCloudinary(
  files: File[],
  onProgress?: UploadProgressCallback
): Promise<string[]> {
  const progresses = new Array(files.length).fill(0);

  const updateTotal = () => {
    if (onProgress) {
      const total = progresses.reduce((a, b) => a + b, 0) / files.length;
      onProgress(Math.round(total));
    }
  };

  const uploads = files.map((file, i) =>
    uploadFileToCloudinary(file, 'raw', 'centra/pdfs', (p) => {
      progresses[i] = p;
      updateTotal();
    })
  );

  return Promise.all(uploads);
}
