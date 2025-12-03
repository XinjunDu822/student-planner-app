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
    <>
        <h3>
          {text.map
          ((item, index) => 
            <span key={index}>
              <br/>{item}
            </span>
          )
          }
        </h3>
    </>
  );
}

export function TaskDisplay({header, emptyText, emptySearchText, tasks, openEditPopup, openDeletePopup, completeTask, keywords, filterStartDate, filterEndDate, displayCompleted=false})
{
  const [keys, setKeys] = useState([]);
  const [keywordPattern, setKeywordPattern] = useState(null);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  
  useEffect(() => {

    var keywords_ = escapeRegExp(keywords);

    var keys_ = keywords_.split(/[\s,]+/);
    

    keys_ = keys_.filter(item => item);


    if(!!keywords_ && keys_.length > 0)
    {
      setKeywordPattern(new RegExp(`(${keys_.join("|")})`, "gi"));
    }
    else
    {
      setKeywordPattern(null);
    }
    setKeys(keys_)

  }, [keywords])

  useEffect(() => {
    var filterStartDateAndTime = new Date(filterStartDate);
    var filterEndDateAndTime = new Date(filterEndDate);
    filterStartDateAndTime.setHours(0, 0, 0, 0);
    filterEndDateAndTime.setHours(24, 0, 0, 0);
    if(!keywordPattern || keys.length === 0)
    {
      setDisplayedTasks(tasks);
    }
    else
    {
      var numKeys = keys.length;

      var displayedTasks_ = [];

      for(let i = 0; i < tasks.length; i++)
      {
        if (tasks[i].date < filterStartDateAndTime || tasks[i].date > filterEndDateAndTime)
          continue;

        let text = tasks[i].title + tasks[i].desc;
        for(let j = 0; j < numKeys; j++)
        {
          let regexPattern = new RegExp(keys[j], 'i');
          if(!regexPattern.test(text))
          {
            break;
          }
          if(j === numKeys - 1)
          {
            displayedTasks_.push(tasks[i]);
          }
        }
      }

      setDisplayedTasks(displayedTasks_);

    }    
  }, [keys, keywordPattern, tasks, filterStartDate, filterEndDate])

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
        {/* <button className="button" onClick={console.log(filterStartDateAndTime)}><p>Mark Complete</p><p>✓</p></button> */}
        <div id="TasksList">
          {displayedTasks.slice().map
          ((item, index) => 
                <Task index={item.id} 
                      key={index}
                      data={item} 
                      openEditPopup={openEditPopup}
                      openDeletePopup={openDeletePopup}
                      completeTask={() => completeTask(item.id)}
                      keys={keys}
                      keywordPattern={keywordPattern}
                      isComplete={displayCompleted}
                      />
          )
          }
        </div>
      </>
  
  );
} 