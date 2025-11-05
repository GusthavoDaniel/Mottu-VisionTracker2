
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import useThemeColors from '../../app/hooks/useThemeColors';
import { Stack } from 'expo-router';

// Hash do commit de referência (Simulado, pois o hash real é gerado no momento do commit)
// O usuário deve substituir este valor pelo hash do commit final antes de gerar o build.
const COMMIT_HASH = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';

export default function AboutScreen() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: t('aboutScreen.title'),
        }}
      />
      <Text style={[styles.title, { color: colors.text }]}>{t('aboutScreen.appName')}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('aboutScreen.subtitle')}</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('aboutScreen.versionInfo')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {t('aboutScreen.version')}: 1.0.0
        </Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {t('aboutScreen.buildHash')}: {COMMIT_HASH}
        </Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {t('aboutScreen.buildDate')}: {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('aboutScreen.developers')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>Gusthavo Daniel de Souza (RM: 554681)</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>Guilherme Damasio Roselli (RM: 555873)</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>Lucas Miranda Leite (RM: 555161)</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('aboutScreen.legal')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {t('aboutScreen.license')}: MIT License
        </Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {t('aboutScreen.copyright')}: © 2024 FIAP - Mobile Application Development
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderBottomColor: '#ccc', // Será substituído pela cor do tema
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
});

