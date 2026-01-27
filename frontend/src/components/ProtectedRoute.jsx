import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ALL_ROLES } from '../config';
import { useNotification } from '../contexts/NotificationContext';
import { useAuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles=ALL_ROLES }) => {
  const { showError } = useNotification();
  const { user } = useAuthContext();
  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      showError("Nie posiadasz odpowiednich uprawnień aby przejść do tej strony");
    }
    }, [user, allowedRoles, showError]
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  else if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/topics" replace />;
  }
  return children;
};

export default ProtectedRoute;
