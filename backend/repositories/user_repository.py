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
