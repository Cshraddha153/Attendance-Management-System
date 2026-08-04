import { api } from './axios';
import type { AttendanceRecord, AttendanceStatus } from '../types';

export async function getAttendance(clientId: string) {
  const { data } = await api.get<{ attendance: AttendanceRecord[] }>(
    `/clients/${clientId}/attendance`
  );
  return data.attendance;
}

export async function markAttendance(clientId: string, status: AttendanceStatus) {
  const { data } = await api.post<{ attendance: AttendanceRecord }>(
    `/clients/${clientId}/attendance`,
    { status }
  );
  return data.attendance;
}

export async function deleteAttendance(clientId: string, attendanceId: string) {
  await api.delete(`/clients/${clientId}/attendance/${attendanceId}`);
}
