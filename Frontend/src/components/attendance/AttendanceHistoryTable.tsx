import type { AttendanceRecord } from '../../types';

interface Props {
  records: AttendanceRecord[];
  onDelete: (id: string) => void;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

const statusBadge: Record<AttendanceRecord['status'], string> = {
  present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  absent: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
};

export function AttendanceHistoryTable({ records, onDelete }: Props) {
  if (records.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No attendance recorded yet.</p>;
  }

  const today = todayStr();

  return (
    <div className="overflow-hidden overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Date</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {records.map((r) => {
            const isToday = r.date.slice(0, 10) === today;
            return (
              <tr key={r._id} className="text-gray-700 dark:text-gray-300">
                <td className="px-3 py-2">{new Date(r.date).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  {isToday ? (
                    <button
                      onClick={() => onDelete(r._id)}
                      className="text-red-600 hover:underline dark:text-red-400"
                    >
                      Remove
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500">Read-only</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
