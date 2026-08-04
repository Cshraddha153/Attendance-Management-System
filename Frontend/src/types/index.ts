export interface User {
  id: string;
  name: string;
  email: string;
}

export type PricingType = 'hourly' | 'session' | 'monthly';

export interface Client {
  _id: string;
  owner: string;
  name: string;
  contact?: string;
  notes?: string;
  pricingType: PricingType;
  rate: number;
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent';

export interface AttendanceRecord {
  _id: string;
  client: string;
  date: string;
  status: AttendanceStatus;
}

export type PaymentStatus = 'paid' | 'pending';

export interface Payment {
  _id: string;
  client: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  note?: string;
}

export interface PaymentsSummary {
  payments: Payment[];
  totalPaid: number;
  expectedTotal: number;
  remainingBalance: number;
}
