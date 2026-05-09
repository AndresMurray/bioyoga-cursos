from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.schemas import HomeConfigUpdate, HomeConfigResponse
from dependencies import require_admin
from services.home_config_service import HomeConfigService

router = APIRouter(prefix="/home-config", tags=["Home Config"])

@router.get("", response_model=HomeConfigResponse)
async def get_home_config(db: Session = Depends(get_db)):
    """
    Obtiene la configuración de la Home. Si no existe, devuelve la estructura por defecto.
    """
    service = HomeConfigService(db)
    return service.get_config()

@router.put("", response_model=HomeConfigResponse)
async def update_home_config(
    config_in: HomeConfigUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    """
    Actualiza la configuración de la Home (Solo Admin).
    """
    service = HomeConfigService(db)
    return service.update_config(config_in)
