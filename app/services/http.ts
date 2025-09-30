export const API_BASE =
  (process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ||
    (__DEV__ ? 'http://10.0.2.2:8080' : 'http://localhost:8080'));

type Opts = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export async function http<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err: any = new Error(`Erro na requisição (${res.status})`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  if (res.status === 204) return undefined as T;
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  return (isJson ? res.json() : (res.text() as any)) as T;
}
