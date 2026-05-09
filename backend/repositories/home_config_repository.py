from sqlalchemy.orm import Session
from models.home_config import HomeConfig

class HomeConfigRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_config(self) -> HomeConfig:
        config = self.db.query(HomeConfig).first()
        if not config:
            config = HomeConfig()
            self.db.add(config)
            self.db.commit()
            self.db.refresh(config)
        return config

    def update_config(self, update_data: dict) -> HomeConfig:
        config = self.get_config()
        for key, value in update_data.items():
            setattr(config, key, value)
        self.db.commit()
        self.db.refresh(config)
        return config
