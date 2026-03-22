"""
Question model — stores both AI-generated and PYQ-sourced questions.
"""
from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, JSON, func
from app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(300), nullable=False)
    importance_score = Column(Float, default=0.5)
    frequency = Column(Integer, default=0)  # times appeared in PYQs
    parent_topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=True)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    question_type = Column(String(20), default="mcq")  # mcq | short
    options = Column(JSON, default=list)  # ["A. ...", "B. ...", ...]
    correct_answer = Column(String(500), default="")
    explanation = Column(Text, default="")
    difficulty = Column(String(20), default="medium")  # easy | medium | hard
    source = Column(String(20), default="ai")  # ai | pyq | teacher
    confidence = Column(Float, default=0.8)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
