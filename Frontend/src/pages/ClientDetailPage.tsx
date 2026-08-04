import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { AttendanceRecord, Client, Payment, PaymentsSummary } from '../types';
import { getClient, updateClient } from '../api/client.api';
import {
  deleteAttendance,
  getAttendance,
  markAttendance,
} from '../api/attendance.api';
import { createPayment, deletePayment, getPayments } from '../api/payment.api';
import { PricingForm } from '../components/pricing/PricingForm';
import { AttendanceMarker } from '../components/attendance/AttendanceMarker';
import { AttendanceHistoryTable } from '../components/attendance/AttendanceHistoryTable';
import { PaymentForm } from '../components/payments/PaymentForm';
import { PaymentHistoryTable } from '../components/payments/PaymentHistoryTable';
import { BalanceSummary } from '../components/payments/BalanceSummary';
import { cardClass } from '../styles/formControls';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [paymentsSummary, setPaymentsSummary] = useState<PaymentsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([getClient(id), getAttendance(id), getPayments(id)]).then(
      ([clientData, attendanceData, paymentsData]) => {
        setClient(clientData);
        setAttendance(attendanceData);
        setPaymentsSummary(paymentsData);
        setLoading(false);
      }
    );
  }, [id]);

  async function refreshPayments() {
    if (!id) return;
    setPaymentsSummary(await getPayments(id));
  }

  async function handlePricingSave(pricingType: Client['pricingType'], rate: number) {
    if (!id) return;
    const updated = await updateClient(id, { pricingType, rate });
    setClient(updated);
    await refreshPayments();
  }

  async function handleMarkAttendance(status: AttendanceRecord['status']) {
    if (!id) return;
    const record = await markAttendance(id, status);
    setAttendance((prev) => [record, ...prev]);
    await refreshPayments();
  }

  async function handleDeleteAttendance(attendanceId: string) {
    if (!id) return;
    setAttendanceError('');
    try {
      await deleteAttendance(id, attendanceId);
      setAttendance((prev) => prev.filter((r) => r._id !== attendanceId));
      await refreshPayments();
    } catch (err: any) {
      setAttendanceError(err?.response?.data?.message || 'Failed to delete attendance record');
    }
  }

  async function handleAddPayment(status: Payment['status'], note: string) {
    if (!id) return;
    await createPayment(id, { status, note });
    await refreshPayments();
  }

  async function handleDeletePayment(paymentId: string) {
    if (!id) return;
    await deletePayment(id, paymentId);
    await refreshPayments();
  }

  if (loading || !client) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-gray-500 dark:text-gray-400">Loading...</div>
    );
  }

  const alreadyMarkedToday = attendance.some((r) => r.date.slice(0, 10) === todayStr());

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link
          to="/clients"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          &larr; Back to clients
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {client.name}
        </h1>
        {client.contact && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{client.contact}</p>
        )}
      </div>

      <section className={`${cardClass} space-y-4`}>
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">Pricing</h2>
        <PricingForm client={client} onSave={handlePricingSave} />
      </section>

      <section className={`${cardClass} space-y-4`}>
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">Attendance</h2>
        <AttendanceMarker alreadyMarkedToday={alreadyMarkedToday} onMark={handleMarkAttendance} />
        {attendanceError && <p className="text-sm text-red-600 dark:text-red-400">{attendanceError}</p>}
        <AttendanceHistoryTable records={attendance} onDelete={handleDeleteAttendance} />
      </section>

      <section className={`${cardClass} space-y-4`}>
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">Payments</h2>
        {paymentsSummary && (
          <BalanceSummary
            expectedTotal={paymentsSummary.expectedTotal}
            totalPaid={paymentsSummary.totalPaid}
            remainingBalance={paymentsSummary.remainingBalance}
          />
        )}
        {paymentsSummary && (
          <PaymentForm calculatedAmount={paymentsSummary.expectedTotal} onSubmit={handleAddPayment} />
        )}
        {paymentsSummary && (
          <PaymentHistoryTable payments={paymentsSummary.payments} onDelete={handleDeletePayment} />
        )}
      </section>
    </div>
  );
}
