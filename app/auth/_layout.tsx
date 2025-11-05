import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function AuthLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: t('common.login'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: t('common.register'),
          headerShown: false,
        }}
      />
    </Stack>
  );
}
