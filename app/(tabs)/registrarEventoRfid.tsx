import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert } from 'react-native';
import useThemeColors from '../hooks/useThemeColors';

export default function RegistrarEventoRfidScreen() {
  const [eventos, setEventos] = useState<{ id: string; timestamp: string }[]>([]);
  const { colors } = useThemeColors();

  const simularLeituraRfid = () => {
    const novoEvento = {
      id: `RFID-${Math.floor(Math.random() * 100000)}`,
      timestamp: new Date().toLocaleString(),
    };

    setEventos((prev) => [novoEvento, ...prev]);
    Alert.alert('Tag RFID Lida', `ID: ${novoEvento.id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulação de Leitura RFID</Text>
      <Button title="📡 Ler Tag RFID" onPress={simularLeituraRfid} color="#00EF7F" />
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.timestamp}
        renderItem={({ item }) => (
          <Text style={styles.item}>🔖 {item.id} - {item.timestamp}</Text>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#00EF7F', marginBottom: 20 },
  item: { color: '#FFF', paddingVertical: 6 },
});
