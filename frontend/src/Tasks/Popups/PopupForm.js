import { useState, useCallback } from "react";
import { DateToParams } from '../../Utils';

export function usePopupForm(serverRequest) {
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

//   const editTask_ = useCallback(async (id, title, desc, date, time)

  const submit = useCallback(async (args = {title, desc, date, time}) => {

    var response;

    response = await serverRequest(args);

    if(response.message)
    {
      setError(response.message);
      return false;
    }
    return true;
  }, [title, desc, date, time])

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
