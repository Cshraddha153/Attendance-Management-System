import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Client, PricingType } from '../../types';
import type { ClientInput } from '../../api/client.api';
import { textInputClass, selectInputClass, primaryButtonClass, secondaryButtonClass } from '../../styles/formControls';

interface Props {
  initial?: Client;
  onSubmit: (input: ClientInput) => Promise<void>;
  onCancel: () => void;
}

export function ClientForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [contact, setContact] = useState(initial?.contact ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [pricingType, setPricingType] = useState<PricingType>(initial?.pricingType ?? 'session');
  const [rate, setRate] = useState(initial?.rate ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ name, contact, notes, pricingType, rate });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save client');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <input
        type="text"
        placeholder="Client name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={textInputClass}
      />
      <input
        type="text"
        placeholder="Contact (phone/email)"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className={textInputClass}
      />
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className={textInputClass}
      />
      <div className="flex gap-3">
        <select
          value={pricingType}
          onChange={(e) => setPricingType(e.target.value as PricingType)}
          className={selectInputClass}
        >
          <option value="hourly">Hourly</option>
          <option value="session">Per session</option>
          <option value="monthly">Monthly</option>
        </select>
        <input
          type="number"
          min={0}
          step="0.01"
          placeholder="Rate (₹)"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className={`w-32 ${textInputClass}`}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
      </div>
    </form>
  );
}
