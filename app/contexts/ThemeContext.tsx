import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeColors {
  background: string;
  text: string;
  accent: string;
  border: string;
  card: string;
  success: string;
  error: string;
  warning: string;
  textSecondary: string;
  primary: string;
}

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const toggleTheme = () => setIsDark((prev) => !prev);

  const colors: ThemeColors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#121212',
    textSecondary: isDark ? '#BBBBBB' : '#666666',
    accent: '#00EF7F',
    border: isDark ? '#444' : '#CCC',
    card: isDark ? '#1E1E1E' : '#F0F0F0',
    success: isDark ? '#81C784' : '#4CAF50',
    error: isDark ? '#EF9A9A' : '#F44336',
    warning: isDark ? '#FFB74D' : '#FFC107',
    primary: '#00A859',
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
