import os
import httpx
from dotenv import load_dotenv

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "[EMAIL_ADDRESS]")
SENDER_NAME = os.getenv("SENDER_NAME")
FRONTEND_URL = os.getenv("FRONTEND_URL")

async def send_validation_email(email: str, first_name: str, token: str, frontend_url: str = None):
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }
    
    # Prioritize provided frontend_url (from request origin), fallback to env var
    base_url = (frontend_url or FRONTEND_URL or "http://localhost:3000").rstrip('/')
    validation_link = f"{base_url}/validate?token={token}"
    
    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": email, "name": first_name}],
        "subject": "Activá tu cuenta - BioYoga Consciente 🌿",
        "htmlContent": f"""
            <html>
                <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.7; color: #3d312a; background-color: #faf7f2; padding: 40px 20px; margin: 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #c7e0d4; padding: 40px; box-shadow: 0 4px 12px rgba(74, 107, 83, 0.05);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <span style="font-size: 40px;">🌿</span>
                            <h2 style="color: #4a6b53; font-family: Georgia, serif; font-size: 28px; margin-top: 10px; margin-bottom: 0;">BioYoga Consciente</h2>
                        </div>
                        <h3 style="color: #3d312a; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">¡Hola, {first_name}!</h3>
                        <p style="font-size: 16px; margin-bottom: 25px;">
                            Te damos la bienvenida a nuestro espacio. Para activar tu cuenta de alumno y acceder de inmediato a todos tus cursos y recursos interactivos, por favor haz clic en el siguiente botón:
                        </p>
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="{validation_link}" 
                               style="background-color: #4a6b53; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(74, 107, 83, 0.2); transition: all 0.3s;">
                               Confirmar Cuenta
                            </a>
                        </div>
                        <p style="font-size: 13px; color: #7c6c62; margin-top: 30px;">
                            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                        </p>
                        <p style="font-size: 12px; color: #4a6b53; word-break: break-all; margin-top: 5px;">
                            {validation_link}
                        </p>
                        <hr style="border: 0; border-top: 1px solid #c7e0d4; margin: 30px 0;" />
                        <p style="font-size: 14px; color: #7c6c62; margin-bottom: 0;">
                            Con amor y presencia,<br />
                            <strong>El equipo de BioYoga Consciente</strong>
                        </p>
                    </div>
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
        "subject": f"¡Ya tenés acceso al curso: {course_title}! - BioYoga Consciente 🧘‍♂️",
        "htmlContent": f"""
            <html>
                <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.7; color: #3d312a; background-color: #faf7f2; padding: 40px 20px; margin: 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #c7e0d4; padding: 40px; box-shadow: 0 4px 12px rgba(74, 107, 83, 0.05);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <span style="font-size: 40px;">🧘‍♂️</span>
                            <h2 style="color: #4a6b53; font-family: Georgia, serif; font-size: 28px; margin-top: 10px; margin-bottom: 0;">BioYoga Consciente</h2>
                        </div>
                        <h3 style="color: #3d312a; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">¡Hola, {first_name}!</h3>
                        <p style="font-size: 16px; margin-bottom: 20px;">
                            ¡Es hora de conectar! Te confirmamos que ya tienes acceso activo al curso: <strong>{course_title}</strong>.
                        </p>
                        <div style="background-color: #faf7f2; border: 1px solid #c7e0d4; border-radius: 16px; padding: 20px; margin: 25px 0; text-align: center;">
                            <p style="font-size: 16px; margin: 0; color: #3d312a;">
                                <strong>Período de acceso disponible:</strong>
                            </p>
                            <p style="font-size: 22px; font-weight: bold; margin: 5px 0 0 0; color: #4a6b53;">
                                {duration_days} días
                            </p>
                        </div>
                        <p style="font-size: 16px; margin-bottom: 25px;">
                            Ya puedes ingresar a tu panel personal de alumno para empezar a transitar este camino de aprendizaje y movimiento consciente.
                        </p>
                        <hr style="border: 0; border-top: 1px solid #c7e0d4; margin: 30px 0;" />
                        <p style="font-size: 14px; color: #7c6c62; margin-bottom: 0;">
                            Te deseamos una excelente práctica,<br />
                            <strong>El equipo de BioYoga Consciente</strong>
                        </p>
                    </div>
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

async def send_password_reset_email(email: str, first_name: str, token: str):
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": email, "name": first_name}],
        "subject": "Recuperá tu contraseña - BioYoga Consciente 🔑",
        "htmlContent": f"""
            <html>
                <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.7; color: #3d312a; background-color: #faf7f2; padding: 40px 20px; margin: 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #c7e0d4; padding: 40px; box-shadow: 0 4px 12px rgba(74, 107, 83, 0.05);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <span style="font-size: 40px;">🔑</span>
                            <h2 style="color: #4a6b53; font-family: Georgia, serif; font-size: 28px; margin-top: 10px; margin-bottom: 0;">BioYoga Consciente</h2>
                        </div>
                        <h3 style="color: #3d312a; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">¡Hola, {first_name}!</h3>
                        <p style="font-size: 16px;">
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta en la plataforma de BioYoga Consciente.
                        </p>
                        <p style="font-size: 15px; margin-bottom: 20px;">
                            Ingresa el siguiente código de 6 dígitos en la pantalla de verificación para restablecer tu acceso. <strong>Este código es válido únicamente por 2 minutos:</strong>
                        </p>
                        <div style="background-color: #faf7f2; border: 1px solid #c7e0d4; border-radius: 16px; padding: 25px; margin: 25px 0; text-align: center;">
                            <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 0; color: #4a6b53;">
                                {token}
                            </p>
                        </div>
                        <p style="font-size: 14px; color: #7c6c62;">
                            Si no realizaste esta solicitud, puedes ignorar este correo tranquilamente; tu contraseña seguirá siendo la misma.
                        </p>
                        <hr style="border: 0; border-top: 1px solid #c7e0d4; margin: 30px 0;" />
                        <p style="font-size: 14px; color: #7c6c62; margin-bottom: 0;">
                            Saludos cordiales,<br />
                            <strong>El equipo de BioYoga Consciente</strong>
                        </p>
                    </div>
                </body>
            </html>
        """
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        if response.status_code != 201:
            print(f"Error sending password reset email: {response.text}")
            return False
        return True


async def send_expiration_email(student_email: str, course_title: str):
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [
            {"email": "amurrayroppel@gmail.com", "name": "Andrés Murray"},
            {"email": "bioyogasistema@gmail.com", "name": "BioYoga Consciente"}
        ],
        "subject": f"Acceso Finalizado: {student_email} - {course_title}",
        "htmlContent": f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #3d312a;">
                    <h2 style="color: #d9534f;">Aviso de finalización de acceso - BioYoga</h2>
                    <p>Al alumno <strong>{student_email}</strong> se le ha terminado el tiempo de acceso configurado para el curso <strong>{course_title}</strong>.</p>
                    <p style="font-weight: bold; color: #d9534f; font-size: 16px;">
                        Por favor, retira el acceso de la carpeta de Drive si corresponde.
                    </p>
                    <br>
                    <p>Saludos,<br>Sistema BioYoga Consciente</p>
                </body>
            </html>
        """
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        if response.status_code != 201:
            print(f"Error sending expiration email: {response.text}")
            return False
        return True

