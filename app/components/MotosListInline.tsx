import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Motos, Moto } from '../services/motos';
import useThemeColors from '../hooks/useThemeColors';

export default function MotosListInline() {
  const { colors } = useThemeColors();
  const [data, setData] = useState<Moto[]>([]);
  const [q, setQ] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const res = await Motos.list();
    setData(res);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data;
    return data.filter(m =>
      m.placa?.toLowerCase().includes(term) ||
      m.modelo?.toLowerCase().includes(term) ||
      m.status?.toLowerCase().includes(term)
    );
  }, [q, data]);

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <FontAwesome5 name="search" size={16} color={colors.textSecondary} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Buscar por placa, modelo, status…"
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => String(i.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/moto/[id]', params: { id: String(item.id) } })}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
            ]}
            android_ripple={{ color: colors.border }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.iconWrap, { backgroundColor: '#00000010' }]}>
                <FontAwesome5 name="motorcycle" size={18} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>{item.placa}</Text>
                <Text style={{ color: colors.textSecondary }}>{item.modelo}</Text>
              </View>
              <Text style={{ fontWeight: '700', color: colors.textSecondary }}>{(item.status || '').toUpperCase()}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 24 }}>
            <FontAwesome5 name="motorcycle" size={20} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Nenhuma moto encontrada</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 44, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700' },
});
