import os
import uuid
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from repositories.user_repository import UserRepository
from services.email_service import send_validation_email, send_password_reset_email
from models.schemas import UserCreate
from datetime import datetime, timedelta, timezone
from jose import jwt
import random
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


class AuthService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    async def register_user(self, user_in: UserCreate, frontend_url: str = None):
        if self.repository.get_by_email(user_in.email):
            return None, "El email ya está registrado"

        if self.repository.get_by_dni(user_in.dni):
            return None, "El DNI ya está registrado"

        validation_token = str(uuid.uuid4())
        hashed_password = pwd_context.hash(user_in.password)

        user_data = user_in.model_dump(exclude={"password"})
        user_data["hashed_password"] = hashed_password
        user_data["validation_token"] = validation_token
        user_data["is_active"] = False

        user = self.repository.create(user_data)

        # Send validation email (non-blocking: registration succeeds even if email fails)
        try:
            await send_validation_email(user.email, user.first_name, validation_token, frontend_url=frontend_url)
        except Exception as e:
            print(f"[WARNING] No se pudo enviar el email de validación: {e}")

        return user, None

    def validate_user_email(self, token: str):
        user = self.repository.get_by_validation_token(token)
        if not user:
            return False, "Token inválido o expirado"

        user.is_active = True
        user.validation_token = None
        self.repository.update(user)
        return True, "Cuenta validada con éxito"

    def authenticate_user(self, email: str, password: str):
        user = self.repository.get_by_email(email)
        if not user or not pwd_context.verify(password, user.hashed_password):
            return None, "Credenciales incorrectas"

        if not user.is_active:
            return None, "Por favor valida tu email antes de ingresar"

        access_token = self._create_access_token(
            data={"sub": user.email, "is_admin": user.is_admin}
        )
        return {"access_token": access_token, "token_type": "bearer"}, None

    def _create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    async def request_password_reset(self, email: str):
        user = self.repository.get_by_email(email)
        if not user:
            # Para evitar enumeración de usuarios, siempre devolvemos éxito incluso si no existe
            return True, "Si el email existe, se envió un código de recuperación."

        # Generar código de 6 dígitos
        token = str(random.randint(100000, 999999))
        
        # Expiración 2 minutos (timezone-aware as per sqlalchemy configuration sometimes, but datetime.utcnow() is used above, let's use timezone-aware for consistency if needed, but db expects naive or timezone-aware based on db. We will use UTC timezone aware)
        expiration = datetime.now(timezone.utc) + timedelta(minutes=2)
        
        user.reset_password_token = token
        user.reset_password_expires = expiration
        self.repository.update(user)

        # Enviar email
        try:
            await send_password_reset_email(user.email, user.first_name, token)
        except Exception as e:
            print(f"[WARNING] No se pudo enviar el email de recuperación: {e}")
            return False, "Error al enviar el email de recuperación."

        return True, "Si el email existe, se envió un código de recuperación."

    def confirm_password_reset(self, token: str, new_password: str):
        user = self.repository.get_by_reset_token(token)
        if not user:
            return False, "Token inválido."

        # Verificar si expiró
        now = datetime.now(timezone.utc)
        if not user.reset_password_expires:
             return False, "Token inválido."
             
        # Si la db lo devuelve como naive, lo convertimos (a veces pasa en SQLite/Postgres)
        expires = user.reset_password_expires
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)

        if now > expires:
            return False, "El código ha expirado."

        # Actualizar contraseña
        user.hashed_password = pwd_context.hash(new_password)
        user.reset_password_token = None
        user.reset_password_expires = None
        self.repository.update(user)

        return True, "Contraseña actualizada exitosamente."

    def change_password(self, user, current_password: str, new_password: str):
        if not pwd_context.verify(current_password, user.hashed_password):
            return False, "La contraseña actual es incorrecta."

        user.hashed_password = pwd_context.hash(new_password)
        self.repository.update(user)
        return True, "Contraseña cambiada exitosamente."
