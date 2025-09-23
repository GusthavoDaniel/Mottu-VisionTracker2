import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import useThemeColors from '../hooks/useThemeColors';

const exemplosAlertas = [
  '⚠️ Moto fora do setor permitido!',
  '🚫 Parada suspeita detectada!',
  '📡 Perda de sinal da tag RFID!',
  '🔒 Moto parada em zona restrita!',
  '⚙️ Verificação obrigatória em 5 minutos!',
];

export default function HistoricoAlertasScreen() {
  const { colors } = useThemeColors();
  const [alertas, setAlertas] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertas((prev) => [exemplosAlertas[index % exemplosAlertas.length], ...prev]);
      setIndex((i) => i + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: 'red' }]}>Histórico de Alertas</Text>
      {alertas.length === 0 ? (
        <Text style={[styles.empty, { color: colors.text }]}>Nenhum alerta ativo.</Text>
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Text style={[styles.alertItem, { color: colors.text, borderBottomColor: colors.border }]}>
              {item}
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
  },
  alertItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
});
