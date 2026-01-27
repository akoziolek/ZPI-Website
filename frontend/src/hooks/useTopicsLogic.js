import { useState, useMemo } from 'react';

/**
 * Hook that implements client-side filtering and sorting logic for a
 * list of topics.
 *
 * - `topics` is the source array of topic DTOs.
 * - `initialSearch` seeds the internal search field.
 *
 * Returns the filtered+sorted topics and handlers to control sorting and
 * filtering state.
 *
 * @param {Array<Object>} topics - Array of topic objects to process.
 * @param {string} [initialSearch=''] - Optional initial search string.
 * @returns {{
 *   filteredAndSortedTopics: Array<Object>,
 *   sortConfig: Array<Object>,
 *   handleSort: function(string): void,
 *   filters: Object,
 *   setFilters: function(Object): void,
 *   clearFilters: function(): void,
 *   activeSearch: string,
 *   setActiveSearch: function(string): void
 * }}
 */
export const useTopicsLogic = (topics, initialSearch = '') => {
  const [sortConfig, setSortConfig] = useState([
    { key: 'name', direction: 'asc' }
  ]);
  
  const [filters, setFilters] = useState({
    status: [],
    supervisor: '',
    studentCount: { min: '', max: '' }
  });

  const [activeSearch, setActiveSearch] = useState(initialSearch);

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

  const clearFilters = () => {
    setFilters({
      status: [],
      supervisor: '',
      studentCount: { min: '', max: '' }
    });
    setActiveSearch('');
  };

  const filteredAndSortedTopics = useMemo(() => {
    if (!topics.length) return topics;

    let filtered = topics.filter(topic => {
      if (filters.status.length > 0 && !filters.status.includes(topic.status_name)) {
        return false;
      }

      if (filters.supervisor.trim() !== "") {
        if (!topic.supervisor) return false;
        const searchLower = filters.supervisor.toLowerCase().trim();
        const supervisorFullName = `${topic.supervisor.name} ${topic.supervisor.surname}`.toLowerCase();
        if (!supervisorFullName.includes(searchLower)) return false;
      }

      if (activeSearch) {
        const searchLower = activeSearch.toLowerCase();
        const nameMatch = topic.name?.toLowerCase().includes(searchLower);
        const supervisorMatch = topic.supervisor 
          ? `${topic.supervisor.name} ${topic.supervisor.surname}`.toLowerCase().includes(searchLower)
          : false;
        const statusMatch = topic.status_name?.toLowerCase().includes(searchLower);

        if (!nameMatch && !supervisorMatch && !statusMatch) return false;
      }

      if (filters.studentCount.min || filters.studentCount.max) {
        const studentCount = topic.students?.length || 0;
        const minCount = filters.studentCount.min ? parseInt(filters.studentCount.min) : 0;
        const maxCount = filters.studentCount.max ? parseInt(filters.studentCount.max) : Infinity;
        
        if (studentCount < minCount || studentCount > maxCount) return false;
      }

      return true;
    });

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

        if (aValue < bValue) return config.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return config.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [topics, sortConfig, filters, activeSearch]);

  return {
    filteredAndSortedTopics,
    sortConfig,
    handleSort,
    filters,
    setFilters,
    clearFilters,
    activeSearch,
    setActiveSearch
  };
};