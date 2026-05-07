from sqlalchemy.orm import Session
from repositories.lesson_repository import LessonRepository
from repositories.course_repository import CourseRepository
from models.schemas import LessonCreate, LessonUpdate


class LessonService:
    def __init__(self, db: Session):
        self.repository = LessonRepository(db)
        self.course_repository = CourseRepository(db)

    def list_lessons(self, course_id: int):
        course = self.course_repository.get_by_id(course_id)
        if not course:
            return None, "Curso no encontrado"
        return self.repository.get_all_by_course(course_id), None

    def get_lesson(self, lesson_id: int):
        lesson = self.repository.get_by_id(lesson_id)
        if not lesson:
            return None, "Clase no encontrada"
        return lesson, None

    def create_lesson(self, course_id: int, lesson_in: LessonCreate):
        course = self.course_repository.get_by_id(course_id)
        if not course:
            return None, "Curso no encontrado"

        data = lesson_in.model_dump()
        data["course_id"] = course_id

        # Auto-assign order if not provided or 0
        if not data.get("order"):
            data["order"] = self.repository.get_next_order(course_id)

        lesson = self.repository.create(data)
        return lesson, None

    def update_lesson(self, lesson_id: int, lesson_in: LessonUpdate):
        lesson = self.repository.get_by_id(lesson_id)
        if not lesson:
            return None, "Clase no encontrada"

        update_data = lesson_in.model_dump(exclude_unset=True)
        if not update_data:
            return lesson, None

        updated = self.repository.update(lesson, update_data)
        return updated, None

    def delete_lesson(self, lesson_id: int):
        lesson = self.repository.get_by_id(lesson_id)
        if not lesson:
            return False, "Clase no encontrada"

        self.repository.delete(lesson)
        return True, None
