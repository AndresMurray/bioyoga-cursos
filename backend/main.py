from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from database.session import engine, Base
from models import user, course, lesson, home_config as model_home_config, enrollment
from routes import auth, courses, lessons, uploads, home_config as route_home_config, students, downloads

# Create tables
# Base.metadata.create_all(bind=engine)  # Usamos Alembic para las migraciones en su lugar

app = FastAPI(title="Centra Kinesiología - Gestión de Cursos API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(lessons.router)
app.include_router(uploads.router)
app.include_router(route_home_config.router)
app.include_router(students.router)
app.include_router(downloads.router)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de Gestión de Cursos de Centra"}

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Endpoint ultra liviano para health checks.
    Retorna un Response vacío con status 200 para evitar overhead de serialización JSON.
    """
    return Response(status_code=status.HTTP_200_OK)
