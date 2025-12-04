import { useState, useEffect, useCallback } from 'react';

import { TaskDisplay } from './TaskDisplay';
import { AddTaskPopup } from './Popups/AddTaskPopup';
import { EditTaskPopup } from './Popups/EditTaskPopup';
import { DeleteTaskPopup } from './Popups/DeleteTaskPopup';
import {InputField, DateInputField} from '../Utils';

import { useTaskManager } from './TaskManager';
import { useFilterManager } from './Filters/FilterManager';
import { usePopupManager } from './Popups/PopupManager';

export function TasksPage({user, logout}) {
  const {
    data: {tasks, completedTasks, numLateTasks, currStreak, bestStreak, error},
    actions: {addTask, editTask, deleteTask, completeTask,},
    selectors: {getTaskById},
    reload: {loadTasks}
  } = useTaskManager(user, logout);

  const {
    filters: { keywords, startDate, endDate },
    actions: { setKeywords, setStartDate, setEndDate, resetFilters }
  } = useFilterManager();

  const {
    selectors: { taskToEdit, taskToDelete },
    actions: { openEditPopup, closeEditPopup, openDeletePopup, closeDeletePopup }
  } = usePopupManager(getTaskById);


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
                {/* Date filter input fields */}
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
              {/* Button that resets all filters */}
              <button 
                className = "button"
                onClick={() => {setKeywords(""); setStartDate(""); setEndDate("");}}>
                Reset Filters
              </button>
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
          openEditPopup={openEditPopup} 
          openDeletePopup={openDeletePopup} 
          completeTask={completeTask}
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
          openEditPopup={openEditPopup} 
          openDeletePopup={openDeletePopup} 
          completeTask={completeTask}
        />

        <EditTaskPopup 
          task={taskToEdit} 
          editTask={editTask} 
          closeEditPopup={closeEditPopup}
        />

        <DeleteTaskPopup 
          task={taskToDelete} 
          deleteTask={deleteTask} 
          closeDeletePopup={closeDeletePopup}
        />

        </div>
      </div>
    </main>
  );
}


