import { apiRequest } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/api/config';
import type { ApiServer, ApiServerMember, ApiServerQuiz } from '@/types/api';

export interface CreateServerPayload {
  name: string;
  description?: string;
}

export async function listServers(accessToken: string): Promise<ApiServer[]> {
  return apiRequest<ApiServer[]>(
    API_ROUTES.servers.list,
    { method: 'GET' },
    accessToken
  );
}

export async function createServer(
  payload: CreateServerPayload,
  accessToken: string
): Promise<ApiServer> {
  return apiRequest<ApiServer>(
    API_ROUTES.servers.create,
    {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        description: payload.description || '',
      }),
    },
    accessToken
  );
}

export async function listServerMembers(
  serverId: number | string,
  accessToken: string
): Promise<ApiServerMember[]> {
  return apiRequest<ApiServerMember[]>(
    API_ROUTES.servers.members(serverId),
    { method: 'GET' },
    accessToken
  );
}

export async function listServerQuizzes(
  serverId: number | string,
  accessToken: string
): Promise<ApiServerQuiz[]> {
  return apiRequest<ApiServerQuiz[]>(
    API_ROUTES.servers.quizzes(serverId),
    { method: 'GET' },
    accessToken
  );
}
