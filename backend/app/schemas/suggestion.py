"""
Pydantic schemas for student suggestions.
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SuggestionCreate(BaseModel):
    exam_id: int
    server_id: Optional[int] = None
    content: str
    suggestion_type: str = "topic"  # topic | hint | note


class SuggestionResponse(BaseModel):
    id: int
    user_id: int
    exam_id: int
    content: str
    suggestion_type: str
    upvotes: int
    downvotes: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class VoteRequest(BaseModel):
    vote: str  # up | down
