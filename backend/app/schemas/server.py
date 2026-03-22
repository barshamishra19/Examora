"""
Pydantic schemas for teacher servers.
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ServerCreate(BaseModel):
    name: str
    description: str = ""


class ServerResponse(BaseModel):
    id: int
    name: str
    teacher_id: int
    invite_code: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True


class ServerJoinRequest(BaseModel):
    invite_code: str


class ServerMemberResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    role: str
    joined_at: datetime
