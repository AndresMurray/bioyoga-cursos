from __future__ import annotations

from urllib.parse import quote

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database.session import get_db
from dependencies import get_current_user
from services.cloudinary_service import build_signed_url, extract_cloudinary_info
from services.pdf_service import PdfService

router = APIRouter(prefix="/downloads", tags=["Downloads"])


def _sanitize_filename(name: str) -> str:
    name = (name or "documento").strip()
    if not name:
        name = "documento"

    bad = '<>:/\\|?*\"\n\r\t'
    for ch in bad:
        name = name.replace(ch, " ")

    name = " ".join(name.split())
    return name[:150] or "documento"


@router.get("/pdfs/{pdf_id}")
async def download_lesson_pdf(
    pdf_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    print(f"DEBUG: Iniciando descarga de PDF ID={pdf_id} para usuario {getattr(current_user, 'email', 'unknown')}")
    
    service = PdfService(db)
    pdf, error = service.validate_pdf_access(pdf_id=pdf_id, current_user=current_user)
    if error:
        print(f"DEBUG: Error de validación: {error}")
        status_code = 404 if "no encontrado" in error.lower() else 403
        raise HTTPException(status_code=status_code, detail=error)

    if not pdf.url:
        print("DEBUG: PDF no tiene URL")
        raise HTTPException(status_code=404, detail="El PDF no tiene una URL válida")

    # AUTO-DETECCIÓN de tipo de recurso y entrega desde la URL
    public_id, res_type, del_type = extract_cloudinary_info(pdf.url)
    if not public_id:
        print(f"DEBUG: No se pudo extraer public_id de la URL: {pdf.url}")
        raise HTTPException(status_code=500, detail="No se pudo resolver el PDF en Cloudinary (formato de URL no reconocido)")

    print(f"DEBUG: Cloudinary Info -> PID: {public_id}, Resource: {res_type}, Delivery: {del_type}")

    try:
        signed_url = build_signed_url(public_id, resource_type=res_type, delivery_type=del_type)
        print(f"DEBUG: URL firmada generada: {signed_url}")
    except Exception as e:
        print(f"DEBUG: Error al generar URL firmada: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al generar URL de descarga: {str(e)}")

    # Verificar si Cloudinary responde OK antes de iniciar el streaming
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            async with client.stream("GET", signed_url) as resp_check:
                if resp_check.status_code not in (200, 206):
                    print(f"DEBUG: Cloudinary rechazó el acceso preventivo. Status: {resp_check.status_code}")
                    raise HTTPException(status_code=502, detail=f"Cloudinary rechazó el acceso (Status {resp_check.status_code})")
    except httpx.HTTPError as e:
        print(f"DEBUG: Error de red al contactar Cloudinary: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Error al contactar Cloudinary: {str(e)}")

    filename_base = _sanitize_filename(getattr(pdf, "title", "documento"))
    filename = f"{filename_base}.pdf" if not filename_base.lower().endswith(".pdf") else filename_base
    
    # Creamos una versión ASCII del nombre para el header "filename" (compatibilidad)
    # y usamos quote() para el header "filename*" (estándar moderno)
    import unicodedata
    filename_ascii = unicodedata.normalize('NFKD', filename).encode('ascii', 'ignore').decode('ascii')
    if not filename_ascii:
        filename_ascii = "documento.pdf"

    async def iter_pdf_bytes():
        try:
            async with httpx.AsyncClient(follow_redirects=True, timeout=60.0) as client:
                async with client.stream("GET", signed_url) as resp:
                    resp.raise_for_status()
                    async for chunk in resp.aiter_bytes():
                        yield chunk
        except Exception as e:
            print(f"DEBUG: Error crítico durante el streaming: {str(e)}")
            raise

    headers = {
        "Content-Disposition": f"attachment; filename=\"{filename_ascii}\"; filename*=UTF-8''{quote(filename)}",
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "Content-Disposition",
    }


    print(f"DEBUG: Iniciando StreamingResponse para {filename}")
    return StreamingResponse(iter_pdf_bytes(), media_type="application/pdf", headers=headers)
