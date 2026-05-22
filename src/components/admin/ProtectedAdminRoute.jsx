import { Navigate } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
