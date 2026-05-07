from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from dependencies import require_admin
from services import cloudinary_service

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
    dependencies=[Depends(require_admin)]
)

@router.post("/image")
async def upload_image_endpoint(file: UploadFile = File(...)):
    """
    Sube una imagen a Cloudinary (solo Admin).
    Retorna la URL de la imagen subida.
    """
    if not cloudinary_service.is_configured():
        # Para desarrollo, si no está configurado, podemos simular el éxito
        # o lanzar error. Lo mejor es lanzar error descriptivo.
        raise HTTPException(status_code=500, detail="Cloudinary no está configurado en el servidor.")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")

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
            raise HTTPException(status_code=400, detail=f"El archivo {file.filename} no es un PDF válido.")
        try:
            url = await cloudinary_service.upload_pdf(file)
            urls.append(url)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al subir {file.filename}: {str(e)}")
            
    return {"urls": urls}
