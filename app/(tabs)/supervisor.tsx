import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Image, 
  Platform,
  Dimensions,
  Alert,
  ListRenderItemInfo
} from 'react-native';
import { useMotoContext } from '../contexts/MotoContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import type { Moto } from '../contexts/MotoContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width > 500 ? width / 2 - 24 : width - 32;


type SetorId = 'Setor A' | 'Setor B' | 'Setor C' | 'Setor D';

interface Setor {
  id: SetorId;
  nome: string;
  cor: string;
  icone: string;
}

interface Estatisticas {
  total: number;
  porSetor: Record<SetorId, number>;
}

export default function SupervisorScreen() {
  const { motos } = useMotoContext();
  const { colors, isDark } = useTheme();
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    total: 0,
    porSetor: { 'Setor A': 0, 'Setor B': 0, 'Setor C': 0, 'Setor D': 0 }
  });
  const [setorSelecionado, setSetorSelecionado] = useState<SetorId | null>(null);

  const setores: Setor[] = [
    { id: 'Setor A', nome: 'Setor A', cor: '#3498db', icone: 'grid' },
    { id: 'Setor B', nome: 'Setor B', cor: '#e74c3c', icone: 'grid' },
    { id: 'Setor C', nome: 'Setor C', cor: '#2ecc71', icone: 'grid' },
    { id: 'Setor D', nome: 'Setor D', cor: '#f39c12', icone: 'grid' },
  ];

  const calcularZona = (x: number, y: number): SetorId => {
    const PATIO_WIDTH = 360 * 0.9;
    const PATIO_HEIGHT = PATIO_WIDTH * 0.6;
    if (y < PATIO_HEIGHT / 2) {
      return x < PATIO_WIDTH / 2 ? 'Setor A' : 'Setor B';
    } else {
      return x < PATIO_WIDTH / 2 ? 'Setor C' : 'Setor D';
    }
  };

  useEffect(() => {
    
    const novasEstatisticas: Estatisticas = {
      total: motos.length,
      porSetor: { 'Setor A': 0, 'Setor B': 0, 'Setor C': 0, 'Setor D': 0 }
    };

    motos.forEach(moto => {
      const setor = calcularZona(moto.posX, moto.posY);
      novasEstatisticas.porSetor[setor]++;
    });

    setEstatisticas(novasEstatisticas);
  }, [motos]);

  const handleSetorPress = (setor: SetorId): void => {
    setSetorSelecionado(setor);
  };

  const handleMotoPress = (moto: Moto): void => {
    Alert.alert(
      `Moto ${moto.placa}`,
      `Modelo: ${moto.modelo}\nCor: ${moto.cor}\nLocalização: ${calcularZona(moto.posX, moto.posY)}\n\nHistórico:\n${moto.historico.join('\n')}`,
      [{ text: 'Fechar', style: 'cancel' }]
    );
  };

  const getMotosDoSetor = (setor: SetorId): Moto[] => {
    return motos.filter(moto => calcularZona(moto.posX, moto.posY) === setor);
  };

  const getCorSetor = (setor: SetorId): string => {
    return setores.find(s => s.id === setor)?.cor || colors.accent;
  };

  const renderSetorCard = ({ item }: ListRenderItemInfo<Setor>): React.ReactElement => (
    <TouchableOpacity 
      style={[
        styles.setorCard, 
        { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          borderColor: item.cor + '80',
          borderLeftWidth: 4,
          width: CARD_WIDTH,
        }
      ]}
      onPress={() => handleSetorPress(item.id)}
    >
      <View style={styles.setorHeader}>
        <View style={[styles.setorIconContainer, { backgroundColor: item.cor + '30' }]}>
          <Ionicons name={item.icone as any} size={24} color={item.cor} />
        </View>
        <View style={styles.setorInfo}>
          <Text style={[styles.setorNome, { color: colors.text }]}>{item.nome}</Text>
          <Text style={[styles.setorContagem, { color: colors.text + '99' }]}>
            {estatisticas.porSetor[item.id]} {estatisticas.porSetor[item.id] === 1 ? 'moto' : 'motos'}
          </Text>
        </View>
      </View>
      
      <View style={styles.setorProgress}>
        <View 
          style={[
            styles.setorProgressBar, 
            { 
              backgroundColor: item.cor + '40',
              width: `${(estatisticas.porSetor[item.id] / Math.max(estatisticas.total, 1)) * 100}%` 
            }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );

  const renderMotoItem = ({ item }: ListRenderItemInfo<Moto>): React.ReactElement => (
    <TouchableOpacity 
      style={[
        styles.motoItem, 
        { 
          backgroundColor: colors.card,
          borderLeftColor: getCorSetor(calcularZona(item.posX, item.posY))
        }
      ]}
      onPress={() => handleMotoPress(item)}
    >
      <View style={styles.motoIconContainer}>
        <Image 
          source={require('../../assets/mottu_moto.png')} 
          style={styles.motoIcon} 
          resizeMode="contain"
        />
      </View>
      <View style={styles.motoInfo}>
        <Text style={[styles.motoPlaca, { color: colors.text }]}>{item.placa}</Text>
        <Text style={[styles.motoModelo, { color: colors.text + '99' }]}>{item.modelo} • {item.cor}</Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={colors.text + '60'} 
        style={styles.motoArrow}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.accent }]}>Painel do Supervisor</Text>
          <Text style={[styles.subtitle, { color: colors.text + '99' }]}>
            Monitoramento de motos por setor
          </Text>
        </View>
        <View style={[styles.totalContainer, { backgroundColor: colors.accent + '20' }]}>
          <Text style={[styles.totalLabel, { color: colors.text + '99' }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.accent }]}>{estatisticas.total}</Text>
        </View>
      </View>

      {/* Resumo dos Setores */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Visão Geral dos Setores</Text>
      <FlatList
        data={setores}
        renderItem={renderSetorCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.setoresContainer}
        style={styles.setoresList}
      />

      {/* Mapa Visual */}
      <View style={[styles.mapaContainer, { backgroundColor: colors.card }]}>
        <View style={styles.mapaHeader}>
          <Text style={[styles.mapaTitle, { color: colors.text }]}>Mapa do Pátio</Text>
          <TouchableOpacity 
            style={[styles.mapaButton, { backgroundColor: colors.accent + '20' }]}
            onPress={() => {}}
          >
            <Text style={[styles.mapaButtonText, { color: colors.accent }]}>Ver Mapa</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.mapaGrid}>
          {setores.map(setor => (
            <TouchableOpacity 
              key={setor.id}
              style={[
                styles.mapaSetor,
                { 
                  backgroundColor: setor.cor + '30',
                  borderColor: setor.cor + '60',
                }
              ]}
              onPress={() => handleSetorPress(setor.id)}
            >
              <Text style={[styles.mapaSetorText, { color: colors.text }]}>{setor.nome.split(' ')[1]}</Text>
              <Text style={[styles.mapaSetorCount, { color: setor.cor }]}>{estatisticas.porSetor[setor.id]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista de Motos por Setor */}
      {setorSelecionado ? (
        <View style={styles.motosSection}>
          <View style={styles.motosHeader}>
            <Text style={[styles.motosTitle, { color: colors.text }]}>
              Motos no {setorSelecionado}
            </Text>
            <TouchableOpacity onPress={() => setSetorSelecionado(null)}>
              <Text style={[styles.motosReset, { color: colors.accent }]}>Voltar</Text>
            </TouchableOpacity>
          </View>
          
          {getMotosDoSetor(setorSelecionado).length > 0 ? (
            <FlatList
              data={getMotosDoSetor(setorSelecionado)}
              renderItem={renderMotoItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.motosContainer}
            />
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Ionicons name="alert-circle-outline" size={40} color={colors.text + '60'} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Nenhuma moto encontrada neste setor
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.motosSection}>
          <View style={styles.motosHeader}>
            <Text style={[styles.motosTitle, { color: colors.text }]}>
              Todas as Motos
            </Text>
          </View>
          
          {motos.length > 0 ? (
            <FlatList
              data={motos}
              renderItem={renderMotoItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.motosContainer}
            />
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Ionicons name="alert-circle-outline" size={40} color={colors.text + '60'} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Nenhuma moto cadastrada no sistema
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text + '60' }]}>
          Última atualização: {new Date().toLocaleTimeString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  totalContainer: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  totalLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  setoresContainer: {
    paddingRight: 16,
  },
  setoresList: {
    marginBottom: 24,
  },
  setorCard: {
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  setorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  setorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  setorInfo: {
    flex: 1,
  },
  setorNome: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  setorContagem: {
    fontSize: 14,
  },
  setorProgress: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  setorProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  mapaContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  mapaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapaTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  mapaButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  mapaButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mapaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mapaSetor: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapaSetorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mapaSetorCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  motosSection: {
    marginBottom: 24,
  },
  motosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  motosTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  motosReset: {
    fontSize: 14,
    fontWeight: '500',
  },
  motosContainer: {
    paddingBottom: 8,
  },
  motoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  motoIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  motoIcon: {
    width: 36,
    height: 36,
  },
  motoInfo: {
    flex: 1,
  },
  motoPlaca: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  motoModelo: {
    fontSize: 14,
  },
  motoArrow: {
    marginLeft: 8,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
  },
});
