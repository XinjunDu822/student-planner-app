import { DateToParams, FormatTime } from '../Utils';

function HighlightMatches({string, regexPattern})
{
  if(!regexPattern)
  {
    return <>{string}</>;
  }  

   // Replace matches with a React element array
  const parts = [];
  let lastIndex = 0;

  string.replace(regexPattern, (match, p1, offset) => {
    // Push text before the match
    if (lastIndex < offset) {
      parts.push(string.slice(lastIndex, offset));
    }

    // Push the highlighted match
    parts.push(<mark key={offset} className="highlight">{match}</mark>);

    lastIndex = offset + match.length;
    return match;
  });

  // Push remaining text after last match
  if (lastIndex < string.length) {
    parts.push(string.slice(lastIndex));
  }

  return <span>{parts}</span>;
}

function TaskActions({ index, onComplete, onEdit, onDelete })
{
  return (
    <div>
      <button className="button" onClick={() => onComplete(index)}>
        <p>Mark Complete</p>
        <p>✓</p>
      </button>

      <button className="button" onClick={() => onEdit(index)}>
        <p>Edit</p>
        <p>✎</p>
      </button>

      <button className="button" onClick={() => onDelete(index)}>
        <p>Delete</p>
        <p>🗑</p>
      </button>
    </div> 
  );
}

export function Task({
  index, 
  data, 
  openEditPopup, 
  openDeletePopup, 
  completeTask, 
  regexPattern,
  isComplete=false
})
{  
  var [dateString, timeParams] = DateToParams(data.date);
  var time = FormatTime(timeParams);

  return (
    <div className = "task">

      <div>
        <HighlightMatches string={data.title} regexPattern={regexPattern}/>
      </div>

      <div>{dateString}</div>

      {!isComplete && (
        <>
          <div>{time}</div>

          <div>
            <HighlightMatches string={data.desc} regexPattern={regexPattern}/>
          </div>

          <TaskActions
            index={index}
            onComplete={completeTask}
            onEdit={openEditPopup}
            onDelete={openDeletePopup}
          /> 
        </>
      )}
      

    </div>
  );
}