import { Text, View, StyleSheet, Button, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";

// Cores (mantendo o padrão Mottu)
const MOTTU_BLACK = "#121212";
const MOTTU_GREEN = "#00EF7F";
const MOTTU_WHITE = "#FFFFFF";
const MOTTU_GRAY = "#333333";
const MOTTU_LIGHT_GRAY = "#A0A0A0";

const MOTOS_STORAGE_KEY = "@MinhasMotos:key";

interface Moto {
  id: string;
  placa: string;
  modelo: string;
  cor: string;
  proprietario: string;
  ultimaLocalizacao: string; // Ex: 'Portaria', 'PatioA', 'Oficina'
  // Campos RFID Simulados
  pontoLeituraRfid?: string;
  horarioUltimaLeitura?: string;
  statusRfid?: string; // Ex: 'Dentro do Pátio', 'Em Movimentação', 'Aguardando Saída'
  historico?: Array<{data: string, local: string, pontoRfid?: string}>;
}

export default function MotoDetalhesScreen() {
  const router = useRouter();
  const { id, timestamp } = useLocalSearchParams(); // timestamp para forçar re-renderização se necessário
  const [moto, setMoto] = useState<Moto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const carregarDetalhesMoto = useCallback(async () => {
    setIsLoading(true);
    if (typeof id === "string") {
      try {
        const motosSalvas = await AsyncStorage.getItem(MOTOS_STORAGE_KEY);
        if (motosSalvas !== null) {
          const motos: Moto[] = JSON.parse(motosSalvas);
          let motoEncontrada = motos.find(m => m.id === id);

          if (motoEncontrada) {
            // Simular dados RFID se não existirem
            if (!motoEncontrada.pontoLeituraRfid) {
              motoEncontrada.pontoLeituraRfid = motoEncontrada.ultimaLocalizacao || "Não registrado";
            }
            if (!motoEncontrada.horarioUltimaLeitura) {
              motoEncontrada.horarioUltimaLeitura = new Date().toLocaleString("pt-BR");
            }
            if (!motoEncontrada.statusRfid) {
              const statusPossiveis = ["Dentro do Pátio", "Em Movimentação", "Aguardando Saída", "Manutenção"];
              motoEncontrada.statusRfid = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)];
            }
            if (!motoEncontrada.historico) {
                motoEncontrada.historico = [{ data: new Date(Date.now() - Math.random()*100000000).toLocaleString("pt-BR"), local: motoEncontrada.ultimaLocalizacao, pontoRfid: motoEncontrada.pontoLeituraRfid }];
            }

            setMoto(motoEncontrada);
          } else {
            setMoto(null);
          }
        } else {
          setMoto(null);
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar os detalhes da moto.");
        setMoto(null);
      }
    }
    setIsLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregarDetalhesMoto();
    }, [carregarDetalhesMoto, timestamp]) // Adicionar timestamp como dependência
  );

  if (isLoading) {
    return <View style={styles.loadingContainer}><Text style={{color: MOTTU_WHITE}}>Carregando detalhes da moto...</Text></View>;
  }

  if (!moto) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Moto não encontrada", headerStyle: { backgroundColor: MOTTU_BLACK }, headerTintColor: MOTTU_WHITE }} />
        <Text style={{color: MOTTU_WHITE, textAlign: "center", marginTop: 20}}>Moto não encontrada.</Text>
        <Button title="Voltar para Lista" onPress={() => router.replace("/(tabs)/motos")} color={MOTTU_GREEN}/>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: `Moto ${moto.placa}`, headerStyle: { backgroundColor: MOTTU_BLACK }, headerTintColor: MOTTU_WHITE, headerTitleStyle: { color: MOTTU_WHITE } }} />
      <Text style={styles.mainTitle}>Detalhes da Moto</Text>
      
      <View style={styles.card}>
        <View style={styles.detailRow}>
            <FontAwesome5 name="id-card" size={18} color={MOTTU_GREEN} style={styles.iconStyle} />
            <Text style={styles.label}>Placa:</Text>
            <Text style={styles.value}>{moto.placa}</Text>
        </View>
        <View style={styles.detailRow}>
            <FontAwesome5 name="motorcycle" size={18} color={MOTTU_GREEN} style={styles.iconStyle} />
            <Text style={styles.label}>Modelo:</Text>
            <Text style={styles.value}>{moto.modelo}</Text>
        </View>
        <View style={styles.detailRow}>
            <FontAwesome5 name="palette" size={18} color={MOTTU_GREEN} style={styles.iconStyle} />
            <Text style={styles.label}>Cor:</Text>
            <Text style={styles.value}>{moto.cor}</Text>
        </View>
        <View style={styles.detailRow}>
            <FontAwesome5 name="user" size={18} color={MOTTU_GREEN} style={styles.iconStyle} />
            <Text style={styles.label}>Proprietário:</Text>
            <Text style={styles.value}>{moto.proprietario}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Informações de Rastreamento (RFID Simulado)</Text>
      <View style={styles.card}>
        <View style={styles.detailRow}>
            <FontAwesome5 name="map-marker-alt" size={18} color={MOTTU_GREEN} style={styles.iconStyle} />
            <Text style={styles.label}>Última Localização:</Text>
            <Text style={styles.value}>{moto.ultimaLocalizacao}</Text>
        </View>
        <View style={styles.detailRow}>
            <FontAwesome5 name="broadcast-tower" size={18} color={MOTTU_GREEN} style={styles.iconStyle} />
            <Text style={styles.label}>Ponto de Leitura RFID:</Text>
            <Text style={styles.value}>{moto.pontoLeituraRfid}</Text>
        </View>
        <View style={styles.detailRow}>
            <FontAwesome5 name="clock" size={18} color={MOTTU_GREEN} style={styles.iconStyle} />
            <Text style={styles.label}>Horário da Leitura:</Text>
            <Text style={styles.value}>{moto.horarioUltimaLeitura}</Text>
        </View>
        <View style={styles.detailRow}>
            <FontAwesome5 name="traffic-light" size={18} color={MOTTU_GREEN} style={styles.iconStyle} />
            <Text style={styles.label}>Status RFID:</Text>
            <Text style={styles.value}>{moto.statusRfid}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Histórico de Localizações (Simulado)</Text>
      <View style={styles.card}>
        {moto.historico && moto.historico.length > 0 ? (
          moto.historico.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyText}><Text style={styles.boldText}>{item.data}:</Text> {item.local} (Ponto RFID: {item.pontoRfid || item.local})</Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>Nenhum histórico de localização disponível.</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={styles.buttonPrimary}
            onPress={() => router.push(`/cadastrarMoto?edit=true&id=${moto.id}`)}
        >
            <FontAwesome5 name="edit" size={18} color={MOTTU_BLACK} />
            <Text style={styles.buttonPrimaryText}>Editar Moto</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={styles.buttonSecondary}
            onPress={() => router.back()}
        >
            <FontAwesome5 name="arrow-left" size={18} color={MOTTU_GREEN} />
            <Text style={styles.buttonSecondaryText}>Voltar para Lista</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOTTU_BLACK,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: MOTTU_BLACK,
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: MOTTU_WHITE,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: MOTTU_GRAY,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: MOTTU_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconStyle: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: MOTTU_LIGHT_GRAY,
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: MOTTU_WHITE,
    flexShrink: 1, 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: MOTTU_WHITE,
    marginTop: 10,
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: MOTTU_BLACK, // Slightly different background for history items
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: MOTTU_GREEN,
  },
  historyText: {
    fontSize: 14,
    color: MOTTU_LIGHT_GRAY,
  },
  boldText:{
    fontWeight: "bold",
    color: MOTTU_WHITE,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: MOTTU_GREEN,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 15,
  },
  buttonPrimaryText: {
    fontSize: 17,
    color: MOTTU_BLACK,
    fontWeight: "bold",
    marginLeft: 10,
  },
  buttonSecondary: {
    borderColor: MOTTU_GREEN,
    borderWidth: 2,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonSecondaryText: {
    fontSize: 17,
    color: MOTTU_GREEN,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

