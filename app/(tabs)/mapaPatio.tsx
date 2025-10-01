import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  PanResponder,
  Alert,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

import { useMotoContext } from '../contexts/MotoContext';
import useThemeColors from '../hooks/useThemeColors';
import { Motos, Moto as MotoAPI } from '../services/motos';

import MotoMarker from '../../components/MotoMarker';
import ZonaMarker from '../../components/ZonaMarker';

const { width } = Dimensions.get('window');
const PATIO_WIDTH = width * 0.9;
const PATIO_HEIGHT = PATIO_WIDTH * 0.6;

const zonas = [
  { nome: 'Setor A', x: 0, y: 0 },
  { nome: 'Setor B', x: PATIO_WIDTH / 2, y: 0 },
  { nome: 'Setor C', x: 0, y: PATIO_HEIGHT / 2 },
  { nome: 'Setor D', x: PATIO_WIDTH / 2, y: PATIO_HEIGHT / 2 },
];

export default function MapaPatioScreen() {
  const { motos = [], moverMoto } = useMotoContext();
  const panResponders = useRef<{ [key: string]: any }>({});
  const router = useRouter();
  const { colors } = useThemeColors();

  
  const [view, setView] = useState<'mapa' | 'lista'>('mapa');

  
  const [motosApi, setMotosApi] = useState<MotoAPI[]>([]);
  const [q, setQ] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const calcularZona = (x: number, y: number): string => {
    if (y < PATIO_HEIGHT / 2) {
      return x < PATIO_WIDTH / 2 ? 'Setor A' : 'Setor B';
    } else {
      return x < PATIO_WIDTH / 2 ? 'Setor C' : 'Setor D';
    }
  };

  
  useEffect(() => {
    motos.forEach((moto) => {
      if (!panResponders.current[moto.id]) {
        panResponders.current[moto.id] = PanResponder.create({
          onMoveShouldSetPanResponder: () => true,
          onPanResponderMove: (_, gesture) => {
            moto.pan.setValue({ x: moto.posX + gesture.dx, y: moto.posY + gesture.dy });
          },
          onPanResponderRelease: (_, gesture) => {
            const newX = Math.max(0, Math.min(moto.posX + gesture.dx, PATIO_WIDTH - 60));
            const newY = Math.max(0, Math.min(moto.posY + gesture.dy, PATIO_HEIGHT - 60));
            moverMoto(moto.id, newX, newY);
            Alert.alert(
              'Moto Movida',
              `Nova posição: ${newX.toFixed(0)}, ${newY.toFixed(0)}\nZona: ${calcularZona(newX, newY)}`
            );
          },
        });
      }
    });
  }, [motos, moverMoto]);

 
  const loadList = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await Motos.list();
      setMotosApi(res);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'lista') loadList();
  }, [view, loadList]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadList();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return motosApi;
    return motosApi.filter(
      m =>
        m.placa?.toLowerCase().includes(term) ||
        m.modelo?.toLowerCase().includes(term) ||
        m.status?.toLowerCase().includes(term)
    );
  }, [q, motosApi]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Mapa do Pátio</Text>

      {/* Toggle Mapa | Lista */}
      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setView('mapa')}
          style={[
            styles.toggleBtn,
            {
              backgroundColor: view === 'mapa' ? colors.accent : colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.toggleText, { color: view === 'mapa' ? '#000' : colors.text }]}>Mapa</Text>
        </Pressable>

        <Pressable
          onPress={() => setView('lista')}
          style={[
            styles.toggleBtn,
            {
              backgroundColor: view === 'lista' ? colors.accent : colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.toggleText, { color: view === 'lista' ? '#000' : colors.text }]}>Lista</Text>
        </Pressable>
      </View>

      {/* Conteúdo */}
      {view === 'mapa' ? (
        <>
          <ImageBackground
            source={require('../assets/patio_background.png')}
            style={[styles.patio, { borderColor: colors.accent }]}
            resizeMode="cover"
          >
            {zonas.map((zona) => (
              <ZonaMarker
                key={zona.nome}
                nome={zona.nome}
                x={zona.x}
                y={zona.y}
                width={PATIO_WIDTH / 2}
                height={PATIO_HEIGHT / 2}
              />
            ))}

            {motos.map((moto) => (
              <MotoMarker
                key={moto.id}
                pan={moto.pan}
                placa={moto.placa}
                onPress={() =>
                  Alert.alert('Detalhes da Moto', `Placa: ${moto.placa}`)
                }
                {...panResponders.current[moto.id]?.panHandlers}
              />
            ))}
          </ImageBackground>

          <TouchableOpacity
            style={[styles.botaoCadastro, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/cadastrarMoto')}
            activeOpacity={0.85}
          >
            <Text style={[styles.botaoTexto, { color: colors.background }]}>+ Cadastrar Moto</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ flex: 1, width: '100%', paddingHorizontal: 16 }}>
          {/* Busca */}
          <View
            style={[
              styles.searchBox,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <FontAwesome5 name="search" size={16} color={colors.textSecondary} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Buscar por placa, modelo, status…"
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.text }]}
              returnKeyType="search"
            />
          </View>

          {/* Lista */}
          <FlatList
            data={filtered}
            keyExtractor={(i) => String(i.id)}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', padding: 24 }}>
                <FontAwesome5 name="motorcycle" size={20} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
                  {loadingList ? 'Carregando…' : 'Nenhuma moto encontrada'}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({ pathname: '/moto/[id]', params: { id: String(item.id) } })
                }
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                android_ripple={{ color: colors.border }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[styles.iconWrap, { backgroundColor: '#00000010' }]}>
                    <FontAwesome5 name="motorcycle" size={18} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>
                      {item.placa}
                    </Text>
                    <Text style={{ color: colors.textSecondary }}>{item.modelo}</Text>
                  </View>
                  <Text style={{ fontWeight: '700', color: colors.textSecondary }}>
                    {(item.status || '').toUpperCase()}
                  </Text>
                </View>
              </Pressable>
            )}
          />

          <TouchableOpacity
            style={[styles.botaoCadastro, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/cadastrarMoto')}
            activeOpacity={0.85}
          >
            <Text style={[styles.botaoTexto, { color: colors.background }]}>+ Cadastrar Moto</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 20 },
  title: { fontSize: 20, marginBottom: 10, fontWeight: 'bold' },

  
  patio: {
    width: PATIO_WIDTH,
    height: PATIO_HEIGHT,
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },

  
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    width: '90%',
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  toggleText: { fontWeight: '700' },

  
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: { fontSize: 16, fontWeight: '700' },

  
  botaoCadastro: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  botaoTexto: { fontWeight: 'bold', fontSize: 16 },
});
