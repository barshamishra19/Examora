"""
Quiz assembler — selects questions from the bank and creates a quiz config.
"""
import random
from sqlalchemy.orm import Session
from app.models.question import Question


def assemble_quiz_questions(
    db: Session,
    exam_id: int,
    num_questions: int = 10,
    difficulty_mix: dict | None = None,
) -> list[Question]:
    """
    Select questions from the DB for a quiz, respecting difficulty distribution.
    """
    if difficulty_mix is None:
        difficulty_mix = {"easy": 0.3, "medium": 0.5, "hard": 0.2}

    all_questions = db.query(Question).filter(Question.exam_id == exam_id).all()
    if not all_questions:
        return []

    by_difficulty = {"easy": [], "medium": [], "hard": []}
    for q in all_questions:
        level = q.difficulty if q.difficulty in by_difficulty else "medium"
        by_difficulty[level].append(q)

    selected = []
    for level, fraction in difficulty_mix.items():
        n = max(1, int(num_questions * fraction))
        pool = by_difficulty.get(level, [])
        random.shuffle(pool)
        selected.extend(pool[:n])

    # Fill if not enough
    remaining = num_questions - len(selected)
    if remaining > 0:
        unused = [q for q in all_questions if q not in selected]
        random.shuffle(unused)
        selected.extend(unused[:remaining])

    return selected[:num_questions]
