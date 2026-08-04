import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center p-8 text-gray-500 dark:text-gray-400">Loading...</div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
