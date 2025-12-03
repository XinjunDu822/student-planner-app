import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import 'reactjs-popup/dist/index.css';
// import { TaskDatabase, CompletedTaskDatabase } from '../DummyData';
import { AddTaskPopup, DisplayTasks, EditTaskPopup, DeleteTaskPopup } from './Tasks';
import { getAllTasks, createTask, editTask, deleteTask, completeTask, updateLastLate, updateBestStreak } from "./TaskService";
import { getUser } from "../Login/AuthService";
import { InputField} from '../Utils';

export function TasksPage({user, logout}) {

  const [numLateTasks, setNumLateTasks] = useState(null);

  const [currStreak, setCurrStreak] = useState(null);
  const [bestStreak, setBestStreak] = useState(null);
  const [keywords, setKeywords] = useState("");

  const [tasks, setTasks] = useState(null);

  const [taskToEdit, setTaskToEdit] = useState(null);

  const [taskToDelete, setTaskToDelete] = useState(null);

  const [error, setError] = useState(null);

  const [completedTasks, setCompletedTasks] = useState(null);


  const loadTasks = useCallback(async () => {

    var response = await getAllTasks(user);
    
    if(!response.tasks)
    {        
        if(response.message == "Unauthorized")
        {
            logout();   
            return;         
        }
        setTasks(null);
        setCompletedTasks(null);
        setError(response.message);
        return;
    }

    var tasks_ = response.tasks;
    var completedTasks_ = response.completedTasks;

    for(var i = 0; i < tasks_.length; i++)
    {
        tasks_[i].date = new Date(tasks_[i].date);
    }

    for(var i = 0; i < completedTasks_.length; i++)
    {
        completedTasks_[i].date = new Date(completedTasks_[i].date);
    }

    setTasks(tasks_);
    setCompletedTasks(completedTasks_);

    var i = 0;
    var d = new Date();
    for(; i < tasks_.length && d >= tasks_[i].date; i++) { }

    setNumLateTasks(i);

    var lastLate = null;

    if(i > 0)
    {
        lastLate = tasks_[i - 1].date;
    }

    var user_ = await getUser(user);

    if(user_.lastLate)
    {
        var serverLastLate = new Date(user_.lastLate);

        if(lastLate != null && lastLate > serverLastLate)
        {
            await updateLastLate(user, lastLate);
        }
        else
        {
            lastLate = serverLastLate;
        }
    }

    var streak = 0;
    
    if(lastLate == null)
    {
        streak = completedTasks_.length;
    }
    else
    {
        for(; streak < completedTasks_.length && completedTasks_[streak].date > lastLate; streak++) { }
    }

    setCurrStreak(streak);

    var bestStreak = user_.bestStreak;

    if(streak > bestStreak)
    {
        bestStreak = streak;
        await updateBestStreak(user, bestStreak);
    }

    setBestStreak(bestStreak);
  }, [user, logout]);
  
  useEffect(() => {
    loadTasks();
    const refreshInterval = setInterval(loadTasks, 60000);
    return () => clearInterval(refreshInterval);
  }, [user, loadTasks]);

  const addTask = useCallback(async (title, desc, date, time) =>
  {
    var response = await createTask(user, title, date, time, desc);

    await loadTasks();

    if(response.message)
    {
        return response.message;
    }

    return true;
  }, [user, loadTasks]);

  const selectTaskToEdit = useCallback((index) =>
  {
    for(let i = 0; i < tasks.length; i++)
    {
        if(tasks[i].id == index)
        {
            setTaskToEdit(tasks[i]);
            return;
        }
    }
    setTaskToEdit(null);

  }, [tasks]);

  const deselectTaskToEdit = useCallback(() => {
    setTaskToEdit(null);
  }, [])


  const editTask_ = useCallback(async (id, title, desc, date, time) =>
  {
    var response = await editTask(user, id, title, date, time, desc);
    await loadTasks();

    if(response.message)
    {
        return response.message;
    }
    return true;
  }, [user, loadTasks]);

  const selectTaskToDelete = useCallback((index) =>
  {
    for(let i = 0; i < tasks.length; i++)
    {
        if(tasks[i].id == index)
        {
            setTaskToDelete(tasks[i]);
            return;
        }
    }
    setTaskToDelete(null);

  }, [tasks]);

  const deselectTaskToDelete = useCallback(() => {
    setTaskToDelete(null);
  }, [])

  const deleteTask_ = useCallback(async (id) =>
  {
    await deleteTask(user, id);
    await loadTasks();
  }, [user, loadTasks]);

  const completeTask_ = useCallback(async (id) =>
  {
    await completeTask(user, id);
    await loadTasks();
  }, [user, loadTasks]);


  if(tasks == null || completedTasks == null)
  {
    return (
        <main>
            <div>
                <h3><br/>Error fetching tasks<br/>{error}</h3>
            </div>
        </main>
    );
  }

  return (
    <main>

        <div className="dashboard">

            <div className="completed">

                <h3>Current streak</h3>

                <div className="streak">
                    {currStreak}
                </div>

                <h3>Best: {bestStreak}</h3><br/>
                
                <hr/><br/>

                <DisplayTasks header={"Complete"} 
                            emptyText={["You have no completed tasks right now.", "What a bum..."]}
                            emptySearchText={["No new matching completed tasks."]}
                            keywords={keywords} 
                            tasks={completedTasks} 
                            selectTaskToDelete={selectTaskToDelete} 
                            displayCompleted={true}/>

            </div>

            <div className="todo">
               
                <div className="dashboard-bar">

                    <h2>My Dashboard</h2>

                    <InputField placeholderText = "Enter keyword(s)" value={keywords} setValue = {setKeywords}/>
                
                </div >

                <AddTaskPopup addTask = {addTask}/>


                <DisplayTasks header={"Late"} 
                            keywords={keywords} 
                            emptyText={null}
                            emptySearchText={null}
                            tasks={tasks.slice(0, numLateTasks)} 
                            openEditPopup={selectTaskToEdit} 
                            openDeletePopup={selectTaskToDelete} 
                            completeTask={completeTask_}/>

                <DisplayTasks header={"To-do"} 
                            emptyText={["You have no new tasks right now.", "Get started by creating some!"]}
                            emptySearchText={["No new matching tasks."]}
                            keywords={keywords} 
                            tasks={tasks.slice(numLateTasks)} 
                            openEditPopup={selectTaskToEdit} 
                            openDeletePopup={selectTaskToDelete} 
                            completeTask={completeTask_}/>


            <EditTaskPopup task={taskToEdit} editTask={editTask_} closeEditPopup={deselectTaskToEdit} />
  
            <DeleteTaskPopup task={taskToDelete} deleteTask={deleteTask_} closeDeletePopup={deselectTaskToDelete} />


            </div>

        </div>

    </main>
    );
}


