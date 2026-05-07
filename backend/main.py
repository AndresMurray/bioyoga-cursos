from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.session import engine, Base
from models import user, course, lesson  # Import to register models
from routes import auth, courses, lessons

# Create tables
Base.metadata.create_all(bind=engine)

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

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de Gestión de Cursos de Centra"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
