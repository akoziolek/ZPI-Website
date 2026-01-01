import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { useModal } from "../contexts/ModalContext";

export const useUnsavedChanges = (isDirty) => {
  const { openModal, closeModal } = useModal();

  // 1. Blokada React Routera (np. kliknięcie w link)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      openModal({
        type: "warning",
        message: "Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?",
        isBlocking: true, // Ważne, żeby nie zamknąć klikając w tło
        actions: (
          <>
            <button
              onClick={() => { blocker.reset(); closeModal(); }}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded border border-gray shadow"
            >
              Anuluj         
            </button>
            <button
              onClick={() => { blocker.proceed(); closeModal(); }}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded border border-gray shadow"
              >
                Przerwij
            </button>
          </>
        ),
      });
    }
  }, [blocker, isDirty, openModal, closeModal]);

  // 2. Blokada przeglądarki (np. odświeżenie, zamknięcie karty)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ""; // Nowoczesne przeglądarki wymagają ustawienia returnValue
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
};