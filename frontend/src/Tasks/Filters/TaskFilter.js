import { useState, useMemo } from 'react';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function useTaskFilter(tasks = [], keywords, startDate = null, endDate = null)
{
  // Parse keywords
  const { keys, regexPattern } = useMemo(() => {
    if (!keywords)
    {
      return { keys: [], regexPattern: null };
    } 

    // Escape regex special chars
    const escapedKeywords = escapeRegExp(keywords);

    // Split keywords into individual words and remove empty strings
    const keysArr = escapedKeywords.split(/[\s,]+/).filter(Boolean);

    const pattern = keysArr.length > 0 ? new RegExp(`(${keysArr.join('|')})`, 'gi') : null;

    return { keys: keysArr, regexPattern: pattern };
  }, [keywords]);


  // Filter tasks
  const filteredTasks = useMemo(() => {
    
    if (!tasks) {
      return [];
    }

    // Check if start and end filter for date exists
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

    return tasks.filter((task) => {
      // Keyword filter
      const keywordMatch = keys.length === 0 || keys.every(key =>
        new RegExp(key, "i").test(task.title + task.desc)
      );

      //Return tasks that are within the filter date range 
      const date = task.date;
      const dateMatch =
        (!start || date >= start) &&
        (!end || date < end);

      return keywordMatch && dateMatch;
    })

  }, [keys, tasks, startDate, endDate])

  return { filteredTasks, regexPattern };
} 