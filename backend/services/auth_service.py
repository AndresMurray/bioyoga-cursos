import os
import uuid
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from repositories.user_repository import UserRepository
from services.email_service import send_validation_email
from models.schemas import UserCreate
from datetime import datetime, timedelta
from jose import jwt
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
