
import { useAuthContext } from '../contexts/AuthContext';
import { apiRequest } from '../api/apiFetch';
import { useCallback } from "react";

/**
 * Hook that provides a preconfigured API request helper tied to the backend URL
 * and the application's token-expiration handler.
 *
 * The returned `request` function accepts an object with `endpoint`, `method`
 * and `body` and forwards the call to the shared `apiRequest` helper.
 *
 * @returns {function(Object): Promise<any>} request
 */
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

  return  request ;
};
