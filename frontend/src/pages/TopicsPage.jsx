import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TopicsTable from "../components/TopicsTable";
import TopicsFilterPanel from "../components/TopicsFIlterPanel";
import { useApi } from "../hooks/useApi";
import { useTopicsLogic } from "../hooks/useTopicsLogic";
import { ACADEMIC_YEAR } from "../config";

const TopicsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const  request  = useApi();
  
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [navbarSearchInput, setNavbarSearchInput] = useState(searchParams.get('search') || '');

  const {
    filteredAndSortedTopics,
    sortConfig,
    handleSort,
    filters,
    setFilters,
    clearFilters,
    activeSearch,
    setActiveSearch
  } = useTopicsLogic(topics, searchParams.get('search') || '');

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

  const handleNavbarSearchSubmit = (searchTerm) => {
    setActiveSearch(searchTerm);
    if (searchTerm.trim()) {
      navigate(`/topics?search=${encodeURIComponent(searchTerm)}`, { replace: true });
    } else {
      navigate('/topics');
    }
  };

  const handleClearAll = () => {
    clearFilters();
    setNavbarSearchInput('');
    navigate('/topics', { replace: true });
  };

  const topicsLength = filteredAndSortedTopics.length;

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
            Tematy ZPI {ACADEMIC_YEAR} {activeSearch && (`- ${activeSearch}`)}
          </h2>
          <p className="mt-2 text-gray-600">
            ({topicsLength} {topicsLength === 1 ? "wynik" : topicsLength <= 4 ? "wyniki" : "wyników"})
          </p>
        </div>

        <div className="flex flex-col items-end w-full mx-auto px-4 max-w-6xl"> 
          <TopicsFilterPanel 
            filters={filters}
            setFilters={setFilters}
            onClear={handleClearAll}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 pl-8 w-full">
          {loading && (
            <div className="text-center text-gray-500 mt-8">Ładowanie tematów...</div>
          )}

          {error && (
            <div className="text-center text-red-600 mt-8 mb-4">{error}</div>
          )}

          {!loading && !error && (
            <TopicsTable 
              topics={filteredAndSortedTopics}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default TopicsPage;