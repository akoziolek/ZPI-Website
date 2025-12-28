import React, { useState, useEffect} from "react";
import { useParams} from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetchWithAuth } from "../api/apiFetch";
import { STAUTSES, getTopicColorClasses } from "../config";


const TopicPage = ({ user, onLogout, onTokenExpired }) => {
  const [topic, setTopic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { uuid } = useParams();

  // call to backend for topics to display
  useEffect(() => {
    console.log(uuid);
    const loadTopics = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await apiFetchWithAuth(`${backendUrl}/topics/${uuid}`, {}, onTokenExpired);
        if (!res.ok) throw new Error(`Network error: ${res.status}`);

        const json = await res.json();
        if (!json.success) throw new Error("API returned error");

        setTopic(json.data);
      } catch (err) {
        setError(`Nie można załadować tematu: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, [onTokenExpired, uuid]); //nie wiem czy moga  byc dwa

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={user} 
        onLogout={onLogout} 
      />
  
      <main className="flex justify-center px-6 sm:px-6 lg:px-8 py-22">
          <div className="w-full min-w-[320px] max-w-6xl p-10 border-2 border-gray-600 bg-gray-100">
            <>
            {loading && (
              <div className="text-center text-gray-500">Ładowanie tematów...</div>
            )}

            {error && (
              <div className="text-center text-red-600 mb-4">{error}</div>
            )}

            {!error && !loading && (
             <>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                <div className="text-xl font-bold text-gray-900 line-clamp-2 min-w-[250px] flex-1">
                  {topic.name}
                </div>
                <span 
                  className={`px-4 py-1 text-[13px] font-semibold rounded-full flex-shrink-0 whitespace-nowrap ${
                    getTopicColorClasses(topic.status_name)
                  }`}
                >
                  {topic.status_name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 mb-2"> 
                <table className="w-full border-collapse table-fixed"> 
                  <tbody>
                    <tr>
                      <th className="w-[140px] text-left align-top font-semibold py-2 pr-4">
                        Opiekun
                      </th>
                      <td className="py-2 align-top">
                        {topic.supervisor ? `${topic.supervisor.name} ${topic.supervisor.surname}` : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-left align-top font-semibold py-2 pr-4">
                        Skład zespołu
                      </th>
                      <td className="py-2 align-top">
                        {topic.students?.length > 0 ? (
                          topic.students.map((student, index) => (
                            <p key={index} className="leading-tight">{student.name} {student.surname}</p>
                          ))
                        ) : ('-')}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {topic.status_name === STAUTSES.PREPARING && (
                  <div className="md:border-l md:border-gray-600 md:pl-12">
                    <table className="w-full border-collapse table-fixed">
                      <tbody>
                        <tr>
                          <th className="w-[140px] text-left align-top font-semibold py-2 pr-4 text-gray-600">
                            Podpisano przez
                          </th>
                          <td className="py-2 align-top italic">
                            {topic.students?.length > 0 ? (
                              topic.students.map((student, index) => (
                                <p key={index} className="leading-tight">{student.name} {student.surname}</p>
                              ))
                            ) : ('-')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 mt-2"> 
                <table className="w-full border-collapse table-fixed">
                  <tbody>
                    <tr>
                      <th className="w-[140px] text-left align-top font-semibold py-3 pr-4">
                        Opis
                      </th>
                      <td className="py-3 leading-relaxed text-gray-700">
                        {topic.description || '-'}
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
          </>
        </div>
      </main>
    </div>
  );
};

export default TopicPage;