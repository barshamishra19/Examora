"""
Quiz service — quiz creation, session management, grading, anti-cheat.
"""
import random
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.quiz import Quiz, QuizQuestion, QuizSession, QuizAnswer
from app.models.question import Question, Topic
from app.models.performance import Performance, AntiCheatEvent
from app.schemas.quiz import QuizCreate, AnswerSubmit


def create_quiz(db: Session, data: QuizCreate, user_id: int) -> Quiz:
    """Create a quiz by selecting questions from the question bank."""
    # Get available questions for this exam
    questions = db.query(Question).filter(Question.exam_id == data.exam_id).all()
    if not questions:
        raise HTTPException(status_code=400, detail="No questions available. Run AI analysis first.")

    # Select questions based on difficulty mix
    selected = _select_questions(questions, data.num_questions, data.difficulty_mix)

    quiz = Quiz(
        title=data.title,
        exam_id=data.exam_id,
        server_id=data.server_id,
        created_by=user_id,
        duration_mins=data.duration_mins,
        is_timed=data.is_timed,
        config={"difficulty_mix": data.difficulty_mix, "num_questions": len(selected)},
    )
    db.add(quiz)
    db.flush()

    for i, q in enumerate(selected):
        db.add(QuizQuestion(quiz_id=quiz.id, question_id=q.id, order=i + 1))

    db.commit()
    db.refresh(quiz)
    return quiz


def _select_questions(questions: list[Question], count: int, difficulty_mix: dict) -> list[Question]:
    """Select questions based on difficulty distribution."""
    by_difficulty = {"easy": [], "medium": [], "hard": []}
    for q in questions:
        level = q.difficulty if q.difficulty in by_difficulty else "medium"
        by_difficulty[level].append(q)

    selected = []
    for level, fraction in difficulty_mix.items():
        n = max(1, int(count * fraction))
        pool = by_difficulty.get(level, [])
        selected.extend(random.sample(pool, min(n, len(pool))))

    # Fill remaining with any available
    remaining = count - len(selected)
    if remaining > 0:
        unused = [q for q in questions if q not in selected]
        selected.extend(random.sample(unused, min(remaining, len(unused))))

    return selected[:count]


def start_quiz_session(db: Session, quiz_id: int, user_id: int) -> dict:
    """Start a quiz session for a student — returns randomized questions."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Check if already in progress
    existing = (
        db.query(QuizSession)
        .filter(QuizSession.quiz_id == quiz_id, QuizSession.user_id == user_id, QuizSession.status == "in_progress")
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You already have an in-progress session for this quiz")

    # Get quiz questions
    qq_rows = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).order_by(QuizQuestion.order).all()
    question_ids = [qq.question_id for qq in qq_rows]

    # Randomize order (Fisher-Yates)
    randomized_ids = question_ids.copy()
    random.shuffle(randomized_ids)

    session = QuizSession(
        quiz_id=quiz_id,
        user_id=user_id,
        total_questions=len(randomized_ids),
        question_order=randomized_ids,
        status="in_progress",
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Fetch questions and randomize options for MCQs
    questions_out = []
    for qid in randomized_ids:
        q = db.query(Question).filter(Question.id == qid).first()
        if q:
            options = list(q.options) if q.options else []
            if q.question_type == "mcq" and options:
                random.shuffle(options)
            questions_out.append({
                "question_id": q.id,
                "text": q.text,
                "question_type": q.question_type,
                "options": options,
                "difficulty": q.difficulty,
            })

    return {
        "session_id": session.id,
        "quiz_title": quiz.title,
        "duration_mins": quiz.duration_mins,
        "questions": questions_out,
    }


def submit_quiz(db: Session, quiz_id: int, session_id: int, user_id: int, answers: list[AnswerSubmit]) -> dict:
    """Submit answers and auto-grade."""
    session = db.query(QuizSession).filter(
        QuizSession.id == session_id,
        QuizSession.user_id == user_id,
        QuizSession.status == "in_progress",
    ).first()
    if not session:
        raise HTTPException(status_code=400, detail="No active session found")

    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    # Time check
    if quiz and quiz.is_timed:
        deadline = session.started_at + timedelta(minutes=quiz.duration_mins + 1)  # 1 min grace
        if datetime.now(timezone.utc) > deadline:
            session.status = "expired"
            db.commit()
            raise HTTPException(status_code=400, detail="Quiz time has expired")

    # Grade answers
    correct_count = 0
    topic_stats: dict[str, dict] = {}  # topic_name -> {correct, total}

    for ans in answers:
        question = db.query(Question).filter(Question.id == ans.question_id).first()
        if not question:
            continue

        is_correct = ans.selected_answer.strip().lower() == question.correct_answer.strip().lower()
        if is_correct:
            correct_count += 1

        db.add(QuizAnswer(
            session_id=session.id,
            question_id=ans.question_id,
            selected_answer=ans.selected_answer,
            is_correct=is_correct,
            time_spent_secs=ans.time_spent_secs,
        ))

        # Track per-topic stats
        topic = db.query(Topic).filter(Topic.id == question.topic_id).first()
        topic_name = topic.name if topic else "General"
        if topic_name not in topic_stats:
            topic_stats[topic_name] = {"correct": 0, "total": 0}
        topic_stats[topic_name]["total"] += 1
        if is_correct:
            topic_stats[topic_name]["correct"] += 1

    # Update session
    session.submitted_at = datetime.now(timezone.utc)
    session.score = round((correct_count / max(session.total_questions, 1)) * 100, 2)
    session.correct_count = correct_count
    session.status = "submitted"
    db.commit()

    # Update performance aggregates
    _update_performance(db, user_id, quiz.exam_id if quiz else None, topic_stats)

    per_topic = [
        {"topic": name, "correct": stats["correct"], "total": stats["total"]}
        for name, stats in topic_stats.items()
    ]

    return {
        "session_id": session.id,
        "score": session.score,
        "total_questions": session.total_questions,
        "correct_count": correct_count,
        "per_topic": per_topic,
    }


def _update_performance(db: Session, user_id: int, exam_id: int | None, topic_stats: dict):
    """Update aggregate performance records."""
    if not exam_id:
        return
    for topic_name, stats in topic_stats.items():
        # Find topic id
        topic = db.query(Topic).filter(Topic.name == topic_name, Topic.exam_id == exam_id).first()
        topic_id = topic.id if topic else None

        perf = db.query(Performance).filter(
            Performance.user_id == user_id,
            Performance.exam_id == exam_id,
            Performance.topic_id == topic_id,
        ).first()

        if perf:
            perf.total_questions += stats["total"]
            perf.correct += stats["correct"]
            perf.accuracy = round((perf.correct / max(perf.total_questions, 1)) * 100, 2)
        else:
            perf = Performance(
                user_id=user_id,
                exam_id=exam_id,
                topic_id=topic_id,
                total_questions=stats["total"],
                correct=stats["correct"],
                accuracy=round((stats["correct"] / max(stats["total"], 1)) * 100, 2),
            )
            db.add(perf)
    db.commit()


def log_anticheat_event(db: Session, session_id: int, event_type: str, metadata: dict = {}):
    """Log a tab-switch, focus-loss, or other anti-cheat event."""
    session = db.query(QuizSession).filter(QuizSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    event = AntiCheatEvent(
        session_id=session_id,
        event_type=event_type,
        metadata_=metadata,
    )
    db.add(event)
    db.commit()


def get_anticheat_report(db: Session, quiz_id: int) -> list[dict]:
    """Generate anti-cheat report for a quiz (teacher view)."""
    from app.models.user import User

    sessions = db.query(QuizSession).filter(QuizSession.quiz_id == quiz_id).all()
    report = []
    for s in sessions:
        events = db.query(AntiCheatEvent).filter(AntiCheatEvent.session_id == s.id).all()
        tab_switches = sum(1 for e in events if e.event_type == "tab_switch")
        focus_losses = sum(1 for e in events if e.event_type == "focus_loss")
        user = db.query(User).filter(User.id == s.user_id).first()
        report.append({
            "user_id": s.user_id,
            "user_name": user.name if user else "Unknown",
            "tab_switches": tab_switches,
            "focus_losses": focus_losses,
            "flagged": tab_switches >= 3,
        })
    return report
