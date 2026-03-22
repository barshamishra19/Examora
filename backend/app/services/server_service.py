"""
Server service — teacher server CRUD, invite codes, membership.
"""
import random
import string
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.server import Server, ServerMember
from app.models.user import User


def _generate_invite_code(length: int = 6) -> str:
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=length))


def create_server(db: Session, teacher_id: int, name: str, description: str = "") -> Server:
    # Generate unique invite code
    for _ in range(10):
        code = _generate_invite_code()
        if not db.query(Server).filter(Server.invite_code == code).first():
            break
    else:
        raise HTTPException(status_code=500, detail="Could not generate unique invite code")

    server = Server(
        name=name,
        teacher_id=teacher_id,
        invite_code=code,
        description=description,
    )
    db.add(server)
    db.flush()

    # Auto-add teacher as member
    member = ServerMember(server_id=server.id, user_id=teacher_id, role="teacher")
    db.add(member)
    db.commit()
    db.refresh(server)
    return server


def join_server(db: Session, user_id: int, invite_code: str) -> ServerMember:
    server = db.query(Server).filter(Server.invite_code == invite_code).first()
    if not server:
        raise HTTPException(status_code=404, detail="Invalid invite code")

    # Check already a member
    existing = (
        db.query(ServerMember)
        .filter(ServerMember.server_id == server.id, ServerMember.user_id == user_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Already a member of this server")

    member = ServerMember(server_id=server.id, user_id=user_id, role="student")
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def get_user_servers(db: Session, user_id: int) -> list[Server]:
    member_rows = db.query(ServerMember).filter(ServerMember.user_id == user_id).all()
    server_ids = [m.server_id for m in member_rows]
    if not server_ids:
        return []
    return db.query(Server).filter(Server.id.in_(server_ids)).all()


def get_server(db: Session, server_id: int) -> Server:
    server = db.query(Server).filter(Server.id == server_id).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return server


def get_server_members(db: Session, server_id: int) -> list[dict]:
    members = db.query(ServerMember).filter(ServerMember.server_id == server_id).all()
    result = []
    for m in members:
        user = db.query(User).filter(User.id == m.user_id).first()
        result.append({
            "id": m.id,
            "user_id": m.user_id,
            "user_name": user.name if user else "Unknown",
            "role": m.role,
            "joined_at": m.joined_at,
        })
    return result


def is_server_member(db: Session, server_id: int, user_id: int) -> bool:
    return (
        db.query(ServerMember)
        .filter(ServerMember.server_id == server_id, ServerMember.user_id == user_id)
        .first()
        is not None
    )


def is_server_teacher(db: Session, server_id: int, user_id: int) -> bool:
    server = get_server(db, server_id)
    return server.teacher_id == user_id
