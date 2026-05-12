from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional, Tuple

from sqlalchemy.orm import Session

from repositories.enrollment_repository import EnrollmentRepository
from repositories.lesson_repository import LessonRepository


@dataclass(frozen=True)
class PdfAccessResult:
    ok: bool
    error: Optional[str] = None


class PdfService:
    def __init__(self, db: Session):
        self.db = db
        self.lesson_repository = LessonRepository(db)
        self.enrollment_repository = EnrollmentRepository(db)

    def _normalize_dt_utc(self, dt: datetime) -> datetime:
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)

    def can_user_access_course(self, *, course_id: int, current_user) -> PdfAccessResult:
        if getattr(current_user, "is_admin", False):
            return PdfAccessResult(ok=True)

        user_id = getattr(current_user, "id", None)
        if not user_id:
            return PdfAccessResult(ok=False, error="Usuario no autenticado")

        enrollment = self.enrollment_repository.get_by_user_and_course(user_id, course_id)
        if not enrollment or not enrollment.is_active:
            return PdfAccessResult(ok=False, error="No tenés acceso a este curso")

        now = datetime.now(timezone.utc)
        end_date = self._normalize_dt_utc(enrollment.end_date)
        if end_date < now:
            return PdfAccessResult(ok=False, error="Tu acceso a este curso ha expirado")

        return PdfAccessResult(ok=True)

    def get_pdf_with_lesson(self, pdf_id: int):
        return self.lesson_repository.get_pdf_by_id(pdf_id)

    def validate_pdf_access(self, *, pdf_id: int, current_user) -> Tuple[Optional[object], Optional[str]]:
        pdf = self.get_pdf_with_lesson(pdf_id)
        if not pdf:
            return None, "PDF no encontrado"

        lesson = getattr(pdf, "lesson", None)
        if not lesson:
            return None, "Clase no encontrada"

        course_id = getattr(lesson, "course_id", None)
        if not course_id:
            return None, "Curso no encontrado"

        access = self.can_user_access_course(course_id=course_id, current_user=current_user)
        if not access.ok:
            return None, access.error or "No tenés acceso a este curso"

        return pdf, None
