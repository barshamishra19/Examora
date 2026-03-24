// User Types
export type UserRole = 'student' | 'teacher';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  selectedExamId?: number | string;
  profileImage?: string;
  createdAt?: Date;
}

// Exam & Category Types
export type ExamCategory = 
  | 'engineering' 
  | 'civil-services' 
  | 'banking' 
  | 'medical' 
  | 'law' 
  | 'railway' 
  | 'school';

export interface Exam {
  id: number | string;
  name: string;
  category: ExamCategory | string;
  description: string;
  icon?: string;
  totalSubjects?: number;
  totalTopics?: number;
  estimatedHours?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  // Detailed exam information
  fullName?: string;
  conductingBody?: string;
  examFormat?: string;
  duration?: string;
  totalQuestions?: number;
  totalMarks?: number;
  negativeMarking?: string;
  subjects?: string[];
  syllabus?: ExamSyllabusDetail[];
  keyFeatures?: string[];
  paperStructure?: PaperSection[];
  recommendedResources?: RecommendedResource[];
  importantDates?: ImportantDate[];
  cutoffTrends?: CutoffTrend[];
  admissionProcess?: string[];
}

export interface ExamSyllabusDetail {
  subject: string;
  topics: string[];
  weightage?: string;
}

export interface PaperSection {
  name: string;
  questions: number;
  marks: number;
  duration?: string;
  negativeMarking?: string;
}

export interface RecommendedResource {
  name: string;
  type: 'book' | 'video' | 'website' | 'app';
  link?: string;
}

export interface ImportantDate {
  event: string;
  date: string;
  description?: string;
}

export interface CutoffTrend {
  year: number;
  category?: string;
  score: number;
  rank?: number;
}

export interface ExamDetailedInfo {
  examId: string;
  syllabusBreakdown: ExamSyllabusDetail[];
  paperPattern: PaperSection[];
  studyResources: RecommendedResource[];
  successTips: string[];
  commonMistakes: string[];
}

export interface Category {
  id: ExamCategory;
  name: string;
  description: string;
  exams: Exam[];
  icon?: string;
}

// Subject & Topic Types
export interface Topic {
  id: string;
  name: string;
  description?: string;
  estimatedHours: number;
  completed: boolean;
  progress: number; // 0-100
  priority: 'low' | 'medium' | 'high';
  questionsCount: number;
  resourceLinks?: string[];
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  topics: Topic[];
  progress: number; // 0-100
  priority: 'low' | 'medium' | 'high';
}

export interface ExamSyllabus {
  examId: string;
  subjects: Subject[];
  totalTopics: number;
  totalProgress: number;
}

// Progress Types
export interface ProgressData {
  userId: string;
  examId: string;
  topicId: string;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number; // percentage
  timeSpent: number; // minutes
  lastAttempt: Date;
  streak: number;
}

export interface DashboardProgress {
  userId: string;
  examId: string;
  overallProgress: number; // 0-100
  totalTopicsCompleted: number;
  totalTopicsFocused: number;
  weakAreas: WeakArea[];
  strongAreas: StrongArea[];
  upcomingTests: Test[];
}

export interface WeakArea {
  subjectId: string;
  subjectName: string;
  accuracy: number;
  questionsAttempted: number;
}

export interface StrongArea {
  subjectId: string;
  subjectName: string;
  accuracy: number;
  questionsAttempted: number;
}

// Quiz & Test Types
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: string;
  options: QuizOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  estimatedTime: number; // seconds
}

export interface Quiz {
  id: string;
  examId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  totalTime: number; // minutes
  passingScore: number; // percentage
  category: 'topic-quiz' | 'mock-test' | 'pyq';
  createdAt: Date;
}

export interface Test {
  id: string;
  examId: string;
  title: string;
  date: Date;
  duration: number; // minutes
  type: 'mock' | 'actual' | 'assignment';
  completed: boolean;
  score?: number;
  accuracy?: number;
}

// Quiz Attempt Types
export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Map<string, string>; // questionId -> selectedOptionId
  score: number;
  accuracy: number;
  timeSpent: number; // minutes
  completedAt: Date;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  profileImage?: string;
  score: number;
  accuracy: number;
  topicsCompleted: number;
  streakDays: number;
  lastAttemptDate: Date;
}

// Teacher Types
export interface ClassBatch {
  id: string;
  teacherId: string;
  name: string;
  description?: string;
  studentIds: string[];
  createdAt: Date;
}

export interface TeacherQuiz {
  id: string;
  teacherId: string;
  title: string;
  questions: QuizQuestion[];
  assignedBatches: string[]; // ClassBatch IDs
  createdAt: Date;
  dueDate?: Date;
}

export interface StudentPerformance {
  userId: string;
  studentName: string;
  averageScore: number;
  averageAccuracy: number;
  topicsCompleted: number;
  quizzesAttempted: number;
  lastActivity: Date;
  trend: 'improving' | 'declining' | 'stable';
}

// Analytics Types
export interface TopicAnalytics {
  topicId: string;
  topicName: string;
  questionsAttempted: number;
  accuracy: number;
  timeSpent: number;
  lastAttempt: Date;
}

export interface SubjectAnalytics {
  subjectId: string;
  subjectName: string;
  topics: TopicAnalytics[];
  overallAccuracy: number;
  totalTimeSpent: number;
}

export interface ExamAnalytics {
  examId: string;
  subjects: SubjectAnalytics[];
  totalQuestionsAttempted: number;
  overallAccuracy: number;
  totalTimeSpent: number;
  performanceTrend: number[]; // percentage values over time
}

// App Context Types
export interface AppContextType {
  user: User | null;
  accessToken: string | null;
  selectedExam: Exam | null;
  selectedCategory: ExamCategory | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthSession: (session: { user: User; accessToken: string } | null) => void;
  setSelectedExam: (exam: Exam | null) => void;
  setSelectedCategory: (category: ExamCategory | null) => void;
  logout: () => void;
}
