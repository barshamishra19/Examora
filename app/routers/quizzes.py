"""
Quizzes router — create quizzes, start sessions, submit answers, get results.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.quiz import (
    QuizCreate, QuizResponse, QuizStartResponse,
    QuizSubmitRequest, QuizResultResponse,
    AntiCheatEventCreate,
)
from app.services.quiz_service import (
    create_quiz, start_quiz_session, submit_quiz,
    log_anticheat_event, get_anticheat_report,
)
from app.models.quiz import Quiz, QuizSession
from app.utils.security import get_current_user, require_teacher

router = APIRouter(prefix="/api/quizzes", tags=["Quizzes"])


@router.post("/", response_model=QuizResponse)
def create_quiz_endpoint(
    data: QuizCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    quiz = create_quiz(db, data, current_user.id)
    return quiz


@router.get("/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {
        "id": quiz.id,
        "title": quiz.title,
        "exam_id": quiz.exam_id,
        "server_id": quiz.server_id,
        "duration_mins": quiz.duration_mins,
        "is_timed": quiz.is_timed,
        "config": quiz.config,
    }


@router.post("/{quiz_id}/start")
def start_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return start_quiz_session(db, quiz_id, current_user.id)


@router.post("/{quiz_id}/sessions/{session_id}/submit")
def submit_quiz_endpoint(
    quiz_id: int,
    session_id: int,
    data: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return submit_quiz(db, quiz_id, session_id, current_user.id, data.answers)


@router.get("/{quiz_id}/results")
def get_results(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    session = (
        db.query(QuizSession)
        .filter(QuizSession.quiz_id == quiz_id, QuizSession.user_id == current_user.id)
        .order_by(QuizSession.started_at.desc())
        .first()
    )
    if not session:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No quiz session found")
    return {
        "session_id": session.id,
        "score": session.score,
        "total_questions": session.total_questions,
        "correct_count": session.correct_count,
        "status": session.status,
        "started_at": session.started_at,
        "submitted_at": session.submitted_at,
    }


# ── Anti-cheat ────────────────────────────────────────────────
@router.post("/{quiz_id}/sessions/{session_id}/anticheat-event")
def report_anticheat_event(
    quiz_id: int,
    session_id: int,
    data: AntiCheatEventCreate,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    log_anticheat_event(db, session_id, data.event_type, data.metadata)
    return {"status": "logged"}


@router.get("/{quiz_id}/anticheat-report")
def anticheat_report(
    quiz_id: int,
    db: Session = Depends(get_db),
    _teacher=Depends(require_teacher),
):
    return get_anticheat_report(db, quiz_id)
