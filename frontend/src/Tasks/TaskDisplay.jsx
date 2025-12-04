import { Task } from './Task';
import { useState, useEffect } from 'react';
import { keywordsToRegex } from '../Utils'

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
  totalTasks,
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
  const regexPattern = keywordsToRegex(keywords);
  
  if(totalTasks === 0)
  {
    return <DisplayEmptyText text={emptyText}/>
  }

  if(tasks.length === 0)
  {
    return <DisplayEmptyText text={emptySearchText}/>
  }

  console.log(typeof tasks)

  return (
    <>
      <h3>{header}</h3>
      <div id="TasksList">
        {tasks.map(task => 
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