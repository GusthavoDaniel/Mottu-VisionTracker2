import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import useThemeColors from '../hooks/useThemeColors';

export default function RegistrarEventoRfidScreen() {
  const [eventos, setEventos] = useState<{ id: string; timestamp: string }[]>([]);
  const { colors } = useThemeColors();
  const { t } = useTranslation();

  const simularLeituraRfid = () => {
    const novoEvento = {
      id: `RFID-${Math.floor(Math.random() * 100000)}`,
      timestamp: new Date().toLocaleString(),
    };

    setEventos((prev) => [novoEvento, ...prev]);
    Alert.alert(
      t('registrarRfid.alertTitle'),
      t('registrarRfid.alertMessage', { id: novoEvento.id })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.accent }]}>
        {t('registrarRfid.title')}
      </Text>

      <Button
        title={`📡 ${t('registrarRfid.readTagButton')}`}
        onPress={simularLeituraRfid}
        color={colors.accent}
      />

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.timestamp}
        renderItem={({ item }) => (
          <Text style={[styles.item, { color: colors.text }]}>
            🔖 {item.id} - {item.timestamp}
          </Text>
        )}
        style={{ marginTop: 20 }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            {t('registrarRfid.noEvents')}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: { paddingVertical: 6, fontSize: 14 },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 15 },
});
