from sqlalchemy.orm import Session
from repositories.course_repository import CourseRepository
from models.schemas import CourseCreate, CourseUpdate


class CourseService:
    def __init__(self, db: Session):
        self.repository = CourseRepository(db)

    def list_courses(self, only_visible: bool = False):
        if only_visible:
            return self.repository.get_visible()
        return self.repository.get_all()

    def get_course(self, course_id: int):
        course = self.repository.get_by_id(course_id)
        if not course:
            return None, "Curso no encontrado"
        return course, None

    def create_course(self, course_in: CourseCreate):
        data = course_in.model_dump()
        course = self.repository.create(data)
        return course, None

    def update_course(self, course_id: int, course_in: CourseUpdate):
        course = self.repository.get_by_id(course_id)
        if not course:
            return None, "Curso no encontrado"

        update_data = course_in.model_dump(exclude_unset=True)
        if not update_data:
            return course, None

        updated = self.repository.update(course, update_data)
        return updated, None

    def delete_course(self, course_id: int):
        course = self.repository.get_by_id(course_id)
        if not course:
            return False, "Curso no encontrado"

        self.repository.delete(course)
        return True, None
