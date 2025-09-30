import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Motos, Moto } from '../services/motos';         
import useThemeColors from '../hooks/useThemeColors';

export default function MotosList() {
  const { colors } = useThemeColors();
  const [data, setData] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await Motos.list();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data;
    return data.filter(
      (m) =>
        m.placa?.toLowerCase().includes(term) ||
        m.modelo?.toLowerCase().includes(term) ||
        m.status?.toLowerCase().includes(term),
    );
  }, [q, data]);

  const remove = async (id: number) => {
    // confirmação simplificada (pode deixar seu Alert se preferir)
    await Motos.remove(id);
    load();
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator />
        <Text style={{ color: colors.text, marginTop: 8 }}>Carregando motos…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header com busca */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome5 name="search" size={16} color={colors.textSecondary} />
          <TextInput
            placeholder="Buscar por placa, modelo, status…"
            placeholderTextColor={colors.textSecondary}
            value={q}
            onChangeText={setQ}
            style={[styles.searchInput, { color: colors.text }]}
            returnKeyType="search"
          />
        </View>
        <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <FontAwesome5 name="motorcycle" size={28} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Nenhuma moto encontrada</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/moto/[id]', params: { id: String(item.id) } })}
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
            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <FontAwesome5 name="motorcycle" size={18} color={colors.accent} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {item.placa || '—'}
                </Text>
                <Text style={{ color: colors.textSecondary }}>
                  {item.modelo || '—'}
                </Text>
              </View>

              <StatusBadge status={item.status as any} colors={colors} />
            </View>

            <View style={[styles.actions, { borderTopColor: colors.border }]}>
              <Pressable
                onPress={() => router.push({ pathname: '/moto/[id]', params: { id: String(item.id) } })}
                style={[styles.btn, { borderColor: colors.accent }]}
              >
                <FontAwesome5 name="edit" size={14} color={colors.accent} />
                <Text style={[styles.btnText, { color: colors.accent }]}>Editar</Text>
              </Pressable>

              <Pressable
                onPress={() => remove(item.id)}
                style={[styles.btn, { borderColor: colors.error }]}
              >
                <FontAwesome5 name="trash" size={14} color={colors.error} />
                <Text style={[styles.btnText, { color: colors.error }]}>Excluir</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      {/* FAB Cadastrar */}
      <Pressable
        onPress={() => router.push('/cadastrarMoto')}
        style={[styles.fab, { backgroundColor: colors.accent, shadowColor: colors.accent }]}
        android_ripple={{ color: '#00000022', borderless: true }}
      >
        <FontAwesome5 name="plus" size={18} color="#000" />
      </Pressable>
    </View>
  );
}

function StatusBadge({
  status,
  colors,
}: {
  status?: string;
  colors: { [k: string]: string };
}) {
  const meta = (() => {
    switch ((status || '').toUpperCase()) {
      case 'ATIVA':
        return { bg: colors.success, fg: '#000', label: 'ATIVA' };
      case 'MANUTENCAO':
        return { bg: colors.warning, fg: '#000', label: 'MANUTENÇÃO' };
      case 'INATIVA':
        return { bg: colors.error, fg: '#fff', label: 'INATIVA' };
      default:
        return { bg: colors.border, fg: colors.text, label: status || '—' };
    }
  })();

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: meta.bg,
      }}
    >
      <Text style={{ color: meta.fg, fontWeight: '700', fontSize: 12 }}>
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 15 },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#00000008',
  },
  title: { fontSize: 16, fontWeight: '700' },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  btnText: { fontSize: 13, fontWeight: '700' },
  fab: {
    position: 'absolute', right: 20, bottom: 28,
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
  },
});
