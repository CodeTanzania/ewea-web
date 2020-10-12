import { useState } from 'react';

/**
 * @function
 * @name useFilters
 * @description Custom hook for controlling filters. It store filter states and control visibility of filter form for dashboards
 * @param {object} defaultFilters Default filters to be used
 * @returns {object} Returns functions and state variables for filters
 * @version 0.1.0
 * @since 0.1.0
 */
const useFilters = (defaultFilters) => {
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [showFilters, setShowFilters] = useState(false);

  return {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
  };
};

export default useFilters;
