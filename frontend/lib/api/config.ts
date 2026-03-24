const fallbackBaseUrl = 'http://127.0.0.1:8000';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || fallbackBaseUrl;

export const API_ROUTES = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    me: '/api/auth/me',
  },
  exams: {
    list: '/api/exams',
    byId: (examId: number | string) => `/api/exams/${examId}`,
    topics: (examId: number | string) => `/api/exams/${examId}/topics`,
    subjects: (examId: number | string) => `/api/exams/${examId}/subjects`,
  },
  quizzes: {
    byId: (quizId: number | string) => `/api/quizzes/${quizId}`,
    start: (quizId: number | string) => `/api/quizzes/${quizId}/start`,
    results: (quizId: number | string) => `/api/quizzes/${quizId}/results`,
  },
  servers: {
    list: '/api/servers',
    create: '/api/servers',
    members: (serverId: number | string) => `/api/servers/${serverId}/members`,
    quizzes: (serverId: number | string) => `/api/servers/${serverId}/quizzes`,
  },
  performance: {
    me: '/api/performance/me',
    weakTopics: '/api/performance/me/weak-topics',
    leaderboard: '/api/performance/leaderboard',
  },
} as const;
