"""
Exams router — exam catalog and topics.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.exam import ExamResponse, ExamSubjectResponse, TopicResponse
from app.services.exam_service import list_exams, get_exam, get_exam_subjects
from app.models.question import Topic
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/exams", tags=["Exams"])


@router.get("/", response_model=list[ExamResponse])
def get_exams(category: str | None = Query(None), db: Session = Depends(get_db)):
    return list_exams(db, category)


@router.get("/{exam_id}", response_model=ExamResponse)
def get_exam_detail(exam_id: int, db: Session = Depends(get_db)):
    return get_exam(db, exam_id)


@router.get("/{exam_id}/subjects", response_model=list[ExamSubjectResponse])
def get_subjects(exam_id: int, db: Session = Depends(get_db)):
    return get_exam_subjects(db, exam_id)


@router.get("/{exam_id}/topics", response_model=list[TopicResponse])
def get_topics(
    exam_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    topics = (
        db.query(Topic)
        .filter(Topic.exam_id == exam_id)
        .order_by(Topic.importance_score.desc())
        .all()
    )
    return topics
