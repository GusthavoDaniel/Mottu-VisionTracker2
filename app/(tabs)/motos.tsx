import { useCallback, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Button, Alert } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Motos, Moto } from '../services/motos';

export default function MotosList(){
  const [data, setData] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setError(undefined);
      setLoading(true);
      const res = await Motos.list();
      setData(res);
    } catch (e:any) {
      setError(e.message || 'Falha ao carregar motos');
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

  const remove = (id:number) => Alert.alert('Excluir', 'Confirmar exclusão?', [
    { text: 'Cancelar' },
    { text: 'Excluir', style: 'destructive', onPress: async () => {
      await Motos.remove(id);
      load();
    }}
  ]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      {error && <Text style={{ color:'red' }}>{error}</Text>}
      <Link href="/cadastrarMoto">+ Cadastrar Moto</Link>

      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={{ padding:12, borderWidth:1, borderRadius:8, marginBottom:8 }}>
            <Text>{item.placa} — {item.modelo} — {item.status}</Text>
            <View style={{ flexDirection:'row', gap:12, marginTop:8 }}>
              <Link href={{ pathname: '/moto/[id]', params: { id: String(item.id) } }}>Editar</Link>
              <Button title="Excluir" onPress={() => remove(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}
