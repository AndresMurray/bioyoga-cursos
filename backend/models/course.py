from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.session import Base


class CourseImage(Base):
    __tablename__ = "course_images"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)
    order = Column(Integer, default=0, nullable=False)
    is_cover = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    course = relationship("Course", back_populates="images")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    duracion_dias = Column(Integer, nullable=False, default=30)
    link_pago = Column(String, nullable=True)  # Mercado Pago URL
    price = Column(Integer, default=0, nullable=False)
    discount_percentage = Column(Integer, default=0, nullable=False)
    is_visible = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    images = relationship("CourseImage", back_populates="course", cascade="all, delete-orphan", order_by="CourseImage.order")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan", order_by="Lesson.order")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan", passive_deletes=True)

