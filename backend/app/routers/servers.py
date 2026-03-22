"""
Servers router — teacher server CRUD, join, membership, server quizzes.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.server import ServerCreate, ServerResponse, ServerJoinRequest
from app.schemas.quiz import QuizCreate, QuizResponse
from app.services.server_service import (
    create_server, join_server, get_user_servers,
    get_server, get_server_members, is_server_teacher,
)
from app.services.quiz_service import create_quiz
from app.models.quiz import Quiz
from app.models.performance import Performance
from app.models.user import User
from app.utils.security import get_current_user, require_teacher

router = APIRouter(prefix="/api/servers", tags=["Servers"])


@router.post("/", response_model=ServerResponse)
def create_server_endpoint(
    data: ServerCreate,
    db: Session = Depends(get_db),
    teacher=Depends(require_teacher),
):
    server = create_server(db, teacher.id, data.name, data.description)
    return server


@router.get("/", response_model=list[ServerResponse])
def list_servers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_user_servers(db, current_user.id)


@router.get("/{server_id}", response_model=ServerResponse)
def get_server_detail(
    server_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    return get_server(db, server_id)


@router.post("/join")
def join_server_endpoint(
    data: ServerJoinRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    member = join_server(db, current_user.id, data.invite_code)
    return {"message": "Joined successfully", "server_id": member.server_id}


@router.get("/{server_id}/members")
def list_members(
    server_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    return get_server_members(db, server_id)


@router.post("/{server_id}/quizzes", response_model=QuizResponse)
def create_server_quiz(
    server_id: int,
    data: QuizCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not is_server_teacher(db, server_id, current_user.id):
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only the server teacher can create quizzes")
    data.server_id = server_id
    return create_quiz(db, data, current_user.id)


@router.get("/{server_id}/quizzes")
def list_server_quizzes(
    server_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    quizzes = db.query(Quiz).filter(Quiz.server_id == server_id).all()
    return [
        {
            "id": q.id,
            "title": q.title,
            "duration_mins": q.duration_mins,
            "is_timed": q.is_timed,
            "created_at": q.created_at,
        }
        for q in quizzes
    ]


@router.get("/{server_id}/performance")
def server_performance(
    server_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not is_server_teacher(db, server_id, current_user.id):
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only the server teacher can view performance")

    members = get_server_members(db, server_id)
    performance_data = []
    for m in members:
        if m["role"] == "student":
            perfs = db.query(Performance).filter(Performance.user_id == m["user_id"]).all()
            performance_data.append({
                "user_id": m["user_id"],
                "user_name": m["user_name"],
                "total_questions": sum(p.total_questions for p in perfs),
                "correct": sum(p.correct for p in perfs),
                "accuracy": round(
                    (sum(p.correct for p in perfs) / max(sum(p.total_questions for p in perfs), 1)) * 100, 2
                ),
            })
    return performance_data
