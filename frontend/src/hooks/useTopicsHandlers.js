// src/hooks/useTopicHandlers.js
import { TOPIC_ACTIONS } from "../config.js";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "./useApiFetch.js";


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
    // .... reszta
  };

  return handlers;
};