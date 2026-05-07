from sqlalchemy.orm import Session
from models.course import Course


class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Course).order_by(Course.id.desc()).all()

    def get_visible(self):
        return self.db.query(Course).filter(Course.is_visible == True).order_by(Course.id.desc()).all()

    def get_by_id(self, course_id: int):
        return self.db.query(Course).filter(Course.id == course_id).first()

    def create(self, data: dict):
        course = Course(**data)
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course

    def update(self, course: Course, data: dict):
        for key, value in data.items():
            if value is not None:
                setattr(course, key, value)
        self.db.commit()
        self.db.refresh(course)
        return course

    def delete(self, course: Course):
        self.db.delete(course)
        self.db.commit()
