import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const { login, isLoading, error, clearError } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error, clearError]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
    if (error) clearError();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
    if (error) clearError();
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    if (email.trim() && !validateEmail(email.trim())) {
      setEmailError('Formato de email inválido');
    }
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    if (password.trim() && password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
    }
  };

  const handleLogin = async () => {
    if (isLoading) return;

    // Limpar erros anteriores
    setEmailError('');
    setPasswordError('');
    
    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      hasError = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Formato de email inválido');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      hasError = true;
    }

    if (hasError) return;
    
    try {
      const result = await login(email.trim().toLowerCase(), password);
      
      if (result.success) {
        router.replace('/(tabs)');
      } else if (result.error) {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante o login. Tente novamente.');
    }
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    formContainer: {
      marginBottom: 30,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
    },
    inputFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    loginButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    loginButtonDisabled: {
      backgroundColor: colors.textSecondary,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    registerText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    registerLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Mottu VisionTracker</Text>
          <Text style={styles.subtitle}>
            Sistema de Gestão Inteligente de Pátio
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                emailFocused && styles.inputFocused,
                emailError && styles.inputError
              ]}
              value={email}
              onChangeText={handleEmailChange}
              onFocus={() => setEmailFocused(true)}
              onBlur={handleEmailBlur}
              placeholder="Digite seu email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[
                styles.input,
                passwordFocused && styles.inputFocused,
                passwordError && styles.inputError
              ]}
              value={password}
              onChangeText={handlePasswordChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={handlePasswordBlur}
              placeholder="Digite sua senha"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              editable={!isLoading}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.loadingText}>Entrando...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={navigateToRegister} disabled={isLoading}>
            <Text style={styles.registerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

