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
