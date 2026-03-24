import { DashboardProgress, Test, LeaderboardEntry, TeacherQuiz, ClassBatch } from '@/types/index';

// Dashboard Progress Data for different exams
export const jeeMainProgress: DashboardProgress = {
  userId: 'user-1',
  examId: 'jee-main',
  overallProgress: 65,
  totalTopicsCompleted: 12,
  totalTopicsFocused: 28,
  weakAreas: [
    {
      subjectId: 'physics-rotational',
      subjectName: 'Rotational Motion',
      accuracy: 35,
      questionsAttempted: 45,
    },
    {
      subjectId: 'chemistry-organic',
      subjectName: 'Organic Chemistry',
      accuracy: 42,
      questionsAttempted: 38,
    },
    {
      subjectId: 'maths-cg',
      subjectName: 'Coordinate Geometry',
      accuracy: 48,
      questionsAttempted: 42,
    },
  ],
  strongAreas: [
    {
      subjectId: 'maths-algebra',
      subjectName: 'Algebra',
      accuracy: 92,
      questionsAttempted: 60,
    },
    {
      subjectId: 'physics-kinematics',
      subjectName: 'Kinematics',
      accuracy: 88,
      questionsAttempted: 50,
    },
    {
      subjectId: 'chemistry-atomic',
      subjectName: 'Atomic Structure',
      accuracy: 85,
      questionsAttempted: 55,
    },
  ],
  upcomingTests: [
    {
      id: 'mock-1',
      examId: 'jee-main',
      title: 'Full Length Mock Test - 1',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 180,
      type: 'mock',
      completed: false,
    },
    {
      id: 'quiz-rotational',
      examId: 'jee-main',
      title: 'Rotational Motion Focus Quiz',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      duration: 45,
      type: 'assignment',
      completed: false,
    },
    {
      id: 'pyq-2023',
      examId: 'jee-main',
      title: 'Previous Year Questions - 2023',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      duration: 180,
      type: 'actual',
      completed: false,
    },
  ],
};

export const bankingProgress: DashboardProgress = {
  userId: 'user-1',
  examId: 'ibps-po',
  overallProgress: 72,
  totalTopicsCompleted: 8,
  totalTopicsFocused: 15,
  weakAreas: [
    {
      subjectId: 'quant-time-work',
      subjectName: 'Time & Work',
      accuracy: 55,
      questionsAttempted: 38,
    },
    {
      subjectId: 'reasoning-coding',
      subjectName: 'Coding & Decoding',
      accuracy: 58,
      questionsAttempted: 35,
    },
  ],
  strongAreas: [
    {
      subjectId: 'quant-percentages',
      subjectName: 'Percentages & Profit Loss',
      accuracy: 92,
      questionsAttempted: 48,
    },
    {
      subjectId: 'english-rc',
      subjectName: 'Reading Comprehension',
      accuracy: 80,
      questionsAttempted: 42,
    },
  ],
  upcomingTests: [
    {
      id: 'pre-exam',
      examId: 'ibps-po',
      title: 'Prelims Full Test',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      duration: 120,
      type: 'mock',
      completed: false,
    },
    {
      id: 'quant-test',
      examId: 'ibps-po',
      title: 'Quantitative Aptitude Speed Test',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      duration: 30,
      type: 'assignment',
      completed: false,
    },
  ],
};

export const civilServicesProgress: DashboardProgress = {
  userId: 'user-1',
  examId: 'upsc-cse',
  overallProgress: 35,
  totalTopicsCompleted: 8,
  totalTopicsFocused: 35,
  weakAreas: [
    {
      subjectId: 'history-ancient',
      subjectName: 'Ancient India',
      accuracy: 42,
      questionsAttempted: 55,
    },
    {
      subjectId: 'geography-physical',
      subjectName: 'Physical Geography',
      accuracy: 48,
      questionsAttempted: 50,
    },
    {
      subjectId: 'polity-rights',
      subjectName: 'Fundamental Rights',
      accuracy: 52,
      questionsAttempted: 45,
    },
  ],
  strongAreas: [
    {
      subjectId: 'polity-constitution',
      subjectName: 'Constitution Basics',
      accuracy: 88,
      questionsAttempted: 70,
    },
    {
      subjectId: 'history-modern',
      subjectName: 'Modern India',
      accuracy: 82,
      questionsAttempted: 65,
    },
  ],
  upcomingTests: [
    {
      id: 'polity-test',
      examId: 'upsc-cse',
      title: 'Indian Polity Topic Test',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 120,
      type: 'assignment',
      completed: false,
    },
  ],
};

// Leaderboard Data
export const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-5',
    userName: 'Aarav Patel',
    score: 985,
    accuracy: 94,
    topicsCompleted: 42,
    streakDays: 28,
    lastAttemptDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    rank: 2,
    userId: 'user-3',
    userName: 'Priya Sharma',
    score: 952,
    accuracy: 91,
    topicsCompleted: 38,
    streakDays: 22,
    lastAttemptDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    rank: 3,
    userId: 'user-1',
    userName: 'You',
    score: 875,
    accuracy: 87,
    topicsCompleted: 32,
    streakDays: 15,
    lastAttemptDate: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    rank: 4,
    userId: 'user-6',
    userName: 'Rajesh Kumar',
    score: 845,
    accuracy: 85,
    topicsCompleted: 28,
    streakDays: 10,
    lastAttemptDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    rank: 5,
    userId: 'user-2',
    userName: 'Ananya Singh',
    score: 812,
    accuracy: 82,
    topicsCompleted: 25,
    streakDays: 8,
    lastAttemptDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    rank: 6,
    userId: 'user-4',
    userName: 'Deepak Gupta',
    score: 765,
    accuracy: 78,
    topicsCompleted: 20,
    streakDays: 5,
    lastAttemptDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    rank: 7,
    userId: 'user-7',
    userName: 'Neha Desai',
    score: 720,
    accuracy: 75,
    topicsCompleted: 18,
    streakDays: 3,
    lastAttemptDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    rank: 8,
    userId: 'user-8',
    userName: 'Vikas Rao',
    score: 680,
    accuracy: 71,
    topicsCompleted: 15,
    streakDays: 2,
    lastAttemptDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

// Teacher Mode Data
export const classBatches: ClassBatch[] = [
  {
    id: 'batch-1',
    teacherId: 'teacher-1',
    name: 'JEE Advance Batch - A',
    description: 'Advanced level JEE preparation for top performers',
    studentIds: ['user-1', 'user-3', 'user-5', 'user-6'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'batch-2',
    teacherId: 'teacher-1',
    name: 'Banking Exam Foundation',
    description: 'Foundation level banking exam preparation',
    studentIds: ['user-2', 'user-4', 'user-7', 'user-8'],
    createdAt: new Date('2024-02-01'),
  },
];

// Sample Analytics Data
export const analyticsData = {
  topicsProgressOverTime: [
    { date: 'Week 1', completed: 2, inProgress: 5, notStarted: 23 },
    { date: 'Week 2', completed: 4, inProgress: 6, notStarted: 20 },
    { date: 'Week 3', completed: 7, inProgress: 8, notStarted: 15 },
    { date: 'Week 4', completed: 10, inProgress: 10, notStarted: 8 },
    { date: 'Week 5', completed: 12, inProgress: 12, notStarted: 4 },
  ],
  accuracyTrend: [
    { week: 'Week 1', accuracy: 68 },
    { week: 'Week 2', accuracy: 70 },
    { week: 'Week 3', accuracy: 75 },
    { week: 'Week 4', accuracy: 78 },
    { week: 'Week 5', accuracy: 82 },
  ],
  subjectWiseProgress: [
    { name: 'Physics', progress: 65, questions: 150 },
    { name: 'Chemistry', progress: 50, questions: 140 },
    { name: 'Mathematics', progress: 72, questions: 160 },
  ],
  performanceComparison: [
    { subject: 'Physics', yourAccuracy: 85, average: 75 },
    { subject: 'Chemistry', yourAccuracy: 78, average: 72 },
    { subject: 'Mathematics', yourAccuracy: 88, average: 80 },
  ],
  timeSpentBySubject: [
    { name: 'Physics', hours: 45 },
    { name: 'Chemistry', hours: 35 },
    { name: 'Mathematics', hours: 55 },
  ],
};

// Quiz Questions Sample
export const sampleQuizzes = {
  'quiz-kinematics': {
    id: 'quiz-kinematics',
    examId: 'jee-main',
    title: 'Kinematics Fundamentals',
    description: 'Test your understanding of kinematics concepts',
    totalTime: 30,
    passingScore: 60,
    category: 'topic-quiz' as const,
    questions: [
      {
        id: 'q-1',
        topicId: 'kinematics',
        question: 'A car accelerates uniformly from rest to 20 m/s in 5 seconds. What is the acceleration?',
        options: [
          { id: 'opt-a', text: '2 m/s²', isCorrect: false },
          { id: 'opt-b', text: '4 m/s²', isCorrect: true },
          { id: 'opt-c', text: '5 m/s²', isCorrect: false },
          { id: 'opt-d', text: '10 m/s²', isCorrect: false },
        ],
        difficulty: 'easy',
        explanation: 'Using v = u + at, where u = 0, v = 20 m/s, t = 5s. Therefore, a = 4 m/s²',
        estimatedTime: 60,
      },
      {
        id: 'q-2',
        topicId: 'kinematics',
        question: 'An object is thrown upward with initial velocity 30 m/s. Maximum height reached is (g = 10 m/s²)',
        options: [
          { id: 'opt-a', text: '30 m', isCorrect: false },
          { id: 'opt-b', text: '45 m', isCorrect: true },
          { id: 'opt-c', text: '60 m', isCorrect: false },
          { id: 'opt-d', text: '90 m', isCorrect: false },
        ],
        difficulty: 'medium',
        explanation: 'Using v² = u² - 2gh, at maximum height v = 0. So h = u²/(2g) = 900/20 = 45 m',
        estimatedTime: 90,
      },
    ],
  },
  'quiz-percentages': {
    id: 'quiz-percentages',
    examId: 'ibps-po',
    title: 'Percentages & Profit Loss',
    description: 'Banking exam style percentage and profit loss problems',
    totalTime: 25,
    passingScore: 70,
    category: 'topic-quiz' as const,
    questions: [
      {
        id: 'q-1',
        topicId: 'percentages',
        question: 'If the price of sugar increases by 25%, by what percent should consumption be reduced to keep expenditure the same?',
        options: [
          { id: 'opt-a', text: '16%', isCorrect: false },
          { id: 'opt-b', text: '20%', isCorrect: true },
          { id: 'opt-c', text: '25%', isCorrect: false },
          { id: 'opt-d', text: '30%', isCorrect: false },
        ],
        difficulty: 'medium',
        explanation: 'If price increases by 25%, consumption reduction = 25/125 × 100 = 20%',
        estimatedTime: 60,
      },
    ],
  },
};

// Helper function to get progress data by exam
export function getProgressByExam(examId: string): DashboardProgress {
  const progressMap: { [key: string]: DashboardProgress } = {
    'jee-main': jeeMainProgress,
    'ibps-po': bankingProgress,
    'sbi-po': bankingProgress,
    'ibps-clerk': bankingProgress,
    'upsc-cse': civilServicesProgress,
  };
  return progressMap[examId] || jeeMainProgress;
}

// Helper function to get leaderboard for exam
export function getLeaderboard(examId?: string): LeaderboardEntry[] {
  // In a real app, filter by exam ID
  return leaderboardData;
}

// Helper function to get quiz by ID
export function getQuizById(quizId: string): typeof sampleQuizzes[keyof typeof sampleQuizzes] | undefined {
  return sampleQuizzes[quizId as keyof typeof sampleQuizzes];
}
