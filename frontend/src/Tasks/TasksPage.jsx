import { useState, useEffect, useCallback } from 'react';

import { TaskDisplay } from './TaskDisplay';
import { AddTaskPopup } from './AddTask';
import { EditTaskPopup } from './EditTask';
import { DeleteTaskPopup } from './DeleteTask';
import {InputField, DateInputField} from '../Utils';
import {useTasks} from './TaskManager';

export function TasksPage({user, logout}) {
  const [keywords, setKeywords] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const {
    tasks,
    completedTasks,
    numLateTasks,
    currStreak,
    bestStreak,
    error,
    addTask,
    editTask_,
    deleteTask_,
    completeTask_,
    getTaskById
  } = useTasks(user, logout);


  // Loading/Error UI
  if(!tasks || !completedTasks)
  {
    return (
    <main>
      <div>
        <h3>
          <br/>
            {error ? `Error fetching tasks\n${error}` : "Loading tasks..."}
        </h3>
      </div>
    </main>
    );
  }

  return (
    <main>
      <div className="dashboard">

        <div className="completed">
          <h3>Current streak</h3>

          <div className="streak">{currStreak}</div>

          <h3>Best: {bestStreak}</h3>
          
          <br/>      
          <hr/>
          <br/>

          {/* Completed tasks */}
          <TaskDisplay 
            header={"Complete"} 
            tasks={completedTasks}
            keywords={keywords}
            displayCompleted
            emptyText={["You have no completed tasks right now.", "What a bum..."]}
            emptySearchText={["No new matching completed tasks."]}           
          />
        </div>

        <div className="todo">
            
          <div className="dashboard-bar">

            <h2>My Dashboard</h2>

            <div>
              <InputField 
                placeholderText = "Enter keyword(s)" 
                value={keywords} 
                setValue={setKeywords}
              />
            </div>

            <div>
              <div className="date-range">
                <DateInputField 
                  placeholderText = "Start date" 
                  value={startDate} 
                  setValue={setStartDate} 
                  emptyOnExit
                /> 
                
                <DateInputField 
                  placeholderText = "End date" 
                  value={endDate} 
                  setValue={setEndDate} 
                  emptyOnExit
                />
              </div>
            </div>
        </div >

        <AddTaskPopup addTask={addTask}/>

        {/* Late tasks */}
        <TaskDisplay 
          header={"Late"} 
          keywords={keywords} 
          startDate={startDate} 
          endDate={endDate}
          emptyText={null}
          emptySearchText={null}
          tasks={tasks.slice(0, numLateTasks)} 
          openEditPopup={(index) => setTaskToEdit(getTaskById(index))} 
          openDeletePopup={(index) => setTaskToDelete(getTaskById(index))} 
          completeTask={completeTask_}
        />

        {/* New tasks */}
        <TaskDisplay 
          header={"To-do"} 
          emptyText={["You have no new tasks right now.", "Get started by creating some!"]}
          emptySearchText={["No new matching tasks."]}
          keywords={keywords} 
          startDate={startDate} 
          endDate={endDate}
          tasks={tasks.slice(numLateTasks)} 
          openEditPopup={(index) => setTaskToEdit(getTaskById(index))} 
          openDeletePopup={(index) => setTaskToDelete(getTaskById(index))} 
          completeTask={completeTask_}
        />

        <EditTaskPopup 
          task={taskToEdit} 
          editTask={editTask_} 
          closeEditPopup={() => setTaskToEdit(null)}
        />

        <DeleteTaskPopup 
          task={taskToDelete} 
          deleteTask={deleteTask_} 
          closeDeletePopup={() => setTaskToDelete(null)}
        />

        </div>
      </div>
    </main>
  );
}


