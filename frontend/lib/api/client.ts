import { API_BASE_URL } from '@/lib/api/config';
import type { ApiErrorResponse } from '@/types/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem('accessToken');
    return raw ? (JSON.parse(raw) as string) : null;
  } catch {
    return null;
  }
}

function clearStoredSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('user');
  } catch {
    // Ignore localStorage cleanup errors
  }
}

function normalizeErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  const payload = data as ApiErrorResponse;
  if (typeof payload.detail === 'string' && payload.detail.trim()) {
    return payload.detail;
  }

  return fallback;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = new Headers(init.headers || {});
  const resolvedToken = token || getStoredAccessToken();

  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (resolvedToken) {
    headers.set('Authorization', `Bearer ${resolvedToken}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  let parsed: unknown = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    parsed = await response.json();
  } else {
    const text = await response.text();
    parsed = text ? { detail: text } : null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();
      throw new ApiError('Session expired. Please login again.', 401);
    }

    const fallback = `Request failed with status ${response.status}`;
    throw new ApiError(normalizeErrorMessage(parsed, fallback), response.status);
  }

  return parsed as T;
}
