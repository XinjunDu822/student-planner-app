import { useState, useCallback } from "react";

export function usePopupManager(getTaskById) {
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [idToDelete, setIdToDelete] = useState(null);

  const openEditPopup = useCallback((task) => {
    setTaskToEdit(task);
  }, []);

  const closeEditPopup = useCallback(() => {
    setTaskToEdit(null);
  }, []);

  const openDeletePopup = useCallback((index) => {
    setIdToDelete(index);
  }, []);

  const closeDeletePopup = useCallback(() => {
    setIdToDelete(null);
  }, []);

  return {
    selectors: { taskToEdit, idToDelete },
    actions: { openEditPopup, closeEditPopup, openDeletePopup, closeDeletePopup }
  };
}