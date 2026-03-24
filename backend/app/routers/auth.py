"""
Auth router — register, login, current user.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm  # Added for Swagger compatibility
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import RegisterRequest, TokenResponse, UserResponse, AuthSessionResponse
from app.services.auth_service import register_user, authenticate_user
from app.utils.security import create_access_token
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", response_model=AuthSessionResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    user = register_user(db, data)
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=TokenResponse)
def login(
    # Change: Use OAuth2PasswordRequestForm instead of LoginRequest
    # This allows the Swagger "Authorize" button to work correctly.
    data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    # In the Swagger popup, the 'username' field will contain the user's email.
    token = authenticate_user(db, data.username, data.password)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def me(current_user=Depends(get_current_user)):
    return current_user