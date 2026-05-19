from sqlalchemy.orm import Session
from repositories.user_repository import UserRepository
from repositories.enrollment_repository import EnrollmentRepository
from repositories.course_repository import CourseRepository
from services.email_service import send_enrollment_email, send_expiration_email
from datetime import datetime, timedelta

class StudentService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.enrollment_repo = EnrollmentRepository(db)
        self.course_repo = CourseRepository(db)

    async def list_students(self, page: int, size: int, search: str = None):
        await self.check_and_expire_enrollments()
        users, total, pages = self.user_repo.get_paginated_students(page, size, search)
        
        student_items = []
        for user in users:
            active_enrollments = self.enrollment_repo.get_active_by_user(user.id)
            active_courses = [
                {
                    "id": e.course.id,
                    "title": e.course.title,
                    "end_date": e.end_date
                } for e in active_enrollments
            ]
            
            student_items.append({
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "dni": user.dni,
                "active_courses": active_courses
            })
            
        return {
            "total": total,
            "page": page,
            "size": size,
            "pages": pages,
            "items": student_items
        }

    async def enroll_student(self, user_id: int, course_id: int):
        course = self.course_repo.get_by_id(course_id)
        if not course:
            return None, "Curso no encontrado"
            
        existing_enrollment = self.enrollment_repo.get_by_user_and_course(user_id, course_id)
        
        start_date = datetime.now()
        end_date = start_date + timedelta(days=course.duracion_dias)
        
        if existing_enrollment:
            existing_enrollment.start_date = start_date
            existing_enrollment.end_date = end_date
            existing_enrollment.is_active = True
            enrollment = self.enrollment_repo.update(existing_enrollment)
        else:
            enrollment_data = {
                "user_id": user_id,
                "course_id": course_id,
                "start_date": start_date,
                "end_date": end_date,
                "is_active": True
            }
            enrollment = self.enrollment_repo.create(enrollment_data)

        # Send enrollment notification email (non-blocking)
        user = self.user_repo.get_by_id(user_id)
        if user:
            try:
                await send_enrollment_email(
                    email=user.email,
                    first_name=user.first_name,
                    course_title=course.title,
                    duration_days=course.duracion_dias
                )
            except Exception as e:
                print(f"[WARNING] No se pudo enviar el email de inscripción: {e}")

        return enrollment, None

    async def check_and_expire_enrollments(self):
        expired = self.enrollment_repo.get_expired_active_enrollments()
        for enrollment in expired:
            enrollment.is_active = False
            self.enrollment_repo.update(enrollment)
            try:
                await send_expiration_email(
                    student_email=enrollment.user.email,
                    course_title=enrollment.course.title
                )
            except Exception as e:
                print(f"[WARNING] No se pudo enviar el email de expiración automática para {enrollment.user.email}: {e}")

    async def unenroll_student(self, user_id: int, course_id: int):
        enrollment = self.enrollment_repo.get_by_user_and_course(user_id, course_id)
        if not enrollment:
            return False, "Inscripción no encontrada"
            
        enrollment.is_active = False
        self.enrollment_repo.update(enrollment)

        # Send expiration email
        try:
            await send_expiration_email(
                student_email=enrollment.user.email,
                course_title=enrollment.course.title
            )
        except Exception as e:
            print(f"[WARNING] No se pudo enviar el email de expiración manual: {e}")

        return True, None

    async def get_user_courses(self, user_id: int):
        await self.check_and_expire_enrollments()
        enrollments = self.enrollment_repo.get_active_by_user(user_id)
        courses = []
        for e in enrollments:
            course = e.course
            courses.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "images": [{"url": img.url} for img in course.images],
                "duracion_dias": course.duracion_dias,
                "price": course.price,
                "discount_percentage": course.discount_percentage,
                "is_visible": course.is_visible,
                "end_date": e.end_date # Add end_date for client view
            })
        return courses
