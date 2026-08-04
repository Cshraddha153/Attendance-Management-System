import { Link } from 'react-router-dom';
import type { Client } from '../../types';

interface Props {
  clients: Client[];
  onDelete: (id: string) => void;
}

const pricingLabel: Record<Client['pricingType'], string> = {
  hourly: 'Hourly',
  session: 'Per session',
  monthly: 'Monthly',
};

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function ClientList({ clients, onDelete }: Props) {
  if (clients.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No clients yet. Add your first client to get started.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {clients.map((client) => (
        <li
          key={client._id}
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-indigo-200 hover:shadow dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-900"
        >
          <Link to={`/clients/${client._id}`} className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
              {initials(client.name) || '?'}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium text-gray-800 dark:text-gray-100">
                {client.name}
              </span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                {pricingLabel[client.pricingType]} · ₹{client.rate}
              </span>
            </span>
          </Link>
          <button
            onClick={() => onDelete(client._id)}
            className="shrink-0 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
