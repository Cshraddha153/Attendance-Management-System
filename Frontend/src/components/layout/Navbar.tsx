import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-3 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <Link to="/clients" className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </span>
        <span className="hidden sm:inline">Attendance & Payment Tracker</span>
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {currentUser && (
          <div className="flex items-center gap-3 border-l border-gray-200 pl-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            <span className="hidden sm:inline">{currentUser.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
