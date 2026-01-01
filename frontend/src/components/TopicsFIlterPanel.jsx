import { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";
import { STATUSES } from "../config";

const TopicsFilterPanel = ({ filters, setFilters, onClear }) => {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  // Zamykanie przy kliknięciu na zewnątrz
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusFilterChange = (status, checked) => {
    setFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, status]
        : prev.status.filter(s => s !== status)
    }));
  };

  const isInvalidRange = filters.studentCount.min !== '' && filters.studentCount.max !== '' && 
    parseInt(filters.studentCount.min) > parseInt(filters.studentCount.max);

  const isFiltering = filters.status.length > 0 || filters.supervisor !== '' || 
    filters.studentCount.min !== '' || filters.studentCount.max !== '';

  return (
    <div ref={filterRef} className="relative">
      <button
        onClick={() => setShowFilters(prev => !prev)}
        className={`flex items-center px-4 rounded-md transition-colors ${
          isFiltering ? "text-blue-700 font-bold" : "text-gray-700"
        }`}
      >
        Filtry <Filter className="w-4 h-4 ml-2" />
      </button>

      {showFilters && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtry</h3>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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

            {/* Opiekun */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Opiekun</label>
              <input
                type="text"
                value={filters.supervisor}
                onChange={(e) => setFilters(prev => ({ ...prev, supervisor: e.target.value }))}
                placeholder="Wpisz nazwisko opiekuna..."
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>

            {/* Liczba studentów */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Liczba studentów</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.studentCount.min}
                  onChange={(e) => setFilters(prev => ({ ...prev, studentCount: { ...prev.studentCount, min: e.target.value } }))}
                  className={`w-1/2 px-2 py-1 border rounded-md focus:outline-none ${isInvalidRange ? "bg-red-50 border-red-500" : "border-gray-300"}`}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.studentCount.max}
                  onChange={(e) => setFilters(prev => ({ ...prev, studentCount: { ...prev.studentCount, max: e.target.value } }))}
                  className={`w-1/2 px-2 py-1 border rounded-md focus:outline-none ${isInvalidRange ? "bg-red-50 border-red-500" : "border-gray-300"}`}
                />
              </div>
            </div>

            <button
              onClick={onClear}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Wyczyść filtry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicsFilterPanel;