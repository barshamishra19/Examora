import { apiRequest } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/api/config';
import type {
  ApiLeaderboardResponse,
  ApiPerformanceMe,
  ApiWeakTopic,
} from '@/types/api';

export async function getMyPerformance(accessToken: string): Promise<ApiPerformanceMe> {
  return apiRequest<ApiPerformanceMe>(
    API_ROUTES.performance.me,
    { method: 'GET' },
    accessToken
  );
}

export async function getWeakTopics(accessToken: string): Promise<ApiWeakTopic[]> {
  return apiRequest<ApiWeakTopic[]>(
    API_ROUTES.performance.weakTopics,
    { method: 'GET' },
    accessToken
  );
}

export async function getLeaderboard(
  params: { examId?: number | string; limit?: number } = {}
): Promise<ApiLeaderboardResponse> {
  const query = new URLSearchParams();

  if (params.examId !== undefined && params.examId !== null) {
    query.set('exam_id', String(params.examId));
  }

  if (params.limit !== undefined) {
    query.set('limit', String(params.limit));
  }

  const suffix = query.toString();
  const path = suffix
    ? `${API_ROUTES.performance.leaderboard}?${suffix}`
    : API_ROUTES.performance.leaderboard;

  return apiRequest<ApiLeaderboardResponse>(path, { method: 'GET' });
}
