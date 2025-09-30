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
   BASE URL dinâmico
   ========================= */

/** Pega o IP do Metro/Expo para device físico. */
function getLanIPFromExpo(): string | null {
  // SDKs mais novos: expoConfig.hostUri
  // SDKs antigos: manifest.debuggerHost
  const hostUri =
    (Constants as any).expoConfig?.hostUri ??
    (Constants as any).manifest?.debuggerHost ??
    '';
  if (!hostUri) return null;

  const host = hostUri.split(':')[0]; // "192.168.x.y:8081" -> "192.168.x.y"
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;
  return host;
}

/** Retorna a base URL apropriada para DEV/PROD. */
function getBaseURL() {
  // 1) Se houver variável de ambiente, ela manda (ex.: EXPO_PUBLIC_API_URL=https://foo.com/api)
  const envUrl =
    (process.env.EXPO_PUBLIC_API_URL as string | undefined) ||
    (Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL as string | undefined);
  if (envUrl) return envUrl.replace(/\/+$/, ''); // remove trailing /

  // 2) DEV - Nova API Java Spring Boot
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Emulador Android (AVD)
      return 'http://10.0.2.2:8080/api';
    }
    // Device físico (ou dev build) via Expo
    const lan = getLanIPFromExpo();
    if (lan) return `http://${lan}:8080/api`;

    // Simulador iOS
    return 'http://localhost:8080/api';
  }

  // 3) PROD - API Java Spring Boot
  return 'https://mottu-visiontracker-api-production.up.railway.app/api';
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
    setor: String(m.setor || 'A1'),
    posicao: String(m.posicao || '1'),
    ultimaAtualizacao: String(m.updatedAt || m.createdAt),
  },
  status: mapStatusFromJava(m.status),
  createdAt: String(m.createdAt),
  updatedAt: String(m.updatedAt),
});

// Helper para mapear status da API Java para o frontend
const mapStatusFromJava = (status: string): Moto['status'] => {
  switch (status?.toUpperCase()) {
    case 'ATIVA': return 'ativa';
    case 'MANUTENCAO': return 'manutencao';
    case 'INATIVA': return 'inativa';
    default: return 'ativa';
  }
};

// Helper para mapear status do frontend para a API Java
const mapStatusToJava = (status: Moto['status']): string => {
  switch (status) {
    case 'ativa': return 'ATIVA';
    case 'manutencao': return 'MANUTENCAO';
    case 'inativa': return 'INATIVA';
    default: return 'ATIVA';
  }
};

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
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
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
      // API Java retorna array direto no campo data
      const motosRaw = Array.isArray(resp.data) ? resp.data : [resp.data];
      const motos: Moto[] = motosRaw.map(toMoto);
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
      const moto: Moto = toMoto(resp.data);
      return { success: true, data: moto, message: 'Moto encontrada' };
    }
    return resp as ApiResponse<Moto>;
  }

  async createMoto(
    motoData: Omit<Moto, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Moto>> {
    const motoJava = {
      placa: motoData.placa,
      modelo: motoData.modelo,
      cor: motoData.cor,
      proprietario: motoData.proprietario,
      numeroSerie: `SN${Date.now()}`,
      tagRFID: `RF${Date.now()}`,
      status: mapStatusToJava(motoData.status),
      setor: motoData.localizacao?.setor || 'A1',
      posicao: motoData.localizacao?.posicao || String(Math.floor(Math.random() * 10) + 1),
    };

    const resp = await this.makeRequest<any>('/motos', {
      method: 'POST',
      body: JSON.stringify(motoJava),
    });

    if (resp.success && resp.data) {
      const moto: Moto = toMoto(resp.data);
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
    const motoJava = {
      placa: motoData.placa,
      modelo: motoData.modelo,
      cor: motoData.cor,
      proprietario: motoData.proprietario,
      status: motoData.status ? mapStatusToJava(motoData.status) : undefined,
      setor: motoData.localizacao?.setor,
      posicao: motoData.localizacao?.posicao,
    };

    // Remove campos undefined
    Object.keys(motoJava).forEach(key => 
      motoJava[key as keyof typeof motoJava] === undefined && delete motoJava[key as keyof typeof motoJava]
    );

    const resp = await this.makeRequest<any>(`/motos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(motoJava),
    });

    if (resp.success && resp.data) {
      const moto: Moto = toMoto(resp.data);
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
    // Buscar estatísticas das motos e alertas
    try {
      const [motosResp, alertasResp] = await Promise.all([
        this.makeRequest('/motos/stats'),
        this.makeRequest('/alertas/stats')
      ]);

      const dashboardData = {
        motos: motosResp.success ? motosResp.data : { total: 0, ativas: 0, manutencao: 0, inativas: 0 },
        alertas: alertasResp.success ? alertasResp.data : { total: 0, naoResolvidos: 0, resolvidos: 0 },
      };

      return {
        success: true,
        data: dashboardData,
        message: 'Dashboard carregado com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao carregar dashboard',
        error: String(error),
      };
    }
  }

  // ===== Alertas =====
  async getAlertas(): Promise<ApiResponse<Alerta[]>> {
    const resp = await this.makeRequest<any>('/alertas');
    if (resp.success && resp.data) {
      // API Java retorna array direto no campo data
      const alertasRaw = Array.isArray(resp.data) ? resp.data : [resp.data];
      const alertas: Alerta[] = alertasRaw.map(
        (alerta: any): Alerta => ({
          id: String(alerta.id),
          motoId: alerta.moto?.id ? String(alerta.moto.id) : String(alerta.motoId || 'unknown'),
          tipo: this.mapTipoAlertaFromJava(alerta.tipo),
          descricao: String(alerta.descricao),
          timestamp: String(alerta.timestamp),
          resolvido: Boolean(alerta.resolvido),
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

  private mapTipoAlertaFromJava(tipo: string): Alerta['tipo'] {
    const mapeamento: Record<string, Alerta['tipo']> = {
      'MOVIMENTO_NAO_AUTORIZADO': 'movimento_nao_autorizado',
      'MANUTENCAO_NECESSARIA': 'manutencao_necessaria',
      'BATERIA_BAIXA': 'bateria_baixa',
      'FORA_DA_AREA': 'fora_da_area',
      'SEM_LEITURA': 'movimento_nao_autorizado', // Mapear para movimento não autorizado
    };
    return mapeamento[tipo] || 'movimento_nao_autorizado';
  }

  async resolverAlerta(id: string): Promise<ApiResponse<Alerta>> {
    const resp = await this.makeRequest<any>(`/alertas/${id}/resolve`, {
      method: 'PATCH',
    });

    if (resp.success && resp.data) {
      const alerta: Alerta = {
        id: String(resp.data.id),
        motoId: resp.data.moto?.id ? String(resp.data.moto.id) : String(resp.data.motoId || 'unknown'),
        tipo: this.mapTipoAlertaFromJava(resp.data.tipo),
        descricao: String(resp.data.descricao),
        timestamp: String(resp.data.timestamp),
        resolvido: Boolean(resp.data.resolvido),
      };

      return {
        success: true,
        data: alerta,
        message: 'Alerta resolvido com sucesso',
      };
    }
    return resp as ApiResponse<Alerta>;
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
