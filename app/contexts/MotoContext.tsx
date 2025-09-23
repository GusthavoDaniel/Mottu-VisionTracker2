import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Animated, Alert } from 'react-native';
import ApiService, { Moto as ApiMoto, Alerta } from '../services/api';

export type Moto = {
  id: string;
  placa: string;
  modelo: string;
  cor: string;
  proprietario: string;
  pan: Animated.ValueXY;
  posX: number;
  posY: number;
  historico: string[];
  localizacao?: {
    setor: string;
    posicao: string;
    ultimaAtualizacao: string;
  };
  status: 'ativa' | 'manutencao' | 'inativa';
  createdAt: string;
  updatedAt: string;
};

interface MotoContextProps {
  motos: Moto[];
  alertas: Alerta[];
  isLoading: boolean;
  isLoadingAlertas: boolean;
  error: string | null;
  
  // Métodos CRUD para motos
  carregarMotos: () => Promise<void>;
  adicionarMoto: (motoData: Omit<Moto, 'id' | 'pan' | 'posX' | 'posY' | 'historico' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  atualizarMoto: (id: string, motoData: Partial<Omit<Moto, 'id' | 'pan' | 'posX' | 'posY' | 'historico' | 'createdAt'>>) => Promise<boolean>;
  removerMoto: (id: string) => Promise<boolean>;
  moverMoto: (id: string, newX: number, newY: number) => void;
  
  // Métodos para alertas
  carregarAlertas: () => Promise<void>;
  resolverAlerta: (id: string) => Promise<boolean>;
  
  // Utilitários
  getMotoById: (id: string) => Moto | undefined;
  clearError: () => void;
}

export const MotoContext = createContext<MotoContextProps>({} as MotoContextProps);

export const MotoProvider = ({ children }: { children: ReactNode }) => {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAlertas, setIsLoadingAlertas] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarMotos();
    carregarAlertas();
  }, []);

  const clearError = () => setError(null);

  const convertApiMotoToMoto = (apiMoto: ApiMoto): Moto => {
    return {
      ...apiMoto,
      pan: new Animated.ValueXY({ x: 0, y: 0 }),
      posX: 0,
      posY: 0,
      historico: [`Cadastrada em ${new Date(apiMoto.createdAt).toLocaleDateString()}`]
    };
  };

  const carregarMotos = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.getMotos();
      
      if (response.success && response.data) {
        const motosConvertidas = response.data.map(convertApiMotoToMoto);
        setMotos(motosConvertidas);
      } else {
        setError(response.error || 'Erro ao carregar motos');
      }
    } catch (error) {
      setError('Erro de conexão. Verifique sua internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarMoto = async (motoData: Omit<Moto, 'id' | 'pan' | 'posX' | 'posY' | 'historico' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.createMoto({
        placa: motoData.placa,
        modelo: motoData.modelo,
        cor: motoData.cor,
        proprietario: motoData.proprietario,
        status: motoData.status,
        localizacao: motoData.localizacao
      });
      
      if (response.success && response.data) {
        const novaMoto = convertApiMotoToMoto(response.data);
        setMotos(prev => [...prev, novaMoto]);
        return true;
      } else {
        setError(response.error || 'Erro ao cadastrar moto');
        return false;
      }
    } catch (error) {
      setError('Erro de conexão. Verifique sua internet.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarMoto = async (id: string, motoData: Partial<Omit<Moto, 'id' | 'pan' | 'posX' | 'posY' | 'historico' | 'createdAt'>>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.updateMoto(id, {
        placa: motoData.placa,
        modelo: motoData.modelo,
        cor: motoData.cor,
        proprietario: motoData.proprietario,
        status: motoData.status,
        localizacao: motoData.localizacao
      });
      
      if (response.success && response.data) {
        const motoAtualizada = convertApiMotoToMoto(response.data);
        setMotos(prev => prev.map(m => m.id === id ? motoAtualizada : m));
        return true;
      } else {
        setError(response.error || 'Erro ao atualizar moto');
        return false;
      }
    } catch (error) {
      setError('Erro de conexão. Verifique sua internet.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removerMoto = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.deleteMoto(id);
      
      if (response.success) {
        setMotos(prev => prev.filter(m => m.id !== id));
        return true;
      } else {
        setError(response.error || 'Erro ao remover moto');
        return false;
      }
    } catch (error) {
      setError('Erro de conexão. Verifique sua internet.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const moverMoto = (id: string, newX: number, newY: number) => {
    setMotos((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              posX: newX,
              posY: newY,
              pan: new Animated.ValueXY({ x: newX, y: newY }),
              historico: [...m.historico, `Movida para: ${newX}, ${newY} em ${new Date().toLocaleString()}`],
            }
          : m
      )
    );
  };

  const carregarAlertas = async (): Promise<void> => {
    setIsLoadingAlertas(true);
    
    try {
      const response = await ApiService.getAlertas();
      
      if (response.success && response.data) {
        setAlertas(response.data);
      } else {
        console.error('Erro ao carregar alertas:', response.error);
      }
    } catch (error) {
      console.error('Erro de conexão ao carregar alertas:', error);
    } finally {
      setIsLoadingAlertas(false);
    }
  };

  const resolverAlerta = async (id: string): Promise<boolean> => {
    try {
      const response = await ApiService.resolverAlerta(id);
      
      if (response.success && response.data) {
        setAlertas(prev => prev.map(a => a.id === id ? response.data! : a));
        return true;
      } else {
        Alert.alert('Erro', response.error || 'Erro ao resolver alerta');
        return false;
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
      return false;
    }
  };

  const getMotoById = (id: string): Moto | undefined => {
    return motos.find(m => m.id === id);
  };

  return (
    <MotoContext.Provider value={{ 
      motos, 
      alertas,
      isLoading,
      isLoadingAlertas,
      error,
      carregarMotos,
      adicionarMoto, 
      atualizarMoto,
      removerMoto,
      moverMoto,
      carregarAlertas,
      resolverAlerta,
      getMotoById,
      clearError
    }}>
      {children}
    </MotoContext.Provider>
  );
};

export const useMotoContext = () => useContext(MotoContext);
