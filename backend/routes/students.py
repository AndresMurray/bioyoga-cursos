from fastapi import APIRouter, Depends, HTTPException, Query, Header
import os
from sqlalchemy.orm import Session
from database.session import get_db
from models.schemas import PaginatedStudentsResponse, EnrollmentResponse
from services.student_service import StudentService
from dependencies import require_admin

router = APIRouter(prefix="/admin/students", tags=["Admin - Students"])

@router.get("/check-expired")
async def trigger_check_expired(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    cron_secret = os.getenv("CRON_SECRET")
    if cron_secret:
        if not authorization or authorization != f"Bearer {cron_secret}":
            raise HTTPException(status_code=401, detail="Unauthorized")
            
    service = StudentService(db)
    await service.check_and_expire_enrollments()
    return {"message": "Chequeo de vencimientos completado y notificaciones enviadas si corresponde."}

@router.get("", response_model=PaginatedStudentsResponse)
async def list_students(
    page: int = Query(1, ge=1),
    size: int = Query(5, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    service = StudentService(db)
    return await service.list_students(page, size, search)

@router.post("/{user_id}/enroll/{course_id}", response_model=EnrollmentResponse)
async def enroll_student(
    user_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    service = StudentService(db)
    enrollment, error = await service.enroll_student(user_id, course_id)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return enrollment

@router.delete("/{user_id}/courses/{course_id}")
async def unenroll_student(
    user_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    service = StudentService(db)
    success, error = await service.unenroll_student(user_id, course_id)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return {"message": "Acceso removido correctamente"}
