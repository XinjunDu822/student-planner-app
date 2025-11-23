const API_URL = "http://localhost:5000/api/auth"; // adjust to your backend

export const signUp = async (name, password) => {
  const res = await fetch(`${API_URL}/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  });

  return await res.json();
};

export const signIn = async (name, password) => {
  const res = await fetch(`${API_URL}/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  });

  return await res.json();
};

export const getUser = async (authorization) => {
  const res = await fetch(`${API_URL}/get-user`, {
    method: "GET",
    headers: { "Content-Type": "application/json",
               "Authorization": `Bearer ${authorization}` },
  });

  return await res.json();
};