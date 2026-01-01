
import { useAuthContext } from '../contexts/AuthContext';
import { apiRequest } from '../api/apiFetch';
import { useCallback } from "react";

export const useApi = () => {
  const { onTokenExpired } = useAuthContext();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const request = useCallback(
    async ({ endpoint, method = "GET", body }) => {
      return apiRequest(
        `${backendUrl}/${endpoint}`,
        {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: body ? { "Content-Type": "application/json" } : {},
          credentials: "include"
        },
        onTokenExpired
      );
    },
    [backendUrl, onTokenExpired]
  );

  return { request };
};

