import { createContext, useContext, useEffect, useState , useRef, useMemo, useCallback} from "react";
import { apiFetch } from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
 const sessionRevision = useRef(0);//to make sure that old request doesnot logout newly logged in user

  const getCurrentUser = useCallback(async () => {
      const revision = sessionRevision.current;
    setLoading(true);
    setAuthError(null);
    try {
      const response = await apiFetch("/api/auth/me");
 if (revision !== sessionRevision.current) {
        return;
      }
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
         if (revision !== sessionRevision.current) {
        return;
      }
      console.error("Failed to fetch current user:", error);
      setUser(null);
      setAuthError(error.message || "Somethign went wrong");
    } finally {
       if (revision === sessionRevision.current) {
    setLoading(false);
  }
    }
  },[]);

  const updateUser = useCallback((userData) => {
  sessionRevision.current += 1;
  setLoading(false);
  setUser(userData);
  setAuthError(null);
},[]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const logout = useCallback(() => {
      sessionRevision.current += 1;
      setLoading(false);
    setUser(null);
      setAuthError(null);
  },[]);

const authContextValue = useMemo(
  () => ({
    user,
    setUser: updateUser,
    loading,
    getCurrentUser,
    logout,
    authError,
  }),
  [user, loading, getCurrentUser, logout, authError]
);


  return (
    <AuthContext.Provider
    value={authContextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}