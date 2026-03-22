"""
Suggestions router — student-contributed topics and hints.
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.suggestion import SuggestionCreate, SuggestionResponse, VoteRequest
from app.models.suggestion import Suggestion
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/suggestions", tags=["Suggestions"])


@router.post("/", response_model=SuggestionResponse)
def create_suggestion(
    data: SuggestionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    suggestion = Suggestion(
        user_id=current_user.id,
        exam_id=data.exam_id,
        server_id=data.server_id,
        content=data.content,
        suggestion_type=data.suggestion_type,
    )
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)
    return suggestion


@router.get("/", response_model=list[SuggestionResponse])
def list_suggestions(
    exam_id: int = Query(...),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    return (
        db.query(Suggestion)
        .filter(Suggestion.exam_id == exam_id)
        .order_by(Suggestion.upvotes.desc())
        .all()
    )


@router.post("/{suggestion_id}/vote")
def vote_suggestion(
    suggestion_id: int,
    data: VoteRequest,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    suggestion = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    if data.vote == "up":
        suggestion.upvotes += 1
    elif data.vote == "down":
        suggestion.downvotes += 1
    else:
        raise HTTPException(status_code=400, detail="Vote must be 'up' or 'down'")

    # Auto-approve if enough upvotes
    if suggestion.upvotes >= 3:
        suggestion.status = "approved"

    db.commit()
    return {"message": f"Vote '{data.vote}' recorded", "upvotes": suggestion.upvotes, "downvotes": suggestion.downvotes}
