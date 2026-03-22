"""
AI Exam Prep Platform — FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import engine, Base, SessionLocal
from app.services.exam_service import seed_exam_catalog

# Import all models so they're registered with Base
from app.models import user, exam, syllabus, question, quiz, server, suggestion, performance  # noqa

# Import routers
from app.routers import auth, exams, syllabus as syllabus_router
from app.routers import questions, quizzes, servers, suggestions, performance as perf_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered exam preparation platform API",
    version="1.0.0",
)

# CORS — allow all for MVP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(exams.router)
app.include_router(syllabus_router.router)
app.include_router(questions.router)
app.include_router(quizzes.router)
app.include_router(servers.router)
app.include_router(suggestions.router)
app.include_router(perf_router.router)


@app.on_event("startup")
def on_startup():
    # Create all tables (use Alembic in production)
    Base.metadata.create_all(bind=engine)

    # Seed exam catalog
    db = SessionLocal()
    try:
        seed_exam_catalog(db)
    finally:
        db.close()


@app.get("/", tags=["Health"])
def root():
    return {
        "name": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
