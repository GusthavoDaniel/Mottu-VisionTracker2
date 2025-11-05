// app/auth/login.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleEmailChange = (v: string) => {
    clearError();
    setEmailError(null);
    setEmail(v);
  };

  const handlePasswordChange = (v: string) => {
    clearError();
    setPasswordError(null);
    setPassword(v);
  };

  const doLogin = async () => {
    clearError();

    if (!email.trim()) {
      setEmailError(t('common.requiredField'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(t('common.invalidEmail'));
      return;
    }
    if (!password.trim()) {
      setPasswordError(t('common.requiredField'));
      return;
    }

    const res = await login(email.trim(), password);
    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      setPasswordError(res.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / título */}
        <View style={styles.logoContainer}>
          <Text style={[styles.logoText, { color: colors.text }]}>
            {t('common.appName')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('loginScreen.subtitle')}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('common.email')}
            </Text>
            <TextInput
              style={[
                styles.input,
                emailFocused && styles.inputFocused,
                !!emailError && styles.inputError,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
              value={email}
              onChangeText={handleEmailChange}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder={t('common.emailPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {!!emailError && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {emailError}
              </Text>
            )}
          </View>

          {/* Senha */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('common.password')}
            </Text>
            <TextInput
              style={[
                styles.input,
                passwordFocused && styles.inputFocused,
                !!passwordError && styles.inputError,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
              value={password}
              onChangeText={handlePasswordChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder={t('common.passwordPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {!!passwordError && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {passwordError}
              </Text>
            )}
          </View>

          {/* Erro global */}
          {!!error && (
            <Text
              style={[
                styles.errorText,
                { color: colors.error, textAlign: 'center' },
              ]}
            >
              {error}
            </Text>
          )}

          {/* Botão Login */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.accent, opacity: isLoading ? 0.8 : 1 },
            ]}
            onPress={doLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="#000" />
                <Text style={[styles.buttonText, styles.loadingText]}>
                  {'  '}
                  {t('common.loading')}
                </Text>
              </>
            ) : (
              <Text style={[styles.buttonText, { color: '#000' }]}>
                {t('common.enter')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Link para cadastro */}
          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={[styles.linkText, { color: colors.accent }]}>
              {t('common.noAccount')} {t('common.registerHere')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  logoText: { fontSize: 22, fontWeight: '800' },
  subtitle: { marginTop: 4, fontSize: 14 },
  formContainer: { paddingHorizontal: 20, paddingTop: 8 },

  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },

  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputFocused: { borderWidth: 1.5 },
  inputError: { borderColor: '#ff4d4f' },

  errorText: { fontSize: 13, marginTop: 6 },

  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    flexDirection: 'row',
  },
  buttonText: { fontSize: 16, fontWeight: '700' },
  loadingText: { color: '#000' },

  link: { alignItems: 'center', marginTop: 16 },
  linkText: { fontSize: 14, fontWeight: '600' },
});
