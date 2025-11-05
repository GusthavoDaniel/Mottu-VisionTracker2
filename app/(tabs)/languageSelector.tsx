
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import useThemeColors from '../../app/hooks/useThemeColors';
import i18n from '../../app/i18n'; // Importar a instância do i18n

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
];

export default function LanguageSelectorScreen() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    // Atualiza o estado local se o idioma do i18n mudar externamente
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      setSelectedLanguage(langCode);
      Alert.alert(t('common.success'), t('languageSelector.languageChangedSuccessfully', { lang: langCode }));
      router.back(); // Volta para a tela anterior após a mudança
    } catch (error) {
      console.error('Erro ao mudar idioma:', error);
      Alert.alert(t('common.error'), t('languageSelector.languageChangeError'));
    }
  };

  const renderItem = ({ item }: { item: { code: string; label: string } }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        { borderColor: colors.border, backgroundColor: colors.card },
        selectedLanguage === item.code && { backgroundColor: colors.accent, borderColor: colors.accent },
      ]}
      onPress={() => changeLanguage(item.code)}
    >
      <Text
        style={[
          styles.languageText,
          { color: colors.text },
          selectedLanguage === item.code && { color: colors.background },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('languageSelector.title')}</Text>
      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  languageItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

