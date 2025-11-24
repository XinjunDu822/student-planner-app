const API_URL = "http://localhost:5000/api"; // adjust to your backend


export const getAllTasks = async (authorization) => {
  const res = await fetch(`${API_URL}/dashboard`, {
    method: "GET",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
  });

  return await res.json();
};

export const createTask = async (authorization, title, date, time, desc) => {
  const res = await fetch(`${API_URL}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
    body: JSON.stringify({ title, date, time, desc }),
  });

  return await res.json();
};

export const editTask = async (authorization, taskId, title, date, time, desc) => {
  const res = await fetch(`${API_URL}/task/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
    body: JSON.stringify({ title, date, time, desc }),
  });

  return await res.json();
};

export const deleteTask = async (authorization, taskId) => {
  const res = await fetch(`${API_URL}/task/${taskId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
  });

  return await res.json();
};

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


export const updateLastLate = async (authorization, date) => {
  const res = await fetch(`${API_URL}/late`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
    body: JSON.stringify({ date }),
  });

  return await res.json();
};

export const updateBestStreak = async (authorization, streak) => {
  const res = await fetch(`${API_URL}/streak`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
    body: JSON.stringify({ streak }),
  });

  return await res.json();
};