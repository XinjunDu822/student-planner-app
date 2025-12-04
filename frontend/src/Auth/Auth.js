import { useState, useCallback } from "react";
import { logout as apiLogout } from "./AuthService";

export function useAuth() {
  const [user, setUser] = useState(null);

  const saveToken = useCallback((userObj) => {
    setUser(userObj);
  }, []);

  const resetToken = useCallback(async () => {
    if (user) {
      await apiLogout(user);
    }
    setUser(null);
  }, [user]);

  return {
    user,
    saveToken,
    resetToken,
    isAuthenticated: !!user,
  };
}