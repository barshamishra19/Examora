import { apiRequest } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/api/config';
import type { ApiExam, ApiExamSubject, ApiExamTopic } from '@/types/api';

export async function listExams(category?: string): Promise<ApiExam[]> {
  const params = new URLSearchParams();
  if (category) {
    params.set('category', category);
  }

  const query = params.toString();
  const path = query ? `${API_ROUTES.exams.list}?${query}` : API_ROUTES.exams.list;

  return apiRequest<ApiExam[]>(path, {
    method: 'GET',
  });
}

export async function getExamById(examId: number | string): Promise<ApiExam> {
  return apiRequest<ApiExam>(API_ROUTES.exams.byId(examId), {
    method: 'GET',
  });
}

export async function getTopicsForExam(examId: number | string): Promise<ApiExamTopic[]> {
  return apiRequest<ApiExamTopic[]>(API_ROUTES.exams.topics(examId), {
    method: 'GET',
  });
}

export async function getSubjectsForExam(examId: number | string): Promise<ApiExamSubject[]> {
  return apiRequest<ApiExamSubject[]>(API_ROUTES.exams.subjects(examId), {
    method: 'GET',
  });
}
