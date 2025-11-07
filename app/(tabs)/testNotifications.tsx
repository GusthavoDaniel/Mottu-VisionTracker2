// app/(tabs)/testNotifications.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Stack } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

import notificationService, {
  registerForPushNotificationsAsync,
  sendTestNotification,
} from '../services/notificationService';

export default function TestNotificationsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loadingToken, setLoadingToken] = useState(false);
  const [sending, setSending] = useState(false);

  const handleGetToken = async () => {
    setLoadingToken(true);
    const tkn = await registerForPushNotificationsAsync();
    setToken(tkn);
    setLoadingToken(false);
  };

  const handleCopyToken = async () => {
    if (!token) return;
    await Clipboard.setStringAsync(token);
  };

  const sendLocal = async () => {
    setSending(true);

    // Se não preencher nada, usamos um cenário padrão traduzível (data_sync)
    if (!title.trim() && !body.trim()) {
      await sendTestNotification('data_sync_title', 'data_sync_body');
      setSending(false);
      return;
    }

    // Se o usuário preencheu, enviamos o texto “cru” mesmo
    await sendTestNotification(title.trim(), body.trim());
    setSending(false);
  };

  const sendScenarioMotoCreated = async () => {
    setSending(true);
    await notificationService.notifyMotoCreated({
      modelo: 'CG 160',
      placa: 'ABC1D23',
    });
    setSending(false);
  };

  const sendScenarioLogin = async () => {
    setSending(true);
    await notificationService.notifyLoginSuccess('Supervisor João');
    setSending(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Stack.Screen
        options={{
          title: t('notifications.screenTitle'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      {/* TOKEN */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('notifications.yourExpoPushToken')}
        </Text>

        <View style={[styles.tokenBox, { borderColor: colors.border }]}>
          <Text style={{ color: colors.textSecondary, flex: 1 }} numberOfLines={2}>
            {token || t('notifications.noTokenFound')}
          </Text>

          <TouchableOpacity
            style={[styles.smallButton, { borderColor: colors.accent }]}
            onPress={handleGetToken}
          >
            {loadingToken ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Text style={[styles.smallButtonText, { color: colors.accent }]}>
                {t('notifications.getToken')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {token && (
          <TouchableOpacity onPress={handleCopyToken} style={{ marginTop: 6 }}>
            <Text style={{ color: colors.accent, fontSize: 12 }}>
              (toque para copiar token)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FORM MANUAL (opcional) */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {t('notifications.notificationTitle')}
        </Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder={t('notifications.notificationTitle')}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.cardTitle, { color: colors.text, marginTop: 10 }]}>
          {t('notifications.notificationBody')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              color: colors.text,
              height: 80,
              textAlignVertical: 'top',
            },
          ]}
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
          placeholder={t('notifications.notificationBody')}
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: colors.accent }]}
          onPress={sendLocal}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={[styles.bigButtonText, { color: '#000' }]}>
              {t('notifications.sendLocalNotification')}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* CENÁRIOS REALISTAS */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Cenários rápidos (para o vídeo)
        </Text>

        <TouchableOpacity
          style={[styles.scenarioButton, { borderColor: colors.accent }]}
          onPress={sendScenarioMotoCreated}
        >
          <Text style={[styles.scenarioText, { color: colors.accent }]}>
            🏍️ Nova moto cadastrada
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.scenarioButton, { borderColor: colors.accent }]}
          onPress={sendScenarioLogin}
        >
          <Text style={[styles.scenarioText, { color: colors.accent }]}>
            👋 Login realizado com sucesso
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  tokenBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  smallButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  smallButtonText: { fontSize: 12, fontWeight: '600' },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  bigButton: {
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bigButtonText: { fontSize: 15, fontWeight: '700' },
  scenarioButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  scenarioText: { fontWeight: '600', fontSize: 14 },
});
