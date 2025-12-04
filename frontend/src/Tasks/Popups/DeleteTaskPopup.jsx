import Popup from 'reactjs-popup';

export function DeleteTaskPopup({id, deleteTask, closeDeletePopup})
{
  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
        open={!!id} onClose={closeDeletePopup}
        modal>
        {
          close => (
            <div className='modal'>
              <div className='content'>
                  <h3>Are you sure you want to delete this task?</h3>
              </div>

              <div className="button-holder">
                <div>
                    <button className="button" onClick=
                      {() => {deleteTask(id); close();}}>
                          Yes
                    </button>
                </div>
                <div>
                    <button className="button" onClick=
                        {() => {close();}}>
                          No
                    </button>
                </div>
              </div>
            </div>
          )
        }
      </Popup>
    </div>
  );
}