import { createContext, useContext, useEffect, useState, useMemo , useCallback} from "react";
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
    root.dataset.accent = accentColor;

    // save preferences after refreshing or reopeneing 
localStorage.setItem("theme", theme);
    localStorage.setItem("accentColor", accentColor);
  }, [theme,accentColor]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  },[]);

const themeContextValue = useMemo(
  () => ({
    theme,
    setTheme,
    toggleTheme,
    accentColor,
    setAccentColor,
  }),
  [theme, toggleTheme, accentColor]
);

 return (
  <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  return useContext(ThemeContext);
}