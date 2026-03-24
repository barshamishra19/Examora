export interface ApiErrorResponse {
  detail?: string;
}

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse extends TokenResponse {
  user: ApiUser;
}

export interface ApiExam {
  id: number;
  name: string;
  category: string;
  description: string;
}

export interface ApiExamTopic {
  id: number;
  exam_id: number;
  name: string;
  importance_score: number;
  frequency: number;
}

export interface ApiExamSubject {
  id: number;
  exam_id: number;
  subject_name: string;
}

export interface ApiPerformanceByTopic {
  topic_id: number;
  exam_id: number;
  total: number;
  correct: number;
  accuracy: number;
}

export interface ApiPerformanceMe {
  user_id: number;
  total_questions_attempted: number;
  total_correct: number;
  overall_accuracy: number;
  by_topic: ApiPerformanceByTopic[];
}

export interface ApiWeakTopic {
  topic_id: number;
  topic_name: string;
  accuracy: number;
  total_questions: number;
  correct: number;
  recommendation: string;
}

export interface ApiLeaderboardEntry {
  rank: number;
  user_id: number;
  user_name: string;
  total_correct: number;
  total_questions: number;
  accuracy: number;
}

export interface ApiLeaderboardResponse {
  leaderboard: ApiLeaderboardEntry[];
}

export interface ApiServer {
  id: number;
  name: string;
  teacher_id: number;
  invite_code: string;
  description: string;
  created_at: string;
}

export interface ApiServerMember {
  id: number;
  user_id: number;
  user_name: string;
  role: 'teacher' | 'student';
  joined_at: string;
}

export interface ApiServerQuiz {
  id: number;
  title: string;
  duration_mins: number;
  is_timed: boolean;
  created_at: string;
}

export interface ApiQuizResult {
  session_id: number;
  score: number;
  total_questions: number;
  correct_count: number;
  status: string;
  started_at: string;
  submitted_at: string | null;
}

export interface ApiQuizStart {
  session_id: number;
  quiz_title: string;
  duration_mins: number;
  questions: Array<{
    question_id: number;
    text: string;
    question_type: string;
    options: string[];
    difficulty: string;
  }>;
}
