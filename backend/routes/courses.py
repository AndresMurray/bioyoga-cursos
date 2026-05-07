from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.session import get_db
from models.schemas import (
    CourseCreate, CourseUpdate, CourseResponse, CourseListResponse
)
from services.course_service import CourseService
from dependencies import require_admin

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=list[CourseListResponse])
async def list_courses(visible_only: bool = False, db: Session = Depends(get_db)):
    """
    Lista de cursos. Pública si visible_only=true, completa para admins.
    """
    service = CourseService(db)
    return service.list_courses(only_visible=visible_only)


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: int, db: Session = Depends(get_db)):
    """
    Detalle de un curso con sus clases.
    """
    service = CourseService(db)
    course, error = service.get_course(course_id)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return course


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_in: CourseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Crear un curso (solo admin).
    """
    service = CourseService(db)
    course, error = service.create_course(course_in)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return course


@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: int,
    course_in: CourseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Editar un curso (solo admin).
    """
    service = CourseService(db)
    course, error = service.update_course(course_id, course_in)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Eliminar un curso y sus clases (solo admin).
    """
    service = CourseService(db)
    success, error = service.delete_course(course_id)
    if error:
        raise HTTPException(status_code=404, detail=error)
