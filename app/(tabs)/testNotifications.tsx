import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import NotificationService from '../../app/services/notificationService';
import useThemeColors from '../../app/hooks/useThemeColors';

export default function TestNotificationsScreen() {
  const { colors } = useThemeColors();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notificationTitle, setNotificationTitle] = useState('Teste de Notificação');
  const [notificationBody, setNotificationBody] = useState('Esta é uma notificação de teste.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAndSetToken = async () => {
      setLoading(true);
      const token = await NotificationService.getPushToken();
      setPushToken(token);
      setLoading(false);
    };
    getAndSetToken();

    const subscription = NotificationService.addNotificationReceivedListener((notification) => {
      Alert.alert(
        'Notificação Recebida (Foreground)',
        `Título: ${notification.request.content.title}\nCorpo: ${notification.request.content.body}`
      );
    });

    const responseSubscription = NotificationService.addNotificationResponseReceivedListener((response) => {
      Alert.alert(
        'Notificação Interagida',
        `Ação: ${response.actionIdentifier}\nPayload: ${JSON.stringify(response.notification.request.content.data)}`
      );
    });

    return () => {
      NotificationService.removeNotificationSubscription(subscription);
      NotificationService.removeNotificationSubscription(responseSubscription);
    };
  }, []);

  const handleSendNotification = async () => {
    setLoading(true);
    const success = await NotificationService.showNotification({
      title: notificationTitle,
      body: notificationBody,
      data: { customData: 'Hello from app' },
    });
    setLoading(false);
    if (success) {
      Alert.alert('Sucesso', 'Notificação enviada com sucesso!');
    } else {
      Alert.alert('Erro', 'Falha ao enviar notificação. Verifique as permissões.');
    }
  };

  const handleRequestPermissions = async () => {
    setLoading(true);
    const granted = await NotificationService.requestPermissions();
    setLoading(false);
    if (granted) {
      Alert.alert('Permissão Concedida', 'As permissões de notificação foram concedidas.');
      const token = await NotificationService.getPushToken();
      setPushToken(token);
    } else {
      Alert.alert('Permissão Negada', 'As permissões de notificação foram negadas.');
    }
  };

  const handleClearBadge = async () => {
    await NotificationService.clearBadge();
    Alert.alert('Badge Limpo', 'O contador de notificações foi limpo.');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Teste de Notificações Push</Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Seu Expo Push Token:</Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Text selectable style={[styles.tokenText, { color: colors.textSecondary }]}>
            {pushToken || 'Nenhum token encontrado.'}
          </Text>
        )}
        <Button
          title="Obter/Atualizar Token"
          onPress={handleRequestPermissions}
          color={colors.accent}
          disabled={loading}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Título da Notificação:</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          value={notificationTitle}
          onChangeText={setNotificationTitle}
          placeholder="Título"
          placeholderTextColor={colors.textSecondary}
          editable={!loading}
        />

        <Text style={[styles.label, { color: colors.text }]}>Corpo da Notificação:</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          value={notificationBody}
          onChangeText={setNotificationBody}
          placeholder="Corpo da mensagem"
          placeholderTextColor={colors.textSecondary}
          multiline
          editable={!loading}
        />

        <Button
          title="Enviar Notificação Local"
          onPress={handleSendNotification}
          color={colors.primary}
          disabled={loading}
        />
      </View>

      <View style={styles.section}>
        {/* 🔧 trocado de colors.secondary -> colors.accent */}
        <Button
          title="Limpar Contador (Badge)"
          onPress={handleClearBadge}
          color={colors.accent}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 30, padding: 15, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.05)' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  tokenText: { fontSize: 14, marginBottom: 10, padding: 10, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.03)' },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10, minHeight: 40 },
});
