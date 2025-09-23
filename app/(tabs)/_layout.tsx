import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import useThemeColors from '../hooks/useThemeColors';

export default function TabLayout() {
  const { colors } = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="tachometer-alt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mapaPatio"
        options={{
          title: 'Mapa Pátio',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="map-marked-alt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="motos"
        options={{
          title: 'Motos',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="motorcycle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gerenciamentoFiliais"
        options={{
          title: 'Filiais',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="building" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historicoAlertas"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="bell" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="supervisor"
        options={{
          title: 'Supervisor',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="user-shield" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="cog" color={color} />
          ),
        }}
      />

      {/* Telas escondidas da tab */}
      <Tabs.Screen
        name="cadastrarMoto"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="registrarEventoRfid"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}