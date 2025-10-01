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

export default function ConfiguracoesScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const { user, logout, isLoading } = useAuth();

  const openLink = (url: string) => Linking.openURL(url);

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

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
        <Text style={[styles.appName, { color: colors.accent }]}>Mottu VisionTracker</Text>
        <Text style={[styles.appVersion, { color: colors.text }]}>Versão 1.0.0</Text>
      </View>

      {/* Seção do Usuário (se logado) */}
      {user && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={24} color={colors.accent} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Usuário</Text>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Nome</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{user.name}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{user.email}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Seção de Tema */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="color-palette" size={24} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Aparência</Text>
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Tema Escuro</Text>
            <Text style={[styles.settingDescription, { color: colors.text + '99' }]}>
              {isDark ? 'Ativado' : 'Desativado'}
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

      {/* Seção Sobre o App */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={24} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Sobre o App</Text>
        </View>

        <Text style={[styles.aboutText, { color: colors.text }]}>
          Este é um protótipo para mapeamento de pátio da Mottu, permitindo visualizar e gerenciar a
          localização das motos no pátio de forma interativa.
        </Text>

        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="map" size={22} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.text }]}>Mapa Interativo</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="locate" size={22} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.text }]}>Localização de Motos</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="grid" size={22} color={colors.accent} />
            <Text style={[styles.featureText, { color: colors.text }]}>Setores Organizados</Text>
          </View>
        </View>
      </View>

      {/* Campos para RMs e Nomes */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="people" size={24} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Registros de Membros</Text>
        </View>

        <View style={styles.rmContainer}>
          <Text style={[styles.rmSectionTitle, { color: colors.text }]}>RMs</Text>

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
          <Text style={[styles.rmSectionTitle, { color: colors.text }]}>Nomes</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text + '99' }]}>Nome 1</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>Gusthavo Daniel de Souza</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text + '99' }]}>Nome 2</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>Guilherme Damasio Roselli</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text + '99' }]}>Nome 3</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>Lucas Miranda Leite</Text>
          </View>
        </View>
      </View>

      {/* Conta / Ações */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="settings" size={22} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Conta</Text>
        </View>

        {user ? (
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>{isLoading ? 'Saindo...' : 'Sair da Conta'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.accent }]}
            onPress={() => router.replace('/auth/login')}
          >
            <Ionicons name="log-in-outline" size={20} color="#000" />
            <Text style={[styles.logoutText, { color: '#000' }]}>Ir para Login</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text + '80' }]}>
          © 2025 Mottu Rotas - Todos os direitos reservados
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

  footer: { marginTop: 8, marginBottom: 24, alignItems: 'center' },
  footerText: { fontSize: 13, marginBottom: 12 },
  socialContainer: { flexDirection: 'row', justifyContent: 'center' },
  socialButton: { marginHorizontal: 10, padding: 8 },
});
