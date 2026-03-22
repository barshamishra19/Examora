"""
Pydantic schemas for quizzes.
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ── Quiz creation ──────────────────────────────────────────────
class QuizCreate(BaseModel):
    title: str
    exam_id: int
    server_id: Optional[int] = None
    duration_mins: int = 30
    is_timed: bool = True
    num_questions: int = 10
    difficulty_mix: dict = {"easy": 0.3, "medium": 0.5, "hard": 0.2}


class QuizResponse(BaseModel):
    id: int
    title: str
    exam_id: Optional[int]
    server_id: Optional[int]
    duration_mins: int
    is_timed: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Quiz session ──────────────────────────────────────────────
class QuizQuestionOut(BaseModel):
    """A single question as served to the student (no correct answer)."""
    question_id: int
    text: str
    question_type: str
    options: list
    difficulty: str


class QuizStartResponse(BaseModel):
    session_id: int
    quiz_title: str
    duration_mins: int
    questions: list[QuizQuestionOut]


class AnswerSubmit(BaseModel):
    question_id: int
    selected_answer: str
    time_spent_secs: int = 0


class QuizSubmitRequest(BaseModel):
    answers: list[AnswerSubmit]


class QuizResultResponse(BaseModel):
    session_id: int
    score: float
    total_questions: int
    correct_count: int
    per_topic: list[dict]  # [{"topic": "...", "correct": 2, "total": 3}]


# ── Anti-cheat ────────────────────────────────────────────────
class AntiCheatEventCreate(BaseModel):
    event_type: str  # tab_switch | focus_loss | copy_paste
    metadata: dict = {}


class AntiCheatReportItem(BaseModel):
    user_id: int
    user_name: str
    tab_switches: int
    focus_losses: int
    flagged: bool
