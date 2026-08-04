interface Props {
  expectedTotal: number;
  totalPaid: number;
  remainingBalance: number;
}

export function BalanceSummary({ expectedTotal, totalPaid, remainingBalance }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/50">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Expected
        </p>
        <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-gray-100">
          ₹{expectedTotal.toFixed(2)}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/50">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Paid
        </p>
        <p className="mt-1 text-xl font-semibold text-emerald-600 dark:text-emerald-400">
          ₹{totalPaid.toFixed(2)}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/50">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Remaining
        </p>
        <p
          className={`mt-1 text-xl font-semibold ${
            remainingBalance > 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-gray-800 dark:text-gray-100'
          }`}
        >
          ₹{remainingBalance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
