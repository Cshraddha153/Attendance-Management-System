import { useEffect, useState } from 'react';
import { ClientList } from '../components/clients/ClientList';
import { ClientForm } from '../components/clients/ClientForm';
import { ClientSearchBar } from '../components/clients/ClientSearchBar';
import { createClient, deleteClient, getClients } from '../api/client.api';
import type { Client } from '../types';

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      getClients(search)
        .then(setClients)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [search]);

  async function handleCreate(input: Parameters<typeof createClient>[0]) {
    const client = await createClient(input);
    setClients((prev) => [...prev, client].sort((a, b) => a.name.localeCompare(b.name)));
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this client and all their attendance/payment history?')) return;
    await deleteClient(id);
    setClients((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Clients</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'}
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          {showForm ? 'Close' : '+ Add Client'}
        </button>
      </div>

      {showForm && <ClientForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      <ClientSearchBar value={search} onChange={setSearch} />

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <ClientList clients={clients} onDelete={handleDelete} />
      )}
    </div>
  );
}
