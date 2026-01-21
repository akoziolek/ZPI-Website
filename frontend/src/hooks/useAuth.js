import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { apiRequest } from '../api/apiFetch';
import { useAuthContext } from "../contexts/AuthContext";

async function verifyToken() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log(backendUrl);
  try {
    const data = await apiRequest(`${backendUrl}/auth/verify`);
    // data jest już parsowane, np. { success: true, user: {...} }
    return data.user ?? null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * React hook that provides authentication state and helpers.
 *
 * Returns the current authenticated user (or null), a loading flag while
 * the initial verification runs, and helper methods to login/logout and
 * handle token expiry. The hook performs a token verification on mount
 * when a token is present in localStorage.
 *
 * @returns {{
 *   user: Object|null,
 *   loading: boolean,
 *   login: function(Object): void,
 *   logout: function(): void,
 *   handleTokenExpired: function(): void
 * }}
 */
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

/**
 * Hook used on the login page to fetch available demo users and execute
 * a login flow for a selected user.
 *
 * The hook fetches the list of users from the backend on mount and
 * exposes `executeLogin(selectedUser)` which performs the POST /auth/login
 * request, stores tokens in localStorage and updates the AuthContext.
 *
 * @returns {{
 *   users: Array<Object>,
 *   loadingUsers: boolean,
 *   loggingIn: boolean,
 *   error: string,
 *   executeLogin: function(Object): Promise<boolean>
 * }}
 */
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