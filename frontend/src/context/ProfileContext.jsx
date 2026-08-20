import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../config/api";
const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await apiFetch("/api/profile");

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error! Failed to fetch profile");
      }

      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        getProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}