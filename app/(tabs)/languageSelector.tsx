import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import NotificationService from '../services/notificationService';

type LangCode = 'pt' | 'en' | 'es';

const languages: { code: LangCode; label: string }[] = [
  { code: 'pt', label: 'Português (Brasil)' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

export default function LanguageSelectorScreen() {
  const [currentLang, setCurrentLang] = useState<LangCode>('pt');
  const [isSaving, setIsSaving] = useState(false);

  // Carrega idioma salvo no AsyncStorage
  useEffect(() => {
    (async () => {
      const stored = (await AsyncStorage.getItem('@language')) as LangCode | null;
      if (stored) {
        setCurrentLang(stored);
      } else {
        setCurrentLang((i18n.language as LangCode) ?? 'pt');
      }
    })();
  }, []);

  const handleChangeLanguage = async (langCode: LangCode) => {
    if (langCode === currentLang) return;

    try {
      setIsSaving(true);

      // 🌍 Troca o idioma
      await i18n.changeLanguage(langCode);
      await AsyncStorage.setItem('@language', langCode);
      setCurrentLang(langCode);

      // 🔔 Dispara notificação visual (sem som)
      await NotificationService.notifyLanguageChanged(langCode);
    } catch (error) {
      console.log('Erro ao trocar idioma', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('languageSelector.title')}</Text>

      {languages.map((lang) => {
        const isActive = lang.code === currentLang;
        return (
          <TouchableOpacity
            key={lang.code}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => handleChangeLanguage(lang.code)}
            disabled={isSaving}
          >
            <Text style={styles.itemText}>{lang.label}</Text>
            {isActive && (
              <Text style={styles.badge}>
                {i18n.t('settings.enabled')}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemActive: {
    borderWidth: 1,
    borderColor: '#00C851',
    backgroundColor: '#E8FFF3',
  },
  itemText: {
    fontSize: 16,
  },
  badge: {
    fontSize: 12,
    color: '#00C851',
    fontWeight: '600',
  },
});
