import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("creavings_theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("creavings_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "dark" ? "light" : "dark";
      toast.success(
        nextTheme === "light" ? "Switched to Light Mode ☀️" : "Switched to Dark Mode 🌙",
        { id: "theme-toast" }
      );
      return nextTheme;
    });
  };

  // Keyboard shortcut listener (Alt + T to toggle theme manually)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
