import { useState, useEffect} from "react";
import { useParams} from "react-router-dom";
import Navbar from "../components/Navbar";
import TopicActionButtons from "../components/TopicActionButtons";
import BackButton from "../components/BackButton";

import { ROLES, STATUSES, getTopicColorClasses } from "../config";
import { useApi } from "../hooks/useApi";

const TopicPage = () => {
  const [topic, setTopic] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { uuid } = useParams();
  const  request  = useApi();

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const topicData = await request({ endpoint: `topics/${uuid}` });
        setTopic(topicData);

        if (topicData.status_name === STATUSES.PREPARING) {
          const sigData = await request({ endpoint: `topics/${uuid}/signatures` });
          setSignatures(sigData.signatures);
        }
      } catch {
        setError("Błąd ładowania danych");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [request, uuid]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
  
      <main className="flex flex-col items-center px-6 sm:px-6 lg:px-8 py-22">
        <>
          {loading && (
            <div className="text-center text-gray-500">Ładowanie tematów...</div>
          )}

          {error && (
            <div className="text-center text-red-600 mb-4">{error}</div>
          )}

          {!error && !loading && (
            <div className="w-full min-w-[320px] max-w-6xl p-10 border-2 border-gray-600 bg-gray-100">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
              <div data-testid="topic-name" className="text-xl font-bold text-gray-900 line-clamp-2 min-w-[250px] flex-1">
                {topic.name}
              </div>
              <span data-testid="topic-status"
                className={`px-4 py-1 text-[13px] font-semibold rounded-full flex-shrink-0 whitespace-nowrap ${
                  getTopicColorClasses(topic.status_name)
                }`}
              >
                {topic.status_name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 mb-2"> 
              <table className="w-full border-collapse table-fixed"> 
                <tbody data-testid="people-table">
                  <tr>
                    <th className="w-[140px] text-left align-top font-semibold py-2 pr-4">
                      Opiekun
                    </th>
                    <td className="py-2 align-top">
                      {topic.supervisor ? `${topic.supervisor?.shortcut_academic_title || ""} ${topic.supervisor.name} ${topic.supervisor.surname}` : '-'}
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

              {topic.status_name === STATUSES.PREPARING && (
                <div className="md:border-l md:border-gray-600 md:pl-12">
                  <table data-testid="signatures-table" className="w-full border-collapse table-fixed">
                    <tbody>
                      <tr>
                        <th className="w-[140px] text-left align-top font-semibold py-2 pr-4 text-gray-600">
                          Podpisano przez
                        </th>
                        <td className="py-2 align-top">
                          {signatures?.length > 0 ? (
                            signatures
                              .slice()
                              .sort((a, b) => (a.role_name === ROLES.TEAM_LEADER && b.role_name !== ROLES.TEAM_LEADER ? -1 : 1))
                              .map((user, index) => (
                                <p key={index} className="leading-tight">
                                  {user.name} {user.surname}
                                </p>
                              ))
                          ) : (
                            '-'
                          )}
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
                    <td className="py-3 leading-relaxed">
                      {topic.description || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
    
        {!error && !loading && !topic && (
            <div className="text-center py-8 text-gray-500">
              Brak tematów do wyświetlenia
            </div>
          )}
        </>
        
        <div data-testid="action-bar" className="w-full max-w-6xl mx-auto flex items-start justify-between py-6">
          <div className="flex-none ml-6">
            <BackButton />
          </div>

          <div className="flex-none">
            <TopicActionButtons 
              topic={topic} 
              signatures={signatures} 
            />
          </div>
        </div>

      </main>
    </div>
  );
};

export default TopicPage;