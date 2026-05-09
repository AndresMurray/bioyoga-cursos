from sqlalchemy.orm import Session
from repositories.home_config_repository import HomeConfigRepository
from models.schemas import HomeConfigUpdate
from models.home_config import HomeConfig

class HomeConfigService:
    def __init__(self, db: Session):
        self.repository = HomeConfigRepository(db)

    def get_config(self) -> HomeConfig:
        return self.repository.get_config()

    def update_config(self, config_in: HomeConfigUpdate) -> HomeConfig:
        update_data = config_in.model_dump(exclude_unset=True)
        return self.repository.update_config(update_data)
