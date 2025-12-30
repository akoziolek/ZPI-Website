// src/hooks/useTopicHandlers.js
import { TOPIC_ACTIONS } from "../config.js";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "./useApiFetch.js";

// TO DO - only an example, what if new page opens?
export const useTopicHandlers = ( onTokenExpired ) => {
  const request = useApiRequest(onTokenExpired);
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
  };

  return handlers;
};