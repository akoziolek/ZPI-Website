
//import { apiRequest } from '../api/apiFetch';
import { useAuthContext } from '../contexts/AuthContext';
import { apiRequest } from '../api/apiFetch';

/*
export const useActionRequest = () => {
  const { onTokenExpired } = useAuthContext(); 
  const { openModal } = useModal();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const performRequest = async ({
    endpoint, 
    method = "POST", 
    body = null, 
    actions = null,
    successMessage = "Akcja zakończona sukcesem",
    failureMsg: failureMessage = "Akcja zakończona niepowodzeniem",
    refresh = true
  }) => {
    try {
      const options = { method, headers: {} };
      
      if (body) {
        options.body = JSON.stringify(body);
        options.headers['Content-Type'] = 'application/json';
      }

      const res = await apiRequest(`${backendUrl}/${endpoint}`, options, onTokenExpired);

      if (!res.ok) throw new Error(`Błąd sieci: ${res.status}`);

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "API zwróciło błąd");

      openModal({
        type: "info",
        message: successMessage,
        isBlocking: false,
        actions: actions,
        refresh: refresh
      });

      return json; // Zwracamy dane, gdyby były potrzebne

    } catch {
      openModal({
        type: "warning",
        message: `${failureMessage}`,
        isBlocking: false,
        actions: actions,
        refresh: refresh
      });
    }
  };

  return performRequest;
};
*/


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

