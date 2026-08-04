import { api } from './axios';
import type { PaymentsSummary, PaymentStatus } from '../types';

export async function getPayments(clientId: string) {
  const { data } = await api.get<PaymentsSummary>(`/clients/${clientId}/payments`);
  return data;
}

export async function createPayment(
  clientId: string,
  input: { status: PaymentStatus; note?: string }
) {
  const { data } = await api.post(`/clients/${clientId}/payments`, input);
  return data.payment;
}

export async function deletePayment(clientId: string, paymentId: string) {
  await api.delete(`/clients/${clientId}/payments/${paymentId}`);
}
