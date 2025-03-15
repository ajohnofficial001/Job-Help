import React, { createContext, useState, useContext, useEffect } from 'react';
import { COLORS } from '../constants';

// Create the theme context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Theme colors based on mode
  const theme = {
    darkMode,
    colors: darkMode ? {
      background: COLORS.primary,
      surface: COLORS.secondary,
      text: COLORS.white,
      textSecondary: COLORS.gray2,
      accent: COLORS.tertiary,
    } : {
      background: COLORS.lightWhite,
      surface: COLORS.white,
      text: COLORS.primary,
      textSecondary: COLORS.secondary,
      accent: COLORS.tertiary,
    },
    toggleDarkMode: () => setDarkMode(prevMode => !prevMode)
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 