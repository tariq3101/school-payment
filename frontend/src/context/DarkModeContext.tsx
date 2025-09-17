import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

type DarkModeContextType = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType>({
  isDark: false,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") setIsDark(true);
  }, []);

  // Apply/remove dark class on <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Hook to use dark mode anywhere
export const useDarkMode = () => useContext(DarkModeContext);
