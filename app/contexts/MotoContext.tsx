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

  carregarMotos: () => Promise<void>;
  adicionarMoto: (
    motoData: Omit<Moto, 'id' | 'pan' | 'posX' | 'posY' | 'historico' | 'createdAt' | 'updatedAt'>
  ) => Promise<boolean>;
  atualizarMoto: (
    id: string,
    motoData: Partial<Omit<Moto, 'id' | 'pan' | 'posX' | 'posY' | 'historico' | 'createdAt'>>
  ) => Promise<boolean>;
  removerMoto: (id: string) => Promise<boolean>;
  moverMoto: (id: string, newX: number, newY: number) => void;

  carregarAlertas: () => Promise<void>;
  resolverAlerta: (id: string) => Promise<boolean>;

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

  // normaliza status vindo do JSON-server (ATIVA / MANUTENCAO / INATIVA)
  const normalizeStatus = (s: any): Moto['status'] => {
    const v = String(s ?? 'ativa').toLowerCase();
    if (v === 'manutencao' || v === 'inativa') return v as Moto['status'];
    return 'ativa';
  };

  const convertApiMotoToMoto = (apiMoto: ApiMoto): Moto => {
    const createdAt = apiMoto.createdAt ?? new Date().toISOString();
    const updatedAt = apiMoto.updatedAt ?? createdAt;

    const posX = (apiMoto as any).posX ?? 0;
    const posY = (apiMoto as any).posY ?? 0;

    return {
      id: String((apiMoto as any).id ?? ''),
      placa: apiMoto.placa ?? '',
      modelo: apiMoto.modelo ?? '',
      cor: (apiMoto as any).cor ?? 'Verde Mottu',
      proprietario: (apiMoto as any).proprietario ?? '—',
      status: normalizeStatus((apiMoto as any).status),

      localizacao:
        apiMoto.localizacao ??
        {
          setor: 'A1',
          posicao: '1',
          ultimaAtualizacao: new Date().toISOString(),
        },

      pan: new Animated.ValueXY({ x: posX, y: posY }),
      posX,
      posY,

      historico:
        (apiMoto as any).historico?.length
          ? [...(apiMoto as any).historico]
          : [`Cadastrada em ${new Date(createdAt).toLocaleDateString('pt-BR')}`],

      createdAt,
      updatedAt,
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
    } catch (e) {
      setError('Erro de conexão. Verifique sua internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarMoto = async (
    motoData: Omit<Moto, 'id' | 'pan' | 'posX' | 'posY' | 'historico' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.createMoto({
        placa: motoData.placa,
        modelo: motoData.modelo,
        cor: motoData.cor,
        proprietario: motoData.proprietario,
        status: motoData.status,
        localizacao: motoData.localizacao,
      });

      if (response.success && response.data) {
        const novaMoto = convertApiMotoToMoto(response.data);
        setMotos((prev) => [...prev, novaMoto]);
        return true;
      } else {
        setError(response.error || 'Erro ao cadastrar moto');
        return false;
      }
    } catch (e) {
      setError('Erro de conexão. Verifique sua internet.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarMoto = async (
    id: string,
    motoData: Partial<Omit<Moto, 'id' | 'pan' | 'posX' | 'posY' | 'historico' | 'createdAt'>>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.updateMoto(id, {
        placa: motoData.placa,
        modelo: motoData.modelo,
        cor: motoData.cor,
        proprietario: motoData.proprietario,
        status: motoData.status,
        localizacao: motoData.localizacao,
      });

      if (response.success && response.data) {
        const motoAtualizada = convertApiMotoToMoto(response.data);
        setMotos((prev) => prev.map((m) => (m.id === id ? motoAtualizada : m)));
        return true;
      } else {
        setError(response.error || 'Erro ao atualizar moto');
        return false;
      }
    } catch (e) {
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
        setMotos((prev) => prev.filter((m) => m.id !== id));
        return true;
      } else {
        setError(response.error || 'Erro ao remover moto');
        return false;
      }
    } catch (e) {
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
              historico: [
                ...m.historico,
                `Movida para: ${newX}, ${newY} em ${new Date().toLocaleString('pt-BR')}`,
              ],
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
        // usar warn pra não abrir RedBox
        console.warn('Erro ao carregar alertas:', response.error || 'sem detalhes');
        setAlertas([]); // fallback
      }
    } catch (e) {
      // se backend retornar 404, não quebrar a UI
      console.warn('Falha ao carregar alertas (provável 404 ou rede):', e);
      setAlertas([]);
    } finally {
      setIsLoadingAlertas(false);
    }
  };

  const resolverAlerta = async (id: string): Promise<boolean> => {
    try {
      const response = await ApiService.resolverAlerta(id);
      if (response.success && response.data) {
        setAlertas((prev) => prev.map((a) => (a.id === id ? response.data! : a)));
        return true;
      } else if (response.success) {
        // alguns mocks podem apenas retornar 200 sem body; nesse caso, removemos
        setAlertas((prev) => prev.filter((a) => a.id !== id));
        return true;
      } else {
        Alert.alert('Erro', response.error || 'Erro ao resolver alerta');
        return false;
      }
    } catch (e) {
      Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
      return false;
    }
  };

  const getMotoById = (id: string): Moto | undefined => motos.find((m) => m.id === id);

  return (
    <MotoContext.Provider
      value={{
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
        clearError,
      }}
    >
      {children}
    </MotoContext.Provider>
  );
};

export const useMotoContext = () => useContext(MotoContext);
