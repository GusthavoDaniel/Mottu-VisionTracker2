import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router, useFocusEffect } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Motos } from '../services/motos';

// Paleta Mottu
const MOTTU_BLACK = '#121212';
const MOTTU_GREEN = '#00EF7F';
const MOTTU_WHITE = '#FFFFFF';
const MOTTU_GRAY = '#333333';
const MOTTU_LIGHT_GRAY = '#A0A0A0';

type MotoView = {
  id: number;
  placa: string;
  modelo: string;
  status: string;
  cor: string;
  proprietario: string;
  ultimaLocalizacao: string;
  pontoLeituraRfid?: string;
  horarioUltimaLeitura?: string;
  statusRfid?: string;
  historico?: Array<{ data: string; local: string; pontoRfid?: string }>;
};

export default function MotoDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [moto, setMoto] = useState<MotoView | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const m = await Motos.get(Number(id));

      const agora = new Date().toLocaleString('pt-BR');
      setMoto({
        id: m.id,
        placa: m.placa,
        modelo: m.modelo,
        status: m.status,
        cor: 'Preta',
        proprietario: '—',
        ultimaLocalizacao: 'Pátio A',
        pontoLeituraRfid: 'Portaria 1',
        horarioUltimaLeitura: agora,
        statusRfid: 'Dentro do Pátio',
        historico: [{ data: agora, local: 'Pátio A', pontoRfid: 'Portaria 1' }],
      });
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Não foi possível carregar a moto da API.');
      setMoto(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={MOTTU_GREEN} />
        <Text style={{ color: MOTTU_WHITE, marginTop: 8 }}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!moto) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Moto não encontrada', headerStyle: { backgroundColor: MOTTU_BLACK }, headerTintColor: MOTTU_WHITE }} />
        <Text style={{ color: MOTTU_WHITE, textAlign: 'center', marginTop: 20 }}>Moto não encontrada.</Text>
        <TouchableOpacity style={[styles.buttonSecondary, { marginTop: 16 }]} onPress={() => router.replace('/motos')}>
          <FontAwesome5 name="arrow-left" size={18} color={MOTTU_GREEN} />
          <Text style={styles.buttonSecondaryText}>Voltar para Lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: `Moto ${moto.placa}`,
          headerStyle: { backgroundColor: MOTTU_BLACK },
          headerTintColor: MOTTU_WHITE,
          headerTitleStyle: { color: MOTTU_WHITE },
        }}
      />

      <Text style={styles.mainTitle}>Detalhes da Moto</Text>

      <View style={styles.card}>
        <Detail icon="id-card" label="Placa" value={moto.placa} />
        <Detail icon="motorcycle" label="Modelo" value={moto.modelo} />
        <Detail icon="info-circle" label="Status" value={moto.status} />
        <Detail icon="palette" label="Cor" value={moto.cor} />
        <Detail icon="user" label="Proprietário" value={moto.proprietario} />
      </View>

      <Text style={styles.sectionTitle}>Informações de Rastreamento (RFID Simulado)</Text>
      <View style={styles.card}>
        <Detail icon="map-marker-alt" label="Última Localização" value={moto.ultimaLocalizacao} />
        <Detail icon="broadcast-tower" label="Ponto de Leitura RFID" value={moto.pontoLeituraRfid || '—'} />
        <Detail icon="clock" label="Horário da Leitura" value={moto.horarioUltimaLeitura || '—'} />
        <Detail icon="traffic-light" label="Status RFID" value={moto.statusRfid || '—'} />
      </View>

      <Text style={styles.sectionTitle}>Histórico de Localizações (Simulado)</Text>
      <View style={styles.card}>
        {moto.historico?.length ? (
          moto.historico.map((h, i) => (
            <View key={i} style={styles.historyItem}>
              <Text style={styles.historyText}>
                <Text style={styles.boldText}>{h.data}:</Text> {h.local} (RFID: {h.pontoRfid || h.local})
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>Sem histórico.</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.push({ pathname: '/moto/[id]', params: { id: String(moto.id) } })}
        >
          <FontAwesome5 name="edit" size={18} color={MOTTU_BLACK} />
          <Text style={styles.buttonPrimaryText}>Editar Moto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={18} color={MOTTU_GREEN} />
          <Text style={styles.buttonSecondaryText}>Voltar para Lista</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Detail({ icon, label, value }: { icon: any; label: string; value?: string }) {
  return (
    <View style={styles.detailRow}>
      <FontAwesome5 name={icon} size={18} color={MOTTU_GREEN} style={styles.iconStyle} />
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MOTTU_BLACK, paddingHorizontal: 15, paddingVertical: 20 },
  loadingContainer: { flex: 1, backgroundColor: MOTTU_BLACK, justifyContent: 'center', alignItems: 'center' },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: MOTTU_WHITE, textAlign: 'center', marginBottom: 20 },
  card: {
    backgroundColor: MOTTU_GRAY, borderRadius: 10, padding: 15, marginBottom: 20,
    shadowColor: MOTTU_GREEN, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconStyle: { marginRight: 10 },
  label: { fontSize: 16, fontWeight: 'bold', color: MOTTU_LIGHT_GRAY, marginRight: 8 },
  value: { fontSize: 16, color: MOTTU_WHITE, flexShrink: 1 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: MOTTU_WHITE, marginTop: 10, marginBottom: 10 },
  historyItem: { backgroundColor: MOTTU_BLACK, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: MOTTU_GREEN },
  historyText: { fontSize: 14, color: MOTTU_LIGHT_GRAY },
  boldText: { fontWeight: 'bold', color: MOTTU_WHITE },
  buttonContainer: { marginTop: 10, marginBottom: 20 },
  buttonPrimary: { backgroundColor: MOTTU_GREEN, paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 15 },
  buttonPrimaryText: { fontSize: 17, color: MOTTU_BLACK, fontWeight: 'bold', marginLeft: 10 },
  buttonSecondary: { borderColor: MOTTU_GREEN, borderWidth: 2, paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  buttonSecondaryText: { fontSize: 17, color: MOTTU_GREEN, fontWeight: 'bold', marginLeft: 10 },
});
