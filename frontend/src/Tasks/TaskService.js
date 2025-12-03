const API_URL = "http://localhost:5000/api"; // adjust to your backend

//Requests backend database to send back all task entries
export const getAllTasks = async (authorization) => {
  const res = await fetch(
    `${API_URL}/dashboard`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authorization}`,
      },
    }
  );
  return await res.json();
};

//Requests backend database to create a new task
export const createTask = async (authorization, title, date, time, desc) => {
  const res = await fetch(`${API_URL}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
    body: JSON.stringify({ title, date, time, desc }),
  });

  return await res.json();
};

//Requests backend database to edit a task's information
export const editTask = async (authorization, taskId, title, date, time, desc) => {
  const res = await fetch(`${API_URL}/task/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
    body: JSON.stringify({ title, date, time, desc }),
  });

  return await res.json();
};

//Requests backend database to delete a task
export const deleteTask = async (authorization, taskId) => {
  const res = await fetch(`${API_URL}/task/${taskId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
  });

  return await res.json();
};

//Requests backend database to mark a task as complete
export const completeTask = async (authorization, taskId) => {
  const res = await fetch(`${API_URL}/task/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
    body: JSON.stringify({ date: new Date(), 
                           isComplete: true }),
  });

  return await res.json();
};

//Requests backend database to update the most recent time a task got marked late
export const updateLastLate = async (authorization, date) => {
  const res = await fetch(`${API_URL}/late`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
    body: JSON.stringify({ date }),
  });

  return await res.json();
};

//Requests backend database to update the highest streak the user has
export const updateBestStreak = async (authorization, streak) => {
  const res = await fetch(`${API_URL}/streak`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
    body: JSON.stringify({ streak }),
  });

  return await res.json();
};