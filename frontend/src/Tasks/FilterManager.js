import { useState, useCallback, useMemo } from "react";

export function useFilterManager() {
  const [keywords, setKeywords] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const resetFilters = useCallback(() => {
    setKeywords("");
    setStartDate("");
    setEndDate("");
  }, []);

  const filterExport = useMemo(() => {
    var filters = {};

    const keys = keywords ? keywords.split(/\s+/).filter(Boolean) : [];

    if(keys && keys.length > 0)
    {
      filters.keywords = keys;
    }
    if(startDate)
    {
      filters.after = encodeURIComponent(startDate.toISOString().split('T')[0]);
    }
    if(endDate)
    {
      filters.before = encodeURIComponent(endDate.toISOString().split('T')[0]);
    }
    return filters;

  }, [keywords, startDate, endDate])

  return {
    filters: { keywords, startDate, endDate },
    actions: { setKeywords, setStartDate, setEndDate, resetFilters },
    filterExport
  };
}
