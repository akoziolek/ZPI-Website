import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
//import { apiRequest } from "../api/apiFetch";
import { ACADEMIC_YEAR, STATUSES, getTopicColorClasses } from "../config";
import { ChevronUp, ChevronDown, Filter } from "lucide-react";
//import { useAuthContext } from "../contexts/AuthContext";
import { useApi } from "../hooks/useApi";

const TopicsPage = () => {
  //const { onTokenExpired } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState([
    { key: 'name', direction: 'asc' }
  ]);
  const [filters, setFilters] = useState({
    status: [],
    supervisor: '',
    studentCount: { min: '', max: '' }
  });
  const [navbarSearch, setNavbarSearch] = useState(searchParams.get('search') || ''); // last done search input
  const [navbarSearchInput, setNavbarSearchInput] = useState(searchParams.get('search') || ''); // curent search input
  const [showFilters, setShowFilters] = useState(false);
  
  // call to backend for topics to display
  /*
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await apiRequest(`${backendUrl}/topics`, {}, onTokenExpired);
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
  */

    const { request } = useApi();
    useEffect(() => {
      const loadTopics = async () => {
        try {
          const data = await request({ endpoint: "topics" });
          setTopics(data);
        } catch {
          setError("Nie można załadować tematów");
        } finally {
          setLoading(false);
        }
      };

      loadTopics();
    }, [request]);


  // clicking outside filtering area
  const filterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSort = (key) => {
    setSortConfig(prevConfig => {
      const existingConfig = prevConfig.find(config => config.key === key);
      
      if (existingConfig) {
        if (existingConfig.direction === 'asc') {
          return prevConfig.map(config => 
            config.key === key 
              ? { ...config, direction: 'desc' }
              : config
          );
        } else {
          return prevConfig.filter(config => config.key !== key);
        }
      } else {
        return [{ key, direction: 'asc' }];
      }
    });
  };

  const filteredAndSortedTopics = useMemo(() => {
    if (!topics.length) return topics;

    // First apply filters
    let filtered = topics.filter(topic => {
      if (filters.status.length > 0 && !filters.status.includes(topic.status_name)) {
        return false;
      }

      if (filters.supervisor.trim() !== "") {
        if (!topic.supervisor) {
          return false;
        }
        const searchLower = filters.supervisor.toLowerCase().trim();
        const supervisorFullName = `${topic.supervisor.name} ${topic.supervisor.surname}`.toLowerCase();
        if (!supervisorFullName.includes(searchLower)) {
          return false;
        }
      }

      // Search text filter (from navbar)
      if (navbarSearch) {
        const searchLower = navbarSearch.toLowerCase();
        const nameMatch = topic.name?.toLowerCase().includes(searchLower);
        const supervisorMatch = topic.supervisor 
          ? `${topic.supervisor.name} ${topic.supervisor.surname}`.toLowerCase().includes(searchLower)
          : false;
        const statusMatch = topic.status_name?.toLowerCase().includes(searchLower);

        if (!nameMatch && !supervisorMatch && !statusMatch) {
          return false;
        }
      }

      if (filters.studentCount.min || filters.studentCount.max) {
        const studentCount = topic.students?.length || 0;
        const minCount = filters.studentCount.min ? parseInt(filters.studentCount.min) : 0;
        const maxCount = filters.studentCount.max ? parseInt(filters.studentCount.max) : Infinity;
        
        if (studentCount < minCount || studentCount > maxCount) {
          return false;
        }
      }

      return true;
    });

    // Then apply sorting
    return filtered.sort((a, b) => {
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
  }, [topics, sortConfig, filters, navbarSearch]);

  const getSortIcon = (key) => {
    const config = sortConfig.find(c => c.key === key);
    
    if (config) {
      const Icon = config.direction === 'asc' ? ChevronUp : ChevronDown;
      return (
        <Icon className="w-4 h-4 inline ml-1 text-blue-600" />
      );
    }
    
    return (
      <ChevronDown className="w-4 h-4 inline ml-1 text-gray-300 opacity-50" />
    );
  };

  // filtering
  const handleStatusFilterChange = (status, checked) => {
    setFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, status]
        : prev.status.filter(s => s !== status)
    }));
  };

  const handleSupervisorFilterChange = (value) => {
    setFilters(prev => ({
      ...prev,
      supervisor: value
    }));
  };

  const handleNavbarSearchSubmit = (searchTerm) => {
    setNavbarSearch(searchTerm);
    // Update URL with search parameter
    if (searchTerm.trim()) {
      navigate(`/topics?search=${encodeURIComponent(searchTerm)}`, { replace: true });
    } else {
      navigate('/topics');
    }
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      supervisor: '',
      studentCount: { min: '', max: '' }
    });
    setNavbarSearch('');
    setNavbarSearchInput('');
    // Clear URL search parameter
    navigate('/topics', { replace: true });
  };

  const topicsLength = filteredAndSortedTopics.length;
  const isInvalidRange =
    filters.studentCount.min !== '' &&
    filters.studentCount.max !== '' &&
    filters.studentCount.min > filters.studentCount.max ;
  const isFiltering = 
    filters.status.length > 0 || 
    filters.supervisor !== '' || 
    filters.studentCount.min !== '' || 
    filters.studentCount.max !== '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        searchValue={navbarSearchInput}
        onSearchChange={setNavbarSearchInput}
        onSearchSubmit={handleNavbarSearchSubmit}
        navigateOnSearch={false}
      />
      <main className="flex flex-col py-6 sm:px-6 lg:px-8 flex-1">
        <div className="sm:mx-auto sm:w-full sm:max-w-6xl pl-4">
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Tematy ZPI {ACADEMIC_YEAR} {navbarSearch && (`- ${navbarSearch}`)}
          </h2>
          <p className="mt-2 text-gray-600">
            ({topicsLength} {topicsLength === 1
              ? "wynik"
              : topicsLength <= 4
                ? "wyniki"
                : "wyników"})
          </p>
        </div>

        {/* Main content */}
        <div className="flex flex-col items-end w-full mx-auto px-4 max-w-6xl"> 
          <div ref={filterRef} className="relative ">
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className={`flex items-center px-4 rounded-md transition-colors ${
                isFiltering 
                  ? "text-blue-700 font-bold" 
                  : "text-gray-700  "
              }`}
            >
              Filtry    
              <Filter className="w-4 h-4 ml-2" />
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Filtry</h3>

                  {/* Status filters */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="space-y-2 max-h-34 overflow-y-auto">
                      {Object.values(STATUSES).map(status => (
                        <label key={status} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={filters.status.includes(status)}
                            onChange={(e) => handleStatusFilterChange(status, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Supervisor filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opiekun
                    </label>
                    <input
                      type="text"
                      value={filters.supervisor}
                      onChange={(e) => handleSupervisorFilterChange(e.target.value)}
                      placeholder="Wpisz nazwisko opiekuna..."
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none "
                    />
                  </div>

                  {/* Student count filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Liczba studentów
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.studentCount.min}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          studentCount: { ...prev.studentCount, min: e.target.value }
                        }))}
                        className={`w-1/2 px-2 py-1 rounded-md focus:outline-none border rounded-md 
                              ${isInvalidRange
                                ? "bg-red-50 border-red-500 focus:ring-red-500"
                                : "border-gray-300"}
                            `}                      
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.studentCount.max}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          studentCount: { ...prev.studentCount, max: e.target.value }
                        }))}
                        className={`w-1/2 px-2 py-1 rounded-md focus:outline-none border rounded-md
                              ${isInvalidRange
                                ? "bg-red-50 border-red-500 focus:ring-red-500"
                                : "border-gray-300"}
                            `}                      
                      />
                    </div>
                  </div>

                  {/* Clear filters button */}
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Wyczyść filtry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="mx-auto max-w-6xl px-4 pl-8">
            <>
              {loading && (
                <div className="text-center text-gray-500">Ładowanie tematów...</div>
              )}

              {error && (
                <div className="text-center text-red-600 mb-4">{error}</div>
              )}

              {!error && filteredAndSortedTopics.length !== 0  && (
              <div>
                <table className="w-full divide-y divide-gray-200 border-separate border-spacing-y-4">
                  <thead >
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('name')}
                      >
                        Nazwa {getSortIcon('name')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('status_name')}
                      >
                        Status {getSortIcon('status_name')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('supervisor')}
                      >
                        Opiekun {getSortIcon('supervisor')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('students')}
                      >
                        Liczba studentów {getSortIcon('students')}
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {!loading && filteredAndSortedTopics.map((topic) => (
                      <tr key={topic.uuid} className="hover:bg-gray-200  bg-gray-100">
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
                          <Link
                            to={`/topics/${topic.uuid}`}
                            className="text-gray-800 bg-gray-300 hover:text-gray-900 px-3 py-1 border border-gray-600 rounded hover:bg-gray-400 transition-colors"
                          >
                            Wyświetl
                          </Link>

                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            )}

            {!error && !loading && filteredAndSortedTopics.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Brak tematów do wyświetlenia
                </div>
              )}
            </>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopicsPage;