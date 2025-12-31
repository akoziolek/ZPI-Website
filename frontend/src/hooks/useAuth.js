import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { apiRequest } from '../api/apiFetch';

/*
async function verifyToken() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  try {
    const res = await apiRequest(`${backendUrl}/auth/verify`);
    if (res.ok) {
      const json = await res.json();
      return json.success ? json.user : null;
    }
    return null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
  */
 async function verifyToken() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  try {
    const data = await apiRequest(`${backendUrl}/auth/verify`);
    // data jest już parsowane, np. { success: true, user: {...} }
    return data.user ?? null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}


export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showInfo } = useNotification();

  // Check authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Verify token with backend
          const verifiedUser = await verifyToken();
          if (verifiedUser) {
            setUser(verifiedUser);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showError('Sesja wygasła. Zaloguj się ponownie.');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          showError('Błąd weryfikacji sesji. Zaloguj się ponownie.');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [showError]);

  const login = useCallback((userData) => {
    setUser(userData);
    showInfo('Zalogowano pomyślnie!', 3000);
  }, [showInfo]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showInfo('Wylogowano pomyślnie.', 3000);
  }, [showInfo]);

  const handleTokenExpired = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showError('Sesja wygasła. Zaloguj się ponownie.');
  }, [showError]);

  return {
    user,
    loading,
    login,
    logout,
    handleTokenExpired
  };
};
