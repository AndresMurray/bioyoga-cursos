from sqlalchemy.orm import Session
from repositories.course_repository import CourseRepository
from models.schemas import CourseCreate, CourseUpdate
from services import cloudinary_service


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

    async def delete_course(self, course_id: int):
        course = self.repository.get_by_id(course_id)
        if not course:
            return False, "Curso no encontrado"

        if self.repository.has_active_enrollments(course_id):
            return False, "No se puede eliminar el curso porque tiene alumnos con acceso habilitado. Primero debe dar de baja las inscripciones activas."

        # 1. Borrar imágenes del curso de Cloudinary
        for img in course.images:
            if img.url:
                try:
                    await cloudinary_service.delete_image_by_url(img.url)
                except Exception as e:
                    print(f"Error al borrar la imagen de portada {img.id} del curso {course_id} en Cloudinary: {e}")

        # 2. Borrar recursos de las clases de Cloudinary
        for lesson in course.lessons:
            if lesson.image_url:
                try:
                    await cloudinary_service.delete_image_by_url(lesson.image_url)
                except Exception as e:
                    print(f"Error al borrar la imagen de la clase {lesson.id} en Cloudinary: {e}")

            for pdf in lesson.pdfs:
                if pdf.url:
                    try:
                        await cloudinary_service.delete_pdf_by_url(pdf.url)
                    except Exception as e:
                        print(f"Error al borrar el PDF {pdf.id} de la clase {lesson.id} en Cloudinary: {e}")

        self.repository.delete(course)
        return True, None

