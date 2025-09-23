import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import useThemeColors from '../hooks/useThemeColors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

// Interface para filial
interface Filial {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  pais: string;
  totalMotos: number;
  disponivel: number;
  manutencao: number;
  alugada: number;
  imagem: string;
  coordenadas: {
    latitude: number;
    longitude: number;
  };
}


const filiaisSimuladas: Filial[] = [
  {
    id: 'fil001',
    nome: 'Filial São Paulo - Centro',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    totalMotos: 120,
    disponivel: 78,
    manutencao: 12,
    alugada: 30,
    imagem: 'https://via.placeholder.com/300x150?text=Filial+SP+Centro',
    coordenadas: {
      latitude: -23.5505,
      longitude: -46.6333
    }
  },
  {
    id: 'fil002',
    nome: 'Filial Rio de Janeiro',
    endereco: 'Av. Atlântica, 500',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    pais: 'Brasil',
    totalMotos: 85,
    disponivel: 42,
    manutencao: 8,
    alugada: 35,
    imagem: 'https://via.placeholder.com/300x150?text=Filial+RJ',
    coordenadas: {
      latitude: -22.9068,
      longitude: -43.1729
    }
  },
  {
    id: 'fil003',
    nome: 'Filial Belo Horizonte',
    endereco: 'Av. Afonso Pena, 1500',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    pais: 'Brasil',
    totalMotos: 65,
    disponivel: 40,
    manutencao: 5,
    alugada: 20,
    imagem: 'https://via.placeholder.com/300x150?text=Filial+BH',
    coordenadas: {
      latitude: -19.9167,
      longitude: -43.9345
    }
  },
  {
    id: 'fil004',
    nome: 'Filial Brasília',
    endereco: 'SCS Quadra 8, Bloco B-50',
    cidade: 'Brasília',
    estado: 'DF',
    pais: 'Brasil',
    totalMotos: 50,
    disponivel: 32,
    manutencao: 3,
    alugada: 15,
    imagem: 'https://via.placeholder.com/300x150?text=Filial+Brasilia',
    coordenadas: {
      latitude: -15.7801,
      longitude: -47.9292
    }
  },
  {
    id: 'fil005',
    nome: 'Filial Cidade do México',
    endereco: 'Paseo de la Reforma, 222',
    cidade: 'Cidade do México',
    estado: 'CDMX',
    pais: 'México',
    totalMotos: 90,
    disponivel: 55,
    manutencao: 10,
    alugada: 25,
    imagem: 'https://via.placeholder.com/300x150?text=Filial+Mexico',
    coordenadas: {
      latitude: 19.4326,
      longitude: -99.1332
    }
  }
];

export default function GerenciamentoFiliaisScreen() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const [filiais, setFiliais] = useState<Filial[]>(filiaisSimuladas);
  const [filtroPais, setFiltroPais] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filialSelecionada, setFilialSelecionada] = useState<Filial | null>(null);

  
  const filiaisFiltradas = filiais.filter(filial => {
    const matchPais = filtroPais ? filial.pais.toLowerCase().includes(filtroPais.toLowerCase()) : true;
    const matchEstado = filtroEstado ? filial.estado.toLowerCase().includes(filtroEstado.toLowerCase()) : true;
    return matchPais && matchEstado;
  });

  
  const selecionarFilial = (filial: Filial) => {
    setFilialSelecionada(filial);
  };

  
  const limparSelecao = () => {
    setFilialSelecionada(null);
  };

  
  const renderFilialCard = (filial: Filial) => {
    const disponibilidadePercentual = (filial.disponivel / filial.totalMotos) * 100;
    const corDisponibilidade = disponibilidadePercentual > 70 ? colors.success :
                              disponibilidadePercentual > 40 ? colors.warning :
                              colors.error;
    
    return (
      <TouchableOpacity
        key={filial.id}
        style={[styles.filialCard, { backgroundColor: colors.card }]}
        onPress={() => selecionarFilial(filial)}
      >
        <View style={styles.filialHeader}>
          <Text style={[styles.filialNome, { color: colors.text }]}>{filial.nome}</Text>
          <View style={[styles.filialPais, { backgroundColor: colors.primary }]}>
            <Text style={[styles.filialPaisText, { color: colors.background }]}>
              {filial.pais}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.filialEndereco, { color: colors.textSecondary }]}>
          {filial.endereco}, {filial.cidade} - {filial.estado}
        </Text>
        
        <View style={styles.filialStats}>
          <View style={styles.filialStat}>
            <Text style={[styles.filialStatValue, { color: colors.text }]}>
              {filial.totalMotos}
            </Text>
            <Text style={[styles.filialStatLabel, { color: colors.textSecondary }]}>
              Total
            </Text>
          </View>
          
          <View style={styles.filialStat}>
            <Text style={[styles.filialStatValue, { color: corDisponibilidade }]}>
              {filial.disponivel}
            </Text>
            <Text style={[styles.filialStatLabel, { color: colors.textSecondary }]}>
              Disponível
            </Text>
          </View>
          
          <View style={styles.filialStat}>
            <Text style={[styles.filialStatValue, { color: colors.warning }]}>
              {filial.manutencao}
            </Text>
            <Text style={[styles.filialStatLabel, { color: colors.textSecondary }]}>
              Manutenção
            </Text>
          </View>
          
          <View style={styles.filialStat}>
            <Text style={[styles.filialStatValue, { color: colors.accent }]}>
              {filial.alugada}
            </Text>
            <Text style={[styles.filialStatLabel, { color: colors.textSecondary }]}>
              Alugada
            </Text>
          </View>
        </View>
        
        <View style={styles.filialFooter}>
          <FontAwesome5 name="map-marker-alt" size={16} color={colors.primary} />
          <Text style={[styles.filialFooterText, { color: colors.textSecondary }]}>
            Ver no mapa
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Renderiza detalhes da filial selecionada
  const renderFilialDetalhes = () => {
    if (!filialSelecionada) return null;
    
    const disponibilidadePercentual = (filialSelecionada.disponivel / filialSelecionada.totalMotos) * 100;
    
    return (
      <View style={[styles.filialDetalhes, { backgroundColor: colors.card }]}>
        <View style={styles.filialDetalhesHeader}>
          <Text style={[styles.filialDetalhesTitle, { color: colors.text }]}>
            Detalhes da Filial
          </Text>
          <TouchableOpacity onPress={limparSelecao}>
            <FontAwesome5 name="times" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.filialDetalhesNome, { color: colors.text }]}>
          {filialSelecionada.nome}
        </Text>
        
        <Text style={[styles.filialDetalhesEndereco, { color: colors.textSecondary }]}>
          {filialSelecionada.endereco}, {filialSelecionada.cidade} - {filialSelecionada.estado}, {filialSelecionada.pais}
        </Text>
        
        <View style={styles.filialDetalhesImageContainer}>
          <Image
            source={{ uri: filialSelecionada.imagem }}
            style={styles.filialDetalhesImage}
            resizeMode="cover"
          />
          <View style={[styles.filialDetalhesMapOverlay, { backgroundColor: colors.primary }]}>
            <Text style={[styles.filialDetalhesMapText, { color: colors.background }]}>
              Ver Mapa Completo
            </Text>
          </View>
        </View>
        
        <Text style={[styles.filialDetalhesSectionTitle, { color: colors.text }]}>
          Estatísticas da Frota
        </Text>
        
        <View style={styles.filialDetalhesStats}>
          <View style={styles.filialDetalhesStat}>
            <Text style={[styles.filialDetalhesStatValue, { color: colors.text }]}>
              {filialSelecionada.totalMotos}
            </Text>
            <Text style={[styles.filialDetalhesStatLabel, { color: colors.textSecondary }]}>
              Total de Motos
            </Text>
          </View>
          
          <View style={styles.filialDetalhesStat}>
            <Text style={[styles.filialDetalhesStatValue, { color: colors.success }]}>
              {disponibilidadePercentual.toFixed(0)}%
            </Text>
            <Text style={[styles.filialDetalhesStatLabel, { color: colors.textSecondary }]}>
              Taxa de Disponibilidade
            </Text>
          </View>
        </View>
        
        <View style={styles.filialDetalhesProgressContainer}>
          <View style={[styles.filialDetalhesProgressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.filialDetalhesProgressFill,
                { 
                  width: `${(filialSelecionada.disponivel / filialSelecionada.totalMotos) * 100}%`,
                  backgroundColor: colors.success
                }
              ]}
            />
            <View
              style={[
                styles.filialDetalhesProgressFill,
                { 
                  width: `${(filialSelecionada.manutencao / filialSelecionada.totalMotos) * 100}%`,
                  backgroundColor: colors.warning,
                  left: `${(filialSelecionada.disponivel / filialSelecionada.totalMotos) * 100}%`
                }
              ]}
            />
            <View
              style={[
                styles.filialDetalhesProgressFill,
                { 
                  width: `${(filialSelecionada.alugada / filialSelecionada.totalMotos) * 100}%`,
                  backgroundColor: colors.accent,
                  left: `${((filialSelecionada.disponivel + filialSelecionada.manutencao) / filialSelecionada.totalMotos) * 100}%`
                }
              ]}
            />
          </View>
          
          <View style={styles.filialDetalhesProgressLegend}>
            <View style={styles.filialDetalhesProgressLegendItem}>
              <View style={[styles.filialDetalhesProgressLegendColor, { backgroundColor: colors.success }]} />
              <Text style={[styles.filialDetalhesProgressLegendText, { color: colors.textSecondary }]}>
                Disponível ({filialSelecionada.disponivel})
              </Text>
            </View>
            
            <View style={styles.filialDetalhesProgressLegendItem}>
              <View style={[styles.filialDetalhesProgressLegendColor, { backgroundColor: colors.warning }]} />
              <Text style={[styles.filialDetalhesProgressLegendText, { color: colors.textSecondary }]}>
                Manutenção ({filialSelecionada.manutencao})
              </Text>
            </View>
            
            <View style={styles.filialDetalhesProgressLegendItem}>
              <View style={[styles.filialDetalhesProgressLegendColor, { backgroundColor: colors.accent }]} />
              <Text style={[styles.filialDetalhesProgressLegendText, { color: colors.textSecondary }]}>
                Alugada ({filialSelecionada.alugada})
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.filialDetalhesButtons}>
          <TouchableOpacity
            style={[styles.filialDetalhesButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/mapaPatio')}
          >
            <Text style={[styles.filialDetalhesButtonText, { color: colors.background }]}>
              Ver Pátio
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filialDetalhesButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/monitoramentoIoT')}
          >
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Gerenciamento de Filiais' }} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Rede de Filiais
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Gerencie todas as filiais da Mottu
        </Text>
      </View>
      
      <View style={[styles.filtrosContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.filtrosTitle, { color: colors.text }]}>
          Filtros
        </Text>
        
        <View style={styles.filtrosRow}>
          <View style={styles.filtroItem}>
            <Text style={[styles.filtroLabel, { color: colors.textSecondary }]}>
              País
            </Text>
            <TextInput
              style={[styles.filtroInput, { backgroundColor: colors.background, color: colors.text }]}
              value={filtroPais}
              onChangeText={setFiltroPais}
              placeholder="Filtrar por país"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.filtroItem}>
            <Text style={[styles.filtroLabel, { color: colors.textSecondary }]}>
              Estado
            </Text>
            <TextInput
              style={[styles.filtroInput, { backgroundColor: colors.background, color: colors.text }]}
              value={filtroEstado}
              onChangeText={setFiltroEstado}
              placeholder="Filtrar por estado"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
        
        <View style={styles.filtrosStats}>
          <Text style={[styles.filtrosStatsText, { color: colors.textSecondary }]}>
            Exibindo {filiaisFiltradas.length} de {filiais.length} filiais
          </Text>
        </View>
      </View>
      
      {filialSelecionada ? (
        renderFilialDetalhes()
      ) : (
        <View style={styles.filiaisGrid}>
          {filiaisFiltradas.map(renderFilialCard)}
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          Sobre o Gerenciamento de Filiais
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          O sistema de gerenciamento de filiais permite visualizar e administrar todas as 
          unidades da Mottu em diferentes localidades. Através desta interface, é possível 
          monitorar o status da frota em cada filial, acessar informações detalhadas e 
          navegar para funcionalidades específicas de cada unidade.
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
            • Visualização centralizada de todas as filiais
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
            • Estatísticas em tempo real da frota
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
            • Acesso rápido ao mapa do pátio de cada filial
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
            • Integração com sistema de monitoramento IoT
          </Text>
        </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  filtrosContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  filtrosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filtrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filtroItem: {
    width: '48%',
  },
  filtroLabel: {
    marginBottom: 6,
    fontSize: 14,
  },
  filtroInput: {
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  filtrosStats: {
    marginTop: 8,
  },
  filtrosStatsText: {
    fontSize: 14,
  },
  filiaisGrid: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  filialCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  filialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filialNome: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  filialPais: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  filialPaisText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  filialEndereco: {
    fontSize: 14,
    marginBottom: 12,
  },
  filialStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filialStat: {
    alignItems: 'center',
  },
  filialStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filialStatLabel: {
    fontSize: 12,
  },
  filialFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filialFooterText: {
    marginLeft: 8,
    fontSize: 14,
  },
  filialDetalhes: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  filialDetalhesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filialDetalhesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filialDetalhesNome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  filialDetalhesEndereco: {
    fontSize: 16,
    marginBottom: 16,
  },
  filialDetalhesImageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  filialDetalhesImage: {
    width: '100%',
    height: '100%',
  },
  filialDetalhesMapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    alignItems: 'center',
  },
  filialDetalhesMapText: {
    fontWeight: 'bold',
  },
  filialDetalhesSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filialDetalhesStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filialDetalhesStat: {
    alignItems: 'center',
  },
  filialDetalhesStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filialDetalhesStatLabel: {
    fontSize: 14,
  },
  filialDetalhesProgressContainer: {
    marginBottom: 20,
  },
  filialDetalhesProgressBar: {
    height: 16,
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  filialDetalhesProgressFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  filialDetalhesProgressLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filialDetalhesProgressLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filialDetalhesProgressLegendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  filialDetalhesProgressLegendText: {
    fontSize: 12,
  },
  filialDetalhesButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filialDetalhesButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  filialDetalhesButtonText: {
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoints: {
    marginLeft: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
  },
});
