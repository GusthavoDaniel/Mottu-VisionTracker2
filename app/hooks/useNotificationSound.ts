import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

/**
 * Hook responsável por configurar notificações e permitir tocar um som manualmente.
 * Usa o pacote expo-av para reproduzir um som local simples.
 */
export function useNotificationSound() {
  useEffect(() => {
    const configureNotifications = async () => {
      // Configura o handler global
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // Configura canal Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          sound: 'default',
        });
      }
    };

    configureNotifications();
  }, []);

  // 🔊 Função para tocar um som curto (ex: feedback ao trocar idioma)
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/notification.mp3') // coloque seu som aqui
      );
      await sound.playAsync();
    } catch (error) {
      console.warn('[useNotificationSound] Erro ao tocar som:', error);
    }
  };

  return { playSound };
}
