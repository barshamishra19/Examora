"""
Performance and AntiCheatEvent models.
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, func
from app.database import Base


class Performance(Base):
    __tablename__ = "performance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=True)
    total_questions = Column(Integer, default=0)
    correct = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    last_attempt = Column(DateTime(timezone=True), server_default=func.now())


class AntiCheatEvent(Base):
    __tablename__ = "anticheat_events"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("quiz_sessions.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(50), nullable=False)  # tab_switch | focus_loss | copy_paste
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    metadata_ = Column("metadata", JSON, default=dict)
