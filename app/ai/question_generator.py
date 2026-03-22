"""
Question generator — uses Gemini to generate practice questions from topics.
"""
import json
import google.generativeai as genai
from app.config import get_settings
from app.ai.prompts import QUESTION_GENERATION_PROMPT

settings = get_settings()


def generate_questions(
    exam_name: str,
    topics: list[dict],
    num_questions: int = 15,
    difficulty_mix: str = "30% easy, 50% medium, 20% hard",
) -> dict:
    """
    Generate practice questions for given topics.
    Returns parsed JSON dict with questions list.
    """
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    topics_json = json.dumps(topics[:20], indent=2)  # limit topics sent

    prompt = QUESTION_GENERATION_PROMPT.format(
        exam_name=exam_name,
        topics_json=topics_json,
        num_questions=num_questions,
        difficulty_mix=difficulty_mix,
    )

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except json.JSONDecodeError:
        return {
            "questions": [],
            "error": "Failed to parse AI response as JSON",
            "raw_response": response.text[:500] if response else "",
        }
    except Exception as e:
        return {
            "questions": [],
            "error": str(e),
        }
