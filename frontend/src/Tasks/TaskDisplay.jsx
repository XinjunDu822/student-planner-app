import { Task } from './Task';
import { useState, useEffect } from 'react';
import { useTaskFilter } from './Filters/TaskFilter';

//Display corresponding text when no tasks are due
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
  tasks = [],
  emptyText, 
  emptySearchText,  
  openEditPopup, 
  openDeletePopup, 
  completeTask, 
  keywords, 
  startDate=null, 
  endDate=null, 
  displayCompleted=false
})
{
  const { filteredTasks, regexPattern } = useTaskFilter(tasks, keywords, startDate, endDate);
  
  if(tasks.length === 0)
  {
    return <DisplayEmptyText text={emptyText}/>
  }

  if(filteredTasks.length === 0)
  {
    return <DisplayEmptyText text={emptySearchText}/>
  }

  return (
    <>
      <h3>{header}</h3>
      <div id="TasksList">
        {filteredTasks.slice().map(task => 
          <Task
            index={task.id}
            key={task.id}
            data={task} 
            openEditPopup={openEditPopup}
            openDeletePopup={openDeletePopup}
            completeTask={completeTask}
            regexPattern={regexPattern}
            isComplete={displayCompleted}
          />
        )}
      </div>
    </>
  );
} 