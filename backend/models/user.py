from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime
from sqlalchemy.sql import func
from database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    dni = Column(String, unique=True, index=True, nullable=False)
    birth_date = Column(Date, nullable=False)
    phone = Column(String, nullable=False)
    country = Column(String, nullable=False)
    province = Column(String, nullable=False)
    city = Column(String, nullable=False)
    
    is_active = Column(Boolean, default=False) # False until email validation
    is_admin = Column(Boolean, default=False)
    
    validation_token = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
