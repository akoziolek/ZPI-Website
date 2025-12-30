// src/hooks/useTopicHandlers.js
import { apiFetchWithAuth } from "../api/apiFetch";
import { TOPIC_ACTIONS } from "../config.js";
import { useNavigate } from "react-router-dom";

// TO DO - only an example, what if new page opens?
export const useTopicHandlers = (onRefresh, showToast, onTokenExpired) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Uniwersalna funkcja do zapytań, by nie powtarzać try-catch
  const performAction = async (uuid, endpoint, method = "POST", successMsg = "Akcja zakończona sukcesem") => {
    try {
      const res = await apiFetchWithAuth(`${backendUrl}/topics/${uuid}${endpoint}`, {
        method: method
      }, onTokenExpired);

      if (!res.ok) throw new Error(`Błąd sieci: ${res.status}`);

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "API zwróciło błąd");

      //showToast(successMsg, "success");
      //onRefresh(); // Odświeżamy listę tematów po sukcesie
      console.log(successMsg);
    } catch {
      //showToast(`Błąd: ${err.message}`, "error");
      console.log("blad");
    }
  };

  // Mapa handlerów przypisana do kluczy akcji
  const handlers = {
    [TOPIC_ACTIONS.APPROVE]: (uuid) =>
      navigate(`/topics/${uuid}/opinion`),

    [TOPIC_ACTIONS.REJECT]: (uuid) =>
      navigate(`/topics/${uuid}/opinion`),
    // ... tutaj dodajesz kolejne akcje wg potrzeb
  };

  return handlers;
};