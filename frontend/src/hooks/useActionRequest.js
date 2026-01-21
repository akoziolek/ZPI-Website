import { useModal } from '../contexts/ModalContext.js';
import { useAuthContext } from '../contexts/AuthContext.js';
import { apiRequest } from '../api/apiFetch.js';
import { ERROR_MESSAGES } from "../config.js";

/**
 * Hook that wraps API actions which trigger user-visible modals.
 *
 * `performRequest` performs an apiRequest to the provided `endpoint` and
 * displays a modal on success or failure (using the ModalContext). It also
 * accepts optional `actions` and messages to customize the modal.
 *
 * @returns {function(Object): Promise<any>} performRequest
 */
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
      const data = await apiRequest(
        `${backendUrl}/${endpoint}`,
        {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: body ? { "Content-Type": "application/json" } : {},
        },
        onTokenExpired
      );

      openModal({
        type: "info",
        message: successMessage,
        isBlocking: false,
        actions,
        refresh
      });

      return data;
    } catch (err) {
      const errorMessage = ERROR_MESSAGES[err.message] ?? failureMessage;
      openModal({
        type: "warning",
        message: errorMessage,
        isBlocking: false,
        actions,
        refresh
      });
      throw err;
    }
  };

  return performRequest;
};