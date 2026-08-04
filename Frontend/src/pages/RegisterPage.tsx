import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PasswordInput } from '../components/common/PasswordInput';
import { textInputClass, primaryButtonClass } from '../styles/formControls';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/clients');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Create an account</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start tracking clients in minutes</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={textInputClass}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={textInputClass}
          />
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="Password"
            required
            minLength={6}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button type="submit" disabled={submitting} className={`w-full ${primaryButtonClass}`}>
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
