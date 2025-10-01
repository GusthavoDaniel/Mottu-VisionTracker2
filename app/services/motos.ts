// app/services/motos.ts
import Api, { Moto as ApiMoto } from './api';
export type Moto = ApiMoto;

export const Motos = {
  list: async (): Promise<ApiMoto[]> => {
    const res = await Api.getMotos();
    return res.success && res.data ? res.data : [];
  },
  get: async (id: string) => {
    const res = await Api.getMotoById(id);
    return res.success ? res.data! : null;
  },
  create: async (m: Omit<ApiMoto,'id'|'createdAt'|'updatedAt'>) => {
    const res = await Api.createMoto(m);
    return res.success ? res.data! : null;
  },
  update: async (id: string, m: Partial<ApiMoto>) => {
    const res = await Api.updateMoto(id, m);
    return res.success ? res.data! : null;
  },
  remove: async (id: string) => {
    await Api.deleteMoto(id);
    return true;
  },
};
