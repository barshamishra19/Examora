"""
Pydantic schemas for exams, syllabi, and topics.
"""
from pydantic import BaseModel
from typing import Optional


# ── Exam ──────────────────────────────────────────────────────
class ExamCreate(BaseModel):
    name: str
    category: str  # competitive | college
    description: str = ""


class ExamResponse(BaseModel):
    id: int
    name: str
    category: str
    description: str

    class Config:
        from_attributes = True


class ExamSubjectResponse(BaseModel):
    id: int
    exam_id: int
    subject_name: str

    class Config:
        from_attributes = True


# ── Topic ──────────────────────────────────────────────────────
class TopicResponse(BaseModel):
    id: int
    exam_id: int
    name: str
    importance_score: float
    frequency: int
    parent_topic_id: Optional[int] = None

    class Config:
        from_attributes = True


# ── Analysis ──────────────────────────────────────────────────
class AnalysisRequest(BaseModel):
    """Optional config for the AI analysis pipeline."""
    include_suggestions: bool = True
    max_topics: int = 30


class AnalysisResponse(BaseModel):
    exam_id: int
    topics_extracted: int
    questions_generated: int
    confidence: str  # high | medium | low
    message: str
