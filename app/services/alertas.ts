// app/services/alertas.ts
import { http } from './http';

export type Alerta = {
  id: number;
  tipo: string;
  mensagem: string;
  createdAt?: string;
};

export const Alertas = {
  list: async (): Promise<Alerta[]> => {
    try {
      return await http<Alerta[]>('/alertas');
    } catch (e: any) {
      if (e?.status === 404) return []; // <- evita quebrar se a rota não existir
      throw e;
    }
  },
  get: (id: number) => http<Alerta>(`/alertas/${id}`),
  create: (data: Omit<Alerta, 'id'>) =>
    http<Alerta>('/alertas', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id: number) => http<void>(`/alertas/${id}`, { method: 'DELETE' }),
};
