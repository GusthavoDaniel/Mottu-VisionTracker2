import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { MotoProvider } from './contexts/MotoContext';
import { AuthProvider } from './contexts/AuthContext';
import useThemeColors from './hooks/useThemeColors';
import BackButton from './components/BackButton';
export default function RootLayout() {
  const { colors } = useThemeColors();
  return (
    <ThemeProvider>
      <AuthProvider>
        <MotoProvider>
          <Stack
            screenOptions={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerTitleStyle: { color: colors.text },
              headerLeft: () => <BackButton />, // <— seta em todas as telas do Stack
            }}
          >
            {/* Grupo de abas sem header do Stack */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* Telas avulsas (herdam o headerLeft acima) */}
            <Stack.Screen name="cadastrarMoto" options={{ title: 'Cadastrar Moto' }} />
            <Stack.Screen name="registrarEventoRfid" options={{ title: 'Registrar RFID' }} />
            <Stack.Screen name="relatorios" options={{ title: 'Relatórios' }} />
          </Stack>
        </MotoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
