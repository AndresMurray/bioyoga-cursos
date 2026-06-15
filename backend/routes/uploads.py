import hashlib
import time
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from dependencies import require_admin
from services import cloudinary_service

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
    dependencies=[Depends(require_admin)]
)


@router.get("/sign")
async def sign_upload(resource_type: str = "raw", folder: str = "centra/pdfs"):
    """
    Genera una firma SHA-256 para que el browser pueda subir archivos
    directamente a Cloudinary sin pasar por Vercel.

    El api_secret NUNCA sale del servidor — solo se usa para firmar.
    El api_key y cloud_name son públicos por diseño en Cloudinary.

    Parámetros:
      - resource_type: 'raw' para PDFs, 'image' para imágenes
      - folder: carpeta destino en Cloudinary (ej: 'centra/pdfs')
    """
    if not cloudinary_service.is_configured():
        raise HTTPException(
            status_code=500,
            detail="Cloudinary no está configurado en el servidor."
        )

    ts = int(time.time())

    # Los parámetros DEBEN estar ordenados alfabéticamente para la firma de Cloudinary
    params_to_sign = f"folder={folder}&timestamp={ts}"

    # Cloudinary usa SHA-256 puro: params_ordenados + api_secret
    to_hash = f"{params_to_sign}{cloudinary_service.CLOUDINARY_API_SECRET}"
    signature = hashlib.sha256(to_hash.encode("utf-8")).hexdigest()

    return {
        "signature": signature,
        "timestamp": ts,
        "api_key": cloudinary_service.CLOUDINARY_API_KEY,
        "cloud_name": cloudinary_service.CLOUDINARY_CLOUD_NAME,
    }


# ── Tipos permitidos ──────────────────────────────
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_IMAGE_LABEL = "JPG, PNG o WebP"
MAX_IMAGE_SIZE_MB = 5
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024


@router.post("/image")
async def upload_image_endpoint(file: UploadFile = File(...)):
    """
    Sube una imagen a Cloudinary (solo Admin).
    Formatos admitidos: JPEG, PNG, WebP. Máximo 5MB.
    Retorna la URL de la imagen subida.
    """
    if not cloudinary_service.is_configured():
        raise HTTPException(status_code=500, detail="Cloudinary no está configurado en el servidor.")
    
    # Validar tipo
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Formato de imagen no admitido ({file.content_type}). Formatos válidos: {ALLOWED_IMAGE_LABEL}."
        )

    # Validar tamaño (leemos el contenido una sola vez)
    content = await file.read()
    if len(content) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"La imagen supera el tamaño máximo permitido de {MAX_IMAGE_SIZE_MB}MB."
        )
    # Rebobinar el archivo para que Cloudinary pueda leerlo
    await file.seek(0)

    try:
        url = await cloudinary_service.upload_image(file)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir imagen: {str(e)}")


@router.post("/pdf")
async def upload_pdf_endpoint(files: List[UploadFile] = File(...)):
    """
    Sube múltiples PDFs a Cloudinary (solo Admin).
    Retorna una lista con las URLs generadas.
    """
    if not cloudinary_service.is_configured():
        raise HTTPException(status_code=500, detail="Cloudinary no está configurado en el servidor.")
    
    urls = []
    for file in files:
        if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=400,
                detail=f"El archivo '{file.filename}' no es un PDF válido. Solo se admiten archivos .pdf."
            )
        try:
            # Ensure the file pointer is at the beginning before uploading
            await file.seek(0)
            url = await cloudinary_service.upload_pdf(file)
            urls.append(url)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al subir {file.filename}: {str(e)}")
            
    return {"urls": urls}


@router.delete("/image")
async def delete_image_endpoint(url: str):
    """
    Elimina una imagen de Cloudinary por su URL (solo Admin).
    """
    if not cloudinary_service.is_configured():
        raise HTTPException(status_code=500, detail="Cloudinary no está configurado en el servidor.")

    try:
        deleted = await cloudinary_service.delete_image_by_url(url)
        if not deleted:
            raise HTTPException(status_code=400, detail="No se pudo eliminar la imagen de Cloudinary.")
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar imagen: {str(e)}")


@router.delete("/pdf")
async def delete_pdf_endpoint(url: str):
    """
    Elimina un PDF de Cloudinary por su URL (solo Admin).
    """
    if not cloudinary_service.is_configured():
        raise HTTPException(status_code=500, detail="Cloudinary no está configurado en el servidor.")

    try:
        deleted = await cloudinary_service.delete_pdf_by_url(url)
        if not deleted:
            raise HTTPException(status_code=400, detail="No se pudo eliminar el PDF de Cloudinary.")
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar PDF: {str(e)}")
