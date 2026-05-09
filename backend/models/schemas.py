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


# ── Course Schemas ──────────────────────────────

class LessonPdfBase(BaseModel):
    title: str
    url: str

class LessonPdfResponse(LessonPdfBase):
    id: int
    lesson_id: int

    class Config:
        from_attributes = True

class CourseImageBase(BaseModel):
    url: str

class CourseImageResponse(CourseImageBase):
    id: int
    course_id: int

    class Config:
        from_attributes = True

class LessonBase(BaseModel):
    title: str = Field(..., min_length=1, description="El título no puede estar vacío.")
    description: Optional[str] = None
    image_url: Optional[str] = None
    link_drive: Optional[str] = None
    pdfs: Optional[list[LessonPdfBase]] = []
    order: Optional[int] = 0

class LessonCreate(LessonBase):
    pass

class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    link_drive: Optional[str] = None
    pdfs: Optional[list[LessonPdfBase]] = None
    order: Optional[int] = None

class LessonResponse(LessonBase):
    id: int
    course_id: int
    pdfs: list[LessonPdfResponse] = []

    class Config:
        from_attributes = True


class CourseBase(BaseModel):
    title: str = Field(..., min_length=1, description="El título no puede estar vacío.")
    description: Optional[str] = None
    images: Optional[list[CourseImageBase]] = []
    duracion_dias: int = Field(30, ge=1, description="Debe ser al menos 1 día.")
    link_pago: Optional[str] = None
    is_visible: bool = False

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    images: Optional[list[CourseImageBase]] = None
    duracion_dias: Optional[int] = None
    link_pago: Optional[str] = None
    is_visible: Optional[bool] = None

class CourseResponse(CourseBase):
    id: int
    images: list[CourseImageResponse] = []
    lessons: list[LessonResponse] = []

    class Config:
        from_attributes = True

class CourseListResponse(BaseModel):
    """Lightweight response without lessons for list endpoints."""
    id: int
    title: str
    description: Optional[str] = None
    images: list[CourseImageResponse] = []
    duracion_dias: int
    link_pago: Optional[str] = None
    is_visible: bool

    class Config:
        from_attributes = True
