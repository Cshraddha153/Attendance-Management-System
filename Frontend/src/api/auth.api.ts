import { api } from './axios';
import type { User } from '../types';

export async function registerRequest(name: string, email: string, password: string) {
  const { data } = await api.post<{ user: User }>('/auth/register', { name, email, password });
  return data.user;
}

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<{ user: User }>('/auth/login', { email, password });
  return data.user;
}

export async function logoutRequest() {
  await api.post('/auth/logout');
}

export async function meRequest() {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
}
