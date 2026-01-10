import { useModal } from '../contexts/ModalContext';
import { useAuthContext } from '../contexts/AuthContext.js';
import { apiRequest } from '../api/apiFetch.js';
import { TOPIC_ACTIONS, ERROR_MESSAGES } from "../config.js";
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

      const errorMessage = ERROR_MESSAGES[err.message] ?? failureMessage;

      openModal({
        type: "warning",
        message: errorMessage,
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
    [TOPIC_ACTIONS.JOIN]: (uuid) =>
      request({
        endpoint: `topics/${uuid}/join`,
        method: "POST",
        successMessage: "Dopisano do tematu!",
        failureMsg: "Wystąpił problem przy dopisywaniu do tematu!",
      }),
    [TOPIC_ACTIONS.WITHDRAW]: (uuid) => 
      request({
        endpoint: `topics/${uuid}/withdraw`,
        method: "DELETE",
        successMessage: "Wypisano się z tematu!",
        failureMsg: "Wystąpił problem przy wypisywaniu z tematu!",
      }),
    [TOPIC_ACTIONS.SIGN]: (uuid) => 
      request({
        endpoint: `topics/${uuid}/sign`,
        method: "POST",
        successMessage: "Podpisano deklarację!",
        failureMsg: "Podczas autoryzacji podpisu wystąpił błąd!",
      }),
    // .... reszta
  };

  return handlers;
};
