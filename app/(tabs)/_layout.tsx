import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import useThemeColors from '../hooks/useThemeColors';
import BackButton from '../components/BackButton';

export default function TabsLayout() {
  const { colors } = useThemeColors();
  const router = useRouter();

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
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        headerLeft, // <— seta nas telas das tabs quando há para onde voltar
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="tachometer-alt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mapaPatio"
        options={{
          title: 'Mapa Pátio',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="map-marked-alt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gerenciamentoFiliais"
        options={{
          title: 'Filiais',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="building" color={color} />,
        }}
      />
      <Tabs.Screen
        name="historicoAlertas"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="supervisor"
        options={{
          title: 'Supervisor',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="user-shield" color={color} />,
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="cog" color={color} />,
        }}
      />

      {/* Telas fora da tab bar */}
      <Tabs.Screen name="cadastrarMoto" options={{ href: null }} />
      <Tabs.Screen name="registrarEventoRfid" options={{ href: null }} />
    </Tabs>
  );
}
