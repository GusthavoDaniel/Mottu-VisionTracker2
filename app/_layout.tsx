import React from 'react';
import { Stack } from 'expo-router';
import { I18nextProvider } from 'react-i18next';
import i18n from '../app/i18n'; // Importe o arquivo de configuração do i18n
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
          <I18nextProvider i18n={i18n}>
            <Stack
              screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerTitleStyle: { color: colors.text },
                headerLeft: () => <BackButton />, 
              }}
            >
            {/* Grupo de abas sem header do Stack */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)/testNotifications" options={{ title: "Testar Notificações" }} />
            <Stack.Screen name="(tabs)/languageSelector" options={{ title: "Selecionar Idioma" }} />
            <Stack.Screen name="(tabs)/about" options={{ title: "Sobre o App" }} />

            {/* Telas avulsas (herdam o headerLeft acima) */}
            <Stack.Screen name="cadastrarMoto" options={{ title: 'Cadastrar Moto' }} />
            <Stack.Screen name="registrarEventoRfid" options={{ title: 'Registrar RFID' }} />
            <Stack.Screen name="relatorios" options={{ title: 'Relatórios' }} />
            </Stack>
          </I18nextProvider>
        </MotoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
