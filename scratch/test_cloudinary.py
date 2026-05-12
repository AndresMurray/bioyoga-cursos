import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.cloudinary_service import extract_public_id_with_type

urls = [
    "https://res.cloudinary.com/demo/image/upload/v123/sample.jpg",
    "https://res.cloudinary.com/demo/raw/upload/v123/centra/pdfs/test.pdf",
    "https://res.cloudinary.com/demo/raw/authenticated/v123/centra/pdfs/test.pdf",
    "https://res.cloudinary.com/demo/raw/private/v123/centra/pdfs/test.pdf",
    "https://res.cloudinary.com/demo/raw/upload/centra/pdfs/test.pdf",
]

for url in urls:
    pid, dtype = extract_public_id_with_type(url, resource_type="raw" if ".pdf" in url else "image")
    print(f"URL: {url}")
    print(f"PID: {pid}, Type: {dtype}")
    print("-" * 20)
