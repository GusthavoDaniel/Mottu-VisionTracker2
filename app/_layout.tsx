
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { MotoProvider } from './contexts/MotoContext';
import { AuthProvider } from './contexts/AuthContext';
import AuthNavigator from './components/AuthNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MotoProvider>
          <AuthNavigator />
        </MotoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
