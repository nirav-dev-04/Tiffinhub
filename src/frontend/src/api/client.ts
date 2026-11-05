import { AuthResponse, HealthStatus, LoginPayload, RegisterPayload, UserSummary } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tiffinhub-api.onrender.com';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.title || errorDetail;
    } catch {
      // fallback to status text
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export async function checkApiHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse<HealthStatus>(response);
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(response);
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(response);
}

export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function getCurrentUserApi(token: string): Promise<UserSummary> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<UserSummary>(response);
}
