import { apiRequest } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/api/config';
import type { ApiUser, RegisterRequest, RegisterResponse, TokenResponse } from '@/types/api';
import type { User } from '@/types/index';

export interface AuthSession {
  user: User;
  accessToken: string;
}

function toAppUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    role: apiUser.role,
  };
}

export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(API_ROUTES.auth.register, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const form = new URLSearchParams();
  form.set('username', email);
  form.set('password', password);

  return apiRequest<TokenResponse>(API_ROUTES.auth.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });
}

export async function getCurrentUser(accessToken: string): Promise<User> {
  const apiUser = await apiRequest<ApiUser>(API_ROUTES.auth.me, {
    method: 'GET',
  }, accessToken);

  return toAppUser(apiUser);
}

export async function loginAndGetSession(email: string, password: string): Promise<AuthSession> {
  const tokenResponse = await login(email, password);
  const user = await getCurrentUser(tokenResponse.access_token);

  return {
    user,
    accessToken: tokenResponse.access_token,
  };
}

export async function registerAndLogin(
  payload: RegisterRequest
): Promise<AuthSession> {
  const response = await register(payload);

  if (response.access_token && response.user) {
    return {
      user: toAppUser(response.user),
      accessToken: response.access_token,
    };
  }

  return loginAndGetSession(payload.email, payload.password);
}
