// app/services/notificationService.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Handler global – apenas campos suportados pelo SDK
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,

    // ✅ Adiciona compatibilidade com novos tipos do iOS 17+
    shouldShowBanner: true,
    shouldShowList: true,
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

  // ---- Permissions / Channel ------------------------------------------------
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
        // Garante um canal com alta prioridade
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

  // ---- Immediate / Scheduled -----------------------------------------------
  async showNotification(notification: NotificationData): Promise<string | null> {
    try {
      const ok = await this.requestPermissions();
      if (!ok) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data ?? {},
          ...(notification.categoryId ? { categoryIdentifier: notification.categoryId } : {}),
        },
        // trigger null => dispara imediatamente
        trigger: null,
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
          ...(notification.categoryId ? { categoryIdentifier: notification.categoryId } : {}),
        },
        trigger,
      });

      return notificationId;
    } catch {
      return null;
    }
  }

  // ---- Cancel ---------------------------------------------------------------
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

  // ---- Domain helpers (mantém chaves i18n no title/body) --------------------
  async notifyMotoCreated(moto: { placa: string; modelo: string }): Promise<void> {
    await this.showNotification({
      title: 'moto_created_title',
      body: `moto_created_body|${moto.modelo}|${moto.placa}`,
      data: { type: 'moto_created', moto },
      categoryId: 'moto_actions',
    });
  }

  async notifyMotoUpdated(moto: { placa: string; modelo: string }): Promise<void> {
    await this.showNotification({
      title: 'moto_updated_title',
      body: `moto_updated_body|${moto.modelo}|${moto.placa}`,
      data: { type: 'moto_updated', moto },
      categoryId: 'moto_actions',
    });
  }

  async notifyMotoDeleted(moto: { placa: string; modelo: string }): Promise<void> {
    await this.showNotification({
      title: 'moto_deleted_title',
      body: `moto_deleted_body|${moto.modelo}|${moto.placa}`,
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

    const titleKey = `rfid_alert_title_${alert.type}`; // chave i18n
    await this.showNotification({
      title: `${icons[alert.type] ?? '🚨'} ${titleKey}`,
      body: alert.message,
      data: { type: 'rfid_alert', alert },
      categoryId: 'rfid_alerts',
    });
  }

  async notifyLoginSuccess(userName: string): Promise<void> {
    await this.showNotification({
      title: 'login_success_title',
      body: `login_success_body|${userName}`,
      data: { type: 'login_success', userName },
      categoryId: 'auth_actions',
    });
  }

  async notifyDataSync(): Promise<void> {
    await this.showNotification({
      title: 'data_sync_title',
      body: 'data_sync_body',
      data: { type: 'data_sync' },
      categoryId: 'system_info',
    });
  }

  async notifyOfflineMode(): Promise<void> {
    await this.showNotification({
      title: 'offline_mode_title',
      body: 'offline_mode_body',
      data: { type: 'offline_mode' },
      categoryId: 'system_info',
    });
  }

  // ---- Categories (botões) --------------------------------------------------
  async setupNotificationCategories(): Promise<void> {
    try {
      await Notifications.setNotificationCategoryAsync('moto_actions', [
        {
          identifier: 'view_moto',
          buttonTitle: 'notification_button_view_details',
          options: { opensAppToForeground: true },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('rfid_alerts', [
        {
          identifier: 'view_alert',
          buttonTitle: 'notification_button_view_alert',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'dismiss_alert',
          buttonTitle: 'notification_button_dismiss',
          options: { opensAppToForeground: false },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('auth_actions', []);
      await Notifications.setNotificationCategoryAsync('system_info', []);
    } catch {}
  }

  // ---- Token ----------------------------------------------------------------
  async getPushToken(): Promise<string | null> {
    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ||
        Constants.easConfig?.projectId || // fallback
        undefined;

      const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
      return token.data;
    } catch {
      return null;
    }
  }

  // ---- Badge ----------------------------------------------------------------
  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch {}
  }

  // ---- Listeners ------------------------------------------------------------
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  removeNotificationSubscription(subscription: Notifications.Subscription) {
    Notifications.removeNotificationSubscription(subscription);
  }
}

export default NotificationService.getInstance();
