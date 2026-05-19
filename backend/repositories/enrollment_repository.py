from sqlalchemy.orm import Session
from models.enrollment import Enrollment
from datetime import datetime

class EnrollmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, enrollment_data: dict):
        db_enrollment = Enrollment(**enrollment_data)
        self.db.add(db_enrollment)
        self.db.commit()
        self.db.refresh(db_enrollment)
        return db_enrollment

    def get_active_by_user(self, user_id: int):
        now = datetime.now()
        return self.db.query(Enrollment).filter(
            Enrollment.user_id == user_id,
            Enrollment.is_active == True,
            Enrollment.end_date > now
        ).all()

    def get_by_user_and_course(self, user_id: int, course_id: int):
        return self.db.query(Enrollment).filter(
            Enrollment.user_id == user_id,
            Enrollment.course_id == course_id
        ).first()

    def update(self, enrollment: Enrollment):
        self.db.commit()
        self.db.refresh(enrollment)
        return enrollment

    def get_expired_active_enrollments(self):
        now = datetime.now()
        return self.db.query(Enrollment).filter(
            Enrollment.is_active == True,
            Enrollment.end_date <= now
        ).all()

