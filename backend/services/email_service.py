import os
import httpx
from dotenv import load_dotenv

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "[EMAIL_ADDRESS]")
SENDER_NAME = os.getenv("SENDER_NAME", "Centra Kinesiología")
FRONTEND_URL = os.getenv("FRONTEND_URL")

async def send_validation_email(email: str, first_name: str, token: str):
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }
    
    validation_link = f"{FRONTEND_URL}/validate?token={token}"
    
    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": email, "name": first_name}],
        "subject": "Valida tu cuenta - Centra Kinesiología",
        "htmlContent": f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #4a3f35;">
                    <h2 style="color: #f8b4a6;">¡Hola {first_name}!</h2>
                    <p>Gracias por registrarte en Centra. Para activar tu cuenta y acceder a tus cursos, por favor haz clic en el siguiente botón:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{validation_link}" 
                           style="background-color: #f8b4a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                           Validar mi cuenta
                        </a>
                    </div>
                    <p>O copia y pega este link en tu navegador:</p>
                    <p>{validation_link}</p>
                    <br>
                    <p>Saludos,<br>El equipo de Centra</p>
                </body>
            </html>
        """
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        if response.status_code != 201:
            print(f"Error sending email: {response.text}")
            return False
        return True


async def send_enrollment_email(email: str, first_name: str, course_title: str, duration_days: int):
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": email, "name": first_name}],
        "subject": f"¡Ya tenés acceso al curso: {course_title}! - Centra Kinesiología",
        "htmlContent": f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #4a3f35;">
                    <h2 style="color: #f8b4a6;">¡Hola {first_name}!</h2>
                    <p>¡Buenas noticias! Ya tenés acceso al curso <strong>{course_title}</strong>.</p>
                    <div style="background-color: #fdf2f0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                        <p style="font-size: 18px; margin: 0; color: #4a3f35;">
                            <strong>Duración de tu acceso:</strong> {duration_days} días
                        </p>
                    </div>
                    <p>Ingresá a tu cuenta para empezar a disfrutar del contenido.</p>
                    <br>
                    <p>Saludos,<br>El equipo de Centra</p>
                </body>
            </html>
        """
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        if response.status_code != 201:
            print(f"Error sending enrollment email: {response.text}")
            return False
        return True
