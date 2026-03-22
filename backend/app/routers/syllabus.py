"""
Syllabus router — upload syllabus/PYQs and trigger AI analysis.
"""
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.syllabus import Syllabus, PYQ
from app.schemas.exam import AnalysisRequest, AnalysisResponse
from app.services.ai_service import run_analysis_pipeline
from app.ai.text_extractor import extract_text_from_file
from app.utils.file_utils import save_upload
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/exams", tags=["Syllabus & PYQs"])


@router.post("/{exam_id}/syllabus")
async def upload_syllabus(
    exam_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    filepath = await save_upload(file, subfolder=f"syllabus/{exam_id}")
    raw_text = extract_text_from_file(filepath)

    syllabus = Syllabus(
        exam_id=exam_id,
        user_id=current_user.id,
        raw_text=raw_text,
        file_path=filepath,
        source="uploaded",
    )
    db.add(syllabus)
    db.commit()
    db.refresh(syllabus)

    return {
        "id": syllabus.id,
        "exam_id": exam_id,
        "file_path": filepath,
        "text_length": len(raw_text),
        "message": "Syllabus uploaded and text extracted successfully.",
    }


@router.post("/{exam_id}/pyqs")
async def upload_pyq(
    exam_id: int,
    file: UploadFile = File(...),
    year: int = Form(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    filepath = await save_upload(file, subfolder=f"pyqs/{exam_id}")
    raw_text = extract_text_from_file(filepath)

    pyq = PYQ(
        exam_id=exam_id,
        year=year,
        raw_text=raw_text,
        file_path=filepath,
    )
    db.add(pyq)
    db.commit()
    db.refresh(pyq)

    return {
        "id": pyq.id,
        "exam_id": exam_id,
        "year": year,
        "file_path": filepath,
        "text_length": len(raw_text),
        "message": "PYQ uploaded and text extracted successfully.",
    }


@router.post("/{exam_id}/analyze", response_model=AnalysisResponse)
def analyze_exam(
    exam_id: int,
    config: AnalysisRequest = AnalysisRequest(),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    result = run_analysis_pipeline(
        db=db,
        exam_id=exam_id,
        include_suggestions=config.include_suggestions,
        max_topics=config.max_topics,
    )
    return result


@router.get("/{exam_id}/analysis")
def get_analysis(
    exam_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    from app.models.question import Topic, Question

    topics = db.query(Topic).filter(Topic.exam_id == exam_id).order_by(Topic.importance_score.desc()).all()
    questions = db.query(Question).filter(Question.exam_id == exam_id).all()

    return {
        "exam_id": exam_id,
        "topics_count": len(topics),
        "questions_count": len(questions),
        "topics": [
            {"id": t.id, "name": t.name, "importance_score": t.importance_score, "frequency": t.frequency}
            for t in topics
        ],
    }
