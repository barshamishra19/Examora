"""
Performance router — student stats and weak-topic identification.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.performance import Performance
from app.models.question import Topic
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/performance", tags=["Performance"])


@router.get("/me")
def my_performance(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    perfs = db.query(Performance).filter(Performance.user_id == current_user.id).all()
    total_q = sum(p.total_questions for p in perfs)
    total_c = sum(p.correct for p in perfs)

    return {
        "user_id": current_user.id,
        "total_questions_attempted": total_q,
        "total_correct": total_c,
        "overall_accuracy": round((total_c / max(total_q, 1)) * 100, 2),
        "by_topic": [
            {
                "topic_id": p.topic_id,
                "exam_id": p.exam_id,
                "total": p.total_questions,
                "correct": p.correct,
                "accuracy": p.accuracy,
            }
            for p in perfs
        ],
    }


@router.get("/me/weak-topics")
def my_weak_topics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    perfs = (
        db.query(Performance)
        .filter(Performance.user_id == current_user.id, Performance.total_questions >= 2)
        .all()
    )

    # Weak = accuracy < 50%
    weak = []
    for p in perfs:
        if p.accuracy < 50.0:
            topic = db.query(Topic).filter(Topic.id == p.topic_id).first()
            weak.append({
                "topic_id": p.topic_id,
                "topic_name": topic.name if topic else "Unknown",
                "accuracy": p.accuracy,
                "total_questions": p.total_questions,
                "correct": p.correct,
                "recommendation": f"Focus more on {topic.name if topic else 'this topic'} — your accuracy is {p.accuracy}%",
            })

    return sorted(weak, key=lambda x: x["accuracy"])
