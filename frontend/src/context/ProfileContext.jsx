import { createContext, useContext, useEffect, useState,  useCallback,
  useMemo, } from "react";
import { apiFetch } from "../config/api";
const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);


  const getProfile = useCallback(async () => {
    setLoading(true);
  setProfileError(null);
    try {
      const response = await apiFetch("/api/profile");

      const data = await response.json().catch(()=>null);
      if (!response.ok) {
        throw new Error(data?.message || "Error! Failed to fetch profile");
      }
      // if successful response but if invalid or error data
if (!data) {
  throw new Error("Error! Failed to fetch profile");
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
  },[]);

    useEffect(() => {
    getProfile().catch(()=>{}); //when first mounted then run this
  }, [getProfile]);
    const updateProfile =useCallback( async (profileData) => {
      try{
    const response = await apiFetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });

    const data = await response.json().catch(()=>null);
    if (!response.ok) {
      throw new Error(data?.message || "Error! Failed to update profile");
    }
if (!data) {
  throw new Error("Error! Failed to update profile");
}
    setProfile(data);
    return data;
  }catch (error){
    throw new Error(error.message || "Error! Failed to update user Profile.")
  }
  },[]);

const getInitials = useCallback((username = "") => {
  // if no space then one letter if space then two
  return username
    .trim()
    .split(/\s+/)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
},[]);
const profileContextValue = useMemo(
  () => ({
    profile,
    loading,
    getProfile,
    updateProfile,
    getInitials,
    profileError,
  }),
  [profile, loading, getProfile, updateProfile, getInitials, profileError]
);

  return (
 <ProfileContext.Provider value={profileContextValue}>
  {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}