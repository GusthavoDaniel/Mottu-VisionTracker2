import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import notificationService from '../services/notificationService';

export interface UseNotificationsReturn {
  showNotification: (title: string, body: string, data?: any) => Promise<void>;
  notifyMotoCreated: (moto: { placa: string; modelo: string }) => Promise<void>;
  notifyMotoUpdated: (moto: { placa: string; modelo: string }) => Promise<void>;
  notifyMotoDeleted: (moto: { placa: string; modelo: string }) => Promise<void>;
  notifyRFIDAlert: (alert: { type: string; message: string }) => Promise<void>;
  notifyLoginSuccess: (userName: string) => Promise<void>;
  notifyDataSync: () => Promise<void>;
  notifyOfflineMode: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    const setupNotifications = async () => {
      await notificationService.requestPermissions();
      await notificationService.setupNotificationCategories();
    };

    setupNotifications();

    
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notificação recebida:', notification);
      });

    
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Resposta da notificação:', response);
        const { data } = response.notification.request.content;
        handleNotificationResponse(data);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const handleNotificationResponse = (data: any) => {
    if (!data || !data.type) return;

    switch (data.type) {
      case 'moto_created':
      case 'moto_updated':
        console.log('Navegar para motos:', data.moto);
        break;
      case 'rfid_alert':
        console.log('Navegar para alertas:', data.alert);
        break;
      case 'login_success':
        console.log('Navegar para dashboard');
        break;
      default:
        console.log('Tipo de notificação não reconhecido:', data.type);
    }
  };

  const showNotification = async (title: string, body: string, data?: any) => {
    await notificationService.showNotification({ title, body, data });
  };

  const notifyMotoCreated   = async (moto: { placa: string; modelo: string }) => notificationService.notifyMotoCreated(moto);
  const notifyMotoUpdated   = async (moto: { placa: string; modelo: string }) => notificationService.notifyMotoUpdated(moto);
  const notifyMotoDeleted   = async (moto: { placa: string; modelo: string }) => notificationService.notifyMotoDeleted(moto);
  const notifyRFIDAlert     = async (alert: { type: string; message: string }) => notificationService.notifyRFIDAlert(alert);
  const notifyLoginSuccess  = async (userName: string) => notificationService.notifyLoginSuccess(userName);
  const notifyDataSync      = async () => notificationService.notifyDataSync();
  const notifyOfflineMode   = async () => notificationService.notifyOfflineMode();

  return {
    showNotification,
    notifyMotoCreated,
    notifyMotoUpdated,
    notifyMotoDeleted,
    notifyRFIDAlert,
    notifyLoginSuccess,
    notifyDataSync,
    notifyOfflineMode,
  };
};
