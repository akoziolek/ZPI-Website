import { useModal } from '../contexts/ModalContext';
import { apiFetchWithAuth } from '../api/apiFetch';

export const useApiRequest = (onTokenExpired) => {
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

      const res = await apiFetchWithAuth(`${backendUrl}/${endpoint}`, options, onTokenExpired);

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