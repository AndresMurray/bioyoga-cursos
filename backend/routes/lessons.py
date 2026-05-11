from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.session import get_db
from models.schemas import LessonCreate, LessonUpdate, LessonResponse
from services.lesson_service import LessonService
from dependencies import require_admin, get_current_user, get_current_user_optional

router = APIRouter(tags=["Lessons"])


@router.get("/courses/{course_id}/lessons", response_model=list[LessonResponse])
async def list_lessons(
    course_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """
    Listar clases de un curso. Requiere acceso (enrolamiento o admin).
    """
    service = LessonService(db)
    user_id = current_user.id if current_user else None
    is_admin = current_user.is_admin if current_user else False
    
    lessons, error = service.list_lessons(course_id, user_id=user_id, is_admin=is_admin)
    if error:
        status_code = 404 if "no encontrado" in error else 403
        raise HTTPException(status_code=status_code, detail=error)
    return lessons


@router.post(
    "/courses/{course_id}/lessons",
    response_model=LessonResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_lesson(
    course_id: int,
    lesson_in: LessonCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Crear una clase dentro de un curso (solo admin).
    """
    service = LessonService(db)
    lesson, error = service.create_lesson(course_id, lesson_in)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return lesson


@router.put("/lessons/{lesson_id}", response_model=LessonResponse)
async def update_lesson(
    lesson_id: int,
    lesson_in: LessonUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Editar una clase (solo admin).
    """
    service = LessonService(db)
    lesson, error = service.update_lesson(lesson_id, lesson_in)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return lesson


@router.delete("/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Eliminar una clase (solo admin).
    """
    service = LessonService(db)
    success, error = service.delete_lesson(lesson_id)
    if error:
        raise HTTPException(status_code=404, detail=error)
