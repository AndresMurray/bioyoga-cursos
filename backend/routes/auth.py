from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database.session import get_db
from models.schemas import UserCreate, UserResponse, LoginRequest, Token
from services.auth_service import AuthService
from dependencies import get_current_user, require_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, request: Request, db: Session = Depends(get_db)):
    origin = request.headers.get("origin")
    auth_service = AuthService(db)
    user, error = await auth_service.register_user(user_in, frontend_url=origin)

    if error:
        raise HTTPException(status_code=400, detail=error)

    return user


@router.get("/validate")
async def validate_email(token: str, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    success, message = auth_service.validate_user_email(token)

    if not success:
        raise HTTPException(status_code=404, detail=message)

    return {"message": message}


@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    token_data, error = auth_service.authenticate_user(
        login_data.email, login_data.password
    )

    if error:
        status_code = status.HTTP_401_UNAUTHORIZED
        if "valida tu email" in error:
            status_code = status.HTTP_403_FORBIDDEN
        raise HTTPException(status_code=status_code, detail=error)

    return token_data

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    """
    Ruta protegida: Obtiene los datos del usuario actual (requiere token JWT).
    """
    return current_user

@router.get("/admin-data")
async def read_admin_data(current_user = Depends(require_admin)):
    """
    Ruta protegida para admins: Solo accesible si el usuario es administrador.
    """
    return {"message": "Bienvenido al panel de administrador", "admin_email": current_user.email}
