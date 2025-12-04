import { useState, useCallback } from "react";

export function usePopupManager(getTaskById) {
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const openEditPopup = useCallback((index) => {
    setTaskToEdit(getTaskById(index));
  }, [getTaskById]);

  const closeEditPopup = useCallback((index) => {
    setTaskToEdit(null);
  }, []);

  const openDeletePopup = useCallback((index) => {
    setTaskToDelete(getTaskById(index));
  }, [getTaskById]);

  const closeDeletePopup = useCallback((index) => {
    setTaskToDelete(null);
  }, []);

  return {
    selectors: { taskToEdit, taskToDelete },
    actions: { openEditPopup, closeEditPopup, openDeletePopup, closeDeletePopup }
  };
}