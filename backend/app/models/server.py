"""
Server and ServerMember models — teacher-created study groups.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from app.database import Base


class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    invite_code = Column(String(10), unique=True, nullable=False, index=True)
    description = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ServerMember(Base):
    __tablename__ = "server_members"

    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(Integer, ForeignKey("servers.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(20), default="student")  # teacher | student
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
