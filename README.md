# 🎓 AI Exam Prep Platform — Backend & AI Architecture

> **An AI-powered exam preparation platform for students and teachers.**
> Students prepare individually or in groups. Teachers create servers to conduct quizzes, tests, and study sessions. The AI analyzes syllabi, PYQs, teacher hints, and student suggestions to generate smart study plans, practice questions, and mock tests.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Architecture Overview](#-architecture-overview)
4. [Folder Structure](#-folder-structure)
5. [Database Schema](#-database-schema)
6. [AI Pipeline](#-ai-pipeline)
7. [API Endpoints](#-api-endpoints)
8. [Product Flows](#-product-flows)
9. [Anti-Cheat System](#-anti-cheat-system)
10. [Build Checklist](#-build-checklist)
11. [Phased Roadmap](#-phased-roadmap)
12. [Getting Started](#-getting-started)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏆 **Competitive Exam Mode** | Select GATE, CAT, UPSC, etc. AI auto-analyzes syllabus & PYQs to detect important topics and trends |
| 🏫 **College/School Mode** | Select class/semester + subject. Upload syllabus & PYQs. AI generates prep even without PYQs |
| 👩‍🏫 **Teacher Servers** | Teachers create servers, share invite codes, conduct quizzes, and track student performance |
| 💡 **Student Contributions** | Students add important topics, class hints, and study suggestions. AI incorporates them into analysis |
| 🤖 **AI Question Generation** | Auto-generates practice questions, quizzes, and mock tests from any input combination |
| 🛡️ **Anti-Cheating** | Random question/option order, timer enforcement, tab-switch detection, locked test mode |
| 📊 **Performance Analytics** | Per-topic accuracy tracking, weak-area identification, improvement trends |

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Runtime | **Python 3.11+** | Best AI/ML ecosystem |
| Framework | **FastAPI** | Async, auto-generated Swagger docs, fast |
| Database | **PostgreSQL** (SQLAlchemy + Alembic) | Relational, robust, proven |
| AI Engine | **Google Gemini API** (or OpenAI) | Structured JSON output for topics & questions |
| File Parsing | **PyMuPDF / pdfplumber** | Extract text from uploaded PDFs |
| Auth | **JWT** (python-jose + passlib) | Stateless, simple |
| Cache | **Redis** (optional for MVP) | Sessions, rate-limiting |
| Testing | **pytest + httpx** | Fast async API testing |

---

## 🏗️ Architecture Overview

```
Client (Frontend / Mobile)
    │
    ▼
┌──────────────────────┐
│   FastAPI Backend     │
│  ┌────────────────┐   │
│  │  Auth Layer    │   │  ← JWT middleware
│  ├────────────────┤   │
│  │  API Routers   │   │  ← REST endpoints
│  ├────────────────┤   │
│  │  Services      │   │  ← Business logic
│  ├────────────────┤   │
│  │  AI Pipeline   │   │  ← Topic analysis, question gen
│  ├────────────────┤   │
│  │  Data Layer    │   │  ← SQLAlchemy models
│  └────────────────┘   │
└─────────┬────────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
PostgreSQL   Gemini API
```

---

## 📁 Folder Structure

```
exam_prep_platform/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Settings, env vars
│   ├── database.py              # DB engine, session
│   │
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── exam.py
│   │   ├── syllabus.py
│   │   ├── question.py
│   │   ├── quiz.py
│   │   ├── server.py
│   │   ├── suggestion.py
│   │   └── performance.py
│   │
│   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── auth.py
│   │   ├── exam.py
│   │   ├── quiz.py
│   │   ├── server.py
│   │   └── suggestion.py
│   │
│   ├── routers/                 # API route handlers
│   │   ├── auth.py
│   │   ├── exams.py
│   │   ├── syllabus.py
│   │   ├── questions.py
│   │   ├── quizzes.py
│   │   ├── servers.py
│   │   ├── suggestions.py
│   │   └── performance.py
│   │
│   ├── services/                # Business logic layer
│   │   ├── auth_service.py
│   │   ├── exam_service.py
│   │   ├── ai_service.py
│   │   ├── quiz_service.py
│   │   ├── server_service.py
│   │   └── anticheat_service.py
│   │
│   ├── ai/                      # AI pipeline modules
│   │   ├── text_extractor.py    # PDF → raw text
│   │   ├── topic_analyzer.py    # Text → ranked topics
│   │   ├── question_generator.py # Topics → questions
│   │   ├── quiz_assembler.py    # Questions → quiz
│   │   ├── grader.py            # Answers → grades
│   │   └── prompts.py           # All LLM prompt templates
│   │
│   └── utils/
│       ├── security.py          # JWT, hashing
│       ├── file_utils.py        # File upload handling
│       └── validators.py
│
├── migrations/                  # Alembic DB migrations
├── tests/                       # pytest test suite
├── uploads/                     # Uploaded PDFs (gitignored)
├── seed_data/                   # Pre-seeded exam syllabi
├── .env                         # Environment variables
├── requirements.txt
├── alembic.ini
└── README.md
```

---

## 🗄️ Database Schema

### Entity Table

| Table | Key Columns | Purpose |
|---|---|---|
| `users` | id, email, password_hash, name, role (student/teacher) | User accounts |
| `exams` | id, name, category (competitive/college) | Exam catalog |
| `exam_subjects` | id, exam_id, subject_name | Subjects per exam |
| `syllabi` | id, exam_id, user_id, raw_text, file_path, source | Uploaded/seeded syllabi |
| `pyqs` | id, exam_id, year, raw_text, file_path | Past year questions |
| `topics` | id, exam_id, name, importance_score, frequency, parent_topic_id | AI-extracted topics |
| `questions` | id, topic_id, text, type (mcq/short), options (JSON), correct_answer, difficulty, source, confidence | Generated questions |
| `quizzes` | id, title, exam_id, server_id, created_by, duration_mins, is_timed, config (JSON) | Quiz definitions |
| `quiz_questions` | id, quiz_id, question_id, order | Questions in a quiz |
| `quiz_sessions` | id, quiz_id, user_id, started_at, submitted_at, score, question_order (JSON), status | Student attempts |
| `quiz_answers` | id, session_id, question_id, selected_answer, is_correct, time_spent_secs | Per-question answers |
| `servers` | id, name, teacher_id, invite_code, invite_link, description | Teacher servers |
| `server_members` | id, server_id, user_id, role, joined_at | Server membership |
| `suggestions` | id, user_id, exam_id, server_id, content, type (topic/hint/note), upvotes | Student contributions |
| `anticheat_events` | id, session_id, event_type, timestamp, metadata | Cheat detection log |
| `performance` | id, user_id, exam_id, topic_id, total_questions, correct, accuracy | Aggregated stats |

### Entity Relationships

```
users ──┬── quiz_sessions (takes quizzes)
        ├── suggestions (contributes hints)
        ├── servers (creates servers / teacher)
        └── server_members (joins servers / student)

exams ──┬── syllabi (has study material)
        ├── pyqs (has past questions)
        ├── topics (has extracted topics)
        └── quizzes (has quizzes)

topics ──── questions (generates questions)

quizzes ──┬── quiz_questions (contains questions)
          └── quiz_sessions (attempted by students)

quiz_sessions ──┬── quiz_answers (records answers)
                └── anticheat_events (logs cheating)

servers ──┬── server_members (has members)
          └── quizzes (hosts quizzes)
```

---

## 🤖 AI Pipeline

### Flow: Input → Topics → Questions → Quiz

```
┌──────────────────────────────────────────────────────┐
│                    INPUT SOURCES                      │
│  Syllabus PDF │ PYQs │ Teacher Hints │ Student Hints │
└───────┬───────┬──────┬──────────────┬────────────────┘
        ▼       ▼      ▼              ▼
┌──────────────────────────────────────────────────────┐
│           TEXT EXTRACTION (PyMuPDF)                   │
│       PDF/document → clean raw text                  │
└──────────────────────┬───────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────┐
│        TOPIC ANALYSIS (Gemini / GPT)                 │
│  "Extract topics from this syllabus + PYQs.          │
│   Rank by importance. Detect repeated patterns."     │
│                                                      │
│  Output: { topics: [{ name, importance, frequency,   │
│            subtopics }] }                            │
└──────────────────────┬───────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────┐
│      QUESTION GENERATION (Gemini / GPT)              │
│  "Generate N practice questions on these topics.     │
│   Mix difficulty. Include MCQ + short-answer."       │
│                                                      │
│  Output: { questions: [{ text, type, options,        │
│            correct, difficulty, topic }] }           │
└──────────────────────┬───────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────┐
│            QUIZ ASSEMBLY ENGINE                      │
│  - Select by topic coverage + difficulty mix         │
│  - Randomize question & option order per student     │
│  - Attach timer config                               │
└──────────────────────┬───────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────┐
│             GRADING + FEEDBACK                       │
│  - Auto-grade MCQs                                   │
│  - AI-grade short answers                            │
│  - Per-topic performance breakdown                   │
│  - Weak area identification                          │
└──────────────────────────────────────────────────────┘
```

### Fallback Logic (When PYQs Are Unavailable)

| Input Available | Strategy | Confidence |
|---|---|---|
| Syllabus + PYQs | Analyze both, cross-reference patterns | 🟢 High |
| Syllabus only | Analyze syllabus + AI general knowledge | 🟡 Medium |
| Teacher/student hints only | Use hints as topic seeds | 🟠 Low-Medium |
| Exam name only | Generate from AI general knowledge | 🔴 Low (marked as "AI-inferred") |

> **The pipeline always produces output.** Confidence scores decrease as fewer inputs are available.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register (student/teacher) |
| POST | `/api/auth/login` | Login → JWT token |
| GET | `/api/auth/me` | Current user profile |

### Exam Catalog
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/exams` | List exams (filter: competitive/college) |
| GET | `/api/exams/{id}` | Exam details + subjects |
| GET | `/api/exams/{id}/topics` | AI-extracted topics |

### Syllabus & PYQ Upload
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/exams/{id}/syllabus` | Upload syllabus PDF |
| POST | `/api/exams/{id}/pyqs` | Upload PYQ PDF |
| POST | `/api/exams/{id}/analyze` | Trigger AI analysis |
| GET | `/api/exams/{id}/analysis` | Get analysis results |

### Questions & Quizzes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/exams/{id}/generate-questions` | AI-generate questions |
| GET | `/api/questions` | List questions (filter by exam/topic) |
| POST | `/api/quizzes` | Create quiz (auto or manual) |
| GET | `/api/quizzes/{id}` | Quiz details |
| POST | `/api/quizzes/{id}/start` | Start session → randomized questions |
| POST | `/api/quizzes/{id}/submit` | Submit answers → auto-grade |
| GET | `/api/quizzes/{id}/results` | Results + per-topic breakdown |

### Teacher Servers
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/servers` | Create server (teacher only) |
| GET | `/api/servers` | List my servers |
| GET | `/api/servers/{id}` | Server details |
| POST | `/api/servers/join` | Join via invite code |
| GET | `/api/servers/{id}/members` | List members |
| POST | `/api/servers/{id}/quizzes` | Create quiz in server |
| GET | `/api/servers/{id}/quizzes` | List server quizzes |
| GET | `/api/servers/{id}/performance` | Student performance data |

### Student Suggestions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/suggestions` | Add topic/hint |
| GET | `/api/suggestions` | List (filter by exam) |
| POST | `/api/suggestions/{id}/vote` | Upvote/downvote |

### Anti-Cheat & Performance
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/quizzes/{id}/anticheat-event` | Log tab-switch / focus-loss |
| GET | `/api/quizzes/{id}/anticheat-report` | Cheat report (teacher only) |
| GET | `/api/performance/me` | My overall stats |
| GET | `/api/performance/me/weak-topics` | My weak topics |

---

## 🔄 Product Flows

### 1. Competitive Exam Mode (GATE, CAT, UPSC)

```
Student selects exam from catalog
  → Backend checks for pre-seeded syllabus/PYQs
  → AI extracts topics from syllabus
  → AI detects patterns & trends from PYQs
  → Cross-references to score topic importance
  → Generates practice questions & mock tests
  → Student takes quiz → gets per-topic feedback
```

### 2. College/School Exam Mode

```
Student selects class/semester + subject
  → Uploads syllabus (required) + PYQs (optional)
  → IF PYQs: full analysis (same as competitive)
  → IF no PYQs: syllabus-only analysis + AI knowledge
  → Teacher hints & student suggestions merged in
  → Questions generated with confidence scores
```

### 3. Teacher Server Mode

```
Teacher creates server → gets invite code
  → Shares code/link with students
  → Students join server
  → Teacher creates quizzes inside server
  → Students take quizzes (randomized, timed, anti-cheat)
  → Teacher views performance reports + cheat detection
```

### 4. Student Contribution Mode

```
Student adds hint/topic suggestion
  → Other students can upvote/downvote
  → AI includes suggestions with upvotes ≥ 2
  → Boosted topics get +10-20% importance
  → New topics from suggestions added to coverage
```

---

## 🛡️ Anti-Cheat System

| Feature | How It Works |
|---|---|
| **Random Question Order** | Fisher-Yates shuffle per student session |
| **Random Option Order** | MCQ options shuffled per student |
| **Timer Enforcement** | Backend validates submission time; auto-submit on expiry |
| **Tab-Switch Detection** | Frontend logs visibility change events to backend |
| **Quiz Lock** | No re-entry after quiz start; session-based lock |
| **Cheat Report** | Teacher sees per-student event timeline + flagged students (>3 tab switches) |

---

## ✅ Build Checklist (in order)

```
[ ] 1.  Project scaffold (FastAPI + folder structure)
[ ] 2.  Database models (SQLAlchemy) + first Alembic migration
[ ] 3.  Auth: register, login, JWT middleware
[ ] 4.  Exam catalog API + seed data (GATE, CAT, UPSC, etc.)
[ ] 5.  Syllabus upload + PDF text extraction
[ ] 6.  PYQ upload + text extraction
[ ] 7.  AI pipeline: syllabus → topic extraction
[ ] 8.  AI pipeline: topics → question generation
[ ] 9.  AI pipeline: questions → quiz assembly
[ ] 10. AI pipeline: fallback logic (no PYQs)
[ ] 11. Teacher server CRUD + invite code generation
[ ] 12. Student join server via code/link
[ ] 13. Teacher creates quiz inside server
[ ] 14. Student suggestion API (add, list, vote)
[ ] 15. AI incorporates student suggestions
[ ] 16. Anti-cheat: random order, timer, tab-switch logging
[ ] 17. Quiz submission + auto-grading
[ ] 18. Performance tracking + weak-topic detection
[ ] 19. Final integration testing
```

---

## 📅 Phased Roadmap

### Phase 1 — Foundation (🔴 Critical)
- **Goal**: Runnable server with DB, auth, and project structure
- **Tasks**: Project scaffold, DB models, migrations, auth (register/login/JWT), config
- **Complexity**: Medium
- **Dependencies**: None

### Phase 2 — Exam Catalog & Syllabus Engine (🔴 Critical)
- **Goal**: System can ingest syllabi/PYQs and extract structured topics
- **Tasks**: Exam catalog API, syllabus/PYQ upload, PDF text extraction, AI analysis pipeline, fallback logic
- **Complexity**: High
- **Dependencies**: Phase 1

### Phase 3 — AI Question & Quiz Generation (🔴 Critical)
- **Goal**: AI generates topics, questions, quizzes, and mock tests from any input
- **Tasks**: Topic extraction + scoring, question generation, quiz assembly, mock test generation, validation/retry
- **Complexity**: High
- **Dependencies**: Phase 2

### Phase 4 — Teacher Server Mode (🟡 High)
- **Goal**: Teachers create servers, invite students, run quizzes
- **Tasks**: Server CRUD, invite flow, quiz creation inside server, student enrollment, performance tracking
- **Complexity**: Medium
- **Dependencies**: Phase 1 + Phase 3

### Phase 5 — Student Contributions (🟡 High)
- **Goal**: Students contribute hints/topics; AI uses them in generation
- **Tasks**: Suggestion API, upvote/downvote, AI integration of suggestions
- **Complexity**: Medium
- **Dependencies**: Phase 3

### Phase 6 — Anti-Cheat & Quiz Flow (🟡 High)
- **Goal**: Fair, cheat-resistant quiz experience
- **Tasks**: Random ordering, timer enforcement, tab-switch logging, quiz lock, cheat reports
- **Complexity**: Medium
- **Dependencies**: Phase 3 + Phase 4

### Phase 7 — Analytics & Polish (🟢 Nice-to-have)
- **Goal**: Insights and production-readiness
- **Tasks**: Performance dashboard data, weak-topic identification, rate limiting
- **Complexity**: Medium
- **Dependencies**: All above

---

## 🚀 Getting Started

> ⚠️ **Setup instructions will be added after implementation begins.**

```bash
# Clone the repo
git clone <repo-url>
cd exam_prep_platform

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, GEMINI_API_KEY, JWT_SECRET

# Run database migrations
alembic upgrade head

# Seed exam catalog
python -m app.seed

# Start the server
uvicorn app.main:app --reload

# API docs available at
# http://localhost:8000/docs (Swagger)
# http://localhost:8000/redoc (ReDoc)
```

---

## 👥 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/quiz-generation`)
3. Commit changes (`git commit -m "Add quiz generation pipeline"`)
4. Push & create a PR

---

## 📝 License

MIT License — feel free to use for your hackathon!

---

> **Built with ❤️ for hackathon season. AI-powered exam prep for everyone.**
