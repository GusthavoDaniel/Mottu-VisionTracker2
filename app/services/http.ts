const BASE = process.env.EXPO_PUBLIC_API_URL!;
if (!BASE) {
  // ajuda a detectar .env ausente
  // eslint-disable-next-line no-console
  console.warn('EXPO_PUBLIC_API_URL não definido. Crie um .env na raiz.');
}

export async function http(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(text || `HTTP ${res.status}`);
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}
