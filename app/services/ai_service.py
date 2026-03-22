"""
AI service — orchestrates the full AI pipeline:
  syllabus/PYQ upload → text extraction → topic analysis → question generation → DB storage.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.exam import Exam
from app.models.syllabus import Syllabus, PYQ
from app.models.question import Topic, Question
from app.models.suggestion import Suggestion
from app.ai.text_extractor import extract_text_from_file
from app.ai.topic_analyzer import analyze_topics
from app.ai.question_generator import generate_questions


def run_analysis_pipeline(
    db: Session,
    exam_id: int,
    include_suggestions: bool = True,
    max_topics: int = 30,
    num_questions: int = 15,
) -> dict:
    """
    Full AI pipeline:
      1. Gather material (syllabus, PYQs, suggestions)
      2. Extract text from uploaded files
      3. Analyze topics via AI
      4. Generate questions via AI
      5. Store topics and questions in DB
    """
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    # --- 1. Gather raw text ---
    syllabus_text = ""
    syllabi = db.query(Syllabus).filter(Syllabus.exam_id == exam_id).all()
    for s in syllabi:
        if s.raw_text:
            syllabus_text += s.raw_text + "\n"
        elif s.file_path:
            extracted = extract_text_from_file(s.file_path)
            s.raw_text = extracted  # cache it
            syllabus_text += extracted + "\n"

    pyq_text = ""
    pyqs = db.query(PYQ).filter(PYQ.exam_id == exam_id).all()
    for p in pyqs:
        if p.raw_text:
            pyq_text += p.raw_text + "\n"
        elif p.file_path:
            extracted = extract_text_from_file(p.file_path)
            p.raw_text = extracted  # cache it
            pyq_text += extracted + "\n"

    # --- 2. Gather student suggestions ---
    suggestion_texts = []
    if include_suggestions:
        suggestions = (
            db.query(Suggestion)
            .filter(Suggestion.exam_id == exam_id)
            .filter((Suggestion.upvotes >= 2) | (Suggestion.status == "approved"))
            .all()
        )
        suggestion_texts = [f"{s.content} (type: {s.suggestion_type}, upvotes: {s.upvotes})" for s in suggestions]

    # --- 3. Determine confidence level ---
    has_syllabus = bool(syllabus_text.strip())
    has_pyqs = bool(pyq_text.strip())
    if has_syllabus and has_pyqs:
        confidence = "high"
    elif has_syllabus:
        confidence = "medium"
    elif suggestion_texts:
        confidence = "low-medium"
    else:
        confidence = "low"

    # --- 4. Analyze topics ---
    topic_result = analyze_topics(
        exam_name=exam.name,
        syllabus_text=syllabus_text,
        pyq_text=pyq_text,
        suggestions=suggestion_texts,
        max_topics=max_topics,
    )

    if topic_result.get("confidence") == "error":
        db.commit()  # save any cached text
        return {
            "exam_id": exam_id,
            "topics_extracted": 0,
            "questions_generated": 0,
            "confidence": "error",
            "message": topic_result.get("error", "AI analysis failed"),
        }

    # --- 5. Store topics in DB ---
    stored_topics = []
    for t in topic_result.get("topics", []):
        topic = Topic(
            exam_id=exam_id,
            name=t["name"],
            importance_score=t.get("importance_score", 0.5),
            frequency=t.get("frequency", 0),
        )
        db.add(topic)
        db.flush()
        stored_topics.append({
            "id": topic.id,
            "name": topic.name,
            "importance_score": topic.importance_score,
        })

    # --- 6. Generate questions ---
    q_result = generate_questions(
        exam_name=exam.name,
        topics=[{"name": t["name"], "importance_score": t.get("importance_score", 0.5)} for t in topic_result.get("topics", [])],
        num_questions=num_questions,
    )

    questions_stored = 0
    for q in q_result.get("questions", []):
        # Find matching topic
        topic_id = None
        for st in stored_topics:
            if st["name"].lower() in q.get("topic", "").lower() or q.get("topic", "").lower() in st["name"].lower():
                topic_id = st["id"]
                break

        question = Question(
            topic_id=topic_id,
            exam_id=exam_id,
            text=q["text"],
            question_type=q.get("type", "mcq"),
            options=q.get("options", []),
            correct_answer=q.get("correct_answer", ""),
            explanation=q.get("explanation", ""),
            difficulty=q.get("difficulty", "medium"),
            source="ai",
            confidence={"high": 0.9, "medium": 0.7, "low-medium": 0.5, "low": 0.3}.get(confidence, 0.5),
        )
        db.add(question)
        questions_stored += 1

    db.commit()

    return {
        "exam_id": exam_id,
        "topics_extracted": len(stored_topics),
        "questions_generated": questions_stored,
        "confidence": confidence,
        "message": f"Analysis complete. {len(stored_topics)} topics and {questions_stored} questions generated.",
    }
