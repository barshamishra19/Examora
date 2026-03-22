"""
Grader — auto-grades MCQs and uses AI for short-answer grading.
"""
import json
import google.generativeai as genai
from app.config import get_settings
from app.ai.prompts import SHORT_ANSWER_GRADING_PROMPT

settings = get_settings()


def grade_mcq(selected_answer: str, correct_answer: str) -> bool:
    """Simple string comparison for MCQs."""
    return selected_answer.strip().lower() == correct_answer.strip().lower()


def grade_short_answer(question_text: str, expected_answer: str, student_answer: str) -> dict:
    """Use AI to grade a short-answer question."""
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = SHORT_ANSWER_GRADING_PROMPT.format(
        question_text=question_text,
        expected_answer=expected_answer,
        student_answer=student_answer,
    )

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception:
        return {"score": 0, "feedback": "Could not grade automatically."}
