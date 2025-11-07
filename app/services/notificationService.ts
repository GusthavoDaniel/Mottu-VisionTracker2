// app/services/notificationService.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import i18n from '../i18n';

// Handler global – tipo novo do Expo (SDK 51+)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  categoryId?: string;
}

class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // ---------------------------------------------------------------------------
  // Permissões / Canal Android
  // ---------------------------------------------------------------------------
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return false;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Mottu VisionTracker',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#00A859',
        });
      }
      return true;
    } catch {
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Disparo imediato / agendado
  // ---------------------------------------------------------------------------
  async showNotification(notification: NotificationData): Promise<string | null> {
    try {
      const ok = await this.requestPermissions();
      if (!ok) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data ?? {},
          ...(notification.categoryId
            ? { categoryIdentifier: notification.categoryId }
            : {}),
        },
        trigger: null, // dispara imediatamente
      });

      return notificationId;
    } catch {
      return null;
    }
  }

  async scheduleNotification(
    notification: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string | null> {
    try {
      const ok = await this.requestPermissions();
      if (!ok) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data ?? {},
          ...(notification.categoryId
            ? { categoryIdentifier: notification.categoryId }
            : {}),
        },
        trigger,
      });

      return notificationId;
    } catch {
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Cancelamento
  // ---------------------------------------------------------------------------
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch {}
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {}
  }

  // ---------------------------------------------------------------------------
  // Tokens / badge
  // ---------------------------------------------------------------------------
  async getPushToken(): Promise<string | null> {
    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ||
        Constants.easConfig?.projectId ||
        undefined;

      const token = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      return token.data;
    } catch {
      return null;
    }
  }

  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch {}
  }

  // ---------------------------------------------------------------------------
  // Categorias (botões) – opcional
  // ---------------------------------------------------------------------------
  async setupNotificationCategories(): Promise<void> {
    try {
      await Notifications.setNotificationCategoryAsync('moto_actions', [
        {
          identifier: 'view_moto',
          buttonTitle: i18n.t(
            'notificationService.notification_button_view_details'
          ),
          options: { opensAppToForeground: true },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('rfid_alerts', [
        {
          identifier: 'view_alert',
          buttonTitle: i18n.t(
            'notificationService.notification_button_view_alert'
          ),
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'dismiss_alert',
          buttonTitle: i18n.t(
            'notificationService.notification_button_dismiss'
          ),
          options: { opensAppToForeground: false },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('auth_actions', []);
      await Notifications.setNotificationCategoryAsync('system_info', []);
    } catch {}
  }

  // ---------------------------------------------------------------------------
  // Cenários de domínio (usados no app)
  // ---------------------------------------------------------------------------
  async notifyMotoCreated(moto: { placa: string; modelo: string }): Promise<void> {
    const title = i18n.t('notificationService.moto_created_title');
    const body = i18n.t('notificationService.moto_created_body', {
      1: moto.modelo,
      2: moto.placa,
    });

    await this.showNotification({
      title,
      body,
      data: { type: 'moto_created', moto },
      categoryId: 'moto_actions',
    });
  }

  async notifyMotoUpdated(moto: { placa: string; modelo: string }): Promise<void> {
    const title = i18n.t('notificationService.moto_updated_title');
    const body = i18n.t('notificationService.moto_updated_body', {
      1: moto.modelo,
      2: moto.placa,
    });

    await this.showNotification({
      title,
      body,
      data: { type: 'moto_updated', moto },
      categoryId: 'moto_actions',
    });
  }

  async notifyMotoDeleted(moto: { placa: string; modelo: string }): Promise<void> {
    const title = i18n.t('notificationService.moto_deleted_title');
    const body = i18n.t('notificationService.moto_deleted_body', {
      1: moto.modelo,
      2: moto.placa,
    });

    await this.showNotification({
      title,
      body,
      data: { type: 'moto_deleted', moto },
      categoryId: 'moto_actions',
    });
  }

  async notifyRFIDAlert(alert: { type: string; message: string }): Promise<void> {
    const icons: Record<string, string> = {
      sem_leitura: '⚠️',
      bateria_baixa: '🔋',
      manutencao: '🔧',
      fora_area: '📍',
    };

    const titleKey = `rfid_alert_title_${alert.type}`; // dentro de notificationService.*
    const title = `${icons[alert.type] ?? '🚨'} ${i18n.t(
      `notificationService.${titleKey}`
    )}`;

    await this.showNotification({
      title,
      body: alert.message,
      data: { type: 'rfid_alert', alert },
      categoryId: 'rfid_alerts',
    });
  }

  async notifyLoginSuccess(userName: string): Promise<void> {
    const title = i18n.t('notificationService.login_success_title');
    const body = i18n.t('notificationService.login_success_body', { 1: userName });

    await this.showNotification({
      title,
      body,
      data: { type: 'login_success', userName },
      categoryId: 'auth_actions',
    });
  }

  async notifyDataSync(): Promise<void> {
    const title = i18n.t('notificationService.data_sync_title');
    const body = i18n.t('notificationService.data_sync_body');

    await this.showNotification({
      title,
      body,
      data: { type: 'data_sync' },
      categoryId: 'system_info',
    });
  }

  async notifyOfflineMode(): Promise<void> {
    const title = i18n.t('notificationService.offline_mode_title');
    const body = i18n.t('notificationService.offline_mode_body');

    await this.showNotification({
      title,
      body,
      data: { type: 'offline_mode' },
      categoryId: 'system_info',
    });
  }
}

// instancia singleton usada no app todo
const notificationService = NotificationService.getInstance();
export default notificationService;

// -----------------------------------------------------------------------------
// Funções auxiliares exportadas para a tela de testes
// -----------------------------------------------------------------------------

// usado em TestNotificationsScreen para obter o token
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  const ok = await notificationService.requestPermissions();
  if (!ok) return null;
  return await notificationService.getPushToken();
}

// usado em TestNotificationsScreen para disparar um push “genérico”
export async function sendTestNotification(
  titleKey: string,
  bodyKey: string,
  params?: Record<string, string | number>
): Promise<void> {
  const title = i18n.t(`notificationService.${titleKey}`, params);
  const body = i18n.t(`notificationService.${bodyKey}`, params);

  await notificationService.showNotification({
    title,
    body,
    data: { type: 'test', titleKey, bodyKey, params },
    categoryId: 'system_info',
  });
}
