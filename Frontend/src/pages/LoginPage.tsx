import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PasswordInput } from '../components/common/PasswordInput';
import { textInputClass, primaryButtonClass } from '../styles/formControls';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/clients');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Log in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={textInputClass}
          />
          <PasswordInput value={password} onChange={setPassword} placeholder="Password" required />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button type="submit" disabled={submitting} className={`w-full ${primaryButtonClass}`}>
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          No account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
