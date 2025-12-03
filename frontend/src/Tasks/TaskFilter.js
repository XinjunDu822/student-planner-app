import { useState, useEffect } from 'react';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function useFilteredTasks(tasks, keywords, startDate = null, endDate = null)
{
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [keys, setKeys] = useState([]);
  const [regexPattern, setRegexPattern] = useState(null);
  
  // Build keyword pattern
  useEffect(() => {

    if (!keywords) {
      setKeys([]);
      setRegexPattern(null);
      return;
    }

    // Escape regex special chars
    const escapedKeywords = escapeRegExp(keywords);

    // Split keywords into individual words and remove empty strings
    const keysArr = escapedKeywords.split(/[\s,]+/).filter(Boolean);

    setKeys(keysArr);

    if(keysArr.length > 0)
    {
      setRegexPattern(new RegExp(`(${keysArr.join("|")})`, "gi"));
    }
    else
    {
      setRegexPattern(null);
    } 
  }, [keywords])

  // Filter tasks
  useEffect(() => {
    
    if (!tasks) {
      setFilteredTasks([]);
      return;
    }

    // Keyword filter
    let filtered = tasks;
  
    if(keys.length > 0)
    {
      filtered = filtered.filter(task =>
        keys.every(key =>
          new RegExp(key, "i").test(task.title + task.desc)
        )
      );
    }

    // Date filter
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if(start)
    {
      start.setHours(0, 0, 0, 0);
    }

    if(end)
    {
      end.setHours(24, 0, 0, 0);
    }

    filtered = filtered.filter(task => {
      const date = task.date;
      return (
        (!start || date >= start) &&
        (!end || date < end)
      );
    });

    setFilteredTasks(filtered);
  }, [keys, tasks, startDate, endDate])

  return { filteredTasks, regexPattern };
} 