from sqlalchemy.orm import Session
from sqlalchemy import func
from models.lesson import Lesson


class LessonRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_by_course(self, course_id: int):
        return (
            self.db.query(Lesson)
            .filter(Lesson.course_id == course_id)
            .order_by(Lesson.order.asc())
            .all()
        )

    def get_by_id(self, lesson_id: int):
        return self.db.query(Lesson).filter(Lesson.id == lesson_id).first()

    def get_next_order(self, course_id: int) -> int:
        """Get the next order number for a new lesson in a course."""
        max_order = (
            self.db.query(func.max(Lesson.order))
            .filter(Lesson.course_id == course_id)
            .scalar()
        )
        return (max_order or 0) + 1

    def create(self, data: dict):
        lesson = Lesson(**data)
        self.db.add(lesson)
        self.db.commit()
        self.db.refresh(lesson)
        return lesson

    def update(self, lesson: Lesson, data: dict):
        for key, value in data.items():
            if value is not None:
                setattr(lesson, key, value)
        self.db.commit()
        self.db.refresh(lesson)
        return lesson

    def delete(self, lesson: Lesson):
        self.db.delete(lesson)
        self.db.commit()
