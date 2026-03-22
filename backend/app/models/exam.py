"""
Exam and ExamSubject models.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from app.database import Base


class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, unique=True)
    category = Column(String(30), nullable=False)  # competitive | college
    description = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ExamSubject(Base):
    __tablename__ = "exam_subjects"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    subject_name = Column(String(200), nullable=False)
