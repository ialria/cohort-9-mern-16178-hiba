import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const getCurrentUser = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await apiFetch("/api/auth/me");

      if (response.status === 401) {
        setUser(null);
        return;
      }


       if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.message || "Error! Failed to verify your authentication"
        );
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
      setAuthError(error.message || "Somethign went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const logout = () => {
    setUser(null);
      setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        getCurrentUser,
        logout,
        authError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}