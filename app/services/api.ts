// services/api.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Tipos de dados
export interface Moto {
  id: string;
  placa: string;
  modelo: string;
  cor: string;
  proprietario: string;
  localizacao?: {
    setor: string;
    posicao: string;
    ultimaAtualizacao: string;
  };
  status: 'ativa' | 'manutencao' | 'inativa';
  createdAt: string;
  updatedAt: string;
}

export interface Alerta {
  id: string;
  motoId: string;
  tipo:
    | 'movimento_nao_autorizado'
    | 'manutencao_necessaria'
    | 'bateria_baixa'
    | 'fora_da_area';
  descricao: string;
  timestamp: string;
  resolvido: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/* =========================
   BASE URL dinâmico (DEV)
   ========================= */

/** Pega o IP do Metro/Expo para device físico. */
function getLanIPFromExpo(): string | null {
  // SDKs novos: expoConfig.hostUri | antigos: manifest.debuggerHost
  const hostUri =
    (Constants as any).expoConfig?.hostUri ??
    (Constants as any).manifest?.debuggerHost ??
    '';
  if (!hostUri) return null;

  const host = hostUri.split(':')[0]; // "192.168.x.y:8081" -> "192.168.x.y"
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;
  return host;
}

function getBaseURL() {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Emulador Android (AVD)
      return 'http://10.0.2.2:5000/api';
    }
    // Device físico (ou dev build) via Expo
    const lan = getLanIPFromExpo();
    if (lan) return `http://${lan}:5000/api`;

    // Simulador iOS
    return 'http://localhost:5000/api';
  }

  // PROD (troque pelo seu domínio/endpoint)
  return 'https://seu-dominio-aqui.com/api';
}

const API_BASE_URL = getBaseURL();

/* =========================
   Helpers
   ========================= */

const toMoto = (m: any): Moto => ({
  id: String(m.id),
  placa: String(m.placa),
  modelo: String(m.modelo),
  cor: String(m.cor),
  proprietario: String(m.proprietario),
  localizacao: {
    setor: 'A1',
    posicao: '1',
    ultimaAtualizacao: String(m.dataAtualizacao),
  },
  status: (m.ativa ? 'ativa' : 'inativa') as Moto['status'],
  createdAt: String(m.dataCriacao),
  updatedAt: String(m.dataAtualizacao),
});

/** Tenta parsear JSON; se falhar, retorna null. */
async function safeJson(res: Response) {
  try {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* =========================
   Serviço
   ========================= */

class ApiService {
  private static instance: ApiService;

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      });

      const data = await safeJson(response);

      if (!response.ok) {
        return {
          success: false,
          error:
            (data && (data.error || data.message)) ||
            `Erro na requisição (${response.status})`,
        };
      }

      // Suporte para { success, data, message } ou corpo puro
      if (data && typeof data === 'object' && 'success' in data) {
        return data as ApiResponse<T>;
      }
      return { success: true, data: data as T };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  // ===== Autenticação =====
  async login(email: string, senha: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  }

  async register(
    nome: string,
    email: string,
    senha: string
  ): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.makeRequest('/auth/logout', { method: 'POST' });
  }

  // ===== Motos =====
  async getMotos(): Promise<ApiResponse<Moto[]>> {
    const resp = await this.makeRequest<any>('/motos');
    if (resp.success && resp.data) {
      // Esperando { data: { data: [...] } } do Flask
      const motosRaw = (resp.data as any).data ?? resp.data;
      const motos: Moto[] = (motosRaw as any[]).map(toMoto);
      return {
        success: true,
        data: motos,
        message: 'Motos carregadas com sucesso',
      };
    }
    return resp as ApiResponse<Moto[]>;
  }

  async getMotoById(id: string): Promise<ApiResponse<Moto>> {
    const resp = await this.makeRequest<any>(`/motos/${id}`);
    if (resp.success && resp.data) {
      const mRaw = (resp.data as any).data ?? resp.data;
      const moto: Moto = toMoto(mRaw);
      return { success: true, data: moto, message: 'Moto encontrada' };
    }
    return resp as ApiResponse<Moto>;
  }

  async createMoto(
    motoData: Omit<Moto, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Moto>> {
    const motoFlask = {
      placa: motoData.placa,
      modelo: motoData.modelo,
      cor: motoData.cor,
      numeroSerie: `SN${Date.now()}`,
      tagRFID: `RF${Date.now()}`,
      filialId: 1,
      proprietario: motoData.proprietario,
      ativa: motoData.status === 'ativa',
    };

    const resp = await this.makeRequest<any>('/motos', {
      method: 'POST',
      body: JSON.stringify(motoFlask),
    });

    if (resp.success && resp.data) {
      const mRaw = (resp.data as any).data ?? resp.data;
      const moto: Moto = toMoto(mRaw);
      return {
        success: true,
        data: moto,
        message: 'Moto cadastrada com sucesso',
      };
    }
    return resp as ApiResponse<Moto>;
  }

  async updateMoto(
    id: string,
    motoData: Partial<Omit<Moto, 'id' | 'createdAt'>>
  ): Promise<ApiResponse<Moto>> {
    const motoFlask = {
      placa: motoData.placa,
      modelo: motoData.modelo,
      cor: motoData.cor,
      proprietario: motoData.proprietario,
      ativa: motoData.status === 'ativa',
    };

    const resp = await this.makeRequest<any>(`/motos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(motoFlask),
    });

    if (resp.success && resp.data) {
      const mRaw = (resp.data as any).data ?? resp.data;
      const moto: Moto = toMoto(mRaw);
      return {
        success: true,
        data: moto,
        message: 'Moto atualizada com sucesso',
      };
    }
    return resp as ApiResponse<Moto>;
  }

  async deleteMoto(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/motos/${id}`, { method: 'DELETE' });
  }

  // ===== Dashboard =====
  async getDashboardData(): Promise<ApiResponse<any>> {
    return this.makeRequest('/rfid/dashboard');
  }

  // ===== Alertas =====
  async getAlertas(): Promise<ApiResponse<Alerta[]>> {
    const resp = await this.makeRequest<any>('/rfid/alertas');
    if (resp.success && resp.data) {
      const listRaw = (resp.data as any).data ?? resp.data;
      const alertas: Alerta[] = (listRaw as any[]).map(
        (alerta: any, index: number): Alerta => ({
          id: `alerta_${index}`,
          motoId: alerta.moto?.id ? String(alerta.moto.id) : 'unknown',
          tipo: this.mapTipoAlerta(String(alerta.tipo)),
          descricao: String(alerta.mensagem),
          timestamp: String(alerta.data),
          resolvido: false,
        })
      );

      return {
        success: true,
        data: alertas,
        message: 'Alertas carregados com sucesso',
      };
    }
    return resp as ApiResponse<Alerta[]>;
  }

  private mapTipoAlerta(tipo: string): Alerta['tipo'] {
    const mapeamento: Record<string, Alerta['tipo']> = {
      sem_leitura: 'movimento_nao_autorizado',
      bateria_baixa: 'bateria_baixa',
      manutencao: 'manutencao_necessaria',
      fora_area: 'fora_da_area',
    };
    return mapeamento[tipo] || 'movimento_nao_autorizado';
  }

  async resolverAlerta(id: string): Promise<ApiResponse<Alerta>> {
    // Simulação local
    return {
      success: true,
      data: {
        id,
        motoId: 'unknown',
        tipo: 'movimento_nao_autorizado',
        descricao: 'Alerta resolvido',
        timestamp: new Date().toISOString(),
        resolvido: true,
      },
      message: 'Alerta resolvido com sucesso',
    };
  }

  // ===== Filiais =====
  async getFiliais(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/filiais');
  }

  // ===== Health =====
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.makeRequest('/health');
  }
}

export default ApiService.getInstance();
