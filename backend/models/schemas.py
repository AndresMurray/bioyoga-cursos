from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import date
from typing import Optional
import re

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="El email debe tener un formato válido.")
    first_name: str = Field(..., min_length=1, description="El nombre no puede estar vacío.")
    last_name: str = Field(..., min_length=1, description="El apellido no puede estar vacío.")
    dni: str = Field(..., min_length=7, max_length=10, description="El DNI debe tener entre 7 y 10 dígitos.")
    birth_date: date
    phone: str = Field(..., min_length=1, description="El celular no puede estar vacío.")
    country: str = Field(..., min_length=1, description="El país no puede estar vacío.")
    province: str = Field(..., min_length=1, description="La provincia no puede estar vacía.")
    city: str = Field(..., min_length=1, description="La ciudad no puede estar vacía.")

    @field_validator('dni')
    @classmethod
    def dni_must_be_digits(cls, v):
        if not re.match(r'^\d+$', v):
            raise ValueError('El DNI debe contener solo números.')
        return v

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="La contraseña debe tener al menos 6 caracteres.")


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
