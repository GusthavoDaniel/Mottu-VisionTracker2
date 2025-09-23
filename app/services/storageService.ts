import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface StorageOptions {
  secure?: boolean;
  expiration?: number; // em milissegundos
}

export interface StoredData<T = any> {
  data: T;
  timestamp: number;
  expiration?: number;
}

class StorageService {
  private static instance: StorageService;
  private cache: Map<string, any> = new Map();

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Armazenar dados
  async setItem<T>(
    key: string,
    value: T,
    options: StorageOptions = {}
  ): Promise<boolean> {
    try {
      const storedData: StoredData<T> = {
        data: value,
        timestamp: Date.now(),
        expiration: options.expiration ? Date.now() + options.expiration : undefined,
      };

      const serializedData = JSON.stringify(storedData);

      if (options.secure && Platform.OS !== 'web') {
        await SecureStore.setItemAsync(key, serializedData);
      } else {
        await AsyncStorage.setItem(key, serializedData);
      }

      this.cache.set(key, storedData);
      return true;
    } catch (error) {
      console.error(`Erro ao armazenar ${key}:`, error);
      return false;
    }
  }

  // Recuperar dados
  async getItem<T>(key: string, secure: boolean = false): Promise<T | null> {
    try {
      if (this.cache.has(key)) {
        const cachedData = this.cache.get(key) as StoredData<T>;
        if (this.isDataValid(cachedData)) {
          return cachedData.data;
        } else {
          this.cache.delete(key);
          await this.removeItem(key, secure);
          return null;
        }
      }

      let serializedData: string | null;

      if (secure && Platform.OS !== 'web') {
        serializedData = await SecureStore.getItemAsync(key);
      } else {
        serializedData = await AsyncStorage.getItem(key);
      }

      if (!serializedData) return null;

      const storedData: StoredData<T> = JSON.parse(serializedData);

      if (!this.isDataValid(storedData)) {
        await this.removeItem(key, secure);
        return null;
      }

      this.cache.set(key, storedData);
      return storedData.data;
    } catch (error) {
      console.error(`Erro ao recuperar ${key}:`, error);
      return null;
    }
  }

  // Remover item
  async removeItem(key: string, secure: boolean = false): Promise<boolean> {
    try {
      if (secure && Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
      this.cache.delete(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      return false;
    }
  }

  // Verificar se um item existe
  async hasItem(key: string, secure: boolean = false): Promise<boolean> {
    try {
      const value = await this.getItem(key, secure);
      return value !== null;
    } catch (error) {
      console.error(`Erro ao verificar ${key}:`, error);
      return false;
    }
  }

  // Limpar todos os dados
  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      this.cache.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar storage:', error);
      return false;
    }
  }

  // ✅ Obter todas as chaves (corrigido)
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys(); // retorna readonly string[]
      return [...keys]; // transforma em string[]
    } catch (error) {
      console.error('Erro ao obter chaves:', error);
      return [];
    }
  }

  // Armazenar múltiplos itens
  async setMultiple(items: Array<[string, any, StorageOptions?]>): Promise<boolean> {
    try {
      const promises = items.map(([key, value, options]) =>
        this.setItem(key, value, options || {})
      );
      const results = await Promise.all(promises);
      return results.every(result => result);
    } catch (error) {
      console.error('Erro ao armazenar múltiplos itens:', error);
      return false;
    }
  }

  // Recuperar múltiplos itens
  async getMultiple<T>(keys: string[], secure: boolean = false): Promise<Record<string, T | null>> {
    try {
      const promises = keys.map(async (key) => {
        const value = await this.getItem<T>(key, secure);
        return [key, value] as [string, T | null];
      });
      const results = await Promise.all(promises);
      return Object.fromEntries(results);
    } catch (error) {
      console.error('Erro ao recuperar múltiplos itens:', error);
      return {};
    }
  }

  // Validar expiração
  private isDataValid<T>(storedData: StoredData<T>): boolean {
    if (!storedData.expiration) return true;
    return Date.now() < storedData.expiration;
  }

  // Limpar dados expirados
  async cleanExpiredData(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      const cleanupPromises = keys.map(async (key) => {
        try {
          const serializedData = await AsyncStorage.getItem(key);
          if (serializedData) {
            const storedData: StoredData = JSON.parse(serializedData);
            if (!this.isDataValid(storedData)) {
              await this.removeItem(key);
            }
          }
        } catch {}
      });
      await Promise.all(cleanupPromises);
    } catch (error) {
      console.error('Erro ao limpar dados expirados:', error);
    }
  }

  // Info do storage
  async getStorageInfo(): Promise<{
    totalKeys: number;
    cacheSize: number;
    estimatedSize: string;
  }> {
    try {
      const keys = await this.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) totalSize += value.length;
      }

      return {
        totalKeys: keys.length,
        cacheSize: this.cache.size,
        estimatedSize: this.formatBytes(totalSize),
      };
    } catch (error) {
      console.error('Erro ao obter informações do storage:', error);
      return { totalKeys: 0, cacheSize: 0, estimatedSize: '0 B' };
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async createBackup(): Promise<string | null> {
    try {
      const keys = await this.getAllKeys();
      const backup: Record<string, any> = {};

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) backup[key] = value;
      }

      return JSON.stringify({ timestamp: Date.now(), data: backup });
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return null;
    }
  }

  async restoreBackup(backupData: string): Promise<boolean> {
    try {
      const backup = JSON.parse(backupData);
      const { data } = backup;

      const promises = Object.entries(data).map(([key, value]) =>
        AsyncStorage.setItem(key, value as string)
      );

      await Promise.all(promises);
      this.cache.clear();
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }
}

// Chaves padrão do app
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  MOTOS_CACHE: 'motos_cache',
  FILIAIS_CACHE: 'filiais_cache',
  DASHBOARD_CACHE: 'dashboard_cache',
  FIRST_LAUNCH: 'first_launch',
  APP_VERSION: 'app_version',
  LAST_SYNC: 'last_sync',
  SEARCH_HISTORY: 'search_history',
  FILTER_PREFERENCES: 'filter_preferences',
} as const;

export default StorageService.getInstance();
