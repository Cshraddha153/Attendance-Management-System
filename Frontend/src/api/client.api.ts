import { api } from './axios';
import type { Client, PricingType } from '../types';

export interface ClientInput {
  name: string;
  contact?: string;
  notes?: string;
  pricingType?: PricingType;
  rate?: number;
}

export async function getClients(search?: string) {
  const { data } = await api.get<{ clients: Client[] }>('/clients', {
    params: search ? { search } : undefined,
  });
  return data.clients;
}

export async function getClient(id: string) {
  const { data } = await api.get<{ client: Client }>(`/clients/${id}`);
  return data.client;
}

export async function createClient(input: ClientInput) {
  const { data } = await api.post<{ client: Client }>('/clients', input);
  return data.client;
}

export async function updateClient(id: string, input: Partial<ClientInput>) {
  const { data } = await api.put<{ client: Client }>(`/clients/${id}`, input);
  return data.client;
}

export async function deleteClient(id: string) {
  await api.delete(`/clients/${id}`);
}
