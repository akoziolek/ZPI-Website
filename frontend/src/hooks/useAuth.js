import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { apiRequest } from '../api/apiFetch';
import { useAuthContext } from "../contexts/AuthContext";

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

export const useLogin = () => {
  const { login: setAuthContext } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Ładowanie użytkowników do listy
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${backendUrl}/users`);
        const json = await res.json();
        setUsers(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, [backendUrl]);

  // Funkcja logowania
  const executeLogin = async (selectedUser) => {
    try {
      setLoggingIn(true);
      setError("");
      localStorage.removeItem("token");

      const data = await apiRequest(
        `${backendUrl}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ mail: selectedUser.mail }),
          credentials: "include",
        },
        () => {}
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthContext(data.user);
      
      return true; // Sukces
    } catch (err) {
      setError(err.message);
      return false; // Błąd
    } finally {
      setLoggingIn(false);
    }
  };

  return { users, loadingUsers, loggingIn, error, executeLogin };
};