// app/_layout.tsx
import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n'; // <- dentro da pasta app, então "./i18n"
import { ThemeProvider } from './contexts/ThemeContext';
import { MotoProvider } from './contexts/MotoContext';
import { AuthProvider } from './contexts/AuthContext';
import useThemeColors from './hooks/useThemeColors';
import BackButton from './components/BackButton';

function RootStack() {
  const { colors } = useThemeColors();
  const router = useRouter();

  const headerLeft = () =>
    router.canGoBack() ? <BackButton /> : null;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        headerLeft,
      }}
    >
      {/* ROTA INICIAL → usa app/index.tsx */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* GRUPO DE AUTENTICAÇÃO (app/auth/...) */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />

      {/* GRUPO DE ABAS (app/(tabs)/...) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Telas específicas dentro de (tabs) com título customizado */}
      <Stack.Screen
        name="(tabs)/testNotifications"
        options={{ title: 'Testar Notificações' }}
      />
      <Stack.Screen
        name="(tabs)/languageSelector"
        options={{ title: 'Selecionar Idioma' }}
      />
      <Stack.Screen
        name="(tabs)/about"
        options={{ title: 'Sobre o App' }}
      />

      {/* Telas avulsas */}
      <Stack.Screen
        name="cadastrarMoto"
        options={{ title: 'Cadastrar Moto' }}
      />
      <Stack.Screen
        name="registrarEventoRfid"
        options={{ title: 'Registrar RFID' }}
      />
      <Stack.Screen
        name="relatorios"
        options={{ title: 'Relatórios' }}
      />
      <Stack.Screen
        name="moto/[id]"
        options={{ title: 'Detalhes da Moto' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MotoProvider>
          <I18nextProvider i18n={i18n}>
            <RootStack />
          </I18nextProvider>
        </MotoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
