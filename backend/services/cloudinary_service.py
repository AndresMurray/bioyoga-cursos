"""
Cloudinary Service — Helper preparado para subida de archivos.

Para activar este servicio:
1. Crear una cuenta en https://cloudinary.com
2. Obtener las credenciales (Cloud Name, API Key, API Secret)
3. Agregar las variables al archivo .env:
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
4. Instalar la librería: pip install cloudinary
5. Descomentar el código de configuración y las funciones de abajo.
"""

import os
from dotenv import load_dotenv

load_dotenv()

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "").strip()
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "").strip()
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "").strip()


def is_configured() -> bool:
    """Check if Cloudinary credentials are set."""
    return bool(CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET)


import cloudinary
import cloudinary.uploader
import cloudinary.utils
from fastapi import UploadFile

if is_configured():
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
    )


async def upload_image(file: UploadFile, folder: str = "bioyoga/images") -> str:
    """
    Sube una imagen a Cloudinary y retorna la URL segura.
    Args:
        file: archivo (UploadFile de FastAPI)
        folder: carpeta destino en Cloudinary
    Returns:
        URL segura de la imagen subida
    """
    if not is_configured():
        raise Exception("Cloudinary no está configurado. Revisa las variables de entorno.")

    result = cloudinary.uploader.upload(
        file.file,
        folder=folder,
        resource_type="image",
    )
    return result["secure_url"]


async def upload_pdf(file: UploadFile, folder: str = "bioyoga/pdfs") -> str:
    """
    Sube un PDF a Cloudinary y retorna la URL segura.
    """
    if not is_configured():
        raise Exception("Cloudinary no está configurado. Revisa las variables de entorno.")

    import re
    import uuid
    from pathlib import PurePath

    original_name = PurePath(file.filename or "").name
    base_name = re.sub(r"\.[^.]+$", "", original_name) if original_name else ""
    safe_base = re.sub(r"[^a-zA-Z0-9_-]+", "_", base_name).strip("_-")
    if not safe_base:
        safe_base = "document"

    # For raw resources, Cloudinary supports/encourages including the file extension in public_id.
    # This makes the delivered URL end with `.pdf`, so browsers/Windows keep the right extension.
    suffix = uuid.uuid4().hex[:8]
    public_id = f"{safe_base}-{suffix}.pdf"

    result = cloudinary.uploader.upload(
        file.file,
        folder=folder,
        public_id=public_id,
        resource_type="raw",
        overwrite=False,
    )
    return result["secure_url"]


async def delete_file(public_id: str, resource_type: str = "image") -> bool:
    """
    Elimina un archivo de Cloudinary por su public_id.
    resource_type: 'image' para imágenes, 'raw' para PDFs.
    """
    if not is_configured():
        raise Exception("Cloudinary no está configurado.")

    result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    return result.get("result") == "ok"


def extract_cloudinary_info(url: str) -> tuple[str, str, str]:
    """
    Extracts (public_id, resource_type, delivery_type) from a Cloudinary URL.
    resource_type: image, raw, video
    delivery_type: upload, authenticated, private
    """
    from urllib.parse import urlparse
    import re

    path = (urlparse(url).path or "").strip("/")
    if not path:
        return "", "image", "upload"

    parts = [p for p in path.split("/") if p]
    
    # Cloudinary segments: .../<resource_type>/<delivery_type>/...
    # Known resource types
    resource_types = {"image", "raw", "video"}
    # Known delivery types
    delivery_types = {"upload", "authenticated", "private", "authenticated_raw", "multi"}
    
    res_type = "image"
    del_type = "upload"
    type_idx = -1
    
    # Search for delivery type first as it's the most reliable anchor
    for i, part in enumerate(parts):
        if part in delivery_types:
            type_idx = i
            del_type = part
            # The part immediately before the delivery type is usually the resource type
            if i > 0 and parts[i-1] in resource_types:
                res_type = parts[i-1]
            break
            
    if type_idx == -1:
        return "", "image", "upload"

    rest = parts[type_idx + 1 :]
    # Skip version (v1234567)
    if rest and (re.fullmatch(r"v\d+", rest[0]) or rest[0].isdigit()):
        rest = rest[1:]

    if not rest:
        return "", res_type, del_type

    public_id = "/".join(rest)

    
    # For images and videos, Cloudinary handles public_id WITHOUT extension
    if res_type in {"image", "video"}:
        public_id = re.sub(r"\.[^.]+$", "", public_id)
    
    return public_id, res_type, del_type


def extract_public_id_with_type(url: str, resource_type: str = "image") -> tuple[str, str]:
    """Legacy helper for backward compatibility."""
    pid, _, dtype = extract_cloudinary_info(url)
    return pid, dtype


def extract_public_id(url: str, resource_type: str = "image") -> str:
    """Legacy helper."""
    pid, _, _ = extract_cloudinary_info(url)
    return pid




async def delete_image_by_url(url: str) -> bool:
    """Elimina una imagen de Cloudinary dada su URL."""
    public_id = extract_public_id(url, resource_type="image")
    if not public_id:
        return False
    return await delete_file(public_id, resource_type="image")


async def delete_pdf_by_url(url: str) -> bool:
    """Elimina un PDF de Cloudinary dada su URL."""
    public_id = extract_public_id(url, resource_type="raw")
    if not public_id:
        return False
    return await delete_file(public_id, resource_type="raw")


def build_signed_url(public_id: str, resource_type: str = "image", delivery_type: str = "upload") -> str:
    """Build a signed Cloudinary delivery URL for any asset.
    """
    if not is_configured():
        raise Exception("Cloudinary no está configurado.")

    url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        resource_type=resource_type,
        type=delivery_type,
        secure=True,
        sign_url=True,
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
    )
    return url


def build_signed_raw_url(public_id: str, delivery_type: str = "upload") -> str:
    """Legacy helper."""
    return build_signed_url(public_id, resource_type="raw", delivery_type=delivery_type)



