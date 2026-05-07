from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.session import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)  # Cloudinary URL (portada)
    link_drive = Column(String, nullable=True)  # External URL
    recursos_pdf = Column(JSON, default=list)  # List of Cloudinary PDF URLs
    order = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    course = relationship("Course", back_populates="lessons")
