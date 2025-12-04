import { useState, useCallback } from "react";

export function useFilterManager() {
  const [keywords, setKeywords] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const resetFilters = useCallback(() => {
    setKeywords("");
    setStartDate("");
    setEndDate("");
  }, []);

  return {
    filters: { keywords, startDate, endDate },
    actions: { setKeywords, setStartDate, setEndDate, resetFilters }
  };
}
