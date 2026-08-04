import type { Payment } from '../../types';

interface Props {
  payments: Payment[];
  onDelete: (id: string) => void;
}

const statusBadge: Record<Payment['status'], string> = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  pending: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

export function PaymentHistoryTable({ payments, onDelete }: Props) {
  if (payments.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No payments recorded yet.</p>;
  }

  return (
    <div className="overflow-hidden overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Date</th>
            <th className="px-3 py-2 text-left font-medium">Amount</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
            <th className="px-3 py-2 text-left font-medium">Note</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {payments.map((p) => (
            <tr key={p._id} className="text-gray-700 dark:text-gray-300">
              <td className="px-3 py-2">{new Date(p.date).toLocaleDateString()}</td>
              <td className="px-3 py-2 font-medium">₹{p.amount.toFixed(2)}</td>
              <td className="px-3 py-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[p.status]}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{p.note}</td>
              <td className="px-3 py-2 text-right">
                <button
                  onClick={() => onDelete(p._id)}
                  className="text-red-600 hover:underline dark:text-red-400"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
