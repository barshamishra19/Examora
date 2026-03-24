import { apiRequest, ApiError } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/api/config';
import type { ApiQuizResult, ApiQuizStart } from '@/types/api';

export async function startQuiz(
  quizId: number | string,
  accessToken: string
): Promise<ApiQuizStart> {
  return apiRequest<ApiQuizStart>(
    API_ROUTES.quizzes.start(quizId),
    { method: 'POST' },
    accessToken
  );
}

export async function getLatestQuizResult(
  quizId: number | string,
  accessToken: string
): Promise<ApiQuizResult | null> {
  try {
    return await apiRequest<ApiQuizResult>(
      API_ROUTES.quizzes.results(quizId),
      { method: 'GET' },
      accessToken
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
