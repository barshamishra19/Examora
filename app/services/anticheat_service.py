"""
Anti-cheat service — wraps quiz_service anti-cheat functions for clarity.
"""
from sqlalchemy.orm import Session
from app.services.quiz_service import log_anticheat_event, get_anticheat_report


def log_event(db: Session, session_id: int, event_type: str, metadata: dict = {}):
    return log_anticheat_event(db, session_id, event_type, metadata)


def get_report(db: Session, quiz_id: int) -> list[dict]:
    return get_anticheat_report(db, quiz_id)
