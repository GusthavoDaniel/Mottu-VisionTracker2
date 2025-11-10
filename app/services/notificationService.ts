// app/services/notificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Handler global — 🔔 com som
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true, // ✅ som ativo
    shouldSetBadge: false,
  }),
});

// Configura canal Android
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default', // ✅ usa som padrão do sistema
  });
}

async function ensureNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// 🏍️ Notificação: Moto cadastrada
export async function notifyMotoCreated(payload: { modelo: string; placa: string }) {
  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏍️ Moto cadastrada!',
      body: `A moto ${payload.modelo} (${payload.placa}) foi cadastrada com sucesso.`,
      sound: 'default',
      data: { type: 'moto_created', ...payload },
      ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
    },
    trigger: null,
  });
}

// 🌍 Notificação: Idioma alterado
export async function notifyLanguageChanged(langCode: string) {
  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) return;

  const langName =
    langCode === 'pt'
      ? 'Português (Brasil)'
      : langCode === 'en'
      ? 'English'
      : 'Español';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌐 Idioma alterado',
      body: `O idioma do aplicativo foi alterado para ${langName}.`,
      sound: 'default', // ✅ toca som
      data: { type: 'language_changed', langCode },
      ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
    },
    trigger: null,
  });
}

// Exporta tudo padronizado
const NotificationService = {
  notifyMotoCreated,
  notifyLanguageChanged, // ✅ adicionada aqui
};

export default NotificationService;
