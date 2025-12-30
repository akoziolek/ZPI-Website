import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ALL_ROLES } from '../config';
import { useNotification } from '../hooks/useNotification';

const ProtectedRoute = ({ user, children, allowedRoles=ALL_ROLES }) => {
  const { showError } = useNotification();
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
