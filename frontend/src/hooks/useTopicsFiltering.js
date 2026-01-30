/**
 * @fileoverview Provides filtering and sorting logic for topics.
 * This module exports a custom React hook that manages client-side filtering
 * and sorting state for a list of academic topics.
 */

import { useState, useMemo } from 'react';

/**
 * Accessor functions to extract and normalize comparable values from topic objects.
 * Each function returns a lowercase string or number for consistent comparison.
 * @type {Object<string, function(Object): (string|number)>}
 */
const GET_VALUE = {
  name: (t) => t.name?.toLowerCase() || '',
  status_name: (t) => t.status_name?.toLowerCase() || '',
  supervisor: (t) => t.supervisor ? `${t.supervisor.name} ${t.supervisor.surname}`.toLowerCase() : '',
  students: (t) => t.students?.length || 0,
};

/**
 * Filters an array of topics based on provided criteria.
 * Applies filters for status, supervisor name, search term, and student count range.
 * 
 * @param {Array<Object>} topics - Array of topic objects to filter.
 * @param {Object} filters - Filter criteria object.
 * @param {Array<string>} filters.status - Array of status names to include (empty = no filter).
 * @param {string} filters.supervisor - Supervisor name to filter by.
 * @param {Object} filters.studentCount - Student count range filter.
 * @param {string} filters.studentCount.min - Minimum student count.
 * @param {string} filters.studentCount.max - Maximum student count.
 * @param {string} search - Search string to match against topic name, supervisor, and status.
 * @returns {Array<Object>} Filtered array of topics.
 */
const filterTopics = (topics, filters, search) => {
  const searchLower = search.toLowerCase().trim();
  const supervisorLower = filters.supervisor.toLowerCase().trim();

  return topics.filter(topic => {
    if (filters.status.length > 0 && !filters.status.includes(topic.status_name)) return false;

    if (supervisorLower && !GET_VALUE.supervisor(topic).includes(supervisorLower)) return false;

    if (searchLower) {
      const matchesSearch = 
        GET_VALUE.name(topic).includes(searchLower) ||
        GET_VALUE.supervisor(topic).includes(searchLower) ||
        GET_VALUE.status_name(topic).includes(searchLower);
      if (!matchesSearch) return false;
    }

    const count = topic.students?.length || 0;
    const min = parseInt(filters.studentCount.min) || 0;
    const max = parseInt(filters.studentCount.max) || Infinity;
    if (count < min || count > max) return false;

    return true;
  });
};

/**
 * Sorts an array of topics according to a sort configuration.
 * Supports multi-column sorting with ascending/descending direction.
 * Uses locale-aware string comparison for string values.
 * 
 * @param {Array<Object>} topics - Array of topic objects to sort.
 * @param {Array<Object>} sortConfig - Array of sort specifications.
 * @param {string} sortConfig[].key - The key in GET_VALUE to sort by ('name', 'status_name', etc.).
 * @param {string} sortConfig[].direction - Sort direction: 'asc' or 'desc'.
 * @returns {Array<Object>} Sorted copy of the topics array.
 */
const sortTopics = (topics, sortConfig) => {
  if (!sortConfig.length) return topics;

  return [...topics].sort((a, b) => {
    for (const { key, direction } of sortConfig) {
      const aVal = GET_VALUE[key](a);
      const bVal = GET_VALUE[key](b);
      
      if (aVal === bVal) continue;

      const multiplier = direction === 'asc' ? 1 : -1;
      return typeof aVal === 'string' 
        ? aVal.localeCompare(bVal) * multiplier
        : (aVal - bVal) * multiplier;
    }
    return 0;
  });
};

/**
 * Custom React hook that manages filtering and sorting state for topics.
 * Provides comprehensive filtering by status, supervisor, search term, and student count.
 * Supports single-column sorting with toggle functionality.
 *
 * @param {Array<Object>} topics - Array of topic objects to process.
 * @param {string} [initialSearch=''] - Optional initial search string.
 * @returns {Object} Hook state and handler functions.
 * @returns {Array<Object>} hook.filteredAndSortedTopics - Memoized filtered and sorted topics.
 * @returns {Array<Object>} hook.sortConfig - Current sort configuration.
 * @returns {Function} hook.handleSort - Function to update sort by column key.
 * @returns {Object} hook.filters - Current filter state.
 * @returns {Function} hook.setFilters - Function to update filters.
 * @returns {Function} hook.clearFilters - Function to reset all filters and search.
 * @returns {string} hook.activeSearch - Current search string.
 * @returns {Function} hook.setActiveSearch - Function to update search string.
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
      const item = prev.find(c => c.key === key);
      if (!item) return [{ key, direction: 'asc' }];
      if (item.direction === 'asc') return [{ key, direction: 'desc' }];
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