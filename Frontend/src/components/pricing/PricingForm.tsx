import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Client, PricingType } from '../../types';
import { selectInputClass, textInputClass, primaryButtonClass, labelClass } from '../../styles/formControls';

interface Props {
  client: Client;
  onSave: (pricingType: PricingType, rate: number) => Promise<void>;
}

export function PricingForm({ client, onSave }: Props) {
  const [pricingType, setPricingType] = useState<PricingType>(client.pricingType);
  const [rate, setRate] = useState(client.rate);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await onSave(pricingType, rate);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className={labelClass}>Pricing type</label>
        <select
          value={pricingType}
          onChange={(e) => setPricingType(e.target.value as PricingType)}
          className={selectInputClass}
        >
          <option value="hourly">Hourly</option>
          <option value="session">Per session</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Rate (₹)</label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className={`w-32 ${textInputClass}`}
        />
      </div>
      <button type="submit" disabled={saving} className={primaryButtonClass}>
        {saving ? 'Saving...' : 'Save'}
      </button>
      {saved && <span className="text-sm text-green-600 dark:text-green-400">Saved</span>}
    </form>
  );
}
