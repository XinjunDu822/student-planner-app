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

export function TaskDisplay({header, emptyText, emptySearchText, tasks, openEditPopup, openDeletePopup, completeTask, keywords, startDate, endDate, displayCompleted=false})
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

    var displayedTasks_ = tasks;
  
    if(!!keywordPattern && keys.length > 0)
    {
      var numKeys = keys.length;

      var displayedTasks_ = [];

      for(let i = 0; i < tasks.length; i++)
      {
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
    }

    var displayedTasks_final = [];

    var startDate_ = !!startDate ? new Date(startDate) : null;
    var endDate_ = !!endDate ? new Date(endDate) : null;

    if(!!startDate_)
    {
      startDate_.setHours(0, 0, 0, 0);
    }

    if(!!endDate_)
    {
      endDate_.setHours(0, 0, 0, 0);
      endDate_.setDate(endDate_.getDate() + 1);
    }

    for(let i = 0; i < displayedTasks_.length; i++)
    {
      if ((!startDate_ || startDate_ <= displayedTasks_[i].date) && (!endDate_ || displayedTasks_[i].date <= endDate_))
        displayedTasks_final.push(displayedTasks_[i]);
    }

    setDisplayedTasks(displayedTasks_final);

  }, [keys, keywordPattern, tasks, startDate, endDate])

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
        {/* <button className="button" onClick={console.log(startDate_)}><p>Mark Complete</p><p>✓</p></button> */}
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