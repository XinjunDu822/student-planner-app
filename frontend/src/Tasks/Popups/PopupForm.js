import { useState, useCallback } from "react";
import { DateToParams } from '../../Utils';

export function usePopupForm(serverRequest, reload) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  const [error, setError] = useState("");

  const setForm = useCallback((task = null) => {

    setError("");

    setTitle(task ? task.title : "");
    setDesc(task ? task.desc : "");
    setDate(task ? task.date : "");
    setTime((task && task.date) ? DateToParams(task.date)[1] : "");
  }, []);

  const submit = useCallback(async (args) => {

    const response = await serverRequest(...Object.values(args));
    
    await reload();

    if(response.message)
    {
      setError(response.message);
      return false;
    }
    return true;
  }, [reload])

  return {
    fields: {
      title,
      desc,
      date,
      time,
      error
    },
    actions: {
      setTitle,
      setDesc,
      setDate,
      setTime,
      setError,
      submit,
      setForm
    },
  };
}
