import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { apiFetchWithAuth } from "../api/apiFetch";

const TopicsPage = ({ user, onLogout, onTokenExpired }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await apiFetchWithAuth(`${backendUrl}/topics`, {}, onTokenExpired);
        if (!res.ok) throw new Error(`Network error: ${res.status}`);

        const json = await res.json();
        if (!json.success) throw new Error("API returned error");

        setTopics(json.data);
      } catch (err) {
        setError(`Nie można załadować tematów: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, [onTokenExpired]);

  const topicsLength = topics.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-col py-6 sm:px-6 lg:px-8 flex-1">
        <div className="sm:mx-auto sm:w-full sm:max-w-5xl pl-4">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Tematy ZPI (data z wstepnych ustaleń)
          </h2>
          <p className="mt-2 text-gray-600">
            ({topicsLength} {topicsLength === 1
              ? "wynik"
              : topicsLength <= 4
                ? "wyniki"
                : "wyników"})
          </p>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-5xl justify-center">
          <div className="py-8 px-4 sm:rounded-lg sm:px-10">
            {loading && (
              <div className="text-center text-gray-500">Ładowanie tematów...</div>
            )}

            {error && (
              <div className="text-center text-red-600 mb-4">{error}</div>
            )}

            {!error && (
              <div>
                <div className="grid grid-cols-5 grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 h-12">
                  <div>Nazwa</div>
                  <div>Status</div>
                  <div>Opiekun (tytuł naukowy)</div>
                  <div>Liczebność zespołu</div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  {!loading && topics.map((topic) => (
                   <div
                      key={topic.id}
                      onClick={() => console.log()}
                      className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 w-full text-left p-4 border border-gray-800 bg-gray-200 text-gray-700 transition-colors h-24"
                    >
                      <div className="font-medium border-r border-gray-800 pr-2 py-1 line-clamp-2">{topic.name}</div>
                      <div className="text-sm text-gray-500 border-r border-gray-800 px-2 py-1 text-center">{topic.status_name}</div>
                      <div className="font-medium border-r border-gray-800 px-2 py-1">{topic.supervisor ? topic.supervisor.name + " " + topic.supervisor.surname : " "}</div>
                      <div className="font-medium border-r border-gray-800 px-2 py-1 text-center">{topic.students ? topic.students.length : 0}</div>
                      <button className="border border-gray-800">Wyświetl</button>
                    </div>

                  ))}
                  {/** CO GDY BRAK topicow */}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;