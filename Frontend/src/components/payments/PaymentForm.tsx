import { useState } from 'react';
import type { FormEvent } from 'react';
import type { PaymentStatus } from '../../types';
import { disabledInputClass, textInputClass, selectInputClass, primaryButtonClass, labelClass } from '../../styles/formControls';

interface Props {
  calculatedAmount: number;
  onSubmit: (status: PaymentStatus, note: string) => Promise<void>;
}

export function PaymentForm({ calculatedAmount, onSubmit }: Props) {
  const [status, setStatus] = useState<PaymentStatus>('paid');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(status, note);
      setNote('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className={labelClass}>Amount (₹)</label>
        <input
          type="text"
          value={calculatedAmount.toFixed(2)}
          disabled
          className={`w-32 ${disabledInputClass}`}
        />
      </div>
      <div>
        <label className={labelClass}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PaymentStatus)}
          className={selectInputClass}
        >
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="min-w-37.5 flex-1">
        <label className={labelClass}>Note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={textInputClass}
        />
      </div>
      <button type="submit" disabled={submitting} className={primaryButtonClass}>
        {submitting ? 'Saving...' : 'Add Payment'}
      </button>
    </form>
  );
}
