import { DateToParams, FormatTime } from '../Utils';

function HighlightMatches({string, keys, keywordPattern})
{
  if(!keywordPattern || keys.length === 0)
  {
    return <>{string}</>;
  }  

   // Replace matches with a React element array
  const parts = [];
  let lastIndex = 0;

  string.replace(keywordPattern, (match, p1, offset) => {
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

export function Task({
  index, 
  data, 
  openEditPopup, 
  openDeletePopup, 
  completeTask, 
  keys, 
  keywordPattern,
  isComplete=false
})
{  
  var [dateString, timeParams] = DateToParams(data.date);
  var time = FormatTime(timeParams);

  return (
    <div className = "task">

      <div>
        <HighlightMatches 
          string={data.title} 
          keys={keys} 
          keywordPattern={keywordPattern}
        />
      </div>

      <div>{dateString}</div>

      {!isComplete && (
        <>
          <div>{time}</div>

          <div>
            <HighlightMatches 
              string={data.desc} 
              keys={keys} 
              keywordPattern={keywordPattern}
            />
          </div>

          <div>
            <button className="button" onClick={() => completeTask(index)}>
              <p>Mark Complete</p>
              <p>✓</p>
            </button>

            <button className="button" onClick={() => openEditPopup(index)}>
              <p>Edit</p>
              <p>✎</p>
            </button>

            <button className="button" onClick={() => openDeletePopup(index)}>
              <p>Delete</p>
              <p>🗑</p>
            </button>
          </div> 
        </>
      )}
      

    </div>
  );
}