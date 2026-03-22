"""
Syllabus and PYQ models.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from app.database import Base


class Syllabus(Base):
    __tablename__ = "syllabi"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null = seeded
    raw_text = Column(Text, default="")
    file_path = Column(String(500), default="")
    source = Column(String(30), default="uploaded")  # uploaded | seeded
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PYQ(Base):
    __tablename__ = "pyqs"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    year = Column(Integer, nullable=True)
    raw_text = Column(Text, default="")
    file_path = Column(String(500), default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
