import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("accentColor") || "purple"; //store theme and then accentcolor too across all views 
  });

    useEffect(() => {
    const root = document.documentElement;
 root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-accent", accentColor);

    // save preferences after refreshing or reopeneing 
localStorage.setItem("theme", theme);
    localStorage.setItem("accentColor", accentColor);
  }, [theme,accentColor]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  };
 return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme ,  accentColor,
        setAccentColor,}}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  return useContext(ThemeContext);
}