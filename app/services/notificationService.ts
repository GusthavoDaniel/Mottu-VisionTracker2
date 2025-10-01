import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,   
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
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

  
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permissão de notificação negada');
        return false;
      }

      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Mottu VisionTracker',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#00A859',
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões de notificação:', error);
      return false;
    }
  }

  
  async showNotification(notification: NotificationData): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryId,
        },
        trigger: null,
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
      return null;
    }
  }

  
  async scheduleNotification(
    notification: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryId,
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return null;
    }
  }

  
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }

  
  async notifyMotoCreated(moto: { placa: string; modelo: string }): Promise<void> {
    await this.showNotification({
      title: '🏍️ Moto Cadastrada!',
      body: `${moto.modelo} (${moto.placa}) foi cadastrada com sucesso.`,
      data: { type: 'moto_created', moto },
      categoryId: 'moto_actions',
    });
  }

  async notifyMotoUpdated(moto: { placa: string; modelo: string }): Promise<void> {
    await this.showNotification({
      title: '✏️ Moto Atualizada!',
      body: `${moto.modelo} (${moto.placa}) foi atualizada com sucesso.`,
      data: { type: 'moto_updated', moto },
      categoryId: 'moto_actions',
    });
  }

  async notifyMotoDeleted(moto: { placa: string; modelo: string }): Promise<void> {
    await this.showNotification({
      title: '🗑️ Moto Removida!',
      body: `${moto.modelo} (${moto.placa}) foi removida do sistema.`,
      data: { type: 'moto_deleted', moto },
      categoryId: 'moto_actions',
    });
  }

  async notifyRFIDAlert(alert: { type: string; message: string }): Promise<void> {
    const icons: { [key: string]: string } = {
      sem_leitura: '⚠️',
      bateria_baixa: '🔋',
      manutencao: '🔧',
      fora_area: '📍',
    };

    await this.showNotification({
      title: `${icons[alert.type] || '🚨'} Alerta RFID`,
      body: alert.message,
      data: { type: 'rfid_alert', alert },
      categoryId: 'rfid_alerts',
    });
  }

  async notifyLoginSuccess(userName: string): Promise<void> {
    await this.showNotification({
      title: '👋 Bem-vindo!',
      body: `Olá ${userName}, você fez login com sucesso.`,
      data: { type: 'login_success', userName },
      categoryId: 'auth_actions',
    });
  }

  async notifyDataSync(): Promise<void> {
    await this.showNotification({
      title: '🔄 Dados Sincronizados',
      body: 'Seus dados foram sincronizados com sucesso.',
      data: { type: 'data_sync' },
      categoryId: 'system_info',
    });
  }

  async notifyOfflineMode(): Promise<void> {
    await this.showNotification({
      title: '📱 Modo Offline',
      body: 'Você está trabalhando offline. Os dados serão sincronizados quando a conexão for restabelecida.',
      data: { type: 'offline_mode' },
      categoryId: 'system_info',
    });
  }

  
  async setupNotificationCategories(): Promise<void> {
    try {
      await Notifications.setNotificationCategoryAsync('moto_actions', [
        {
          identifier: 'view_moto',
          buttonTitle: 'Ver Detalhes',
          options: { opensAppToForeground: true },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('rfid_alerts', [
        {
          identifier: 'view_alert',
          buttonTitle: 'Ver Alerta',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'dismiss_alert',
          buttonTitle: 'Dispensar',
          options: { opensAppToForeground: false },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('auth_actions', []);
      await Notifications.setNotificationCategoryAsync('system_info', []);
    } catch (error) {
      console.error('Erro ao configurar categorias de notificação:', error);
    }
  }

  
  async getPushToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', 
      });
      return token.data;
    } catch (error) {
      console.error('Erro ao obter push token:', error);
      return null;
    }
  }

  
  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Erro ao limpar badge:', error);
    }
  }
}

export default NotificationService.getInstance();
