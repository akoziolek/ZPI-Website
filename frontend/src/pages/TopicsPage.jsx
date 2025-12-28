import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { apiFetchWithAuth } from "../api/apiFetch";
import { ACADEMIC_YEAR, STAUTSES } from "../config";
import { ChevronUp, ChevronDown } from "lucide-react";

const TopicsPage = ({ user, onLogout, onTokenExpired }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState([
    { key: 'status_name', direction: 'asc' },
    { key: 'name', direction: 'asc' }
  ]);
  
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

  const handleSort = (key) => {
    setSortConfig(prevConfig => {
      const existingIndex = prevConfig.findIndex(config => config.key === key);
      
      if (existingIndex !== -1) {
        // If column is already in sort config, toggle direction
        const newConfig = [...prevConfig];
        newConfig[existingIndex] = {
          ...newConfig[existingIndex],
          direction: newConfig[existingIndex].direction === 'asc' ? 'desc' : 'asc'
        };
        // Move this column to the front (primary sort)
        const [primary] = newConfig.splice(existingIndex, 1);
        return [primary, ...newConfig];
      } else {
        // Add new column to sort config as primary
        return [{ key, direction: 'asc' }, ...prevConfig];
      }
    });
  };

  const sortedTopics = useMemo(() => {
    if (!topics.length) return topics;

    return [...topics].sort((a, b) => {
      for (const config of sortConfig) {
        let aValue, bValue;

        switch (config.key) {
          case 'name':
            aValue = a.name?.toLowerCase() || '';
            bValue = b.name?.toLowerCase() || '';
            break;
          case 'status_name':
            aValue = a.status_name?.toLowerCase() || '';
            bValue = b.status_name?.toLowerCase() || '';
            break;
          case 'supervisor':
            aValue = a.supervisor ? `${a.supervisor.name} ${a.supervisor.surname}`.toLowerCase() : '';
            bValue = b.supervisor ? `${b.supervisor.name} ${b.supervisor.surname}`.toLowerCase() : '';
            break;
          case 'students':
            aValue = a.students?.length || 0;
            bValue = b.students?.length || 0;
            break;
          default:
            aValue = '';
            bValue = '';
        }

        if (aValue < bValue) {
          return config.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return config.direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }, [topics, sortConfig]);

  const getSortIcon = (key) => {
    const config = sortConfig.find(c => c.key === key);
    if (!config) return null;
    
    const isPrimary = sortConfig[0].key === key;
    const Icon = config.direction === 'asc' ? ChevronUp : ChevronDown;
    
    return (
      <Icon 
        className={`w-4 h-4 inline ml-1 ${isPrimary ? 'text-blue-600' : 'text-gray-400'}`} 
      />
    );
  };

  const getTopicColorClasses = (topicStatus) => {
    switch (topicStatus) {
      case STAUTSES.OPEN:
        return 'bg-sky-100 text-gray-800';
      case STAUTSES.SUBMITTED:
        return 'bg-yellow-100 text-gray-800';
      case STAUTSES.APPROVED:
        return 'bg-green-100 text-gray-800';
      case STAUTSES.REJECTED:
        return 'bg-red-100 text-gray-800';
      case STAUTSES.PREPARING:
        return 'bg-violet-100 text-gray-800';
      default:
        'bg-gray-100 text-gray-800'
    };
  };

  const topicsLength = sortedTopics.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-col py-6 sm:px-6 lg:px-8 flex-1">
        <div className="sm:mx-auto sm:w-full sm:max-w-6xl pl-4">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Tematy ZPI {ACADEMIC_YEAR}
          </h2>
          <p className="mt-2 text-gray-600">
            ({topicsLength} {topicsLength === 1
              ? "wynik"
              : topicsLength <= 4
                ? "wyniki"
                : "wyników"})
          </p>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-6xl justify-center">
          <div className="py-8 px-4 sm:rounded-lg sm:px-10">
            {loading && (
              <div className="text-center text-gray-500">Ładowanie tematów...</div>
            )}

            {error && (
              <div className="text-center text-red-600 mb-4">{error}</div>
            )}

            {!error && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-y-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('name')}
                      >
                        Nazwa {getSortIcon('name')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status_name')}
                      >
                        Status {getSortIcon('status_name')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('supervisor')}
                      >
                        Opiekun {getSortIcon('supervisor')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('students')}
                      >
                        Liczba studentów {getSortIcon('students')}
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {!loading && sortedTopics.map((topic) => (
                      <tr key={topic.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap border-y border-l border-gray-600">
                          <div className="text-sm font-semibold text-gray-900 line-clamp-2 max-w-xs ">
                            {topic.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-y border-gray-600">
                          <span className={`inline-flex justify-center min-w-full px-2 py-1 text-xs font-semibold rounded-full  ${
                            getTopicColorClasses(topic.status_name)
                          }`}>
                            {topic.status_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-y border-gray-600">
                          <div className="text-sm font-semibold text-gray-900">
                            {topic.supervisor ? `${topic.supervisor.name} ${topic.supervisor.surname}` : 'Brak opiekuna'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center border-y border-gray-600">
                          <div className="text-sm font-semibold text-gray-900">
                            {topic.students ? topic.students.length : 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-y border-r border-gray-600">
                          <button className="text-gray-600 bg-gray-200 hover:text-gray-900 px-3 py-1 border border-gray-600 rounded hover:bg-white transition-colors">
                            Wyświetl
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

                {!loading && sortedTopics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Brak tematów do wyświetlenia
                  </div>
                )}
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;