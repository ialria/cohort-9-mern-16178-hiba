import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../config/api";
const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  useEffect(() => {
    getProfile().catch(()=>{});
  }, []);

  const getProfile = async () => {
    setLoading(true);
  setProfileError(null);
    try {
      const response = await apiFetch("/api/profile");

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error! Failed to fetch profile");
      }

      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
       setProfile(null);
    setProfileError(
      error.message || "Oops! Something went wrong. Please try again."
    );
    } finally {
      setLoading(false);
    }
  };
    const updateProfile = async (profileData) => {
      try{
    const response = await apiFetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error! Failed to update profile");
    }

    setProfile(data);
    return data;
  }catch (error){
    throw new Error(error.message || "Error! Failed to update user Profile.")
  }
  };

const getInitials = (username = "") => {
  return username
    .trim()
    .split(/\s+/)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};


  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        getProfile,
        updateProfile,
        getInitials,
        profileError
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}