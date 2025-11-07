// app/languageSelector.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext'; // 👈 IMPORT CERTO

const LANGS = [
  { code: 'pt', label: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export default function LanguageSelectorScreen() {
  const { i18n, t } = useTranslation();
  const { colors, isDark } = useTheme(); // 👈 AGORA EXISTE :)

  const current = React.useMemo(() => {
    const lang = i18n.language || 'pt';
    if (lang.startsWith('pt')) return 'pt';
    if (lang.startsWith('es')) return 'es';
    return 'en';
  }, [i18n.language]);

  const changeLanguage = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      // se quiser, pode exibir um toast/alert usando:
      // t('languageSelector.languageChangedSuccessfully', { lang: code })
    } catch (e) {
      // tratar erro se quiser
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: t('languageSelector.title'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />

      {LANGS.map((lang) => {
        const selected = current === lang.code;
        return (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.row,
              {
                borderColor: selected ? colors.accent : colors.border,
                backgroundColor: selected ? colors.card : colors.background,
              },
            ]}
            onPress={() => changeLanguage(lang.code)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.flag,
                { opacity: selected ? 1 : 0.8 },
              ]}
            >
              {lang.flag}
            </Text>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.label,
                  {
                    color: selected
                      ? (isDark ? '#000' : '#121212')
                      : colors.text,
                  },
                ]}
              >
                {lang.label}
              </Text>

              {selected && (
                <Text style={[styles.selectedText, { color: colors.textSecondary }]}>
                  {t('settings.enabled')}
                </Text>
              )}
            </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  flag: {
    fontSize: 26,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedText: {
    fontSize: 12,
    marginTop: 2,
  },
});
