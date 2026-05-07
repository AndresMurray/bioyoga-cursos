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

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")


def is_configured() -> bool:
    """Check if Cloudinary credentials are set."""
    return bool(CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET)


# TODO: Descomentar cuando se tengan las credenciales de Cloudinary
#
# import cloudinary
# import cloudinary.uploader
#
# if is_configured():
#     cloudinary.config(
#         cloud_name=CLOUDINARY_CLOUD_NAME,
#         api_key=CLOUDINARY_API_KEY,
#         api_secret=CLOUDINARY_API_SECRET,
#     )
#
#
# async def upload_image(file, folder: str = "centra/images") -> str:
#     """
#     Sube una imagen a Cloudinary y retorna la URL segura.
#     Args:
#         file: archivo (UploadFile de FastAPI)
#         folder: carpeta destino en Cloudinary
#     Returns:
#         URL segura de la imagen subida
#     """
#     if not is_configured():
#         raise Exception("Cloudinary no está configurado. Revisa las variables de entorno.")
#
#     result = cloudinary.uploader.upload(
#         file.file,
#         folder=folder,
#         resource_type="image",
#     )
#     return result["secure_url"]
#
#
# async def upload_pdf(file, folder: str = "centra/pdfs") -> str:
#     """
#     Sube un PDF a Cloudinary y retorna la URL segura.
#     """
#     if not is_configured():
#         raise Exception("Cloudinary no está configurado. Revisa las variables de entorno.")
#
#     result = cloudinary.uploader.upload(
#         file.file,
#         folder=folder,
#         resource_type="raw",
#     )
#     return result["secure_url"]
#
#
# async def delete_file(public_id: str) -> bool:
#     """
#     Elimina un archivo de Cloudinary por su public_id.
#     """
#     if not is_configured():
#         raise Exception("Cloudinary no está configurado.")
#
#     result = cloudinary.uploader.destroy(public_id)
#     return result.get("result") == "ok"
