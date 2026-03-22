"""
Suggestion model — student-contributed topics, hints, and notes.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from app.database import Base


class Suggestion(Base):
    __tablename__ = "suggestions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    server_id = Column(Integer, ForeignKey("servers.id", ondelete="SET NULL"), nullable=True)
    content = Column(Text, nullable=False)
    suggestion_type = Column(String(30), default="topic")  # topic | hint | note
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    status = Column(String(20), default="pending")  # pending | approved | rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
