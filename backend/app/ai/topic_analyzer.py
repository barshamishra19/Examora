"""
Topic analyzer — uses Gemini to extract and rank topics from study material.
"""
import json
import google.generativeai as genai
from app.config import get_settings
from app.ai.prompts import TOPIC_ANALYSIS_PROMPT, FALLBACK_TOPIC_PROMPT

settings = get_settings()


def analyze_topics(
    exam_name: str,
    syllabus_text: str = "",
    pyq_text: str = "",
    suggestions: list[str] | None = None,
    max_topics: int = 30,
) -> dict:
    """
    Analyze material and extract ranked topics.
    Returns parsed JSON dict with topics, patterns, and confidence.
    """
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Determine which prompt to use
    has_material = bool(syllabus_text.strip()) or bool(pyq_text.strip())

    if has_material:
        pyq_section = f"**Past Year Questions**:\n{pyq_text}" if pyq_text.strip() else "No PYQs provided."
        suggestions_section = ""
        if suggestions:
            suggestions_section = "**Student/Teacher Suggestions**:\n" + "\n".join(f"- {s}" for s in suggestions)

        prompt = TOPIC_ANALYSIS_PROMPT.format(
            exam_name=exam_name,
            material_text=syllabus_text[:8000],  # truncate for token limit
            pyq_section=pyq_section[:4000],
            suggestions_section=suggestions_section,
            max_topics=max_topics,
        )
    else:
        # Fallback — no syllabus or PYQs
        hints_section = ""
        if suggestions:
            hints_section = "**Hints from students/teachers**:\n" + "\n".join(f"- {s}" for s in suggestions)
        prompt = FALLBACK_TOPIC_PROMPT.format(
            exam_name=exam_name,
            hints_section=hints_section,
            max_topics=max_topics,
        )

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean markdown code fences if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except json.JSONDecodeError:
        return {
            "topics": [],
            "patterns": [],
            "confidence": "error",
            "error": "Failed to parse AI response as JSON",
            "raw_response": response.text[:500] if response else "",
        }
    except Exception as e:
        return {
            "topics": [],
            "patterns": [],
            "confidence": "error",
            "error": str(e),
        }
