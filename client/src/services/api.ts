const API_BASE_URL = 'http://localhost:3000/api';

interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

/**
 * API client with automatic JWT token attachment.
 * Reads the token from localStorage and injects it as a Bearer token.
 */
async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 204 No Content (e.g. DELETE)
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Something went wrong');
  }

  return data as T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Auth endpoints ─────────────────────────────────────────────

export interface AuthResponse {
  token: string;
}

export const authApi = {
  register: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ─── Car endpoints ──────────────────────────────────────────────

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const carsApi = {
  getAll: () => apiFetch<Car[]>('/cars'),

  getById: (id: number) => apiFetch<Car>(`/cars/${id}`),

  create: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<Car>('/cars', {
      method: 'POST',
      body: JSON.stringify(car),
    }),

  update: (id: number, data: Partial<Car>) =>
    apiFetch<Car>(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/cars/${id}`, {
      method: 'DELETE',
    }),
};
