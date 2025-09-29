import { http } from './http';

export type Moto = {
  id: number;
  placa: string;
  modelo: string;
  status: 'ATIVA' | 'MANUTENCAO';
};

export const Motos = {
  list: (): Promise<Moto[]> => http('/motos'),
  get: (id: number): Promise<Moto> => http(`/motos/${id}`),
  create: (data: Omit<Moto, 'id'>): Promise<Moto> =>
    http('/motos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Moto>): Promise<Moto> =>
    http(`/motos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    http(`/motos/${id}`, { method: 'DELETE' }),
};
