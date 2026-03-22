"""
All LLM prompt templates for the AI pipeline.
Prompts are designed to return strict JSON for reliable parsing.
"""

TOPIC_ANALYSIS_PROMPT = """You are an expert education analyst. Analyze the following study material and extract important topics.

**Exam**: {exam_name}
**Source material**:
{material_text}

{pyq_section}

{suggestions_section}

**Instructions**:
1. Extract all major topics and subtopics from the material.
2. Score each topic's importance from 0.0 to 1.0 based on:
   - How much syllabus weight it carries
   - How frequently it appears in PYQs (if provided)
   - If students/teachers highlighted it
3. Identify patterns — which topics are repeatedly examined.
4. Limit to the top {max_topics} most important topics.

**Return ONLY valid JSON** in this exact format:
{{
  "topics": [
    {{
      "name": "Topic Name",
      "importance_score": 0.85,
      "frequency": 5,
      "subtopics": ["Subtopic A", "Subtopic B"],
      "notes": "Brief note on why this is important"
    }}
  ],
  "patterns": ["Pattern 1 observed", "Pattern 2 observed"],
  "confidence": "high"
}}
"""

QUESTION_GENERATION_PROMPT = """You are an expert question paper setter for {exam_name}.

**Topics to cover** (with importance scores):
{topics_json}

**Instructions**:
1. Generate exactly {num_questions} practice questions.
2. Difficulty distribution: {difficulty_mix}
3. Cover topics proportionally to their importance scores.
4. Question types: MCQ (4 options) and short-answer.
5. Each MCQ must have exactly one correct answer.
6. Provide a brief explanation for each correct answer.

**Return ONLY valid JSON** in this exact format:
{{
  "questions": [
    {{
      "text": "Question text here?",
      "type": "mcq",
      "difficulty": "medium",
      "topic": "Topic Name",
      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
      "correct_answer": "B. Option 2",
      "explanation": "Brief explanation of why B is correct."
    }},
    {{
      "text": "Explain the concept of X briefly.",
      "type": "short",
      "difficulty": "easy",
      "topic": "Topic Name",
      "options": [],
      "correct_answer": "Key points: 1) ..., 2) ..., 3) ...",
      "explanation": "This tests understanding of fundamental concept X."
    }}
  ]
}}
"""

SHORT_ANSWER_GRADING_PROMPT = """You are an expert grader. Grade this student's answer to the following question.

**Question**: {question_text}
**Expected answer**: {expected_answer}
**Student's answer**: {student_answer}

Grade on a scale of 0 to 10.
Return JSON: {{"score": 8, "feedback": "Good answer, but missed point about X."}}
"""

FALLBACK_TOPIC_PROMPT = """You are an expert on the exam: {exam_name}.

No syllabus or PYQ documents were provided, but generate likely important topics based on your knowledge of this exam.

{hints_section}

Generate the top {max_topics} most likely topics for this exam with estimated importance scores.

**Return ONLY valid JSON** in this exact format:
{{
  "topics": [
    {{
      "name": "Topic Name",
      "importance_score": 0.7,
      "frequency": 0,
      "subtopics": ["Subtopic A"],
      "notes": "Inferred from general exam knowledge"
    }}
  ],
  "patterns": [],
  "confidence": "low"
}}
"""
