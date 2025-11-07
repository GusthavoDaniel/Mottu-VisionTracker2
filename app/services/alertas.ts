// app/services/alertas.ts
import { http } from './http';

export type Alerta = {
  id: number;
  tipo: string;
  mensagem: string;
  createdAt?: string;
};

// ---------------- MOCK + GERADOR AUTOMÁTICO -----------------

const TIPOS_MOCK = [
  'movimento_nao_autorizado',
  'manutencao_necessaria',
  'bateria_baixa',
  'fora_da_area',
] as const;

type TipoMock = (typeof TIPOS_MOCK)[number];

let MOCK_ALERTS: Alerta[] = [];
let lastGeneratedAt = 0;

function gerarMensagem(tipo: TipoMock): string {
  switch (tipo) {
    case 'movimento_nao_autorizado':
      return 'Movimento não autorizado detectado na moto XYZ1234.';
    case 'manutencao_necessaria':
      return 'Moto ABC9876 precisa de manutenção preventiva.';
    case 'bateria_baixa':
      return 'Bateria baixa detectada na moto MTT2025.';
    case 'fora_da_area':
      return 'Moto saiu da área permitida (Zona Leste).';
    default:
      return 'Alerta registrado no sistema.';
  }
}

function gerarAlertaMock(): Alerta {
  const tipo = TIPOS_MOCK[Math.floor(Math.random() * TIPOS_MOCK.length)];
  const agora = new Date();

  return {
    id: Date.now(), // id único simples
    tipo,
    mensagem: gerarMensagem(tipo),
    createdAt: agora.toISOString(),
  };
}

/**
 * Gera automaticamente um novo alerta em memória
 * se já passou 1 minuto desde o último gerado
 * (ou se ainda não houver nenhum).
 */
function ensureMockAlertsAtualizados() {
  const agoraMs = Date.now();

  if (MOCK_ALERTS.length === 0 || agoraMs - lastGeneratedAt > 60_000) {
    const novo = gerarAlertaMock();
    MOCK_ALERTS = [novo, ...MOCK_ALERTS]; // adiciona no topo
    lastGeneratedAt = agoraMs;
  }
}

// ---------------- API PÚBLICA -----------------

export const Alertas = {
  /** Lista todos os alertas.
   *  Se a API falhar, usa os mocks que vão se auto-atualizando.
   */
  list: async (): Promise<Alerta[]> => {
    try {
      // tenta usar o backend se existir
      const data = await http<Alerta[]>('/alertas');
      return data;
    } catch (e: any) {
      console.warn('⚠️ /alertas indisponível, usando mocks em memória.', e?.message);
      ensureMockAlertsAtualizados();
      return MOCK_ALERTS;
    }
  },

  get: async (id: number): Promise<Alerta> => {
    try {
      return await http<Alerta>(`/alertas/${id}`);
    } catch (e: any) {
      console.warn('⚠️ /alertas/:id indisponível, procurando no mock.');
      const found = MOCK_ALERTS.find((a) => a.id === id);
      if (!found) throw e;
      return found;
    }
  },

  /** Você pode chamar isso de algum lugar se quiser criar alertas de teste manualmente */
  create: async (data: Omit<Alerta, 'id'>): Promise<Alerta> => {
    try {
      return await http<Alerta>('/alertas', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (e: any) {
      console.warn('⚠️ /alertas POST indisponível, criando mock em memória.');
      const novo: Alerta = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      MOCK_ALERTS = [novo, ...MOCK_ALERTS];
      return novo;
    }
  },

  remove: async (id: number): Promise<void> => {
    try {
      await http<void>(`/alertas/${id}`, { method: 'DELETE' });
    } catch (e: any) {
      console.warn('⚠️ /alertas DELETE indisponível, removendo do mock.');
      MOCK_ALERTS = MOCK_ALERTS.filter((a) => a.id !== id);
    }
  },
};
