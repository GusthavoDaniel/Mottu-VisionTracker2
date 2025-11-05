import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const MOTTU_RED = '#FF3B30';
const MOTTU_ORANGE = '#FF9500';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: t('common.dashboard'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleButton}>
              <MaterialIcons
                name={isDark ? 'wb-sunny' : 'nightlight-round'}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Text style={[styles.headerTitle, { color: colors.text }]}>
        {t('common.appName')}
      </Text>

      {/* Resumo Geral */}
      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <View style={styles.summaryRow}>
          <FontAwesome5 name="warehouse" size={24} color={colors.accent} />
          <Text style={[styles.summaryText, { color: colors.text }]}>
            {t('common.totalInPatio')} 15
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <FontAwesome5 name="tools" size={24} color={MOTTU_ORANGE} />
          <Text style={[styles.summaryText, { color: colors.text }]}>
            {t('common.inMaintenance')} 3
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <FontAwesome5 name="exclamation-triangle" size={24} color={MOTTU_RED} />
          <Text style={[styles.summaryText, { color: colors.text }]}>
            {t('common.activeAlerts')} 4
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <FontAwesome5 name="motorcycle" size={24} color={colors.accent} />
          <Text style={[styles.summaryText, { color: colors.text }]}>
            {t('common.inMovement')} 5
          </Text>
        </View>
      </View>

      {/* Alertas Críticos */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>
        ⚡ {t('common.criticalAlerts')}
      </Text>
      <View style={[styles.alertCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.alertText, { color: colors.text }]}>
          {t('dashboardScreen.alert1')}
        </Text>
        <Text style={[styles.alertText, { color: colors.text }]}>
          {t('dashboardScreen.alert2')}
        </Text>
      </View>

      {/* KPIs */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>
        📊 {t('common.operationalKPIs')}
      </Text>
      <View style={[styles.kpiCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.kpiText, { color: colors.text }]}>
          ⏳ {t('dashboardScreen.avgStay', { value: '2.4' })}
        </Text>
        <Text style={[styles.kpiText, { color: colors.text }]}>
          🔄 {t('dashboardScreen.entriesExits24hKpi', { entries: 12, exits: 9 })}
        </Text>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/mapaPatio')}
          activeOpacity={0.85}
        >
          <FontAwesome5
            name="map-marked-alt"
            size={24}
            color={isDark ? '#121212' : '#FFFFFF'}
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: isDark ? '#121212' : '#FFFFFF' },
            ]}
          >
            {t('common.viewPatio')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/registrarEventoRfid')}
          activeOpacity={0.85}
        >
          <MaterialIcons
            name="wifi-tethering"
            size={24}
            color={isDark ? '#121212' : '#FFFFFF'}
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: isDark ? '#121212' : '#FFFFFF' },
            ]}
          >
            {t('common.registerRFID')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/relatorios')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name="file-chart"
            size={24}
            color={isDark ? '#121212' : '#FFFFFF'}
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: isDark ? '#121212' : '#FFFFFF' },
            ]}
          >
            {t('common.reports')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão de Seleção de Idioma */}
      <TouchableOpacity
        style={[styles.languageButton, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/languageSelector')}
        activeOpacity={0.85}
      >
        <MaterialIcons
          name="language"
          size={24}
          color={isDark ? '#121212' : '#FFFFFF'}
        />
        <Text
          style={[
            styles.languageButtonText,
            { color: isDark ? '#121212' : '#FFFFFF' },
          ]}
        >
          {t('languageSelector.title')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  themeToggleButton: {
    marginRight: 10,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
  },
  languageButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryCard: { borderRadius: 10, padding: 20, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  summaryText: { fontSize: 18, marginLeft: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: MOTTU_RED,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  alertText: { fontSize: 16, marginBottom: 8 },
  kpiCard: { padding: 15, borderRadius: 8, marginBottom: 20 },
  kpiText: { fontSize: 16, marginBottom: 8 },
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
