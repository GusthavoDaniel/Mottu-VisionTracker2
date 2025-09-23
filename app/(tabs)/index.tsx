import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';


const MOTTU_RED = '#FF3B30';
const MOTTU_ORANGE = '#FF9500';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ 
        title: 'Dashboard', 
        headerStyle: { backgroundColor: colors.background }, 
        headerTintColor: colors.text 
      }} />

      <Text style={[styles.headerTitle, { color: colors.text }]}>Mottu Pátio Operacional</Text>

      {/* Resumo Geral */}
      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <View style={styles.summaryRow}>
          <FontAwesome5 name="warehouse" size={24} color={colors.accent} />
          <Text style={[styles.summaryText, { color: colors.text }]}>Total no Pátio: 15</Text>
        </View>
        <View style={styles.summaryRow}>
          <FontAwesome5 name="tools" size={24} color={MOTTU_ORANGE} />
          <Text style={[styles.summaryText, { color: colors.text }]}>Em Manutenção: 3</Text>
        </View>
        <View style={styles.summaryRow}>
          <FontAwesome5 name="exclamation-triangle" size={24} color={MOTTU_RED} />
          <Text style={[styles.summaryText, { color: colors.text }]}>Alertas Ativos: 4</Text>
        </View>
        <View style={styles.summaryRow}>
          <FontAwesome5 name="motorcycle" size={24} color={colors.accent} />
          <Text style={[styles.summaryText, { color: colors.text }]}>Em Movimento: 5</Text>
        </View>
      </View>

      {/* Alertas Críticos */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>⚡ Alertas Críticos</Text>
      <View style={[styles.alertCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.alertText, { color: colors.text }]}>🚨 Moto XYZ1234 parada há 48h na Zona Norte.</Text>
        <Text style={[styles.alertText, { color: colors.text }]}>⚡ Bateria crítica na moto ABC9876.</Text>
      </View>

      {/* KPIs */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>📊 KPIs Operacionais</Text>
      <View style={[styles.kpiCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.kpiText, { color: colors.text }]}>⏳ Permanência média: 2.4 dias</Text>
        <Text style={[styles.kpiText, { color: colors.text }]}>🔄 Entradas/saídas últimas 24h: 12 / 9</Text>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.accent }]} 
          onPress={() => router.push('(tabs)/mapaPatio')}
        >
          <FontAwesome5 name="map-marked-alt" size={24} color={isDark ? '#121212' : '#FFFFFF'} />
          <Text style={[styles.actionButtonText, { color: isDark ? '#121212' : '#FFFFFF' }]}>Ver Pátio</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.accent }]} 
          onPress={() => router.push('/registrarEventoRfid')}
        >
          <MaterialIcons name="wifi-tethering" size={24} color={isDark ? '#121212' : '#FFFFFF'} />
          <Text style={[styles.actionButtonText, { color: isDark ? '#121212' : '#FFFFFF' }]}>Registrar RFID</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.accent }]} 
          onPress={() => Alert.alert('Em desenvolvimento', 'Relatórios em breve.')}
        >
          <MaterialCommunityIcons name="file-chart" size={24} color={isDark ? '#121212' : '#FFFFFF'} />
          <Text style={[styles.actionButtonText, { color: isDark ? '#121212' : '#FFFFFF' }]}>Relatórios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryCard: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    marginLeft: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: MOTTU_RED,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  alertText: {
    fontSize: 16,
    marginBottom: 8,
  },
  kpiCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  kpiText: {
    fontSize: 16,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    width: '30%',
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
