
import { http } from './http';

export type Alerta = {
  id: number;
  tipo: string;       
  mensagem: string;   
  createdAt?: string; 
};

export const Alertas = {
  list: (): Promise<Alerta[]> => http('/alertas'),
  get: (id: number): Promise<Alerta> => http(`/alertas/${id}`),
  create: (data: Omit<Alerta, 'id'>): Promise<Alerta> =>
    http('/alertas', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    http(`/alertas/${id}`, { method: 'DELETE' }),
};
