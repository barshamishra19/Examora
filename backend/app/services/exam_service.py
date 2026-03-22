"""
Exam service — catalog CRUD and seed data.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.exam import Exam, ExamSubject


def list_exams(db: Session, category: str | None = None) -> list[Exam]:
    q = db.query(Exam)
    if category:
        q = q.filter(Exam.category == category)
    return q.order_by(Exam.name).all()


def get_exam(db: Session, exam_id: int) -> Exam:
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam


def get_exam_subjects(db: Session, exam_id: int) -> list[ExamSubject]:
    return db.query(ExamSubject).filter(ExamSubject.exam_id == exam_id).all()


def seed_exam_catalog(db: Session):
    """Pre-seed the exam catalog if empty."""
    if db.query(Exam).count() > 0:
        return  # already seeded

    catalog = [
        {
            "name": "GATE - Computer Science",
            "category": "competitive",
            "description": "Graduate Aptitude Test in Engineering (CS/IT)",
            "subjects": [
                "Data Structures", "Algorithms", "Operating Systems",
                "Database Management", "Computer Networks", "Theory of Computation",
                "Compiler Design", "Digital Logic", "Computer Organization",
                "Discrete Mathematics", "Linear Algebra", "Probability & Statistics",
            ],
        },
        {
            "name": "GATE - Electronics",
            "category": "competitive",
            "description": "Graduate Aptitude Test in Engineering (ECE)",
            "subjects": [
                "Network Theory", "Signals & Systems", "Electronic Devices",
                "Analog Circuits", "Digital Circuits", "Control Systems",
                "Communications", "Electromagnetics",
            ],
        },
        {
            "name": "CAT",
            "category": "competitive",
            "description": "Common Admission Test for MBA programs",
            "subjects": [
                "Quantitative Aptitude", "Verbal Ability & Reading Comprehension",
                "Data Interpretation & Logical Reasoning",
            ],
        },
        {
            "name": "UPSC CSE",
            "category": "competitive",
            "description": "Civil Services Examination (Prelims + Mains)",
            "subjects": [
                "Indian Polity", "History", "Geography", "Economy",
                "Science & Technology", "Environment", "Current Affairs",
                "Ethics & Integrity", "Essay",
            ],
        },
        {
            "name": "JEE Main",
            "category": "competitive",
            "description": "Joint Entrance Examination for engineering admissions",
            "subjects": ["Physics", "Chemistry", "Mathematics"],
        },
        {
            "name": "NEET",
            "category": "competitive",
            "description": "National Eligibility cum Entrance Test for medical",
            "subjects": ["Physics", "Chemistry", "Biology"],
        },
    ]

    for item in catalog:
        exam = Exam(
            name=item["name"],
            category=item["category"],
            description=item["description"],
        )
        db.add(exam)
        db.flush()  # get exam.id
        for subj in item["subjects"]:
            db.add(ExamSubject(exam_id=exam.id, subject_name=subj))

    db.commit()
