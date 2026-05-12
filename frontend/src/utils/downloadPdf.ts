/**
 * Utility to download a PDF from the backend protected endpoint.
 * This ensures the Authorization header is included to avoid 401/403 errors
 * when fetching restricted assets from Cloudinary.
 */
export async function downloadPdf(pdfId: number, title: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Tu sesión ha expirado. Por favor, volvé a ingresar.');
      return { success: false, error: 'No token' };
    }

    // Usamos la misma lógica de URL que el resto de la app (api.ts)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    
    console.log(`Iniciando descarga de PDF ${pdfId} desde ${apiUrl}`);

    const response = await fetch(`${apiUrl}/downloads/pdfs/${pdfId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Error al descargar el PDF.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        errorMessage = `Error del servidor (${response.status}): ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Convert response to blob
    // Si el streaming falla a mitad de camino, esto lanzará un error
    const blob = await response.blob();
    
    if (blob.size === 0) {
      throw new Error('El archivo descargado está vacío.');
    }

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    
    // Sanitize filename
    const cleanTitle = title.replace(/[<>:"/\\|?*]/g, '_');
    const filename = cleanTitle.toLowerCase().endsWith('.pdf') ? cleanTitle : `${cleanTitle}.pdf`;
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      if (link.parentNode) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
    }, 100);
    
    return { success: true };
  } catch (error: any) {
    console.error('Download error:', error);
    
    // Si es un error de CORS o red, el mensaje suele ser genérico "Failed to fetch"
    const msg = error.message === 'Failed to fetch' 
      ? 'No se pudo conectar con el servidor. Verificá que el backend esté corriendo.' 
      : error.message;
      
    alert(msg);
    return { success: false, error: msg };
  }
}
