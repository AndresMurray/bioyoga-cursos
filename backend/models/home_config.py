from sqlalchemy import Column, Integer, String, Text
from database.session import Base

class HomeConfig(Base):
    __tablename__ = "home_configs"

    id = Column(Integer, primary_key=True, index=True, default=1)
    hero_title = Column(String, nullable=False, default="Pasión por el movimiento y la salud")
    hero_subtitle_1 = Column(Text, nullable=False, default="Hola, soy Lic. en Kinesiología. Mi objetivo es ayudarte a recuperar tu bienestar a través de técnicas innovadoras y un trato cercano y profesional.")
    hero_subtitle_2 = Column(Text, nullable=False, default="En este espacio no solo brindo atención personalizada, sino que también comparto mis conocimientos a través de cursos especializados para profesionales y estudiantes del área.")
    hero_image_url = Column(String, nullable=False, default="/images/kinesiologist.png")
    whatsapp_number = Column(String, nullable=False, default="5491112345678")
