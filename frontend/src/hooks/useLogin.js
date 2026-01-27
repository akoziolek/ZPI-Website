import { useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { apiRequest } from "../api/apiFetch";

export const useLogin = () => {
  const { login: setAuthContext } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
      
      return true; 
    } catch (err) {
      setError(err.message);
      return false; 
    } finally {
      setLoggingIn(false);
    }
  };

  return { users, loadingUsers, loggingIn, error, executeLogin };
};