import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const isBedUser = user?.role === 'leito' || user?.role === 'paciente';
  const isStaffRoute =
    location.pathname.startsWith('/select-unit') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/first-access');

  if (isBedUser && isStaffRoute) {
    return <Navigate to="/patient" replace />;
  }

  return <Outlet />;
}
