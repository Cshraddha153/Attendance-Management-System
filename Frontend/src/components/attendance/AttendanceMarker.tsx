import { useState } from 'react';
import type { AttendanceStatus } from '../../types';
import { disabledInputClass, labelClass } from '../../styles/formControls';

interface Props {
  alreadyMarkedToday: boolean;
  onMark: (status: AttendanceStatus) => Promise<void>;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AttendanceMarker({ alreadyMarkedToday, onMark }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleMark(status: AttendanceStatus) {
    setError('');
    setSubmitting(true);
    try {
      await onMark(status);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = submitting || alreadyMarkedToday;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" value={today()} disabled className={disabledInputClass} />
        </div>
        <button
          disabled={disabled}
          onClick={() => handleMark('present')}
          className="rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Present
        </button>
        <button
          disabled={disabled}
          onClick={() => handleMark('absent')}
          className="rounded-lg bg-rose-600 px-4 py-2.5 font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Absent
        </button>
      </div>
      {alreadyMarkedToday && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          Attendance for today has already been marked.
        </p>
      )}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
