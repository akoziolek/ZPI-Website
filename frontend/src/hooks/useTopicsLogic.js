/**
 * @fileoverview Provides filtering and sorting logic for topics.
 * This module exports a custom React hook that manages client-side filtering
 * and sorting state for a list of academic topics.
 */

import { useState, useMemo } from 'react';

/**
 * Accessor functions to extract and normalize comparable values from topic objects.
 * Each function takes a topic object and returns a normalized, comparable value.
 * 
 * @type {Object<string, function(Object): (string|number)>}
 * @property {Function} name - Extracts and lowercases the topic name
 * @property {Function} status_name - Extracts and lowercases the topic status
 * @property {Function} supervisor - Extracts supervisor full name in lowercase
 * @property {Function} students - Returns the count of students assigned to the topic
 */
const GET_VALUE = {
  name: (t) => t.name?.toLowerCase() || '',
  status_name: (t) => t.status_name?.toLowerCase() || '',
  supervisor: (t) => t.supervisor ? `${t.supervisor.name} ${t.supervisor.surname}`.toLowerCase() : '',
  students: (t) => t.students?.length || 0,
};

/**
 * Checks if a topic matches the provided status filter.
 * 
 * @function matchesStatus
 * @param {Object} topic - The topic object to check
 * @param {string[]} statusList - Array of status names to match against. Empty array matches all statuses.
 * @returns {boolean} True if the topic's status is in the statusList or statusList is empty
 */
const matchesStatus = (topic, statusList) => 
  statusList.length === 0 || statusList.includes(topic.status_name);

/**
 * Checks if a topic's supervisor matches the provided search term.
 * 
 * @function matchesSupervisor
 * @param {Object} topic - The topic object to check
 * @param {string} supervisorSearch - Partial or full supervisor name to search for
 * @returns {boolean} True if the topic's supervisor matches the search term or search is empty
 */
const matchesSupervisor = (topic, supervisorSearch) => {
  if (!supervisorSearch) return true;
  return GET_VALUE.supervisor(topic).includes(supervisorSearch.toLowerCase().trim());
};

/**
 * Checks if a topic matches a search term across name, supervisor, or status fields.
 * 
 * @function matchesSearchTerm
 * @param {Object} topic - The topic object to check
 * @param {string} term - The search term to match against multiple topic fields
 * @returns {boolean} True if the term is found in name, supervisor, or status (case-insensitive)
 */
const matchesSearchTerm = (topic, term) => {
  if (!term) return true;
  const lowerTerm = term.toLowerCase().trim();
  return GET_VALUE.name(topic).includes(lowerTerm) ||
         GET_VALUE.supervisor(topic).includes(lowerTerm) ||
         GET_VALUE.status_name(topic).includes(lowerTerm);
};

/**
 * Checks if a topic's student count falls within the specified range.
 * 
 * @function matchesStudentCount
 * @param {Object} topic - The topic object to check
 * @param {Object} range - The student count range to match against
 * @param {string|number} range.min - Minimum number of students (inclusive)
 * @param {string|number} range.max - Maximum number of students (inclusive)
 * @returns {boolean} True if the topic's student count is within the range
 */
const matchesStudentCount = (topic, range) => {
  const count = topic.students?.length || 0;
  const min = parseInt(range.min) || 0;
  const max = parseInt(range.max) || Infinity;
  return count >= min && count <= max;
};

/**
 * Compares two topics based on a single sort configuration.
 * Used as a comparator function for array sorting.
 * 
 * @function compareSingleKey
 * @param {Object} a - The first topic object to compare
 * @param {Object} b - The second topic object to compare
 * @param {Object} config - Sort configuration object
 * @param {string} config.key - The topic property to sort by (name, status_name, supervisor, or students)
 * @param {('asc'|'desc')} config.direction - Sort direction: 'asc' for ascending, 'desc' for descending
 * @returns {number} Negative if a < b, positive if a > b, 0 if equal
 */
const compareSingleKey = (a, b, config) => {
  const aVal = GET_VALUE[config.key](a);
  const bVal = GET_VALUE[config.key](b);

  if (aVal === bVal) return 0;

  const multiplier = config.direction === 'asc' ? 1 : -1;
  
  return typeof aVal === 'string'
    ? aVal.localeCompare(String(bVal)) * multiplier
    : (Number(aVal) - Number(bVal)) * multiplier;
};

/**
 * Filters an array of topics based on provided criteria.
 * Applies status, supervisor, search term, and student count filters.
 * 
 * @function filterTopics
 * @param {Object[]} topics - Array of topic objects to filter
 * @param {Object} filters - Filter configuration object
 * @param {string[]} filters.status - Array of status names to filter by
 * @param {string} filters.supervisor - Supervisor name search term
 * @param {Object} filters.studentCount - Student count range filter
 * @param {string} search - General search term across multiple fields
 * @returns {Object[]} Filtered array of topics matching all criteria
 */
const filterTopics = (topics, filters, search) => {
  return topics.filter(topic => 
    matchesStatus(topic, filters.status) &&
    matchesSupervisor(topic, filters.supervisor) &&
    matchesSearchTerm(topic, search) &&
    matchesStudentCount(topic, filters.studentCount)
  );
};

/**
 * Sorts an array of topics according to a sort configuration.
 * Supports multi-level sorting with primary and secondary sort keys.
 * 
 * @function sortTopics
 * @param {Object[]} topics - Array of topic objects to sort
 * @param {Object[]} sortConfig - Array of sort configuration objects, applied in order
 * @param {string} sortConfig[].key - The property to sort by
 * @param {('asc'|'desc')} sortConfig[].direction - Sort direction
 * @returns {Object[]} New sorted array of topics
 */
const sortTopics = (topics, sortConfig) => {
  if (sortConfig.length === 0) return topics;

  return [...topics].sort((a, b) => {
    let result = 0;
    for (const config of sortConfig) {
      result = compareSingleKey(a, b, config);
      if (result !== 0) break; 
    }
    return result;
  });
};

/**
 * Custom React hook that manages filtering and sorting state for topics.
 * Provides a complete filtering and sorting solution for displaying a filtered,
 * multi-level sorted list of academic topics with client-side performance optimization.
 * 
 * @function useTopicsLogic
 * @param {Object[]} topics - Array of topic objects to manage
 * @param {string} [initialSearch=''] - Initial search term value
 * @returns {Object} Hook state and handler object
 * @returns {Object[]} return.filteredAndSortedTopics - Memoized array of filtered and sorted topics
 * @returns {Object[]} return.sortConfig - Current sort configuration array
 * @returns {Function} return.handleSort - Toggles sort direction for a given key
 * @returns {Object} return.filters - Current filter state object
 * @returns {Object} return.filters.status - Array of active status filters
 * @returns {string} return.filters.supervisor - Current supervisor search term
 * @returns {Object} return.filters.studentCount - Student count range filter
 * @returns {string} return.filters.studentCount.min - Minimum student count
 * @returns {string} return.filters.studentCount.max - Maximum student count
 * @returns {Function} return.setFilters - Updates the filters state
 * @returns {Function} return.clearFilters - Resets all filters and search to default values
 * @returns {string} return.activeSearch - Current global search term
 * @returns {Function} return.setActiveSearch - Updates the global search term
 * 
 * @example
 * const {
 *   filteredAndSortedTopics,
 *   filters,
 *   setFilters,
 *   activeSearch,
 *   setActiveSearch,
 *   handleSort,
 *   clearFilters
 * } = useTopicsLogic(allTopics, '');
 */
export const useTopicsLogic = (topics, initialSearch = '') => { 
  const [sortConfig, setSortConfig] = useState([{ key: 'name', direction: 'asc' }]);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const [filters, setFilters] = useState({
    status: [],
    supervisor: '',
    studentCount: { min: '', max: '' }
  });

  const handleSort = (key) => {
    setSortConfig(prev => {
      const current = prev.find(c => c.key === key);
      
      if (!current) return [{ key, direction: 'asc' }];
      if (current.direction === 'asc') return [{ key, direction: 'desc' }];
      return [];
    });
  };

  const filteredAndSortedTopics = useMemo(() => {
    const filtered = filterTopics(topics, filters, activeSearch);
    return sortTopics(filtered, sortConfig);
  }, [topics, filters, activeSearch, sortConfig]);

  const clearFilters = () => {
    setFilters({ status: [], supervisor: '', studentCount: { min: '', max: '' } });
    setActiveSearch('');
  };

  return {
    filteredAndSortedTopics, sortConfig, handleSort,
    filters, setFilters, clearFilters,
    activeSearch, setActiveSearch
  };
};