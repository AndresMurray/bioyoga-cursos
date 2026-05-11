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
from fastapi import UploadFile

if is_configured():
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
    )


async def upload_image(file: UploadFile, folder: str = "centra/images") -> str:
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


async def upload_pdf(file: UploadFile, folder: str = "centra/pdfs") -> str:
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


def extract_public_id(url: str, resource_type: str = "image") -> str:
    """
    Extrae el public_id de una URL de Cloudinary.

    - Para `resource_type="image"` o `"video"`: el public_id NO incluye extensión.
    - Para `resource_type="raw"`: el public_id PUEDE/DEBE incluir extensión (ej `.pdf`).

    Ejemplos:
    - https://res.cloudinary.com/xxx/image/upload/v123/centra/images/abc123.jpg
      -> centra/images/abc123
    - https://res.cloudinary.com/xxx/raw/upload/v123/centra/pdfs/file-1a2b3c4d.pdf
      -> centra/pdfs/file-1a2b3c4d.pdf
    """
    from urllib.parse import urlparse
    import re

    path = (urlparse(url).path or "").strip("/")
    if not path:
        return ""

    parts = [p for p in path.split("/") if p]
    try:
        upload_idx = parts.index("upload")
    except ValueError:
        return ""

    rest = parts[upload_idx + 1 :]
    if rest and re.fullmatch(r"v\d+", rest[0]):
        rest = rest[1:]

    if not rest:
        return ""

    public_id = "/".join(rest)
    if resource_type in {"image", "video"}:
        public_id = re.sub(r"\.[^.]+$", "", public_id)
    return public_id


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
