from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.session import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)  # Cloudinary URL
    duracion_dias = Column(Integer, nullable=False, default=30)
    link_pago = Column(String, nullable=True)  # Mercado Pago URL
    is_visible = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan", order_by="Lesson.order")
