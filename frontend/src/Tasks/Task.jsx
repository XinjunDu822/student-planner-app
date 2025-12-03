import { DateToParams, FormatTime, HighlightMatches } from '../Utils';

export function Task({index, data, openEditPopup, openDeletePopup, completeTask, keys, keywordPattern, isComplete=false})
{
  var date = data.date;
  
  var [d, t] = DateToParams(date);
  var time = FormatTime(t);

  return (
    <div className = "task">

      <div>
        <HighlightMatches string={data.title} keys={keys} keywordPattern={keywordPattern}/>
      </div>

      <div>
        {d}
      </div>

      {
        !isComplete && (
          <>
            <div>
              {time}  
            </div>

            <div>
              <HighlightMatches string={data.desc} keys={keys} keywordPattern={keywordPattern}/>
            </div>

            <div>
    
              <div>
                <button className="button" onClick={completeTask}><p>Mark Complete</p><p>✓</p></button>
              </div>

              <div>
                <button className="button" onClick={() => openEditPopup(index)}><p>Edit</p><p>✎</p></button>
              </div>

              <div>
                <button className="button" onClick={() => openDeletePopup(index)}><p>Delete</p><p>🗑</p></button>
              </div>   

            </div> 
          </>
        )
      }
      

    </div>
  );
}