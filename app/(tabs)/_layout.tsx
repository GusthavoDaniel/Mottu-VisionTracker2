import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import useThemeColors from '../hooks/useThemeColors';
import BackButton from '../components/BackButton';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const { t } = useTranslation();

  const headerLeft = () => (router.canGoBack() ? <BackButton /> : null);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerLeft,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.dashboard'),
          tabBarLabel: t('common.dashboard'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="tachometer-alt" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="mapaPatio"
        options={{
          title: t('common.patioMap'),
          tabBarLabel: t('common.patioMap'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="map-marked-alt" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="gerenciamentoFiliais"
        options={{
          title: t('branches.title'),
          tabBarLabel: t('branches.title'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="building" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="historicoAlertas"
        options={{
          title: t('common.alertHistory'),
          tabBarLabel: t('common.alertHistory'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="bell" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="supervisor"
        options={{
          title: t('supervisor.title'),
          tabBarLabel: t('supervisor.title'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="user-shield" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="configuracoes"
        options={{
          title: t('settings.title'),
          tabBarLabel: t('settings.title'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="cog" color={color} />
          ),
        }}
      />

      {/* Telas fora da tab bar */}
      <Tabs.Screen name="motos" options={{ href: null }} />
      <Tabs.Screen name="cadastrarMoto" options={{ href: null }} />
      <Tabs.Screen name="registrarEventoRfid" options={{ href: null }} />
    </Tabs>
  );
}
