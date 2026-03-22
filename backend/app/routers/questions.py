"""
Questions router — generate and list questions.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.question import Question, Topic
from app.services.ai_service import run_analysis_pipeline
from app.utils.security import get_current_user

router = APIRouter(prefix="/api", tags=["Questions"])


@router.post("/exams/{exam_id}/generate-questions")
def generate_questions_endpoint(
    exam_id: int,
    num_questions: int = Query(15, ge=1, le=50),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    result = run_analysis_pipeline(
        db=db,
        exam_id=exam_id,
        num_questions=num_questions,
    )
    return result


@router.get("/questions")
def list_questions(
    exam_id: int = Query(...),
    topic_id: int | None = Query(None),
    difficulty: str | None = Query(None),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    q = db.query(Question).filter(Question.exam_id == exam_id)
    if topic_id:
        q = q.filter(Question.topic_id == topic_id)
    if difficulty:
        q = q.filter(Question.difficulty == difficulty)
    questions = q.limit(limit).all()

    return [
        {
            "id": question.id,
            "text": question.text,
            "type": question.question_type,
            "options": question.options,
            "correct_answer": question.correct_answer,
            "explanation": question.explanation,
            "difficulty": question.difficulty,
            "topic_id": question.topic_id,
            "confidence": question.confidence,
        }
        for question in questions
    ]
