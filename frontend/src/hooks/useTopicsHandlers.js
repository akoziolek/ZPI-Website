import { useModal } from '../contexts/ModalContext';
import { useAuthContext } from '../contexts/AuthContext.js';
import { apiRequest } from '../api/apiFetch.js';
// src/hooks/useTopicHandlers.js
import { TOPIC_ACTIONS } from "../config.js";
import { useNavigate } from "react-router-dom";


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
      openModal({
        type: "warning",
        message: failureMessage,
        isBlocking: false,
        actions,
        refresh
      });

      throw err; // ważne, jeśli przycisk ma reagować dalej
    }
  };

  return performRequest;
};

export const useTopicHandlers = () => {
  const request = useActionRequest();
  const navigate = useNavigate();

  // Mapa handlerów przypisana do kluczy akcji
  const handlers = {
    [TOPIC_ACTIONS.APPROVE]: (uuid) =>
      request({
        endpoint: `topics/${uuid}/approve`,
        method: "POST",
        body: { argumentation: "" },
        successMessage: "Zatwierdzono temat!",
        failureMsg: "Wystąpił błąd podczas dodawania opinii!",
      }),
    [TOPIC_ACTIONS.REJECT]: (uuid) =>
      navigate(`/topics/${uuid}/opinion`),
    // .... reszta
  };

  return handlers;
};

