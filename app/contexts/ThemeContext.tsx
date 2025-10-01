import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export interface ThemeColors {
  background: string;
  surface: string;        
  text: string;
  textSecondary: string;
  primary: string;
  accent: string;
  border: string;
  card: string;
  success: string;
  error: string;
  warning: string;
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

  const toggleTheme = () => setIsDark(prev => !prev);

  const colors = useMemo<ThemeColors>(() => ({
    background: isDark ? '#121212' : '#FFFFFF',
    surface:    isDark ? '#1E1E1E' : '#F5F5F5',   
    text:       isDark ? '#FFFFFF' : '#121212',
    textSecondary: isDark ? '#BBBBBB' : '#666666',
    primary: '#00A859',
    accent:  '#00EF7F',
    border:  isDark ? '#333333' : '#DDDDDD',
    card:    isDark ? '#1E1E1E' : '#F0F0F0',
    success: isDark ? '#81C784' : '#4CAF50',
    error:   isDark ? '#EF9A9A' : '#F44336',
    warning: isDark ? '#FFB74D' : '#FFC107',
  }), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
