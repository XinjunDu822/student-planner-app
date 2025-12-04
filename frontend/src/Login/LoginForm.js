import { useState, useCallback } from "react";

export function useLoginForm(serverRequest, saveToken) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const reset = useCallback(() => {
    setUsername("");
    setPassword("");
    setError("");
  }, []);

  const submit = useCallback(async () => {
    const response = await serverRequest(username, password);

    if(!response.token)
    {
      setError(response.message);
      return;
    }

    saveToken(response.token);
  }, [username, password, saveToken]);

  return {
    fields: {
      username,
      password,
      error,
    },
    actions: {
      setUsername,
      setPassword,
      submit,
      reset,
    },
  };
}
