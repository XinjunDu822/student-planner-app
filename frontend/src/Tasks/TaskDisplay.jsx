import { Task } from './Task';
import { useState, useEffect } from 'react';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function DisplayEmptyText({text})
{
  if(!text) 
  {
    return null;
  }
  return (
    <h3>
      {text.map((item, index) => (
        <span key={index}>
          <br/>{item}
        </span>
      ))}
    </h3>
  );
}

export function TaskDisplay({
  header, 
  emptyText, 
  emptySearchText, 
  tasks, 
  openEditPopup, 
  openDeletePopup, 
  completeTask, 
  keywords, 
  startDate=null, 
  endDate=null, 
  displayCompleted=false
})
{
  const [keywordPattern, setKeywordPattern] = useState(null);
  const [keys, setKeys] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  
  // Build keyword pattern
  useEffect(() => {

    const escapedKeywords = escapeRegExp(keywords);

    const keys_ = escapedKeywords.split(/[\s,]+/).filter(Boolean);

    setKeys(keys_);

    if(keys_.length > 0)
    {
      setKeywordPattern(new RegExp(`(${keys_.join("|")})`, "gi"));
    }
    else
    {
      setKeywordPattern(null);
    } 
  }, [keywords])

  // Filter tasks
  useEffect(() => {
    
    if (!tasks) {
      setDisplayedTasks([]);
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

    setDisplayedTasks(filtered);
  }, [keys, tasks, startDate, endDate])

  if(tasks.length === 0)
  {
    return <DisplayEmptyText text={emptyText}/>
  }

  if(displayedTasks.length === 0)
  {
    return <DisplayEmptyText text={emptySearchText}/>
  }

  return (
    <>
      <h3>{header}</h3>
      <div id="TasksList">
        {displayedTasks.slice().map(task => 
          <Task
            index={task.id}
            key={task.id}
            data={task} 
            openEditPopup={openEditPopup}
            openDeletePopup={openDeletePopup}
            completeTask={completeTask}
            keys={keys}
            keywordPattern={keywordPattern}
            isComplete={displayCompleted}
          />
        )}
      </div>
    </>
  );
} 