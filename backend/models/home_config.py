from sqlalchemy import Column, Integer, String, Text
from database.session import Base

class HomeConfig(Base):
    __tablename__ = "home_configs"

    id = Column(Integer, primary_key=True, index=True, default=1)
    hero_title = Column(String, nullable=False, default="")
    hero_subtitle_1 = Column(Text, nullable=False, default="")
    hero_subtitle_2 = Column(Text, nullable=False, default="")
    hero_image_url = Column(String, nullable=False, default="")
    whatsapp_number = Column(String, nullable=False, default="")
    courses_title = Column(String, nullable=False, default="NUESTROS CURSOS Y TALLERES")
    courses_subtitle = Column(Text, nullable=False, default="Capacitaciones diseñadas para profundizar tu práctica personal y potenciar tu camino en el mundo del yoga y el bienestar.")
    footer_description = Column(Text, nullable=False, default="Espacio dedicado a la formación profesional en yoga, meditación y bienestar consciente.")
    informative_title = Column(String, nullable=False, default="CLASES PRESENCIALES Y ACTIVIDADES")
    informative_subtitle = Column(Text, nullable=False, default="Conocé nuestros horarios, talleres especiales y la oferta de clases presenciales en nuestro espacio.")
