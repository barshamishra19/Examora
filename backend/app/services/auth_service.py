"""
Auth service — register, login, user lookup.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.validators import validate_password_strength


def register_user(db: Session, data: RegisterRequest) -> User:
    # Check duplicate
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Validate password
    err = validate_password_strength(data.password)
    if err:
        raise HTTPException(status_code=400, detail=err)

    # Validate role
    if data.role not in ("student", "teacher"):
        raise HTTPException(status_code=400, detail="Role must be 'student' or 'teacher'")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        name=data.name,
        role=data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> str:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return token
