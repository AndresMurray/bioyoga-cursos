from sqlalchemy.orm import Session
from models.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def get_by_dni(self, dni: str):
        return self.db.query(User).filter(User.dni == dni).first()

    def get_by_validation_token(self, token: str):
        return self.db.query(User).filter(User.validation_token == token).first()

    def create(self, user_data: dict):
        db_user = User(**user_data)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update(self, user: User):
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_paginated_students(self, page: int, size: int, search: str = None):
        query = self.db.query(User).filter(User.is_admin == False)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                (User.email.ilike(search_filter)) |
                (User.first_name.ilike(search_filter)) |
                (User.last_name.ilike(search_filter)) |
                (User.dni.ilike(search_filter))
            )
            
        total = query.count()
        pages = (total + size - 1) // size
        
        items = query.offset((page - 1) * size).limit(size).all()
        
        return items, total, pages
