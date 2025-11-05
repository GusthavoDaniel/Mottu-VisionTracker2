import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ConfiguracoesScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const { user, logout, isLoading } = useAuth();
  const { t } = useTranslation();

  const openLink = (url: string) => Linking.openURL(url);

  const handleLogout = () => {
    Alert.alert(
      t('settings.logoutTitle'),
      t('settings.logoutMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('settings.logoutConfirm'), style: 'destructive', onPress: logout },
      ]
    );
  };

  
  const buildHash = process.env.EXPO_PUBLIC_BUILD_HASH || 'N/A';
  const buildDate = process.env.EXPO_PUBLIC_BUILD_DATE || new Date().toLocaleDateString();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/mottu_moto.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appName, { color: colors.accent }]}>
          {t('common.appName')}
        </Text>
        <Text style={[styles.appVersion, { color: colors.text }]}>
          {t('footer.version')}
        </Text>
      </View>

      {/* Usuário logado */}
      {user && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={24} color={colors.accent} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('settings.userSectionTitle')}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {t('common.name')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user.name}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {t('common.email')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user.email}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Tema */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="color-palette" size={24} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('settings.appearance')}
          </Text>
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('settings.darkTheme')}
            </Text>
            <Text style={[styles.settingDescription, { color: colors.text + '99' }]}>
              {isDark ? t('settings.enabled') : t('settings.disabled')}
            </Text>
          </View>

          <Switch
            trackColor={{ false: '#767577', true: colors.accent + '70' }}
            thumbColor={isDark ? colors.accent : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDark}
          />
        </View>
      </View>

      {/* Sobre o App */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={24} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('settings.about')}
          </Text>
        </View>

        <Text style={[styles.aboutText, { color: colors.text }]}>
          {t('settings.description')}
        </Text>

        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="map" size={22} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              {t('settings.interactiveMap')}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="locate" size={22} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              {t('settings.motoTracking')}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="grid" size={22} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              {t('settings.organizedSectors')}
            </Text>
          </View>
        </View>

        {/* 🔹 Info de build e commit */}
        <View style={styles.buildInfo}>
          <Text style={[styles.buildText, { color: colors.textSecondary }]}>
            {t('aboutScreen.buildHash')}: <Text style={styles.bold}>{buildHash}</Text>
          </Text>
          <Text style={[styles.buildText, { color: colors.textSecondary }]}>
            {t('aboutScreen.buildDate')}: <Text style={styles.bold}>{buildDate}</Text>
          </Text>
        </View>
      </View>

      {/* Membros / RMs */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="people" size={24} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('settings.membersTitle')}
          </Text>
        </View>

        <View style={styles.rmContainer}>
          <Text style={[styles.rmSectionTitle, { color: colors.text }]}>
            {t('settings.rmsTitle')}
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text + '99' }]}>RM 1</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>RM554681</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text + '99' }]}>RM 2</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>RM555873</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text + '99' }]}>RM 3</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>RM555161</Text>
          </View>
        </View>

        <View style={styles.spacer} />

        <View style={styles.rmContainer}>
          <Text style={[styles.rmSectionTitle, { color: colors.text }]}>
            {t('settings.namesTitle')}
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text + '99' }]}>1</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              Gusthavo Daniel de Souza
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text + '99' }]}>2</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              Guilherme Damasio Roselli
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text + '99' }]}>3</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              Lucas Miranda Leite
            </Text>
          </View>
        </View>
      </View>

      {/* Conta */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="settings" size={22} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('settings.accountTitle')}
          </Text>
        </View>

        {user ? (
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>
              {isLoading ? t('settings.loggingOut') : t('settings.logoutButton')}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.accent }]}
            onPress={() => router.replace('/auth/login')}
          >
            <Ionicons name="log-in-outline" size={20} color="#000" />
            <Text style={[styles.logoutText, { color: '#000' }]}>
              {t('settings.goToLogin')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text + '80' }]}>
          {t('footer.copyright')}
        </Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://github.com')}>
            <Ionicons name="logo-github" size={24} color={colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://linkedin.com')}>
            <Ionicons name="logo-linkedin" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { alignItems: 'center', marginVertical: 24 },
  logo: { width: 80, height: 80, marginBottom: 12 },
  appName: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  appVersion: { fontSize: 14, opacity: 0.7 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
    }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginLeft: 10 },
  userInfo: { marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  settingDescription: { fontSize: 14, marginTop: 2 },
  infoRow: { paddingVertical: 12 },
  infoLabel: { fontSize: 14, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '500' },
  divider: { height: 1, opacity: 0.1, backgroundColor: '#888' },
  aboutText: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  featureContainer: { marginTop: 8 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureText: { fontSize: 15, marginLeft: 10 },
  rmContainer: { marginTop: 8 },
  rmSectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  spacer: { height: 20 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  logoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  buildInfo: { marginTop: 10 },
  buildText: { fontSize: 13, marginBottom: 4 },
  bold: { fontWeight: 'bold' },
  footer: { marginTop: 8, marginBottom: 24, alignItems: 'center' },
  footerText: { fontSize: 13, marginBottom: 12 },
  socialContainer: { flexDirection: 'row', justifyContent: 'center' },
  socialButton: { marginHorizontal: 10, padding: 8 },
});
