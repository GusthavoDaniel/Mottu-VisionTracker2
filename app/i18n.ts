import i18n, { type LanguageDetectorAsyncModule, type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: es },
};

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('user-language');
        if (stored) {
          callback(stored);
          return;
        }

        const device = (Localization.getLocales?.()[0]?.languageCode || 'en').slice(0, 2);
        callback(['pt', 'en', 'es'].includes(device) ? device : 'en');
      } catch (e) {
        console.error('Erro ao detectar idioma:', e);
        callback('en');
      }
    })(); // <-- executa a função async dentro
  },
  init: () => {},
  cacheUserLanguage: (lang) => {
    (async () => {
      try {
        await AsyncStorage.setItem('user-language', lang);
      } catch (e) {
        console.error('Erro ao salvar idioma:', e);
      }
    })();
  },
};

const options: InitOptions = {
  resources,
  fallbackLng: 'en',
  debug: __DEV__,
  interpolation: { escapeValue: false },
  // ✅ nesta versão do i18next, use "v4" ou remova a opção
  compatibilityJSON: 'v4',
  // Evita suspense no RN
  react: { useSuspense: false } as any,
};

i18n.use(languageDetector).use(initReactI18next).init(options);

export default i18n;

export async function setAppLanguage(lang: 'pt' | 'en' | 'es') {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem('user-language', lang);
}