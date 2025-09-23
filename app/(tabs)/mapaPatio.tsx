import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  PanResponder,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useMotoContext } from '../contexts/MotoContext';
import MotoMarker from '../../components/MotoMarker';
import ZonaMarker from '../../components/ZonaMarker';
import { useRouter } from 'expo-router';
import useThemeColors from '../hooks/useThemeColors';

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
            Alert.alert('Moto Movida', `Nova posição: ${newX.toFixed(0)}, ${newY.toFixed(0)}\nZona: ${calcularZona(newX, newY)}`);
          },
        });
      }
    });
  }, [motos]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Mapa Interativo do Pátio</Text>

      <ImageBackground
        source={require('../assets/patio_background.png')}
        style={[
          styles.patio,
          {
            borderColor: colors.accent,
          },
        ]}
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
            onPress={() => Alert.alert('Detalhes da Moto', `Placa: ${moto.placa}`)}
            {...panResponders.current[moto.id]?.panHandlers}
          />
        ))}
      </ImageBackground>

      <TouchableOpacity
        style={[styles.botaoCadastro, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/cadastrarMoto')}
      >
        <Text style={[styles.botaoTexto, { color: colors.background }]}>+ Cadastrar Moto</Text>
      </TouchableOpacity>
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
  botaoCadastro: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  botaoTexto: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
