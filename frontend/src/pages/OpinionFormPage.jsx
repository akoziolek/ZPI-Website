import React, { useState, useEffect } from "react";
import { useParams, useBlocker } from "react-router-dom";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import { useModal } from "../hooks/useModal";
import { apiFetchWithAuth } from "../api/apiFetch";
import { STATUSES } from "../config";

const OpinionFormPage = ({ user, onLogout, onTokenExpired}) => {
  const [topic, setTopic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reasoning, setReasoning] = useState("");
  const { openModal, closeModal } = useModal();
  const isReasoningInputted = reasoning.trim().length > 0;
  const { uuid } = useParams();
  // block changing the page, when reasoning is inputted
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isReasoningInputted && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const loadTopic = async () => {
      setLoading(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const topicPromise = apiFetchWithAuth(`${backendUrl}/topics/${uuid}`, {}, onTokenExpired)
        .then(async res => {
          if (!res.ok) throw new Error(`Network error: ${res.status}`);
          const json = await res.json();
          return json.data;
        });
  
        const [topicData] = await Promise.all([
          topicPromise,
        ]);

        // if something changed from the last call to backend
        if(topicData.status === STATUSES.APPROVED || topicData.status === STATUSES.REJECTED) {
          setError("Status tematu uległ zmianie, jest on już rozpatrzono.");
        } else{
          setTopic(topicData);
        }
      } catch (err) {
        setError(`Nie można załadować tematu: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [onTokenExpired, uuid, user.role, user.uuid]);

  useEffect(() => {
    if (blocker.state === "blocked") {
      openModal({
        type: "warning",
        message: "Czy na pewno chcesz przerwać dodawanie opinii?",
        isBlocking: true,
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
      )
      });
    }
  }, [blocker, openModal, closeModal]);


  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isReasoningInputted) {
        event.preventDefault();
        event.returnValue = "Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?";
        return event.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Czyszczenie listenera przy odmontowaniu komponentu
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isReasoningInputted]);


  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          user={user} 
          onLogout={onLogout} 
        />
    
        <main className="flex flex-col items-center px-6 sm:px-6 lg:px-8 py-18">
          {loading && (
            <div className="text-center text-gray-500">Ładowanie tematów...</div>
          )}

          {error && (
            <div className="text-center text-red-600 mb-4">{error}</div>
          )}

          {!error && !loading && (
            <>
              <div className="sm:mx-auto sm:w-full sm:max-w-6xl pb-6 pl-6">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Odrzucenie tematu
                </h2>
              </div>
            
              <div className="w-full min-w-[320px] max-w-6xl p-10 border-2 border-gray-600 bg-gray-100">      
                <table className="w-full border-collapse table-fixed mx-auto"> 
                  <tbody>
                    <tr>
                      <th className="w-[140px] text-left align-top font-semibold py-2 px-4 ">
                        Temat
                      </th>
                      <td className="py-2 align-top pr-4">
                        {topic.name}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-[140px] text-left align-top font-semibold py-2 px-4">
                        Opiekun
                      </th>
                      <td className="py-2 align-top pr-4">
                        {topic.supervisor ? `${topic.supervisor.name} ${topic.supervisor.surname}` : '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="border-b py-2" />
                <table className="w-full border-collapse table-fixed mx-auto mt-2"> 
                  <tbody>
                    <tr>
                      <th className="w-[140px] text-left align-top font-semibold py-2 px-4">
                        Decyzja
                      </th>
                      <td className="py-2 align-top pr-4">
                        Negatywna
                      </td>
                    </tr>
                    <tr>
                      <th className="w-[140px] text-left align-top font-semibold py-2 px-4">
                        Uzasadnienie
                      </th>
                      <td className="py-2 pr-6 align-top">
                        <textarea
                          rows="4"
                          type="text"
                          maxLength={1000}
                          value={reasoning}
                          onChange={(e) => setReasoning(e.target.value)}
                          className="w-full bg-white border-gray-600 text-sm px-2 py-2 text-zinc-800 border-2 rounded-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </>
          )}
    
          {!error && !loading && !topic && (
              <div className="text-center py-8 text-gray-500">
                Brak tematów do wyświetlenia
              </div>
          )}
      
          
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-6">
            <div className="flex-none ml-6">
              <BackButton className=""/>
            </div>
            <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded min-w-xs border border-gray shadow">
              Dodaj
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default OpinionFormPage;